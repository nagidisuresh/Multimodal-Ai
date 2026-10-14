'use strict';

const requiredEnvVars = [
  'PORT',
  'FRONTEND_URL',
  'GEMINI_API_KEY',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
];

// Optional but validated at use-time
const optionalEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'GOOGLE_CLIENT_ID'];

function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error('❌ [OmniMind AI Startup Check] Missing required environment variables:');
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error('\nCopy .env.example to .env and configure all required keys.\nServer cannot start without these variables in production.');
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }

  // Warn about optional vars
  optionalEnvVars.forEach((key) => {
    if (!process.env[key]) {
      console.warn(`⚠️  Optional env var ${key} is not set. Using sensible fallback.`);
    }
  });
}

module.exports = {
  validateEnv,
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'omnimind_production_jwt_secret_key_minimum_64_characters_long_for_security',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '20', 10),
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
};
