'use strict';

const multer = require('multer');
const { MAX_FILE_SIZE_MB } = require('../config/env');
const { checkSignature, ALLOWED_MIME_TYPES } = require('../services/fileSignature');

const maxSize = MAX_FILE_SIZE_MB * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxSize },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return cb(new Error(
        `File type "${file.mimetype}" is not allowed. Allowed types: images (JPEG, PNG, WebP), PDF, TXT, MP3, WAV, MP4.`
      ));
    }
    cb(null, true);
  },
});

/**
 * Middleware to validate uploaded file signature after Multer processing.
 */
function validateFileSignature(req, res, next) {
  if (!req.file) return next();
  const valid = checkSignature(req.file.buffer, req.file.mimetype);
  if (!valid) {
    return res.status(400).json({
      error: `File content does not match the declared type (${req.file.mimetype}). Your file might have a spoofed extension.`,
    });
  }
  next();
}

module.exports = { upload, validateFileSignature };
