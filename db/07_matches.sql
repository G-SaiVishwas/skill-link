-- 07_matches.sql
-- Match engine output linking workers to job requests with scoring.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'match_status') THEN
    CREATE TYPE match_status AS ENUM ('suggested', 'shortlisted', 'contacted', 'hired', 'rejected');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES job_requests(id) ON DELETE CASCADE,
  worker_id uuid NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  score numeric(5,2) NOT NULL DEFAULT 0,
  status match_status NOT NULL DEFAULT 'suggested',
  matched_at timestamptz NOT NULL DEFAULT now(),
  contacted_at timestamptz,
  hired_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_matches_unique ON matches (request_id, worker_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches (status);
CREATE INDEX IF NOT EXISTS idx_matches_score ON matches (score DESC);
