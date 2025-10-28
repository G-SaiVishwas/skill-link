-- 13_admin_audit.sql
-- Administrative logs for onboarding agents and system events.

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  subject_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  channel text DEFAULT 'web',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_actor ON admin_audit_logs (actor_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_subject ON admin_audit_logs (subject_user_id);
