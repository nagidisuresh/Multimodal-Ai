'use strict';

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const db = require('../config/db');

/**
 * Middleware: validate JWT from Authorization header.
 * Attaches req.user = { id, email, name, role } from the verified token.
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided. Please log in.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verify user still exists
    const result = await db.query(
      'SELECT id, name, email, role FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found. Please log in again.' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
    }
    next(err);
  }
}

/**
 * Role-check middleware factory. Use after `authenticate`.
 * @param  {...string} roles - Allowed roles (e.g. 'admin', 'user')
 * @returns {Function} Express middleware
 * @example router.get('/admin', authenticate, requireRole('admin'), handler);
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to access this resource.' });
    }
    next();
  };
}

module.exports = { authenticate, requireRole };
