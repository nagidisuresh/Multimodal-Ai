'use strict';

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  createWorkspace,
  listWorkspaces,
  getWorkspace,
  deleteWorkspace
} = require('../controllers/workspaceController');

router.post('/', authenticate, createWorkspace);
router.get('/', authenticate, listWorkspaces);
router.get('/:id', authenticate, getWorkspace);
router.delete('/:id', authenticate, deleteWorkspace);

module.exports = router;
