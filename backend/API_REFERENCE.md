# SkillLink Backend - Quick API Reference

## 🔐 Authentication Flow

### 1. Send OTP
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919100000001"}'
```

**Response (Development):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "debug": {
    "otp": "123456",
    "expiresAt": "2025-10-29T12:10:00Z"
  }
}
```

### 2. Verify OTP & Get Token
```bash
curl -X POST http://localhost:3001/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919100000001", "otp": "123456"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "auth_uid": "auth-worker-001",
    "role": "worker",
    "phone": "+919100000001"
  }
}
```

**Save this token for authenticated requests!**

---

## 👷 Worker Onboarding

```bash
curl -X POST http://localhost:3001/api/onboard/worker \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "display_name": "Ramesh Kumar",
    "intro_text": "I am a professional cook with 5 years experience in vegetarian cuisine. I specialize in South Indian dishes and hotel kitchens.",
    "location": {
      "city": "Bengaluru",
      "lat": 12.9716,
      "lng": 77.5946
    },
    "rate_per_hour": 180,
    "languages": ["English", "Hindi", "Kannada"]
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Worker profile created successfully",
  "worker_profile": {
    "id": "worker-uuid",
    "display_name": "Ramesh Kumar",
    "bio_generated": "Experienced professional cook...",
    "bio_generated_local": "अनुभवी पेशेवर रसोइया...",
    "suggested_rate": 180,
    "trustrank": 4.2,
    "availability_status": "available"
  },
  "skills": [
    {"slug": "cook", "name": "Cook", "proficiency": "intermediate"},
    {"slug": "vegetarian", "name": "Vegetarian", "proficiency": "intermediate"}
  ],
  "skill_card": {
    "card_url": "http://localhost:3000/worker/worker-uuid",
    "qr_code_data": "data:image/png;base64,..."
  }
}
```

---

## 🏢 Employer Onboarding

```bash
curl -X POST http://localhost:3001/api/onboard/employer \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "org_name": "Green Leaf Restaurant",
    "contact_name": "Priya Sharma",
    "location": {
      "city": "Bengaluru",
      "lat": 12.9716,
      "lng": 77.5946
    },
    "preferred_languages": ["English", "Hindi", "Kannada"]
  }'
```

---

## 💼 Create Job & Get Matched Workers

```bash
curl -X POST http://localhost:3001/api/job/create \
  -H "Authorization: Bearer EMPLOYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "raw_text": "Need an experienced vegetarian cook for my restaurant. Must know South Indian dishes. Urgent requirement for morning shift.",
    "location": {
      "city": "Bengaluru",
      "lat": 12.9716,
      "lng": 77.5946
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Job request created successfully",
  "job": {
    "id": "job-uuid",
    "role_text": "Vegetarian Cook",
    "ai_skills": ["cook", "vegetarian", "south-indian"],
    "urgency": "urgent",
    "status": "open",
    "location_city": "Bengaluru"
  },
  "suggested_workers": [
    {
      "worker_id": "worker-uuid",
      "match_id": "match-uuid",
      "score": 94,
      "name": "Ramesh Kumar",
      "photo_url": "https://...",
      "bio": "Experienced professional cook...",
      "skills": ["Cook", "Vegetarian", "South Indian"],
      "rate_per_hour": 180,
      "distance_km": 2.3,
      "trustrank": 4.5
    },
    {
      "worker_id": "worker-uuid-2",
      "match_id": "match-uuid-2",
      "score": 87,
      "name": "Suresh Patel",
      "skills": ["Cook", "Vegetarian"],
      "distance_km": 5.1,
      "trustrank": 4.2
    }
  ]
}
```

---

## 🔍 Search Workers

```bash
# Search by skills, location, and rate
curl -X GET "http://localhost:3001/api/workers/search?skills=cook,vegetarian&city=Bengaluru&rate_max=200" \
  -H "Authorization: Bearer EMPLOYER_TOKEN"

# Search with geo-radius
curl -X GET "http://localhost:3001/api/workers/search?lat=12.9716&lng=77.5946&radius_km=10&rate_min=100&rate_max=250" \
  -H "Authorization: Bearer EMPLOYER_TOKEN"
```

---

## 💘 Contact Worker (Create Match)

```bash
curl -X POST http://localhost:3001/api/match/MATCH_ID/contact \
  -H "Authorization: Bearer EMPLOYER_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Match created successfully",
  "data": {
    "id": "match-uuid",
    "status": "contacted",
    "contacted_at": "2025-10-29T12:30:00Z"
  }
}
```

---

## 💬 Send Message

```bash
curl -X POST http://localhost:3001/api/message \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "match_id": "match-uuid",
    "message_text": "Hi! Can you start tomorrow at 8 AM?"
  }'
```

---

## 📸 Upload Photo

```bash
curl -X POST http://localhost:3001/api/upload/photo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/photo.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "url": "https://xxxxx.supabase.co/storage/v1/object/public/worker-photos/user-id/timestamp.jpg"
}
```

---

## 🎤 Upload Voice (with Transcription)

```bash
curl -X POST "http://localhost:3001/api/upload/voice?transcribe=true" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/voice.mp3"
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "url": "https://xxxxx.supabase.co/storage/v1/object/public/worker-voices/user-id/timestamp.mp3",
  "transcript": "Hi, I am Ramesh and I am a professional cook..."
}
```

---

## 🪪 Get Public SkillCard (No Auth)

```bash
curl -X GET http://localhost:3001/api/worker/WORKER_ID/skillcard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "worker": {
      "id": "worker-uuid",
      "display_name": "Ramesh Kumar",
      "bio_generated": "...",
      "photo_url": "...",
      "trustrank": 4.5,
      "verified": true
    },
    "skills": [
      {"slug": "cook", "name": "Cook", "proficiency": "expert"}
    ],
    "skill_card": {
      "card_url": "http://localhost:3000/worker/worker-uuid",
      "qr_code_data": "data:image/png;base64,..."
    }
  }
}
```

---

## 📋 Get My Profile

### Worker
```bash
curl -X GET http://localhost:3001/api/worker/me \
  -H "Authorization: Bearer WORKER_TOKEN"
```

### Employer
```bash
curl -X GET http://localhost:3001/api/employer/me \
  -H "Authorization: Bearer EMPLOYER_TOKEN"
```

---

## 🔄 Update Profile

### Update Worker
```bash
curl -X PATCH http://localhost:3001/api/worker/WORKER_ID \
  -H "Authorization: Bearer WORKER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "availability_status": "busy",
    "suggested_rate": 200
  }'
```

### Update Employer
```bash
curl -X PATCH http://localhost:3001/api/employer/EMPLOYER_ID \
  -H "Authorization: Bearer EMPLOYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "org_name": "Green Leaf Restaurant & Catering"
  }'
```

---

## 🎯 Complete User Flow Example

```bash
# 1. Worker signs up
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210"}'

# 2. Verify OTP (use OTP from dev response)
curl -X POST http://localhost:3001/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210", "otp": "123456"}'

# Save token from response: export TOKEN="eyJ..."

# 3. Onboard as worker
curl -X POST http://localhost:3001/api/onboard/worker \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "display_name": "Amit Singh",
    "intro_text": "Electrician with 8 years experience",
    "location": {"city": "Delhi"},
    "rate_per_hour": 250
  }'

# 4. Employer creates job
# (Use different token for employer)
curl -X POST http://localhost:3001/api/job/create \
  -H "Authorization: Bearer $EMPLOYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "raw_text": "Need electrician for house wiring work",
    "location": {"city": "Delhi"}
  }'

# 5. Employer contacts matched worker
curl -X POST http://localhost:3001/api/match/MATCH_ID/contact \
  -H "Authorization: Bearer $EMPLOYER_TOKEN"

# 6. Chat initiated
curl -X POST http://localhost:3001/api/message \
  -H "Authorization: Bearer $EMPLOYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "match_id": "MATCH_ID",
    "message_text": "Can you visit tomorrow?"
  }'
```

---

## 🧪 Testing with Seed Data

The database has pre-seeded users you can test with:

**Workers:**
- `+919100000001` - Cook (vegetarian, gobi specialist)
- `+919100000002` - Cook (hotel work)
- `+919100000003` - Carpenter
- `+919100000004` - Tailor & Beautician
- `+919100000005` - Electrician & Plumber

**Employers:**
- `+919200000001` - Hotel Gobi Palace (Hyderabad)
- `+919200000002` - CraftBuild Co (Bengaluru)
- `+919200000003` - Saree Boutique (Mumbai)

**Dev OTP:** Any 6-digit number works in development mode!

---

## 🚨 Common Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized access"
}
```
**Fix:** Include `Authorization: Bearer <token>` header

### 400 Validation Error
```json
{
  "success": false,
  "error": "Validation error",
  "details": "..."
}
```
**Fix:** Check request body matches expected schema

### 404 Not Found
```json
{
  "success": false,
  "error": "Worker profile not found"
}
```
**Fix:** Ensure resource exists and ID is correct

---

## 📊 Health Check

```bash
curl http://localhost:3001/health
```

**Response:**
```json
{
  "status": "healthy",
  "uptime": 12345.67
}
```

---

**💡 Tip:** Use [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) for easier API testing with collections!
