'use strict';

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { createConversation, listConversations, renameConversation, deleteConversation } = require('../controllers/conversationController');

router.post('/cases/:id/conversations', authenticate, createConversation);
router.get('/cases/:id/conversations', authenticate, listConversations);
router.patch('/conversations/:id', authenticate, renameConversation);
router.delete('/conversations/:id', authenticate, deleteConversation);

module.exports = router;
