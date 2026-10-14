'use strict';

const db = require('../config/db');

// GET /api/search?q=phone_number_or_keyword
async function search(req, res, next) {
  try {
    const q = (req.query.q || '').trim();
    if (!q || q.length < 2) return res.status(400).json({ error: 'Search query must be at least 2 characters.' });

    // Full-text search + entity JSON search
    const result = await db.query(
      `SELECT e.id, e.case_id, e.file_name, e.evidence_type, e.verdict, e.risk_score, e.created_at,
              c.title as case_title,
              ts_rank(e.search_vector, query) as rank
       FROM evidence e
       JOIN cases c ON e.case_id = c.id,
       to_tsquery('english', $1) query
       WHERE e.user_id = $2 AND (
         e.search_vector @@ query OR
         e.entities::text ILIKE $3 OR
         e.pasted_text ILIKE $3 OR
         e.extracted_text ILIKE $3
       )
       ORDER BY rank DESC, e.created_at DESC
       LIMIT 30`,
      [q.split(/\s+/).join(' & '), req.user.id, `%${q}%`]
    );

    res.json({ results: result.rows, query: q });
  } catch (err) {
    // Fallback without tsquery if invalid
    try {
      const result = await db.query(
        `SELECT e.id, e.case_id, e.file_name, e.evidence_type, e.verdict, e.risk_score, e.created_at, c.title as case_title
         FROM evidence e
         JOIN cases c ON e.case_id = c.id
         WHERE e.user_id = $1 AND (
           e.entities::text ILIKE $2 OR e.pasted_text ILIKE $2 OR e.extracted_text ILIKE $2
         )
         ORDER BY e.created_at DESC LIMIT 30`,
        [req.user.id, `%${req.query.q || ''}%`]
      );
      res.json({ results: result.rows, query: req.query.q });
    } catch (e2) { next(e2); }
  }
}

module.exports = { search };
