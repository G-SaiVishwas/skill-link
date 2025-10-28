-- 02_worker_profiles.sql
-- Worker profile metadata and AI-derived attributes.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'worker_availability_status') THEN
    CREATE TYPE worker_availability_status AS ENUM ('available', 'busy', 'hidden');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS worker_profiles (
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

ALTER TABLE worker_profiles
  ALTER COLUMN availability_status TYPE worker_availability_status
  USING availability_status::worker_availability_status;

ALTER TABLE worker_profiles
  ALTER COLUMN availability_status SET DEFAULT 'available';

ALTER TABLE worker_profiles
  ADD COLUMN IF NOT EXISTS voice_transcript text;

ALTER TABLE worker_profiles
  ADD COLUMN IF NOT EXISTS bio_generated_local text;

ALTER TABLE worker_profiles
  ADD COLUMN IF NOT EXISTS ai_metadata jsonb DEFAULT '{}'::jsonb;

CREATE UNIQUE INDEX IF NOT EXISTS idx_worker_profiles_user_id ON worker_profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_worker_profiles_city ON worker_profiles (location_city);
CREATE INDEX IF NOT EXISTS idx_worker_profiles_latlng ON worker_profiles USING gist (ll_to_earth(coalesce(latitude,0)::double precision, coalesce(longitude,0)::double precision));

COMMENT ON INDEX idx_worker_profiles_latlng IS 'Requires earthdistance extension; falls back to bounding box queries if unavailable.';

CREATE OR REPLACE FUNCTION update_worker_profiles_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_worker_profiles_updated_at ON worker_profiles;
CREATE TRIGGER set_worker_profiles_updated_at
  BEFORE UPDATE ON worker_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_worker_profiles_updated_at();
