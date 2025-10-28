-- 15_employer_subscriptions.sql
-- Employer subscription records for monetisation hooks.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
    CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'past_due', 'cancelled');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS employer_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
  payment_id uuid REFERENCES payments(id) ON DELETE SET NULL,
  plan_code text NOT NULL,
  seats integer DEFAULT 1,
  status subscription_status NOT NULL DEFAULT 'trial',
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_employer_subscriptions_employer ON employer_subscriptions (employer_id);
CREATE INDEX IF NOT EXISTS idx_employer_subscriptions_status ON employer_subscriptions (status);

CREATE OR REPLACE FUNCTION update_employer_subscriptions_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_employer_subscriptions_updated_at ON employer_subscriptions;
CREATE TRIGGER set_employer_subscriptions_updated_at
  BEFORE UPDATE ON employer_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_employer_subscriptions_updated_at();
