'use strict';

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');
const { summarize, chat, getMessages, complaint } = require('../controllers/aiController');

router.post('/cases/:id/summarize', authenticate, aiLimiter, summarize);
router.post('/cases/:id/chat', authenticate, aiLimiter, chat);
router.get('/cases/:id/messages', authenticate, getMessages);
router.post('/cases/:id/complaint', authenticate, aiLimiter, complaint);

module.exports = router;
