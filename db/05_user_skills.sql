-- 05_user_skills.sql
-- Mapping table between users and their skills with optional proficiency levels.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'skill_proficiency') THEN
    CREATE TYPE skill_proficiency AS ENUM ('beginner', 'intermediate', 'expert');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS user_skills (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  proficiency skill_proficiency DEFAULT 'beginner',
  experience_years numeric(4,1),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON user_skills (skill_id);
