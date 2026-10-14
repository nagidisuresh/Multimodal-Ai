'use strict';

const db = require('../config/db');
const { generateLearnContent } = require('../services/gemini');
const { learnSchema, quizAttemptSchema } = require('../schemas');

// POST /api/cases/:id/learn
async function createLearnContent(req, res, next) {
  try {
    // Verify case ownership with global fallback
    let caseResult = await db.query('SELECT * FROM cases WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (caseResult.rows.length === 0) {
      caseResult = await db.query('SELECT * FROM cases WHERE id = $1', [req.params.id]);
    }
    if (caseResult.rows.length === 0) return res.status(404).json({ error: 'Case not found.' });
    const caseRow = caseResult.rows[0];

    const parsed = learnSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.errors.map(e => e.message).join(', ') });
    const { scam_type, level } = parsed.data;

    const scamType = scam_type || caseRow.summary?.scamType || 'General Scam';
    const caseContext = caseRow.summary ? JSON.stringify(caseRow.summary) : null;

    const learnData = await generateLearnContent(scamType, level, caseRow.language, caseContext);

    // Save quiz
    const saved = await db.query(
      'INSERT INTO quizzes (case_id, user_id, scam_type, level, data) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [caseRow.id, req.user.id, scamType, level, JSON.stringify(learnData)]
    );

    // Track progress safely
    try {
      const existing = await db.query('SELECT id FROM learning_progress WHERE user_id = $1 AND topic = $2', [req.user.id, scamType]);
      if (existing.rows.length > 0) {
        await db.query('UPDATE learning_progress SET last_studied_at = NOW(), status = $1 WHERE id = $2', ['in_progress', existing.rows[0].id]);
      } else {
        await db.query(
          'INSERT INTO learning_progress (user_id, topic, status, last_studied_at) VALUES ($1, $2, $3, NOW())',
          [req.user.id, scamType, 'in_progress']
        );
      }
    } catch (trackErr) {
      console.warn('Learning progress tracking warning:', trackErr.message);
    }

    res.json({ learn: learnData, quiz_id: saved.rows[0].id });
  } catch (err) { next(err); }
}

// POST /api/learn/quiz-attempt
async function saveQuizAttempt(req, res, next) {
  try {
    const parsed = quizAttemptSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.errors.map(e => e.message).join(', ') });
    const { quiz_id, answers } = parsed.data;

    // Verify quiz ownership
    const quizResult = await db.query('SELECT * FROM quizzes WHERE id = $1 AND user_id = $2', [quiz_id, req.user.id]);
    if (quizResult.rows.length === 0) return res.status(404).json({ error: 'Quiz not found.' });
    const quiz = quizResult.rows[0];
    const quizData = quiz.data;

    // Calculate score
    let score = 0;
    answers.forEach(({ question_index, selected_index }) => {
      if (quizData.quiz[question_index]?.correctIndex === selected_index) score++;
    });

    const attempt = await db.query(
      'INSERT INTO quiz_attempts (quiz_id, user_id, score, total, answers) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [quiz_id, req.user.id, score, quizData.quiz.length, JSON.stringify(answers)]
    );

    // Update progress to completed if score >= 80%
    if (score / quizData.quiz.length >= 0.8) {
      await db.query(
        `UPDATE learning_progress SET status = 'completed', last_studied_at = NOW()
         WHERE user_id = $1 AND topic = $2`,
        [req.user.id, quiz.scam_type]
      );
    }

    res.json({ attempt: attempt.rows[0], score, total: quizData.quiz.length });
  } catch (err) { next(err); }
}

// GET /api/progress
async function getProgress(req, res, next) {
  try {
    const progress = await db.query(
      'SELECT * FROM learning_progress WHERE user_id = $1 ORDER BY last_studied_at DESC',
      [req.user.id]
    );
    const attempts = await db.query(
      `SELECT qa.*, q.scam_type, q.level FROM quiz_attempts qa
       JOIN quizzes q ON qa.quiz_id = q.id
       WHERE qa.user_id = $1 ORDER BY qa.created_at DESC LIMIT 20`,
      [req.user.id]
    );
    res.json({ progress: progress.rows, attempts: attempts.rows });
  } catch (err) { next(err); }
}

module.exports = { createLearnContent, saveQuizAttempt, getProgress };
