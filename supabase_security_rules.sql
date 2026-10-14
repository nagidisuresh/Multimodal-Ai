-- Supabase Row Level Security (RLS) for User Profiles Table
-- Ensures users can only view, create, and edit their own profile

CREATE TABLE IF NOT EXISTS public.profiles (
  uid UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  photo_url TEXT,
  provider TEXT DEFAULT 'email',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_login_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 1. Users can select/read only their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = uid);

-- 2. Users can insert their own profile upon sign-up
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = uid);

-- 3. Users can update only their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = uid)
  WITH CHECK (auth.uid() = uid);
