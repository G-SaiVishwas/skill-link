-- 14_skill_card_paid_verification.sql
-- Tracks premium verification purchases for worker skill cards.

CREATE TABLE IF NOT EXISTS skill_card_paid_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  payment_id uuid REFERENCES payments(id) ON DELETE SET NULL,
  verification_status text NOT NULL DEFAULT 'initiated',
  verifier_notes text,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_skill_card_paid_verifications_worker ON skill_card_paid_verifications (worker_id);
CREATE INDEX IF NOT EXISTS idx_skill_card_paid_verifications_payment ON skill_card_paid_verifications (payment_id);

CREATE OR REPLACE FUNCTION update_skill_card_paid_verifications_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_skill_card_paid_verifications_updated_at ON skill_card_paid_verifications;
CREATE TRIGGER set_skill_card_paid_verifications_updated_at
  BEFORE UPDATE ON skill_card_paid_verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_skill_card_paid_verifications_updated_at();
