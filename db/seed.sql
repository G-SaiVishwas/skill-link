-- seed.sql
-- Demo seed data for SkillLink hackathon MVP. Re-runnable thanks to ON CONFLICT guards.

INSERT INTO users (auth_uid, role, phone, email)
VALUES
  ('auth-worker-001', 'worker', '+919100000001', 'worker1@example.com'),
  ('auth-worker-002', 'worker', '+919100000002', 'worker2@example.com'),
  ('auth-worker-003', 'worker', '+919100000003', 'worker3@example.com'),
  ('auth-worker-004', 'worker', '+919100000004', 'worker4@example.com'),
  ('auth-worker-005', 'worker', '+919100000005', 'worker5@example.com'),
  ('auth-employer-001', 'employer', '+919200000001', 'employer1@example.com'),
  ('auth-employer-002', 'employer', '+919200000002', 'employer2@example.com'),
  ('auth-employer-003', 'employer', '+919200000003', 'employer3@example.com')
ON CONFLICT (auth_uid) DO NOTHING;

INSERT INTO worker_profiles (user_id, display_name, photo_url, voice_intro_url, bio_generated, location_city, latitude, longitude, suggested_rate, availability_status, trustrank, verified, languages, voice_sentiment_score)
SELECT id, initcap(split_part(auth_uid, '-', 2)),
       'https://storage.skilllink.demo/workers/' || auth_uid || '.jpg',
       'https://storage.skilllink.demo/voices/' || auth_uid || '.mp3',
       'Experienced professional ready for gigs around the city.',
       CASE WHEN auth_uid IN ('auth-worker-001','auth-worker-002') THEN 'Hyderabad'
            WHEN auth_uid IN ('auth-worker-003','auth-worker-004') THEN 'Bengaluru'
            ELSE 'Mumbai' END,
       17.3850 + (random() / 10),
       78.4867 + (random() / 10),
       1200 + (random() * 300),
       'available',
       4.2,
       auth_uid IN ('auth-worker-001','auth-worker-003'),
       ARRAY['English','Hindi'],
       0.78
FROM users
WHERE auth_uid LIKE 'auth-worker-%'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO employer_profiles (user_id, org_name, contact_name, photo_url, location_city, latitude, longitude, preferred_languages)
VALUES
  ((SELECT id FROM users WHERE auth_uid = 'auth-employer-001'), 'Hotel Gobi Palace', 'Ravi Kumar', 'https://storage.skilllink.demo/employers/hotel-gobi.png', 'Hyderabad', 17.3850, 78.4867, ARRAY['Hindi','Telugu']),
  ((SELECT id FROM users WHERE auth_uid = 'auth-employer-002'), 'CraftBuild Co', 'Meena Shah', 'https://storage.skilllink.demo/employers/craftbuild.png', 'Bengaluru', 12.9716, 77.5946, ARRAY['English','Kannada']),
  ((SELECT id FROM users WHERE auth_uid = 'auth-employer-003'), 'Saree Boutique', 'Lakshmi Nair', 'https://storage.skilllink.demo/employers/saree-boutique.png', 'Mumbai', 19.0760, 72.8777, ARRAY['English','Hindi'])
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO skills (slug, name, synonyms, category)
VALUES
  ('cook', 'Cook', '["chef","kitchen"]', 'hospitality'),
  ('vegetarian', 'Vegetarian Specialist', '["veg cook","pure veg"]', 'hospitality'),
  ('gobi', 'Gobi Specialist', '["cauliflower","manchurian"]', 'hospitality'),
  ('hotel', 'Hotel Work', '["banquet","hospitality support"]', 'hospitality'),
  ('carpenter', 'Carpenter', '["woodwork","repairs"]', 'craft'),
  ('tailor', 'Tailor', '["stitching","alterations"]', 'fashion'),
  ('electrician', 'Electrician', '["wiring","repairs"]', 'maintenance'),
  ('plumber', 'Plumber', '["pipes","leak repair"]', 'maintenance'),
  ('beautician', 'Beautician', '["makeup","salon"]', 'beauty')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  synonyms = EXCLUDED.synonyms,
  category = EXCLUDED.category;

INSERT INTO user_skills (user_id, skill_id, proficiency, experience_years)
SELECT u.id, s.id,
       CASE s.slug WHEN 'cook' THEN 'expert' ELSE 'intermediate' END,
       3.0
FROM users u
JOIN skills s ON s.slug IN ('cook','vegetarian','gobi','hotel')
WHERE u.auth_uid = 'auth-worker-001'
ON CONFLICT (request_id, worker_id) DO NOTHING;

INSERT INTO user_skills (user_id, skill_id, proficiency, experience_years)
SELECT u.id, s.id, 'intermediate', 2.5
FROM users u
JOIN skills s ON s.slug IN ('cook','hotel')
WHERE u.auth_uid = 'auth-worker-002'
ON CONFLICT DO NOTHING;

INSERT INTO user_skills (user_id, skill_id, proficiency, experience_years)
SELECT u.id, s.id, 'expert', 5.0
FROM users u
JOIN skills s ON s.slug IN ('carpenter')
WHERE u.auth_uid = 'auth-worker-003'
ON CONFLICT DO NOTHING;

INSERT INTO user_skills (user_id, skill_id, proficiency, experience_years)
SELECT u.id, s.id, 'intermediate', 4.0
FROM users u
JOIN skills s ON s.slug IN ('tailor','beautician')
WHERE u.auth_uid = 'auth-worker-004'
ON CONFLICT DO NOTHING;

INSERT INTO user_skills (user_id, skill_id, proficiency, experience_years)
SELECT u.id, s.id, 'beginner', 1.5
FROM users u
JOIN skills s ON s.slug IN ('electrician','plumber')
WHERE u.auth_uid = 'auth-worker-005'
ON CONFLICT DO NOTHING;

INSERT INTO job_requests (employer_id, raw_text, ai_transcript, ai_skills, role_text, urgency, preferred_experience, location_city, latitude, longitude, availability_window, status, ai_meta)
SELECT
  ep.id,
  seed.raw_text,
  seed.ai_transcript,
  seed.ai_skills,
  seed.role_text,
  seed.urgency,
  seed.preferred_experience,
  seed.location_city,
  seed.latitude,
  seed.longitude,
  seed.availability_window,
  seed.status,
  seed.ai_meta
FROM (
  VALUES
    (
      'auth-employer-001',
      'Need a cook who cooks gobi for my hotel',
      'Need a cook who cooks gobi for my hotel',
      '["cook","vegetarian","gobi","hotel"]',
      'Hotel Cook',
      'urgent',
      '2+ years in hotel kitchens',
      'Hyderabad',
      17.3850,
      78.4867,
      'Morning shift',
      'open',
      '{"confidence":0.92,"source":"ai_voice_parse"}'
    ),
    (
      'auth-employer-002',
      'Looking for part-time carpenter for furniture assembly',
      NULL,
      '["carpenter","furniture","assembly"]',
      'Furniture Carpenter',
      'medium',
      '3 years carpentry',
      'Bengaluru',
      12.9716,
      77.5946,
      'Weekend work',
      'open',
      '{"confidence":0.81}'
    ),
    (
      'auth-employer-003',
      'Beautician needed for bridal makeup',
      NULL,
      '["beautician","bridal","makeup"]',
      'Bridal Beautician',
      'high',
      '5 years salon experience',
      'Mumbai',
      19.0760,
      72.8777,
      'Full day',
      'open',
      '{"confidence":0.85}'
    )
) AS seed(auth_uid, raw_text, ai_transcript, ai_skills, role_text, urgency, preferred_experience, location_city, latitude, longitude, availability_window, status, ai_meta)
JOIN users u ON u.auth_uid = seed.auth_uid
JOIN employer_profiles ep ON ep.user_id = u.id
WHERE NOT EXISTS (
  SELECT 1 FROM job_requests jr WHERE jr.employer_id = ep.id AND jr.raw_text = seed.raw_text
);

INSERT INTO matches (request_id, worker_id, score, status, matched_at)
VALUES
  (
    (SELECT id FROM job_requests WHERE raw_text = 'Need a cook who cooks gobi for my hotel'),
    (SELECT id FROM worker_profiles WHERE user_id = (SELECT id FROM users WHERE auth_uid = 'auth-worker-001')),
    0.94,
    'suggested',
    now()
  ),
  (
    (SELECT id FROM job_requests WHERE raw_text = 'Need a cook who cooks gobi for my hotel'),
    (SELECT id FROM worker_profiles WHERE user_id = (SELECT id FROM users WHERE auth_uid = 'auth-worker-002')),
    0.81,
    'suggested',
    now()
  ),
  (
    (SELECT id FROM job_requests WHERE raw_text = 'Looking for part-time carpenter for furniture assembly'),
    (SELECT id FROM worker_profiles WHERE user_id = (SELECT id FROM users WHERE auth_uid = 'auth-worker-003')),
    0.9,
    'shortlisted',
    now()
  )
ON CONFLICT DO NOTHING;

INSERT INTO messages (match_id, sender_user_id, message_text, direction)
VALUES
  (
    (SELECT id FROM matches WHERE score = 0.94),
    (SELECT id FROM users WHERE auth_uid = 'auth-employer-001'),
    'Hi, can you come for a tasting tomorrow?',
    'employer_to_worker'
  ),
  (
    (SELECT id FROM matches WHERE score = 0.94),
    (SELECT id FROM users WHERE auth_uid = 'auth-worker-001'),
    'Sure, morning works for me!',
    'worker_to_employer'
  )
ON CONFLICT DO NOTHING;

INSERT INTO skill_cards (worker_id, card_url, qr_code_data, price, verified, template_variant, generated_summary)
VALUES
  (
    (SELECT id FROM worker_profiles WHERE user_id = (SELECT id FROM users WHERE auth_uid = 'auth-worker-001')),
    'https://skill.link/cards/auth-worker-001',
    'QRDATA:auth-worker-001',
    1500,
    true,
    'v1',
    'Hotel cook specialising in vegetarian gobi dishes, punctual and trusted by local hotels.'
  )
ON CONFLICT (worker_id) DO UPDATE SET
  card_url = EXCLUDED.card_url,
  qr_code_data = EXCLUDED.qr_code_data,
  price = EXCLUDED.price,
  verified = EXCLUDED.verified;

INSERT INTO verifications (worker_id, verifier_user_id, method, notes)
VALUES
  (
    (SELECT id FROM worker_profiles WHERE user_id = (SELECT id FROM users WHERE auth_uid = 'auth-worker-001')),
    (SELECT id FROM users WHERE auth_uid = 'auth-employer-001'),
    'employer',
    'Verified after successful banquet service.'
  )
ON CONFLICT DO NOTHING;

INSERT INTO ratings (match_id, rater_id, ratee_id, rating, review_text)
VALUES
  (
    (SELECT id FROM matches WHERE score = 0.94),
    (SELECT id FROM users WHERE auth_uid = 'auth-employer-001'),
    (SELECT id FROM users WHERE auth_uid = 'auth-worker-001'),
    5,
    'Excellent gobi prep, guests loved it.'
  )
ON CONFLICT DO NOTHING;

INSERT INTO payments (user_id, amount, currency, provider, reference_code, status, feature_tag)
VALUES
  (
    (SELECT id FROM users WHERE auth_uid = 'auth-worker-001'),
    499,
    'INR',
    'razorpay',
    'PAY-001',
    'completed',
    'skill_card_paid_verification'
  )
ON CONFLICT DO NOTHING;

INSERT INTO skill_card_paid_verifications (worker_id, payment_id, verification_status, verifier_notes, expires_at)
VALUES
  (
    (SELECT id FROM worker_profiles WHERE user_id = (SELECT id FROM users WHERE auth_uid = 'auth-worker-001')),
    (SELECT id FROM payments WHERE reference_code = 'PAY-001'),
    'approved',
    'Verified by SkillLink agent during onboarding drive.',
    now() + interval '180 days'
  )
ON CONFLICT DO NOTHING;

INSERT INTO employer_subscriptions (employer_id, payment_id, plan_code, seats, status, current_period_end, metadata)
VALUES
  (
    (SELECT id FROM employer_profiles WHERE user_id = (SELECT id FROM users WHERE auth_uid = 'auth-employer-001')),
    (SELECT id FROM payments WHERE reference_code = 'PAY-001'),
    'starter',
    3,
    'active',
    now() + interval '30 days',
    '{"notes":"demo shared plan"}'
  )
ON CONFLICT DO NOTHING;

INSERT INTO admin_audit_logs (actor_user_id, subject_user_id, action, details)
VALUES
  (
    (SELECT id FROM users WHERE auth_uid = 'auth-employer-001'),
    (SELECT id FROM users WHERE auth_uid = 'auth-worker-001'),
    'match_feedback_added',
    '{"rating":5,"comment":"Excellent gobi prep"}'
  )
ON CONFLICT DO NOTHING;
