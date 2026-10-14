-- ScamKavach Database Migration v1
-- Run this in the Supabase SQL Editor
-- Project: https://pbdoqhakywwctvmxznuw.supabase.co

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =============================================
-- CASES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  language VARCHAR(10) DEFAULT 'en' NOT NULL CHECK (language IN ('en', 'te', 'hi')),
  status VARCHAR(50) DEFAULT 'OPEN' NOT NULL CHECK (status IN ('OPEN', 'ANALYZED', 'CLOSED')),
  verdict VARCHAR(50) DEFAULT 'PENDING' CHECK (verdict IN ('SAFE', 'SUSPICIOUS', 'SCAM', 'PENDING')),
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  summary JSONB DEFAULT '{}',
  timeline JSONB DEFAULT '[]',
  linked_entities JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cases_user_id ON cases(user_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_verdict ON cases(verdict);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at DESC);

-- =============================================
-- EVIDENCE TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  evidence_type VARCHAR(50) NOT NULL CHECK (evidence_type IN ('TEXT', 'IMAGE', 'PDF', 'AUDIO', 'VIDEO', 'LINK')),
  file_name VARCHAR(500),
  mime_type VARCHAR(255),
  size_bytes BIGINT DEFAULT 0,
  storage_key VARCHAR(1000),
  pasted_text TEXT,
  status VARCHAR(50) DEFAULT 'uploaded' NOT NULL CHECK (status IN ('uploaded', 'processing', 'completed', 'failed')),
  error_message TEXT,
  analysis JSONB DEFAULT '{}',
  entities JSONB DEFAULT '{"phones":[],"upiIds":[],"urls":[],"bankAccounts":[],"amounts":[],"names":[],"dates":[]}',
  extracted_text TEXT,
  verdict VARCHAR(50) DEFAULT 'PENDING' CHECK (verdict IN ('SAFE', 'SUSPICIOUS', 'SCAM', 'PENDING')),
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_evidence_case_id ON evidence(case_id);
CREATE INDEX IF NOT EXISTS idx_evidence_user_id ON evidence(user_id);
CREATE INDEX IF NOT EXISTS idx_evidence_status ON evidence(status);
CREATE INDEX IF NOT EXISTS idx_evidence_type ON evidence(evidence_type);
CREATE INDEX IF NOT EXISTS idx_evidence_search_vector ON evidence USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_evidence_entities ON evidence USING GIN(entities);
CREATE INDEX IF NOT EXISTS idx_evidence_created_at ON evidence(created_at DESC);

-- Function to update search_vector from pasted_text and extracted_text
CREATE OR REPLACE FUNCTION update_evidence_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.pasted_text, '') || ' ' ||
    COALESCE(NEW.extracted_text, '') || ' ' ||
    COALESCE(NEW.file_name, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER evidence_search_vector_update
  BEFORE INSERT OR UPDATE ON evidence
  FOR EACH ROW EXECUTE FUNCTION update_evidence_search_vector();

-- =============================================
-- CONVERSATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) DEFAULT 'New Conversation' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_conversations_case_id ON conversations(case_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);

-- =============================================
-- MESSAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'ai')),
  content TEXT NOT NULL,
  sources JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_case_id ON messages(case_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at ASC);

-- =============================================
-- GENERATED CONTENT TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS generated_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
  platform VARCHAR(100) NOT NULL,
  format VARCHAR(100) NOT NULL,
  tone VARCHAR(100),
  language VARCHAR(10) DEFAULT 'en',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_content_user_id ON generated_content(user_id);
CREATE INDEX IF NOT EXISTS idx_content_case_id ON generated_content(case_id);
CREATE INDEX IF NOT EXISTS idx_content_created_at ON generated_content(created_at DESC);

-- =============================================
-- QUIZZES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scam_type VARCHAR(255) NOT NULL,
  level VARCHAR(50) DEFAULT 'beginner' NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_quizzes_user_id ON quizzes(user_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_case_id ON quizzes(case_id);

-- =============================================
-- QUIZ ATTEMPTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 5,
  answers JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user_id ON quiz_attempts(user_id);

-- =============================================
-- LEARNING PROGRESS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'in_progress' NOT NULL CHECK (status IN ('in_progress', 'completed')),
  last_studied_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, topic)
);

CREATE INDEX IF NOT EXISTS idx_progress_user_id ON learning_progress(user_id);

-- =============================================
-- UPDATED_AT auto-update trigger
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (defense in depth)
-- The backend uses service_role key and enforces ownership.
-- RLS is enabled but no public policies — backend bypasses with service_role.
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'ScamKavach database migration completed successfully!';
END $$;
