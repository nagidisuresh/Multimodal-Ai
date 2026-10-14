'use strict';

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');
const { generate, listContent, getContent, deleteContent } = require('../controllers/contentController');

router.post('/generate', authenticate, aiLimiter, generate);
router.get('/', authenticate, listContent);
router.get('/:id', authenticate, getContent);
router.delete('/:id', authenticate, deleteContent);

module.exports = router;
