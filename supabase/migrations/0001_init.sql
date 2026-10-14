-- ====================================================================
-- OmniMind AI — Database Migration v1.0
-- Target: Supabase Cloud PostgreSQL
-- Project: OmniMind AI (One Input. Every Insight.)
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 2. PROFILES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL DEFAULT 'User',
  email VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  preferred_language VARCHAR(10) DEFAULT 'en' NOT NULL CHECK (preferred_language IN ('en', 'hi', 'te')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Automatic Profile Creation Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, preferred_language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email,
    'en'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- 3. WORKSPACES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  mode VARCHAR(50) DEFAULT 'learnable' NOT NULL CHECK (mode IN ('learnable', 'visionvoice', 'visioncart', 'kitchenmate', 'healthlens', 'roadsense')),
  language VARCHAR(10) DEFAULT 'en' NOT NULL CHECK (language IN ('en', 'hi', 'te')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_workspaces_user_id ON public.workspaces(user_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_created_at ON public.workspaces(created_at DESC);

-- ====================================================================
-- 4. FILES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(500) NOT NULL,
  original_name VARCHAR(500) NOT NULL,
  file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('pdf', 'image', 'audio', 'video')),
  mime_type VARCHAR(255) NOT NULL,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  storage_path TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'uploaded' NOT NULL CHECK (status IN ('uploaded', 'processing', 'extracted', 'failed')),
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  extracted_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_files_workspace_id ON public.files(workspace_id);
CREATE INDEX IF NOT EXISTS idx_files_user_id ON public.files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_status ON public.files(status);

-- ====================================================================
-- 5. CHUNKS TABLE (Multimodal Grounding & Search Index)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID NOT NULL REFERENCES public.files(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chunk_type VARCHAR(50) NOT NULL CHECK (chunk_type IN ('text', 'ocr', 'transcript', 'keyframe', 'summary')),
  content TEXT NOT NULL,
  page_number INTEGER,
  start_timestamp VARCHAR(20),
  end_timestamp VARCHAR(20),
  bounding_box JSONB, -- { x, y, width, height, label }
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chunks_file_id ON public.chunks(file_id);
CREATE INDEX IF NOT EXISTS idx_chunks_workspace_id ON public.chunks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_chunks_search ON public.chunks USING GIN(search_vector);

-- Trigger to auto-update full-text search vector
CREATE OR REPLACE FUNCTION public.chunks_search_trigger()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', COALESCE(NEW.content, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_chunks_search ON public.chunks;
CREATE TRIGGER trg_chunks_search
  BEFORE INSERT OR UPDATE ON public.chunks
  FOR EACH ROW EXECUTE FUNCTION public.chunks_search_trigger();

-- ====================================================================
-- 6. CONVERSATIONS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(500) DEFAULT 'New Conversation' NOT NULL,
  mode VARCHAR(50) DEFAULT 'learnable' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_conversations_workspace_id ON public.conversations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);

-- ====================================================================
-- 7. MESSAGES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'completed' NOT NULL CHECK (status IN ('sending', 'generating', 'completed', 'failed')),
  confidence NUMERIC(4, 2) DEFAULT 0.95,
  citations JSONB DEFAULT '[]'::jsonb NOT NULL,
  missing_info TEXT,
  follow_up_questions JSONB DEFAULT '[]'::jsonb NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at ASC);

-- ====================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles: users can select/update only their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Workspaces: users manage their own workspaces
CREATE POLICY "Users can manage own workspaces"
  ON public.workspaces FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Files: users manage their own files
CREATE POLICY "Users can manage own files"
  ON public.files FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Chunks: users read and manage chunks from their workspaces
CREATE POLICY "Users can manage own chunks"
  ON public.chunks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Conversations: users manage their own conversations
CREATE POLICY "Users can manage own conversations"
  ON public.conversations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Messages: users manage their own messages
CREATE POLICY "Users can manage own messages"
  ON public.messages FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ====================================================================
-- 9. REALTIME PUBLICATION SETUP
-- ====================================================================
-- Add messages table to supabase_realtime publication for instant streaming
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;
END $$;

-- ====================================================================
-- 10. STORAGE BUCKET & RLS POLICIES
-- ====================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'omnimind-files',
  'omnimind-files',
  FALSE,
  20971520, -- 20MB in bytes
  ARRAY[
    'application/pdf',
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a', 'audio/ogg',
    'video/mp4', 'video/webm', 'video/quicktime'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = FALSE,
  file_size_limit = 20971520;

-- Storage RLS: Users can access and upload only inside their user_id path
CREATE POLICY "Users can upload own storage files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'omnimind-files' 
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own storage files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'omnimind-files' 
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own storage files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'omnimind-files' 
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );
