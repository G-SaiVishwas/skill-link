-- 16_functions.sql
-- Helper functions to support API RPC calls.

CREATE OR REPLACE FUNCTION link_user_to_skill_by_slug(
  p_auth_uid text,
  p_skill_slug text
) RETURNS void AS $$
DECLARE
  v_user_id uuid;
  v_skill_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM users WHERE auth_uid = p_auth_uid;
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found for auth_uid %', p_auth_uid;
  END IF;

  SELECT id INTO v_skill_id FROM skills WHERE slug = p_skill_slug;
  IF v_skill_id IS NULL THEN
    INSERT INTO skills (slug, name)
    VALUES (p_skill_slug, initcap(replace(p_skill_slug, '-', ' ')))
    ON CONFLICT (slug) DO NOTHING
    RETURNING id INTO v_skill_id;
  END IF;

  INSERT INTO user_skills (user_id, skill_id, proficiency)
  VALUES (v_user_id, v_skill_id, 'intermediate')
  ON CONFLICT (user_id, skill_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION find_worker_matches(
  p_job_request_id uuid
) RETURNS TABLE (
  match_id uuid,
  worker_profile_id uuid,
  score numeric,
  worker_display_name text,
  worker_city text,
  worker_languages text[],
  worker_trustrank numeric,
  worker_photo_url text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    w.id,
    m.score,
    w.display_name,
    w.location_city,
    w.languages,
    w.trustrank,
    w.photo_url
  FROM matches m
  JOIN worker_profiles w ON w.id = m.worker_id
  WHERE m.request_id = p_job_request_id
  ORDER BY m.score DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;
