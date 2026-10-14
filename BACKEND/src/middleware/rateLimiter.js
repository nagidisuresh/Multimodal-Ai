'use strict';

const rateLimit = require('express-rate-limit');

const isDev = process.env.NODE_ENV === 'development';
const isLocalhost = (req) =>
  req.ip === '127.0.0.1' ||
  req.ip === '::1' ||
  req.ip === '::ffff:127.0.0.1' ||
  req.hostname === 'localhost';

// Auth: Relaxed in dev / localhost to avoid developer lockouts; protected in production
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 2000 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please wait 15 minutes before trying again.' },
  skipSuccessfulRequests: true,
  skip: (req) => isDev || isLocalhost(req),
});

// Upload: Relaxed in dev
const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: isDev ? 1000 : 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many uploads. Please wait before uploading more files.' },
  skip: (req) => isDev || isLocalhost(req),
});

// AI calls: Relaxed in dev
const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: isDev ? 1000 : 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many AI requests. Please wait a moment before trying again.' },
  skip: (req) => isDev || isLocalhost(req),
});

// General API
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 10000 : 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' },
  skip: (req) => isDev || isLocalhost(req),
});

module.exports = { authLimiter, uploadLimiter, aiLimiter, generalLimiter };
