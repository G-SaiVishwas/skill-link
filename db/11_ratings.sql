-- 11_ratings.sql
-- Ratings shared post-job completion for feedback loops.

CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  rater_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ratee_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ratings_unique ON ratings (match_id, rater_id);
CREATE INDEX IF NOT EXISTS idx_ratings_ratee ON ratings (ratee_id);
