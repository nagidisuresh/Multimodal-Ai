'use strict';

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');
const { createLearnContent, saveQuizAttempt, getProgress } = require('../controllers/learnController');

router.post('/cases/:id/learn', authenticate, aiLimiter, createLearnContent);
router.post('/learn/quiz-attempt', authenticate, saveQuizAttempt);
router.get('/progress', authenticate, getProgress);

module.exports = router;
