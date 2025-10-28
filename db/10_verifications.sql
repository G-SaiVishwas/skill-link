-- 10_verifications.sql
-- Verification actions to build trust metrics for workers.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_method') THEN
    CREATE TYPE verification_method AS ENUM ('peer', 'employer', 'agent');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  verifier_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  method verification_method NOT NULL,
  notes text,
  evidence_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_verifications_worker_id ON verifications (worker_id);
