'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticate } = require('../middleware/auth');
const {
  uploadWorkspaceFile,
  listFiles,
  deleteFileRecord,
  triggerExtraction
} = require('../controllers/fileController');

// Multer memory storage (buffer uploaded to Supabase Storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB limit
});

router.post('/upload', authenticate, upload.single('file'), uploadWorkspaceFile);
router.post('/workspace/:workspaceId', authenticate, upload.single('file'), uploadWorkspaceFile);
router.get('/', authenticate, listFiles);
router.delete('/:id', authenticate, deleteFileRecord);
router.post('/:id/extract', authenticate, triggerExtraction);

module.exports = router;
