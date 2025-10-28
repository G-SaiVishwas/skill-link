-- 03_employer_profiles.sql
-- Employer organization profile information.

CREATE TABLE IF NOT EXISTS employer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  org_name text NOT NULL,
  contact_name text,
  photo_url text,
  location_city text,
  latitude double precision,
  longitude double precision,
  preferred_languages text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP INDEX IF EXISTS idx_employer_profiles_user_id;
CREATE UNIQUE INDEX idx_employer_profiles_user_id ON employer_profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_employer_profiles_city ON employer_profiles (location_city);
CREATE INDEX IF NOT EXISTS idx_employer_profiles_latlng ON employer_profiles USING gist (ll_to_earth(coalesce(latitude,0)::double precision, coalesce(longitude,0)::double precision));

CREATE OR REPLACE FUNCTION update_employer_profiles_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_employer_profiles_updated_at ON employer_profiles;
CREATE TRIGGER set_employer_profiles_updated_at
  BEFORE UPDATE ON employer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_employer_profiles_updated_at();
