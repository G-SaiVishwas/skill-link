-- 06_job_requests.sql
-- Employer-submitted job requests enriched with AI metadata.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_request_status') THEN
    CREATE TYPE job_request_status AS ENUM ('open', 'closed', 'cancelled');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS job_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
  raw_text text,
  raw_voice_url text,
  ai_transcript text,
  ai_skills jsonb DEFAULT '[]'::jsonb,
  role_text text,
  urgency text,
  preferred_experience text,
  location_city text,
  latitude double precision,
  longitude double precision,
  availability_window text,
  status job_request_status NOT NULL DEFAULT 'open',
  ai_meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_job_requests_employer ON job_requests (employer_id);
CREATE INDEX IF NOT EXISTS idx_job_requests_status ON job_requests (status);
CREATE INDEX IF NOT EXISTS idx_job_requests_city ON job_requests (location_city);
CREATE INDEX IF NOT EXISTS idx_job_requests_ai_skills_gin ON job_requests USING gin (ai_skills jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_job_requests_latlng ON job_requests USING gist (ll_to_earth(coalesce(latitude,0)::double precision, coalesce(longitude,0)::double precision));

CREATE OR REPLACE FUNCTION update_job_requests_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_job_requests_updated_at ON job_requests;
CREATE TRIGGER set_job_requests_updated_at
  BEFORE UPDATE ON job_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_job_requests_updated_at();
