'use strict';

const express = require('express');
const router = express.Router();
const { register, login, googleLogin, me, logout, deleteAccount } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleLogin);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);
router.delete('/account', authenticate, deleteAccount);

module.exports = router;
