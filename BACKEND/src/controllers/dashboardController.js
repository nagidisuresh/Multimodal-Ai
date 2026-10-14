'use strict';

const db = require('../config/db');

// GET /api/dashboard/stats
async function stats(req, res, next) {
  try {
    const userId = req.user.id;
    const [
      wsCount,
      fCount,
      cCount,
      caseCount,
      verdictBreakdown,
      evidenceCount,
      recentCases,
      recentEvidence,
      recentWorkspaces,
      quizStats,
      progress,
    ] = await Promise.all([
      db.query('SELECT COUNT(*) FROM workspaces WHERE user_id = $1', [userId]).catch(() => ({ rows: [{ count: 0 }] })),
      db.query('SELECT COUNT(*) FROM files WHERE user_id = $1', [userId]).catch(() => ({ rows: [{ count: 0 }] })),
      db.query('SELECT COUNT(*) FROM conversations WHERE user_id = $1', [userId]).catch(() => ({ rows: [{ count: 0 }] })),
      db.query('SELECT COUNT(*) FROM cases WHERE user_id = $1', [userId]),
      db.query(
        `SELECT verdict, COUNT(*) FROM cases WHERE user_id = $1 GROUP BY verdict`,
        [userId]
      ),
      db.query('SELECT COUNT(*) FROM evidence WHERE user_id = $1', [userId]),
      db.query('SELECT id, title, verdict, risk_score, status, created_at FROM cases WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5', [userId]),
      db.query('SELECT id, file_name, evidence_type, verdict, status, created_at FROM evidence WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5', [userId]),
      db.query('SELECT id, name, mode, language, created_at FROM workspaces WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5', [userId]).catch(() => ({ rows: [] })),
      db.query(
        `SELECT AVG(score::float/total) as avg_score, COUNT(*) as attempts
         FROM quiz_attempts WHERE user_id = $1`, [userId]
      ),
      db.query('SELECT topic, status FROM learning_progress WHERE user_id = $1 ORDER BY last_studied_at DESC LIMIT 5', [userId]),
    ]);

    const verdicts = {};
    verdictBreakdown.rows.forEach(r => { verdicts[r.verdict] = parseInt(r.count); });

    res.json({
      workspacesCount: parseInt(wsCount.rows[0].count || 0),
      filesCount: parseInt(fCount.rows[0].count || 0),
      conversationsCount: parseInt(cCount.rows[0].count || 0),
      totalWorkspaces: parseInt(wsCount.rows[0].count || 0),
      totalFiles: parseInt(fCount.rows[0].count || 0),
      totalConversations: parseInt(cCount.rows[0].count || 0),
      totalCases: parseInt(caseCount.rows[0].count),
      totalEvidence: parseInt(evidenceCount.rows[0].count),
      recentWorkspaces: recentWorkspaces.rows,
      casesByVerdict: verdicts,
      recentCases: recentCases.rows,
      recentEvidence: recentEvidence.rows,
      quizStats: {
        totalAttempts: parseInt(quizStats.rows[0].attempts || 0),
        avgScore: Math.round((quizStats.rows[0].avg_score || 0) * 100),
      },
      recentProgress: progress.rows,
    });
  } catch (err) { next(err); }
}

module.exports = { stats };
