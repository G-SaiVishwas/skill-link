-- 00_schema.sql
-- Master schema runner for SkillLink. Execute with psql: \i db/00_schema.sql
-- Assumes working directory is repo root. Enables required extensions and sources child files.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;

\i db/01_users.sql
\i db/02_worker_profiles.sql
\i db/03_employer_profiles.sql
\i db/04_skills.sql
\i db/05_user_skills.sql
\i db/06_job_requests.sql
\i db/07_matches.sql
\i db/08_messages.sql
\i db/09_skill_cards.sql
\i db/10_verifications.sql
\i db/11_ratings.sql
\i db/12_payments.sql
\i db/13_admin_audit.sql
\i db/14_skill_card_paid_verification.sql
\i db/15_employer_subscriptions.sql
\i db/16_functions.sql
\i db/17_views.sql
\i db/seed.sql
