-- 09_skill_cards.sql
-- Publicly shareable worker skill cards and QR metadata.

CREATE TABLE IF NOT EXISTS skill_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  card_url text NOT NULL,
  qr_code_data text,
  price numeric(10,2),
  verified boolean DEFAULT false,
  template_variant text DEFAULT 'default',
  generated_summary text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_skill_cards_worker_id ON skill_cards (worker_id);

CREATE OR REPLACE FUNCTION update_skill_cards_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_skill_cards_updated_at ON skill_cards;
CREATE TRIGGER set_skill_cards_updated_at
  BEFORE UPDATE ON skill_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_skill_cards_updated_at();
