'use strict';

const db = require('../config/db');
const { createConversationSchema, renameConversationSchema } = require('../schemas');

async function verifyCase(caseId, userId) {
  let r = await db.query('SELECT id FROM cases WHERE id = $1 AND user_id = $2', [caseId, userId]);
  if (r.rows[0]) return r.rows[0];
  r = await db.query('SELECT id FROM cases WHERE id = $1', [caseId]);
  return r.rows[0] || null;
}

// POST /api/cases/:id/conversations
async function createConversation(req, res, next) {
  try {
    const caseRow = await verifyCase(req.params.id, req.user.id);
    if (!caseRow) return res.status(404).json({ error: 'Case not found.' });
    const parsed = createConversationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.errors.map(e => e.message).join(', ') });
    const result = await db.query(
      'INSERT INTO conversations (case_id, user_id, title) VALUES ($1, $2, $3) RETURNING *',
      [req.params.id, req.user.id, parsed.data.title]
    );
    res.status(201).json({ conversation: result.rows[0] });
  } catch (err) { next(err); }
}

// GET /api/cases/:id/conversations
async function listConversations(req, res, next) {
  try {
    const caseRow = await verifyCase(req.params.id, req.user.id);
    if (!caseRow) return res.status(404).json({ error: 'Case not found.' });
    const result = await db.query(
      'SELECT * FROM conversations WHERE case_id = $1 AND user_id = $2 ORDER BY created_at DESC',
      [req.params.id, req.user.id]
    );
    res.json({ conversations: result.rows });
  } catch (err) { next(err); }
}

// PATCH /api/conversations/:id
async function renameConversation(req, res, next) {
  try {
    const parsed = renameConversationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.errors.map(e => e.message).join(', ') });
    const result = await db.query(
      'UPDATE conversations SET title = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [parsed.data.title, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Conversation not found.' });
    res.json({ conversation: result.rows[0] });
  } catch (err) { next(err); }
}

// DELETE /api/conversations/:id
async function deleteConversation(req, res, next) {
  try {
    const result = await db.query(
      'DELETE FROM conversations WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Conversation not found.' });
    res.json({ message: 'Conversation deleted.' });
  } catch (err) { next(err); }
}

module.exports = { createConversation, listConversations, renameConversation, deleteConversation };
