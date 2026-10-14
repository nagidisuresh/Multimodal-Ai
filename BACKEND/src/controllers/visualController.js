'use strict';

const db = require('../config/db');
const { visualExplainSchema } = require('../schemas');
const { generateVisualLesson } = require('../services/gemini');
const { checkSignature, ALLOWED_MIME_TYPES } = require('../services/fileSignature');

// POST /api/visual/explain
async function explain(req, res, next) {
  try {
    // Parse body fields (may come as multipart form-data alongside file)
    const parsed = visualExplainSchema.safeParse({
      topic: req.body.topic,
      level: req.body.level || 'beginner',
      language: req.body.language || 'en',
    });

    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.errors.map((e) => e.message),
      });
    }

    const { topic, level, language } = parsed.data;

    // Optional image via Multer (memory storage)
    let imageBuffer = null;
    let imageMimeType = null;

    if (req.file) {
      const sigValid = checkSignature(req.file.buffer, req.file.mimetype);
      if (!sigValid) {
        return res.status(400).json({ error: 'Unsupported or corrupted file. Only PNG, JPEG, WebP images are accepted for diagrams.' });
      }
      // Only accept image types for diagram upload
      if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({ error: 'Only image files (PNG, JPEG, WebP) are accepted for diagram upload.' });
      }
      imageBuffer = req.file.buffer;
      imageMimeType = req.file.mimetype;
    }

    // Call Gemini
    const lessonData = await generateVisualLesson(topic, level, language, imageBuffer, imageMimeType);

    // Save to database
    const result = await db.query(
      `INSERT INTO visual_lessons (user_id, topic, level, language, data)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, topic, level, language, created_at`,
      [req.user.id, topic, level, language, JSON.stringify(lessonData)]
    );

    const saved = result.rows[0];

    res.status(201).json({
      lesson: {
        id: saved.id,
        topic: saved.topic,
        level: saved.level,
        language: saved.language,
        created_at: saved.created_at,
        data: lessonData,
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/visual — list user's visual lessons
async function listLessons(req, res, next) {
  try {
    const result = await db.query(
      `SELECT id, topic, level, language, data, created_at
       FROM visual_lessons
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [req.user.id]
    );

    res.json({ lessons: result.rows });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/visual/:id — delete a visual lesson (own only)
async function deleteLesson(req, res, next) {
  try {
    const { id } = req.params;
    const result = await db.query(
      'DELETE FROM visual_lessons WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found or not owned by you.' });
    }

    res.json({ message: 'Lesson deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { explain, listLessons, deleteLesson };
