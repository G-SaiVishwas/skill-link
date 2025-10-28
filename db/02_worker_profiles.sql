-- 02_worker_profiles.sql
-- Worker profile metadata and AI-derived attributes.

CREATE TABLE IF NOT EXISTS worker_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  photo_url text,
  voice_intro_url text,
  bio_generated text,
  location_city text,
  latitude double precision,
  longitude double precision,
  suggested_rate numeric(10,2),
  availability_status text DEFAULT 'available',
  trustrank numeric(5,2) DEFAULT 0,
  verified boolean DEFAULT false,
  languages text[] DEFAULT ARRAY[]::text[],
  voice_sentiment_score numeric(4,2),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

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
