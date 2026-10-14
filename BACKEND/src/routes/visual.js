'use strict';

const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { aiLimiter } = require('../middleware/rateLimiter');
const { explain, listLessons, deleteLesson } = require('../controllers/visualController');

const router = Router();

// POST /api/visual/explain — generate a visual lesson (rate-limited, auth, optional image)
router.post('/explain', authenticate, aiLimiter, upload.single('file'), explain);

// GET /api/visual — list user's saved visual lessons
router.get('/', authenticate, listLessons);

// DELETE /api/visual/:id — delete a visual lesson
router.delete('/:id', authenticate, deleteLesson);

module.exports = router;
