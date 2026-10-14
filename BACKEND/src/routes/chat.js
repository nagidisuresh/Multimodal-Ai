'use strict';

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  askQuestion,
  listConversations,
  getConversationMessages,
  deleteConversation
} = require('../controllers/chatController');

router.post('/ask', authenticate, askQuestion);
router.get('/conversations', authenticate, listConversations);
router.get('/conversations/:id/messages', authenticate, getConversationMessages);
router.delete('/conversations/:id', authenticate, deleteConversation);

module.exports = router;
