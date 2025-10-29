# 🧪 Backend Testing Guide - Quick Start

## Server Status: ✅ RUNNING

**URL:** `http://localhost:3001`

## 1️⃣ Test Health Check

```bash
curl http://localhost:3001/health
```

Expected:
```json
{
  "status": "healthy",
  "uptime": 123.45
}
```

## 2️⃣ Test Root Endpoint

```bash
curl http://localhost:3001/
```

Expected:
```json
{
  "service": "SkillLink API",
  "status": "running",
  "version": "1.0.0",
  "timestamp": "2025-10-29T01:47:18.000Z"
}
```

## 3️⃣ Google OAuth Flow

### Frontend Flow:
1. User clicks "Sign in with Google" in your frontend
2. Supabase Auth UI handles Google OAuth
3. Frontend receives Supabase session token
4. Frontend sends token to backend

### Backend Test:
```bash
# After getting token from frontend:
curl -X POST http://localhost:3001/api/auth/session \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN_HERE"
```

Expected:
```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "auth_uid": "supabase-auth-uid",
    "email": "user@gmail.com",
    "phone": "",
    "role": null,
    "created_at": "2025-10-29T..."
  },
  "message": "Please complete onboarding",
  "needsOnboarding": true
}
```

## 4️⃣ Worker Onboarding (After Auth)

```bash
curl -X POST http://localhost:3001/api/onboard/worker \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "display_name": "Rajesh Kumar",
    "intro_text": "I have 5 years experience in electrical work, house wiring, panel installation",
    "location": {
      "city": "Hyderabad"
    },
    "rate_per_hour": 300,
    "languages": ["English", "Hindi", "Telugu"]
  }'
```

This will:
- ✅ Extract skills using AI
- ✅ Generate English and Hindi bios
- ✅ Calculate TrustRank
- ✅ Create skill card with QR code
- ✅ Link skills to worker profile

## 5️⃣ Employer Onboarding (After Auth)

```bash
curl -X POST http://localhost:3001/api/onboard/employer \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contact_name": "Priya Sharma",
    "org_name": "ABC Construction",
    "location": {
      "city": "Hyderabad"
    },
    "preferred_languages": ["English", "Hindi"]
  }'
```

## 6️⃣ Create Job Request

```bash
curl -X POST http://localhost:3001/api/job/create \
  -H "Authorization: Bearer EMPLOYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "raw_text": "Need experienced electrician for commercial building. Should know 3-phase wiring, panel work. Urgent requirement for next week.",
    "location": {
      "city": "Hyderabad",
      "lat": 17.385,
      "lng": 78.4867
    }
  }'
```

This will:
- ✅ Parse job description with AI
- ✅ Extract required skills
- ✅ Find matching workers
- ✅ Create match records
- ✅ Return top 10 suggested workers

## 7️⃣ Upload Photo

```bash
curl -X POST http://localhost:3001/api/upload/photo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/photo.jpg"
```

Returns:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "url": "https://supabase.co/storage/v1/object/public/worker-photos/user-id/12345.jpg"
}
```

## 8️⃣ Upload Voice (with transcription)

```bash
curl -X POST "http://localhost:3001/api/upload/voice?transcribe=true" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/audio.mp3"
```

Returns:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "url": "https://..../worker-voices/user-id/12345.mp3",
  "transcript": "मैं एक इलेक्ट्रीशियन हूं..."
}
```

## 9️⃣ Search Workers

```bash
curl "http://localhost:3001/api/workers/search?skills=electrician,wiring&city=Hyderabad&rate_max=500" \
  -H "Authorization: Bearer EMPLOYER_TOKEN"
```

## 🔟 Send Message

```bash
curl -X POST http://localhost:3001/api/message \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "match_id": "match-uuid-here",
    "message_text": "Hello, are you available for work tomorrow?"
  }'
```

## 🎯 Common Issues & Solutions

### Issue: "Authorization header required"
**Solution:** Make sure you include the token:
```bash
-H "Authorization: Bearer YOUR_SUPABASE_TOKEN"
```

### Issue: "User not found. Please complete onboarding."
**Solution:** The user exists in Supabase Auth but not in your database. Complete onboarding first.

### Issue: "Invalid or expired token"
**Solution:** 
1. Token might be expired - get a fresh token from frontend
2. Check that `SUPABASE_JWT_SECRET` in `.env` matches Supabase dashboard

### Issue: Port 3001 already in use
**Solution:**
```bash
lsof -ti:3001 | xargs kill -9
npm run dev
```

## 📊 Testing Workflow

### Complete Flow Test:
1. **Auth**: Login with Google → Get token
2. **Onboarding**: Create worker/employer profile
3. **Job**: Employer creates job request
4. **Matching**: System auto-matches workers
5. **Contact**: Employer shortlists worker
6. **Chat**: Exchange messages
7. **Hire**: Update match status to "hired"

## 🔍 Debugging Tips

### Check Server Logs
The server logs show detailed information:
```
[01:47:18 UTC] INFO: Server listening at http://0.0.0.0:3001
```

### Test with Verbose Output
```bash
curl -v http://localhost:3001/health
```

### Check Database
```sql
-- In Supabase SQL Editor:
SELECT * FROM users;
SELECT * FROM worker_profiles;
SELECT * FROM employer_profiles;
```

## ✅ All Systems Go!

Your backend is ready for the hackathon. Test each endpoint to make sure everything works before connecting your frontend.

**Good luck! 🚀**
