'use strict';

require('dotenv').config();
const { validateEnv, PORT } = require('./config/env');

validateEnv();

const app = require('./app');
const { pool } = require('./config/db');

async function start() {
  // Verify DB connection on startup
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL connected:', res.rows[0].now);
  } catch (err) {
    console.warn('⚠️ PostgreSQL connection pending or failed:', err.message);
    console.warn('👉 Ensure your DATABASE_URL in BACKEND/.env has your valid Supabase Postgres password.');
  }

  const server = app.listen(PORT, () => {
    console.log(`🚀 ScamKavach backend running on port ${PORT}`);
    console.log(`📡 Health: http://localhost:${PORT}/api/health`);
  });

  return server;
}

start();

module.exports = { app, start };
