'use strict';

const crypto = require('crypto');
const db = require('../config/db');
const { generateCaseSummary, askCase, generateComplaint: genComplaint } = require('../services/gemini');
const { chatSchema, complaintSchema } = require('../schemas');

async function verifyCase(caseId, userId) {
  let r = await db.query('SELECT * FROM cases WHERE id = $1 AND user_id = $2', [caseId, userId]);
  if (r.rows[0]) return r.rows[0];
  r = await db.query('SELECT * FROM cases WHERE id = $1', [caseId]);
  return r.rows[0] || null;
}

// POST /api/cases/:id/summarize
async function summarize(req, res, next) {
  try {
    const caseRow = await verifyCase(req.params.id, req.user.id);
    if (!caseRow) return res.status(404).json({ error: 'Case not found.' });

    // Get all completed evidence analyses
    const evResult = await db.query(
      "SELECT id, file_name, evidence_type, analysis FROM evidence WHERE case_id = $1 AND status = 'completed'",
      [caseRow.id]
    );
    if (evResult.rows.length === 0) {
      return res.status(400).json({ error: 'No completed evidence analyses yet. Please wait for analysis to finish.' });
    }

    const analyses = evResult.rows.map((ev) => ({
      evidenceId: ev.id,
      fileName: ev.file_name,
      type: ev.evidence_type,
      analysis: ev.analysis,
    }));

    const summary = await generateCaseSummary(caseRow.title, analyses, caseRow.language);

    // Save to case
    await db.query(
      `UPDATE cases SET 
        summary = $1, timeline = $2, linked_entities = $3,
        verdict = $4, risk_score = $5, status = 'ANALYZED', updated_at = NOW()
       WHERE id = $6`,
      [
        JSON.stringify(summary),
        JSON.stringify(summary.timeline),
        JSON.stringify(summary.linkedEntities),
        summary.verdict,
        summary.riskScore,
        caseRow.id,
      ]
    );

    res.json({ summary, message: 'Case summary generated.' });
  } catch (err) { next(err); }
}

// POST /api/cases/:id/chat
async function chat(req, res, next) {
  try {
    const caseRow = await verifyCase(req.params.id, req.user.id);
    if (!caseRow) return res.status(404).json({ error: 'Case not found.' });

    const parsed = chatSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.errors.map(e => e.message).join(', ') });
    const { question, conversation_id } = parsed.data;

    // Get or create conversation
    let convId = conversation_id;
    if (!convId) {
      convId = crypto.randomUUID();
      await db.query(
        "INSERT INTO conversations (id, case_id, user_id, title) VALUES ($1, $2, $3, $4)",
        [convId, caseRow.id, req.user.id, question.slice(0, 80)]
      );
    } else {
      // Verify ownership
      const convCheck = await db.query('SELECT id FROM conversations WHERE id = $1 AND user_id = $2', [convId, req.user.id]);
      if (convCheck.rows.length === 0) return res.status(403).json({ error: 'Conversation not found.' });
    }

    // Get conversation history
    const histResult = await db.query(
      'SELECT role, content FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC LIMIT 20',
      [convId]
    );
    const history = histResult.rows;

    // Get all evidence analyses
    const evResult = await db.query(
      "SELECT id, file_name, analysis FROM evidence WHERE case_id = $1 AND status = 'completed'",
      [caseRow.id]
    );
    const evidenceAnalyses = evResult.rows.map(ev => ({ evidenceId: ev.id, fileName: ev.file_name, analysis: ev.analysis }));

    const aiResponse = await askCase(
      caseRow.title, caseRow.language, caseRow.summary, evidenceAnalyses, history, question
    );

    // Store user message
    await db.query(
      'INSERT INTO messages (id, conversation_id, case_id, user_id, role, content) VALUES ($1, $2, $3, $4, $5, $6)',
      [crypto.randomUUID(), convId, caseRow.id, req.user.id, 'user', question]
    );
    // Store AI message
    await db.query(
      'INSERT INTO messages (id, conversation_id, case_id, user_id, role, content, sources) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [crypto.randomUUID(), convId, caseRow.id, req.user.id, 'ai', aiResponse.answer, JSON.stringify(aiResponse.sources)]
    );

    res.json({ answer: aiResponse.answer, sources: aiResponse.sources, conversation_id: convId });
  } catch (err) { next(err); }
}

// GET /api/cases/:id/messages
async function getMessages(req, res, next) {
  try {
    const caseRow = await verifyCase(req.params.id, req.user.id);
    if (!caseRow) return res.status(404).json({ error: 'Case not found.' });

    const { conversation_id } = req.query;
    let query, params;
    if (conversation_id) {
      query = 'SELECT * FROM messages WHERE conversation_id = $1 AND user_id = $2 ORDER BY created_at ASC';
      params = [conversation_id, req.user.id];
    } else {
      query = 'SELECT * FROM messages WHERE case_id = $1 AND user_id = $2 ORDER BY created_at ASC';
      params = [req.params.id, req.user.id];
    }
    const result = await db.query(query, params);
    res.json({ messages: result.rows });
  } catch (err) { next(err); }
}

// POST /api/cases/:id/complaint
async function complaint(req, res, next) {
  try {
    const caseRow = await verifyCase(req.params.id, req.user.id);
    if (!caseRow) return res.status(404).json({ error: 'Case not found.' });

    if (!caseRow.summary || Object.keys(caseRow.summary).length === 0) {
      const evResult = await db.query(
        "SELECT id, file_name, evidence_type, analysis FROM evidence WHERE case_id = $1",
        [caseRow.id]
      );
      const analyses = evResult.rows.map((ev) => ({
        evidenceId: ev.id,
        fileName: ev.file_name,
        type: ev.evidence_type,
        analysis: ev.analysis,
      }));
      const autoSummary = await generateCaseSummary(caseRow.title, analyses, caseRow.language);
      await db.query(
        `UPDATE cases SET 
          summary = $1, timeline = $2, linked_entities = $3,
          verdict = $4, risk_score = $5, status = 'ANALYZED', updated_at = NOW()
         WHERE id = $6`,
        [
          JSON.stringify(autoSummary),
          JSON.stringify(autoSummary.timeline),
          JSON.stringify(autoSummary.linkedEntities),
          autoSummary.verdict,
          autoSummary.riskScore,
          caseRow.id,
        ]
      );
      caseRow.summary = autoSummary;
      caseRow.timeline = autoSummary.timeline;
      caseRow.linked_entities = autoSummary.linkedEntities;
    }

    const parsed = complaintSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.errors.map(e => e.message).join(', ') });

    const evCount = await db.query('SELECT COUNT(*) FROM evidence WHERE case_id = $1', [caseRow.id]);
    const victimDetails = { ...parsed.data, evidenceCount: evCount.rows[0].count };

    const complaintText = await genComplaint(caseRow, victimDetails, caseRow.language);
    res.json({ complaint: complaintText, disclaimer: 'AI-generated draft. Review before submission.' });
  } catch (err) { next(err); }
}

module.exports = { summarize, chat, getMessages, complaint };
