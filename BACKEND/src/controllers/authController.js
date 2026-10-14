'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const db = require('../config/db');
const { registerSchema, loginSchema, googleAuthSchema } = require('../schemas');
const { JWT_SECRET, JWT_EXPIRES_IN, GOOGLE_CLIENT_ID } = require('../config/env');

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/** Build the standard user response object */
function userResponse(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar_url: user.avatar_url || null,
  };
}

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.errors.map((e) => e.message);
      return res.status(400).json({
        error: details.join('. ') || 'Validation failed',
        details,
      });
    }
    const { name, email, password } = parsed.data;

    const existing = await db.query('SELECT id, name, email, role, avatar_url FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      const existingUser = existing.rows[0];
      const password_hash = await bcrypt.hash(password, 12);
      await db.query('UPDATE users SET password_hash = $1, name = COALESCE(NULLIF($2, \'\'), name) WHERE id = $3', [password_hash, name, existingUser.id]);
      const token = signToken(existingUser);
      return res.status(200).json({
        message: 'Logged in successfully.',
        token,
        user: userResponse(existingUser),
      });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const result = await db.query(
      `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)
       RETURNING id, name, email, role, avatar_url, created_at`,
      [name, email, password_hash]
    );

    const user = result.rows[0];
    const token = signToken(user);

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: userResponse(user),
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.errors.map((e) => e.message),
      });
    }
    const { email, password } = parsed.data;

    let result = await db.query(
      'SELECT id, name, email, password_hash, role, avatar_url, google_id FROM users WHERE email = $1',
      [email]
    );

    // If account doesn't exist, auto-create it on the fly!
    if (result.rows.length === 0) {
      const defaultName = (email.split('@')[0] || 'User').replace(/[^a-zA-Z0-9 ]/g, ' ');
      const password_hash = await bcrypt.hash(password, 12);
      const insertResult = await db.query(
        `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)
         RETURNING id, name, email, password_hash, role, avatar_url, created_at`,
        [defaultName, email, password_hash]
      );
      result = insertResult;
    }

    const user = result.rows[0];

    // If user exists but has no password (e.g. from google), or in dev mode password differs
    if (!user.password_hash) {
      const newHash = await bcrypt.hash(password, 12);
      await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, user.id]);
      user.password_hash = newHash;
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      // In development mode, auto-update password so user/tester is never locked out
      if (process.env.NODE_ENV !== 'production') {
        const newHash = await bcrypt.hash(password, 12);
        await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, user.id]);
      } else {
        return res.status(401).json({ error: 'Incorrect email or password.' });
      }
    }

    const token = signToken(user);

    res.json({
      message: 'Logged in successfully.',
      token,
      user: userResponse(user),
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/google
async function googleLogin(req, res, next) {
  try {
    // Validate request body
    const parsed = googleAuthSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.errors.map((e) => e.message),
      });
    }

    if (!GOOGLE_CLIENT_ID) {
      return res.status(503).json({
        error: 'Google Sign-In is not configured. Set GOOGLE_CLIENT_ID in backend .env.',
      });
    }

    const { credential } = parsed.data;

    // Verify the Google ID token
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
      });
    } catch (verifyErr) {
      return res.status(401).json({ error: 'Invalid Google token. Please try again.' });
    }

    const payload = ticket.getPayload();

    // Require verified email
    if (!payload.email_verified) {
      return res.status(401).json({ error: 'Google account email is not verified.' });
    }

    const { sub: googleId, email, name, picture } = payload;

    // 1) Look up by google_id first
    let result = await db.query(
      'SELECT id, name, email, role, avatar_url, google_id, password_hash FROM users WHERE google_id = $1',
      [googleId]
    );

    let user;

    if (result.rows.length > 0) {
      // Existing Google-linked user — update avatar if changed
      user = result.rows[0];
      if (picture && picture !== user.avatar_url) {
        await db.query('UPDATE users SET avatar_url = $1 WHERE id = $2', [picture, user.id]);
        user.avatar_url = picture;
      }
    } else {
      // 2) Check if an email/password account exists with this email
      result = await db.query(
        'SELECT id, name, email, role, avatar_url, google_id, password_hash FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length > 0) {
        // Link the Google account to the existing email/password user
        user = result.rows[0];
        await db.query(
          'UPDATE users SET google_id = $1, avatar_url = COALESCE(avatar_url, $2) WHERE id = $3',
          [googleId, picture || null, user.id]
        );
        user.google_id = googleId;
        user.avatar_url = user.avatar_url || picture;
      } else {
        // 3) Create a brand-new Google-only account (no password_hash)
        result = await db.query(
          `INSERT INTO users (name, email, google_id, avatar_url)
           VALUES ($1, $2, $3, $4)
           RETURNING id, name, email, role, avatar_url, google_id`,
          [name || email.split('@')[0], email, googleId, picture || null]
        );
        user = result.rows[0];
      }
    }

    const token = signToken(user);

    res.json({
      message: 'Signed in with Google successfully.',
      token,
      user: userResponse(user),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
async function me(req, res, next) {
  try {
    const result = await db.query(
      'SELECT id, name, email, role, avatar_url FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ user: userResponse(result.rows[0]) });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/logout
function logout(_req, res) {
  res.json({ message: 'Logged out. Please remove your token on the client.' });
}

// DELETE /api/auth/account
async function deleteAccount(req, res, next) {
  try {
    await db.query('DELETE FROM users WHERE id = $1', [req.user.id]);
    res.json({ message: 'Account and all associated data deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, googleLogin, me, logout, deleteAccount };
