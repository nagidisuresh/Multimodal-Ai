'use strict';

const express = require('express');
const router = express.Router();
const {
  getModes,
  getModeDetails,
  askOmniMind,
  generateStudioOutput,
} = require('../controllers/omnimindController');

router.get('/modes', getModes);
router.get('/mode/:modeId', getModeDetails);
router.post('/ask', askOmniMind);
router.post('/studio', generateStudioOutput);

module.exports = router;
