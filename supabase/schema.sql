-- ==============================================================================
-- VOCATRACK SUPABASE DATABASE SCHEMA (Acuan Kontrak CT-01 s.d. CT-12 & PRD v1.13)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PROFILES (Akun & Profil Siswa / Reviewer)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  school TEXT DEFAULT 'SMK Binaan VocaTrack',
  major TEXT DEFAULT 'Rekayasa Perangkat Lunak',
  avatar_url TEXT,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  role TEXT DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'REVIEWER', 'ADMIN')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk pencarian cepat
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy Profiles: Pengguna bisa melihat semua profil & mengedit profilnya sendiri
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 3. TRIGGER OTOMATIS: Salin Data dari auth.users ke public.profiles saat Register
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    school,
    major,
    avatar_url,
    total_xp,
    level,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Siswa Vokasi'),
    COALESCE(NEW.raw_user_meta_data->>'school', 'SMK Binaan VocaTrack'),
    COALESCE(NEW.raw_user_meta_data->>'major', 'Rekayasa Perangkat Lunak'),
    NEW.raw_user_meta_data->>'avatar_url',
    0,
    1,
    'STUDENT'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    school = COALESCE(EXCLUDED.school, profiles.school),
    major = COALESCE(EXCLUDED.major, profiles.major),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasang trigger ke auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 4. TABEL PROGRES BELAJAR SISWA (CT-07, F-03, F-04, F-08)
CREATE TABLE IF NOT EXISTS public.student_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL, -- Contoh: 'FND-01', 'FE-01', 'MO-01', dll
  is_unlocked BOOLEAN DEFAULT false,
  is_read_completed BOOLEAN DEFAULT false,
  is_video_completed BOOLEAN DEFAULT false,
  practice_answered_count INTEGER DEFAULT 0,
  has_passed_historically BOOLEAN DEFAULT false,
  latest_score INTEGER,
  total_attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, module_id)
);

ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own progress"
  ON public.student_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students can upsert own progress"
  ON public.student_progress FOR ALL
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);


-- 5. TABEL EVALUASI RESMI (CT-05, CT-06, F-07)
-- Catatan: Kunci jawaban dan grading disimpan di server / RPC backend
CREATE TABLE IF NOT EXISTS public.official_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id TEXT UNIQUE NOT NULL,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  deadline_at TIMESTAMPTZ NOT NULL,
  submitted_at TIMESTAMPTZ,
  answers JSONB DEFAULT '[]'::jsonb,
  score INTEGER,
  is_passed BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUBMITTED', 'PROCESSING', 'GRADED')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.official_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view and create own evaluations"
  ON public.official_evaluations FOR ALL
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);


-- 6. TABEL PEMERIKSAAN KEMAMPUAN AWAL / PLACEMENT TEST (CT-04, F-02)
CREATE TABLE IF NOT EXISTS public.placement_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  recommended_start_module_id TEXT NOT NULL,
  eligible_module_ids TEXT[] DEFAULT '{}',
  evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.placement_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own placement results"
  ON public.placement_results FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own placement results"
  ON public.placement_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);


-- 7. TABEL PENGUMPULAN PROYEK SISWA & REVIEWER (CT-09, F-12, F-13)
CREATE TABLE IF NOT EXISTS public.project_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL, -- 'FRONTEND', 'BACKEND', 'MOBILE'
  repo_url TEXT NOT NULL,
  commit_hash TEXT NOT NULL,
  demo_url TEXT,
  status TEXT DEFAULT 'SUBMITTED' CHECK (status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REVISE')),
  rubric_scores JSONB, -- 4 Aspek (Fungsional, Arsitektur, Kualitas Kode, Dokumentasi)
  reviewer_id UUID REFERENCES public.profiles(id),
  reviewer_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view and submit own projects"
  ON public.project_submissions FOR ALL
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Reviewers can review all projects"
  ON public.project_submissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('REVIEWER', 'ADMIN')
    )
  );

