-- ScamKavach Migration v2: Visual Lessons table
-- Run this in the Supabase SQL Editor after 0001_init.sql

-- =============================================
-- VISUAL LESSONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS visual_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic VARCHAR(500) NOT NULL,
  level VARCHAR(50) DEFAULT 'beginner' NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  language VARCHAR(10) DEFAULT 'en' NOT NULL CHECK (language IN ('en', 'te', 'hi')),
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_visual_lessons_user_id ON visual_lessons(user_id);
CREATE INDEX IF NOT EXISTS idx_visual_lessons_created_at ON visual_lessons(created_at DESC);

ALTER TABLE visual_lessons ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  RAISE NOTICE 'Visual Lessons table created successfully!';
END $$;
