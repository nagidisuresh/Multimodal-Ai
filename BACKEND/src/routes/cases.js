'use strict';

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { createCase, listCases, getCase, updateCase, deleteCase } = require('../controllers/caseController');

router.use(authenticate);
router.post('/', createCase);
router.get('/', listCases);
router.get('/:id', getCase);
router.patch('/:id', updateCase);
router.delete('/:id', deleteCase);

module.exports = router;
