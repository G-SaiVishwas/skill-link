-- 08_messages.sql
-- Chat messages exchanged between matched workers and employers.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_direction') THEN
    CREATE TYPE message_direction AS ENUM ('worker_to_employer', 'employer_to_worker', 'system');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sender_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_text text,
  message_voice_url text,
  direction message_direction NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages (match_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages (sender_user_id);
