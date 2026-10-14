'use strict';

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { upload, validateFileSignature } = require('../middleware/upload');
const { uploadLimiter } = require('../middleware/rateLimiter');
const {
  uploadEvidence, pasteEvidence, listEvidence, getEvidence,
  reanalyzeEvidence, deleteEvidence, listAllFiles
} = require('../controllers/evidenceController');

// File upload for a specific case
router.post('/cases/:id/evidence',
  authenticate, uploadLimiter,
  upload.single('file'), validateFileSignature,
  uploadEvidence
);

// Paste text/link evidence
router.post('/cases/:id/evidence/paste', authenticate, pasteEvidence);

// List evidence for a case
router.get('/cases/:id/evidence', authenticate, listEvidence);

// Get single evidence with signed URL
router.get('/evidence/:id', authenticate, getEvidence);

// Retry analysis
router.post('/evidence/:id/reanalyze', authenticate, reanalyzeEvidence);
router.post('/evidence/:id/retry', authenticate, reanalyzeEvidence);

// Delete evidence
router.delete('/evidence/:id', authenticate, deleteEvidence);

// All files library
router.get('/files', authenticate, listAllFiles);

module.exports = router;
