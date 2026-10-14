-- ScamKavach Migration v3: Google OAuth columns
-- Run this in the Supabase SQL Editor after 0001_init.sql and 0002_visual_lessons.sql

-- Add google_id and avatar_url to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Make password_hash nullable (Google-only accounts won't have one)
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Index for fast Google ID lookup
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id) WHERE google_id IS NOT NULL;

DO $$
BEGIN
  RAISE NOTICE 'Google OAuth columns added successfully!';
END $$;
