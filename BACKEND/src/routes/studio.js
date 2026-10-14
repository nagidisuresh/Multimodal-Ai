'use strict';

const express = require('express');
const router = express.Router();
const { generateStudioOutput } = require('../controllers/studioController');

router.post('/generate', generateStudioOutput);

module.exports = router;
