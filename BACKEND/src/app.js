'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const { FRONTEND_URL, NODE_ENV } = require('./config/env');
const errorHandler = require('./middleware/error');

// Routes
const authRoutes = require('./routes/auth');
const caseRoutes = require('./routes/cases');
const evidenceRoutes = require('./routes/evidence');
const aiRoutes = require('./routes/ai');
const contentRoutes = require('./routes/content');
const learnRoutes = require('./routes/learn');
const searchRoutes = require('./routes/search');
const dashboardRoutes = require('./routes/dashboard');
const conversationRoutes = require('./routes/conversations');
const visualRoutes = require('./routes/visual');
const omnimindRoutes = require('./routes/omnimind');
const workspaceRoutes = require('./routes/workspaces');
const fileRoutes = require('./routes/files');
const chatRoutes = require('./routes/chat');
const studioRoutes = require('./routes/studio');
const translateRoutes = require('./routes/translate');

const app = express();

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, curl, mobile, and dev tools with no origin
    if (!origin) return callback(null, true);
    const allowed = FRONTEND_URL ? FRONTEND_URL.replace(/\/+$/, '') : null;
    if (
      !allowed ||
      origin === allowed ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.endsWith('.netlify.app') ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com')
    ) {
      callback(null, true);
    } else {
      // In production API, accept incoming web requests gracefully
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ─── Logging ──────────────────────────────────────────────────────────────────
if (NODE_ENV !== 'test') {
  app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ─── Rate Limiting & Latency Tracking ─────────────────────────────────────────
const { generalLimiter } = require('./middleware/rateLimiter');
app.use('/api', generalLimiter);

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (NODE_ENV === 'development') {
      console.log(`[OmniMind Latency] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// ─── Health check (Render keep-alive) ─────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString(), env: NODE_ENV });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api', evidenceRoutes);
app.use('/api', aiRoutes);
app.use('/api/content', contentRoutes);
app.use('/api', learnRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', conversationRoutes);
app.use('/api/visual', visualRoutes);
app.use('/api/omnimind', omnimindRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/studio', studioRoutes);
app.use('/api', translateRoutes);

// ─── 404 catch-all ────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Centralised error handler ────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
