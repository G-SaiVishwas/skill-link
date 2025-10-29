-- CLEAN DATABASE INITIALIZATION
-- Run this ONCE to set up a fresh SkillLink database
-- This will DROP all existing tables, views, and functions!

-- ============================================
-- STEP 1: Drop all views first (to avoid dependency errors)
-- ============================================

DROP VIEW IF EXISTS worker_profiles_view CASCADE;
DROP VIEW IF EXISTS employer_profiles_view CASCADE;
DROP VIEW IF EXISTS job_matches_view CASCADE;
DROP VIEW IF EXISTS active_jobs_view CASCADE;

-- ============================================
-- STEP 2: Drop all functions
-- ============================================

DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS match_workers_for_job(uuid) CASCADE;
DROP FUNCTION IF EXISTS calculate_match_score(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS get_worker_skillcard(uuid) CASCADE;

-- ============================================
-- STEP 3: Drop all tables (in reverse dependency order)
-- ============================================

DROP TABLE IF EXISTS admin_audit CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS verifications CASCADE;
DROP TABLE IF EXISTS skill_card_paid_verification CASCADE;
DROP TABLE IF EXISTS employer_subscriptions CASCADE;
DROP TABLE IF EXISTS skill_cards CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS job_requests CASCADE;
DROP TABLE IF EXISTS user_skills CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS employer_profiles CASCADE;
DROP TABLE IF EXISTS worker_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- STEP 4: Drop all custom types
-- ============================================

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS worker_availability_status CASCADE;
DROP TYPE IF EXISTS job_status CASCADE;
DROP TYPE IF EXISTS match_status CASCADE;
DROP TYPE IF EXISTS verification_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS subscription_tier CASCADE;

-- ============================================
-- STEP 5: Create custom types
-- ============================================

CREATE TYPE user_role AS ENUM ('worker', 'employer', 'admin');
CREATE TYPE worker_availability_status AS ENUM ('available', 'busy', 'inactive');
CREATE TYPE job_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');
CREATE TYPE match_status AS ENUM ('pending', 'contacted', 'hired', 'rejected');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'premium', 'enterprise');

-- ============================================
-- STEP 6: Create tables
-- ============================================

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_uid text UNIQUE NOT NULL,
  role user_role,
  phone text NOT NULL DEFAULT '',
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_users_auth_uid ON users (auth_uid);

-- Worker profiles
CREATE TABLE worker_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  photo_url text,
  voice_intro_url text,
  voice_transcript text,
  bio_generated text,
  bio_generated_local text,
  location_city text,
  latitude double precision,
  longitude double precision,
  suggested_rate numeric(10,2),
  availability_status worker_availability_status NOT NULL DEFAULT 'available',
  trustrank numeric(5,2) DEFAULT 0,
  verified boolean DEFAULT false,
  languages text[] DEFAULT ARRAY[]::text[],
  voice_sentiment_score numeric(4,2),
  ai_metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_worker_profiles_user_id ON worker_profiles (user_id);
CREATE INDEX idx_worker_profiles_city ON worker_profiles (location_city);

-- Employer profiles
CREATE TABLE employer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  org_name text,
  contact_name text,
  photo_url text,
  location_city text,
  latitude double precision,
  longitude double precision,
  preferred_languages text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_employer_profiles_user_id ON employer_profiles (user_id);

-- Skills
CREATE TABLE skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_skills_name ON skills (name);

-- User skills (junction table)
CREATE TABLE user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level integer DEFAULT 1,
  years_experience integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

CREATE INDEX idx_user_skills_user ON user_skills (user_id);
CREATE INDEX idx_user_skills_skill ON user_skills (skill_id);

-- Job requests
CREATE TABLE job_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  location_city text,
  latitude double precision,
  longitude double precision,
  budget_min numeric(10,2),
  budget_max numeric(10,2),
  status job_status NOT NULL DEFAULT 'open',
  urgency text,
  start_date date,
  ai_parsed_skills jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_job_requests_employer ON job_requests (employer_id);
CREATE INDEX idx_job_requests_status ON job_requests (status);

-- Matches
CREATE TABLE matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES job_requests(id) ON DELETE CASCADE,
  worker_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  match_score numeric(5,2),
  status match_status NOT NULL DEFAULT 'pending',
  contacted_at timestamptz,
  hired_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_matches_job ON matches (job_id);
CREATE INDEX idx_matches_worker ON matches (worker_id);
CREATE INDEX idx_matches_status ON matches (status);

-- Messages
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_text text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_match ON messages (match_id);
CREATE INDEX idx_messages_sender ON messages (sender_id);

-- Skill cards
CREATE TABLE skill_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_url text NOT NULL,
  qr_code_url text,
  views_count integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_skill_cards_worker ON skill_cards (worker_id);

-- Verifications
CREATE TABLE verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skills(id) ON DELETE SET NULL,
  verifier_id uuid REFERENCES users(id) ON DELETE SET NULL,
  status verification_status NOT NULL DEFAULT 'pending',
  proof_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_verifications_worker ON verifications (worker_id);
CREATE INDEX idx_verifications_status ON verifications (status);

-- Ratings
CREATE TABLE ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  rater_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rated_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score >= 1 AND score <= 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ratings_match ON ratings (match_id);
CREATE INDEX idx_ratings_rated_user ON ratings (rated_user_id);

-- Payments
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  payer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  payment_method text,
  transaction_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_match ON payments (match_id);
CREATE INDEX idx_payments_status ON payments (status);

-- Admin audit log
CREATE TABLE admin_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action text NOT NULL,
  target_table text,
  target_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_audit_admin ON admin_audit (admin_id);
CREATE INDEX idx_admin_audit_action ON admin_audit (action);

-- Skill card paid verifications
CREATE TABLE skill_card_paid_verification (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  verification_provider text NOT NULL,
  verification_date timestamptz NOT NULL DEFAULT now(),
  certificate_url text,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_paid_verifications_worker ON skill_card_paid_verification (worker_id);

-- Employer subscriptions
CREATE TABLE employer_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier subscription_tier NOT NULL DEFAULT 'free',
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  auto_renew boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscriptions_employer ON employer_subscriptions (employer_id);

-- ============================================
-- STEP 7: Create functions
-- ============================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_worker_profiles_updated_at BEFORE UPDATE ON worker_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employer_profiles_updated_at BEFORE UPDATE ON employer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_requests_updated_at BEFORE UPDATE ON job_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 8: Create views
-- ============================================

-- Worker profiles view (with skills)
CREATE OR REPLACE VIEW worker_profiles_view AS
SELECT 
  wp.*,
  u.email,
  u.phone,
  array_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL) as skills
FROM worker_profiles wp
JOIN users u ON u.id = wp.user_id
LEFT JOIN user_skills us ON us.user_id = wp.user_id
LEFT JOIN skills s ON s.id = us.skill_id
GROUP BY wp.id, u.email, u.phone;

-- ============================================
-- DONE!
-- ============================================

-- Verify setup
SELECT 'Database initialized successfully!' as status;
SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'public';
