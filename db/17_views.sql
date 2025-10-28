-- 17_views.sql
-- Convenience views for API consumption.

CREATE OR REPLACE VIEW worker_profiles_view AS
SELECT
  wp.id,
  wp.user_id,
  u.auth_uid,
  wp.display_name,
  wp.photo_url,
  wp.voice_intro_url,
  wp.voice_transcript,
  wp.bio_generated,
  wp.bio_generated_local,
  wp.location_city,
  wp.latitude,
  wp.longitude,
  wp.suggested_rate,
  wp.availability_status,
  wp.trustrank,
  wp.languages,
  wp.verified,
  wp.ai_metadata,
  wp.created_at,
  wp.updated_at,
  COALESCE(sc.card_url, '') AS card_url,
  COALESCE(sc.qr_code_data, '') AS qr_code_data,
  COALESCE(sc.generated_summary, wp.bio_generated) AS card_summary,
  ARRAY_REMOVE(ARRAY_AGG(s.name) FILTER (WHERE s.id IS NOT NULL), NULL) AS skills
FROM worker_profiles wp
JOIN users u ON u.id = wp.user_id
LEFT JOIN user_skills us ON us.user_id = wp.user_id
LEFT JOIN skills s ON s.id = us.skill_id
LEFT JOIN skill_cards sc ON sc.worker_id = wp.id
GROUP BY
  wp.id,
  wp.user_id,
  u.auth_uid,
  wp.availability_status,
  wp.voice_transcript,
  wp.bio_generated_local,
  wp.ai_metadata,
  sc.card_url,
  sc.qr_code_data,
  sc.generated_summary;

CREATE OR REPLACE VIEW matches_view AS
SELECT
  m.id,
  m.request_id,
  m.worker_id,
  m.score,
  m.status,
  m.matched_at,
  m.contacted_at,
  m.hired_at,
  wp.display_name,
  wp.location_city,
  wp.trustrank,
  wp.photo_url
FROM matches m
JOIN worker_profiles wp ON wp.id = m.worker_id;
