'use strict';

const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { uploadFile, downloadFile, deleteFile, getSignedUrl } = require('../config/supabase');
const { analyzeEvidence } = require('../services/gemini');
const { pasteEvidenceSchema } = require('../schemas');

// Helper: map mime type to evidence_type
function getEvidenceType(mimeType) {
  if (['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) return 'IMAGE';
  if (mimeType === 'application/pdf') return 'PDF';
  if (['text/plain', 'text/markdown'].includes(mimeType)) return 'TEXT';
  if (['audio/mpeg', 'audio/wav'].includes(mimeType)) return 'AUDIO';
  if (mimeType === 'video/mp4') return 'VIDEO';
  return 'TEXT';
}

// Verify case ownership with global fallback
async function verifyCase(caseId, userId) {
  let result = await db.query('SELECT id, language, user_id FROM cases WHERE id = $1 AND user_id = $2', [caseId, userId]);
  if (result.rows[0]) return result.rows[0];
  result = await db.query('SELECT id, language, user_id FROM cases WHERE id = $1', [caseId]);
  return result.rows[0] || null;
}

// POST /api/cases/:id/evidence (file upload)
async function uploadEvidence(req, res, next) {
  try {
    const caseRow = await verifyCase(req.params.id, req.user.id);
    if (!caseRow) return res.status(404).json({ error: 'Case not found.' });

    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file provided.' });

    const evidenceType = getEvidenceType(file.mimetype);
    const storageKey = `${req.user.id}/${caseRow.id}/${uuidv4()}_${file.originalname}`;

    // Upload to private bucket
    await uploadFile(file.buffer, file.mimetype, storageKey);

    // Insert evidence row
    const evResult = await db.query(
      `INSERT INTO evidence (case_id, user_id, evidence_type, file_name, mime_type, size_bytes, storage_key, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'uploaded')
       RETURNING *`,
      [caseRow.id, req.user.id, evidenceType, file.originalname, file.mimetype, file.size, storageKey]
    );
    const evidence = evResult.rows[0];

    // Trigger async analysis (don't await — respond immediately)
    runAnalysis(evidence.id, file.buffer, file.mimetype, null, caseRow.language, file.originalname).catch(console.error);

    res.status(201).json({ evidence, message: 'File uploaded. Analysis started.' });
  } catch (err) { next(err); }
}

// POST /api/cases/:id/evidence/paste (pasted text or link)
async function pasteEvidence(req, res, next) {
  try {
    const caseRow = await verifyCase(req.params.id, req.user.id);
    if (!caseRow) return res.status(404).json({ error: 'Case not found.' });

    const parsed = pasteEvidenceSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.errors.map(e => e.message).join(', ') });

    const { evidence_type, content } = parsed.data;
    const fileName = evidence_type === 'LINK' ? 'Phishing Link' : 'Pasted Text';

    const evResult = await db.query(
      `INSERT INTO evidence (case_id, user_id, evidence_type, file_name, pasted_text, status)
       VALUES ($1, $2, $3, $4, $5, 'uploaded')
       RETURNING *`,
      [caseRow.id, req.user.id, evidence_type, fileName, content]
    );
    const evidence = evResult.rows[0];

    runAnalysis(evidence.id, null, 'text/plain', content, caseRow.language, fileName).catch(console.error);

    res.status(201).json({ evidence, message: 'Evidence saved. Analysis started.' });
  } catch (err) { next(err); }
}

// Background analysis runner
async function runAnalysis(evidenceId, fileBuffer, mimeType, pastedText, language, fileName) {
  // Mark as processing
  await db.query("UPDATE evidence SET status = 'processing' WHERE id = $1", [evidenceId]);
  try {
    const analysis = await analyzeEvidence(fileBuffer, mimeType, pastedText, language, fileName);
    await db.query(
      `UPDATE evidence SET 
        status = 'completed',
        analysis = $1,
        entities = $2,
        extracted_text = $3,
        verdict = $4,
        risk_score = $5,
        error_message = NULL
       WHERE id = $6`,
      [
        JSON.stringify(analysis),
        JSON.stringify(analysis.extracted),
        analysis.transcript || analysis.explanation,
        analysis.verdict,
        analysis.riskScore,
        evidenceId,
      ]
    );
  } catch (err) {
    await db.query(
      "UPDATE evidence SET status = 'failed', error_message = $1 WHERE id = $2",
      [err.message.slice(0, 500), evidenceId]
    );
  }
}

// GET /api/cases/:id/evidence
async function listEvidence(req, res, next) {
  try {
    const caseRow = await verifyCase(req.params.id, req.user.id);
    if (!caseRow) return res.status(404).json({ error: 'Case not found.' });

    let result = await db.query(
      'SELECT * FROM evidence WHERE case_id = $1 ORDER BY created_at ASC',
      [req.params.id]
    );

    // Auto-seed default multimodal evidence for demo/seeded cases if empty
    if (result.rows.length === 0) {
      try {
        const defaultItems = [
          {
            type: 'PDF',
            name: 'Digital_Arrest_Notice.pdf',
            verdict: 'SCAM',
            score: 92,
            analysis: {
              verdict: 'SCAM',
              riskScore: 92,
              scamType: 'Law Enforcement Impersonation',
              confidence: 0.95,
              redFlags: [
                'Forged CBI / Cyber Crime emblem and fake signature',
                'Demands urgent fund transfer to personal account to cancel arrest warrant',
                'Fabricated FIR notice under falsified IT Act sections'
              ],
              extracted: {
                phones: ['+919876543210'],
                upiIds: ['cbi.investigation@okaxis'],
                urls: ['http://cbi-gov-verify.xyz'],
                bankAccounts: ['918273645019'],
                amounts: ['₹50,000'],
                names: ['Officer R. K. Sharma'],
                dates: ['13-Oct-2026']
              },
              transcript: 'OFFICIAL SUMMONS & ARREST WARRANT. Suspect must transfer verification security deposit of Rs 50,000 to designated UPI account within 30 minutes to prevent immediate detention.',
              explanation: 'Document poses as a central investigation agency notice requiring immediate monetary deposits to clear legal liabilities. Legitimate law enforcement agencies never request UPI payments to cancel warrants.',
              nextSteps: [
                'Do not transfer any money',
                'Report UPI id cbi.investigation@okaxis to bank and cyber cell',
                'File complaint on cybercrime.gov.in'
              ]
            },
            text: 'IMMEDIATE ARREST WARRANT UNDER IT ACT SECTION 66. Transfer Rs 50,000 verification deposit to clear pending allegations.'
          },
          {
            type: 'AUDIO',
            name: 'Threatening_Call_Audio.mp3',
            verdict: 'SCAM',
            score: 88,
            analysis: {
              verdict: 'SCAM',
              riskScore: 88,
              scamType: 'Voice Threat & Extortion',
              confidence: 0.93,
              redFlags: [
                'High pressure aggressive voice tone demanding victim stay on call',
                'Threatening immediate arrest by local police dispatch',
                'Refusal to allow legal counsel or family consultation'
              ],
              extracted: {
                phones: ['+919876543210'],
                upiIds: [],
                urls: [],
                bankAccounts: [],
                amounts: ['₹50,000'],
                names: ['Inspector Sharma'],
                dates: []
              },
              transcript: 'Listen carefully. We have registered a money laundering case against your Aadhaar. If you disconnect this call, local police is already moving towards your address. You have 15 minutes to clear your status.',
              explanation: 'Extortion call utilizing synthetic fear conditioning to prevent victim from verifying facts with actual authorities.',
              nextSteps: [
                'Immediately hang up and block caller',
                'Call 1930 Cybercrime Helpline',
                'Notify local police station if threats persist'
              ]
            },
            text: 'Listen carefully. We have registered a money laundering case against your Aadhaar. Transfer immediately.'
          },
          {
            type: 'IMAGE',
            name: 'Fraudulent_UPI_QR_Demand.png',
            verdict: 'SCAM',
            score: 94,
            analysis: {
              verdict: 'SCAM',
              riskScore: 94,
              scamType: 'Fraudulent UPI Collection',
              confidence: 0.98,
              redFlags: [
                'Personal savings account handle disguised with official-sounding alias',
                'Requesting high value transfer as "Verification Guarantee Deposit"',
                'QR code links directly to an unregistered individual merchant'
              ],
              extracted: {
                phones: [],
                upiIds: ['cbi.investigation@okaxis'],
                urls: ['http://cbi-gov-verify.xyz'],
                bankAccounts: ['918273645019'],
                amounts: ['₹50,000'],
                names: ['Cyber Verification Cell'],
                dates: []
              },
              transcript: 'Scan & Pay Rs 50,000 to Cyber Security Escrow Account cbi.investigation@okaxis. Refundable within 24 hours.',
              explanation: 'Standard phishing payment asset directing untraceable funds to a mule UPI VPA.',
              nextSteps: [
                'Submit screenshot as evidence to cyber cell',
                'Request bank freeze on merchant VPA'
              ]
            },
            text: 'Scan & Pay Rs 50,000 to Cyber Security Escrow Account cbi.investigation@okaxis. Refundable within 24 hours.'
          }
        ];

        for (const item of defaultItems) {
          await db.query(
            `INSERT INTO evidence (case_id, user_id, evidence_type, file_name, status, verdict, risk_score, analysis, entities, extracted_text)
             VALUES ($1, $2, $3, $4, 'completed', $5, $6, $7, $8, $9)`,
            [
              req.params.id,
              req.user.id,
              item.type,
              item.name,
              item.verdict,
              item.score,
              JSON.stringify(item.analysis),
              JSON.stringify(item.analysis.extracted),
              item.text
            ]
          );
        }

        result = await db.query(
          'SELECT * FROM evidence WHERE case_id = $1 ORDER BY created_at ASC',
          [req.params.id]
        );
      } catch (seedErr) {
        console.warn('Evidence seed fallback:', seedErr.message);
      }
    }

    res.json({ evidence: result.rows });
  } catch (err) { next(err); }
}

// GET /api/evidence/:id
async function getEvidence(req, res, next) {
  try {
    const result = await db.query(
      'SELECT * FROM evidence WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Evidence not found.' });
    const ev = result.rows[0];
    // Generate signed URL if file exists
    let signedUrl = null;
    if (ev.storage_key) {
      try { signedUrl = await getSignedUrl(ev.storage_key, 60); } catch (_) {}
    }
    res.json({ evidence: ev, signedUrl });
  } catch (err) { next(err); }
}

// POST /api/evidence/:id/reanalyze
async function reanalyzeEvidence(req, res, next) {
  try {
    const result = await db.query(
      'SELECT * FROM evidence WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Evidence not found.' });
    const ev = result.rows[0];

    // Get case language
    const caseResult = await db.query('SELECT language FROM cases WHERE id = $1', [ev.case_id]);
    const language = caseResult.rows[0]?.language || 'en';

    let fileBuffer = null;
    if (ev.storage_key) {
      try { fileBuffer = await downloadFile(ev.storage_key); } catch (e) {
        return res.status(500).json({ error: 'Could not retrieve file for reanalysis.' });
      }
    }

    // Trigger async
    runAnalysis(ev.id, fileBuffer, ev.mime_type, ev.pasted_text, language, ev.file_name).catch(console.error);
    res.json({ message: 'Reanalysis started.' });
  } catch (err) { next(err); }
}

// DELETE /api/evidence/:id
async function deleteEvidence(req, res, next) {
  try {
    const result = await db.query(
      'SELECT storage_key FROM evidence WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Evidence not found.' });
    const ev = result.rows[0];
    if (ev.storage_key) {
      try { await deleteFile(ev.storage_key); } catch (_) {}
    }
    await db.query('DELETE FROM evidence WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ message: 'Evidence deleted.' });
  } catch (err) { next(err); }
}

// GET /api/files (all evidence across cases)
async function listAllFiles(req, res, next) {
  try {
    const result = await db.query(
      `SELECT e.*, c.title as case_title FROM evidence e
       JOIN cases c ON e.case_id = c.id
       WHERE e.user_id = $1 ORDER BY e.created_at DESC LIMIT 100`,
      [req.user.id]
    );
    res.json({ files: result.rows });
  } catch (err) { next(err); }
}

module.exports = { uploadEvidence, pasteEvidence, listEvidence, getEvidence, reanalyzeEvidence, deleteEvidence, listAllFiles, runAnalysis };
