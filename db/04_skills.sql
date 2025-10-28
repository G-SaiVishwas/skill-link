-- 04_skills.sql
-- Canonical list of skills available for tagging workers and jobs.

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  synonyms jsonb DEFAULT '[]'::jsonb,
  category text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_skills_slug ON skills (slug);
CREATE INDEX IF NOT EXISTS idx_skills_name_gin ON skills USING gin (to_tsvector('simple', name));
CREATE INDEX IF NOT EXISTS idx_skills_synonyms_gin ON skills USING gin (synonyms jsonb_path_ops);

CREATE OR REPLACE FUNCTION update_skills_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_skills_updated_at ON skills;
CREATE TRIGGER set_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW
  EXECUTE FUNCTION update_skills_updated_at();
