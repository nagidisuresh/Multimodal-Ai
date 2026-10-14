'use strict';

const express = require('express');
const router = express.Router();
const {
  translateText,
  voiceTranslate,
  transcribeAudio,
  speechAdapter,
} = require('../controllers/translateController');

router.post('/translate', translateText);
router.post('/voice-translate', voiceTranslate);
router.post('/transcribe', transcribeAudio);
router.post('/speech', speechAdapter);

module.exports = router;
