'use strict';

const db = require('../config/db');
const { generateContent: genContent, generateCaseSummary } = require('../services/gemini');
const { anonymizeCase } = require('../services/anonymize');
const { contentSchema } = require('../schemas');

// POST /api/content/generate
async function generate(req, res, next) {
  try {
    const parsed = contentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.errors.map(e => e.message).join(', ') });
    const { case_id, platform, format, tone, audience, language, length } = parsed.data;

    // Verify case ownership
    const caseResult = await db.query('SELECT * FROM cases WHERE id = $1 AND user_id = $2', [case_id, req.user.id]);
    if (caseResult.rows.length === 0) return res.status(404).json({ error: 'Case not found.' });
    const caseRow = caseResult.rows[0];

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
    }

    // Anonymize before sending to Gemini
    const anonymized = anonymizeCase(caseRow);
    const content = await genContent(anonymized, platform, format, tone, audience, length, language);

    // Save to DB
    const saved = await db.query(
      'INSERT INTO generated_content (user_id, case_id, platform, format, tone, language, content) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user.id, case_id, platform, format, tone, language, content]
    );
    res.json({ content: saved.rows[0] });
  } catch (err) { next(err); }
}

// GET /api/content
async function listContent(req, res, next) {
  try {
    const result = await db.query(
      'SELECT * FROM generated_content WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    res.json({ content: result.rows });
  } catch (err) { next(err); }
}

// GET /api/content/:id
async function getContent(req, res, next) {
  try {
    const result = await db.query('SELECT * FROM generated_content WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Content not found.' });
    res.json({ content: result.rows[0] });
  } catch (err) { next(err); }
}

// DELETE /api/content/:id
async function deleteContent(req, res, next) {
  try {
    const result = await db.query('DELETE FROM generated_content WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Content not found.' });
    res.json({ message: 'Content deleted.' });
  } catch (err) { next(err); }
}

module.exports = { generate, listContent, getContent, deleteContent };
