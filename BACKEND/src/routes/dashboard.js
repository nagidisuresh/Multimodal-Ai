'use strict';

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { stats } = require('../controllers/dashboardController');

router.get('/stats', authenticate, stats);

module.exports = router;
