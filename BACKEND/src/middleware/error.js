'use strict';

function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const isDev = process.env.NODE_ENV === 'development';

  // CORS errors
  if (err.message && err.message.startsWith('CORS:')) {
    return res.status(403).json({ error: err.message });
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: `File too large. Maximum size is ${process.env.MAX_FILE_SIZE_MB || 20} MB.` });
  }

  // PostgreSQL errors
  if (err.code && err.code.startsWith('2') || err.code === '23505') {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A record with this value already exists.' });
    }
  }

  // Generic
  const message = isDev ? err.message : 'Something went wrong. Please try again.';
  console.error(`[ERROR] ${status} - ${err.message}`);
  if (isDev && err.stack) console.error(err.stack);

  res.status(status).json({ error: message });
}

module.exports = errorHandler;
