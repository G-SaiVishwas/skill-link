# 🔑 API Keys Setup & How Voice Transcription Works

## 🎉 Your Servers Are Running!

### ✅ Backend: http://localhost:3001
### ✅ Frontend: http://localhost:5173

---

## 🔐 Required API Keys

You need to add **3 API keys** to make all features work:

### 1️⃣ OpenAI API Key (REQUIRED for Voice Transcription & AI Features)

**What it does:**
- **Voice Transcription**: Converts worker voice recordings to text using Whisper AI
- **Skill Extraction**: Analyzes the transcript to identify worker skills
- **Job Parsing**: Converts natural language job descriptions into structured data
- **Bio Generation**: Creates professional bios in English + Hindi
- **TrustRank Calculation**: AI-powered reputation scoring

**Where to get it:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Click on **API keys** in the left sidebar
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-proj-...` or `sk-...`)

**Where to add it:**
Edit `backend/.env` and replace:
```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
```

With your actual key:
```bash
OPENAI_API_KEY=sk-proj-abc123xyz...
```

**Cost:**
- Whisper (voice transcription): ~$0.006 per minute of audio
- GPT-4o-mini (skills, jobs, bios): ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- Very affordable! A 1-minute voice intro costs less than 1 cent

---

### 2️⃣ Supabase Keys (REQUIRED for Auth & Database)

**What they do:**
- **Google OAuth**: User sign-in with Google accounts
- **Database**: Store users, profiles, jobs, matches, messages
- **File Storage**: Store worker photos and voice recordings
- **JWT Validation**: Secure API authentication

**Where to get them:**
1. Go to [supabase.com](https://supabase.com)
2. Sign in and select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy these 3 values:

   a) **Project URL** (e.g., `https://xxxxx.supabase.co`)
   
   b) **Anon/Public Key** (long string starting with `eyJhbGci...`)
   
   c) **JWT Secret** (found under "JWT Settings")

**Where to add them:**

**Backend** (`backend/.env`):
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-super-secret-jwt-secret-here
```

**Frontend** (`frontend/.env.local`):
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Additional Supabase Setup:**

1. **Enable Google OAuth:**
   - Supabase Dashboard → **Authentication** → **Providers**
   - Enable **Google** provider
   - Add redirect URL: `http://localhost:5173/auth/callback`

2. **Create Storage Buckets:**
   - Go to **Storage** in Supabase Dashboard
   - Create bucket: `worker-photos` (Public)
   - Create bucket: `worker-voices` (Public)

3. **Run Database Schema:**
   - Go to **SQL Editor** in Supabase Dashboard
   - Run all files in `/db/` folder in order (00_schema.sql → 17_views.sql)

---

### 3️⃣ Service Role Key (OPTIONAL - for admin operations)

**What it does:**
- Bypasses Row Level Security for admin operations
- Used for backend server-side operations

**Where to get it:**
- Supabase Dashboard → **Settings** → **API** → "Service role key"

**Where to add it:**
```bash
# backend/.env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎙️ How Voice Transcription & AI Works

### The Complete Worker Onboarding Flow:

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Worker records voice intro (30-60 seconds)                  │
│     - Records in browser using MediaRecorder API                │
│     - Saved as .webm audio blob                                 │
└───────────────────┬─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. Frontend uploads voice to backend                           │
│     POST /api/upload/voice?transcribe=true                      │
│     - Sends audio blob as multipart form data                   │
└───────────────────┬─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. Backend saves to Supabase Storage                           │
│     - Uploads to 'worker-voices' bucket                         │
│     - Returns public URL: https://supabase.co/storage/...       │
└───────────────────┬─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. Backend calls OpenAI Whisper API (if transcribe=true)       │
│     File: backend/src/services/openai.service.ts                │
│                                                                  │
│     const transcription = await openai.audio.transcriptions     │
│       .create({                                                  │
│         file: audioFile,                                         │
│         model: 'whisper-1',                                      │
│         language: 'hi', // Hindi + English support               │
│       })                                                         │
│                                                                  │
│     Returns: "मैं एक कुशल प्लम्बर हूँ। I have 5 years..."      │
└───────────────────┬─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. Backend returns transcription to frontend                   │
│     Response: { url: "...", transcription: "..." }              │
└───────────────────┬─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. Frontend calls POST /api/onboard/worker with:               │
│     - voice_intro_url                                            │
│     - voice_transcript                                           │
│     - photo_url                                                  │
│     - location_city                                              │
└───────────────────┬─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  7. Backend AI Pipeline (all automatic!)                        │
│                                                                  │
│     Step 1: Extract Skills from Transcript                      │
│     ────────────────────────────────────                        │
│     File: backend/src/services/openai.service.ts                │
│     Function: extractSkillsFromText()                           │
│                                                                  │
│     const skills = await openai.chat.completions.create({       │
│       model: 'gpt-4o-mini',                                      │
│       messages: [{                                               │
│         role: 'system',                                          │
│         content: VOICE_TO_SKILLS_PROMPT // from prompts/        │
│       }]                                                         │
│     })                                                           │
│                                                                  │
│     Returns: ["Plumbing", "Pipe Fitting", "Bathroom Repair"]    │
│                                                                  │
│     ────────────────────────────────────                        │
│     Step 2: Generate Professional Bio                           │
│     ────────────────────────────────────                        │
│     Function: generateWorkerBio()                               │
│                                                                  │
│     Generates TWO versions:                                      │
│     - English: "Experienced plumber with 5 years..."            │
│     - Hindi: "5 साल के अनुभव के साथ कुशल प्लम्बर..."           │
│                                                                  │
│     ────────────────────────────────────                        │
│     Step 3: Calculate TrustRank™                                │
│     ────────────────────────────────────                        │
│     Function: calculateTrustRank()                              │
│                                                                  │
│     AI analyzes:                                                 │
│     - Voice confidence & clarity                                │
│     - Professional language                                     │
│     - Experience mentioned                                       │
│     Returns: 0.0 to 1.0 score                                   │
│                                                                  │
│     ────────────────────────────────────                        │
│     Step 4: Create SkillCard with QR Code                       │
│     ────────────────────────────────────                        │
│     - Generates unique profile URL                              │
│     - Creates QR code for easy sharing                          │
│     - Stores in database                                        │
│                                                                  │
└───────────────────┬─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  8. Backend saves complete profile to Supabase                  │
│     - User record                                                │
│     - Worker profile with AI-generated data                     │
│     - Skills in user_skills table                               │
│     - SkillCard record                                          │
└───────────────────┬─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  9. Frontend receives complete profile & redirects              │
│     - Worker can now view jobs                                   │
│     - Their SkillCard is ready to share                         │
│     - TrustRank is calculated                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Where the Code Lives

### Voice Upload & Transcription:
```
backend/src/routes/upload.routes.ts
  ↓ calls
backend/src/services/storage.service.ts (uploads to Supabase)
  ↓ calls
backend/src/services/openai.service.ts → transcribeVoice()
```

**Actual Code:**
```typescript
// backend/src/services/openai.service.ts

async transcribeVoice(audioBuffer: Buffer): Promise<string> {
  const file = new File([audioBuffer], 'voice.webm', { 
    type: 'audio/webm' 
  })
  
  const transcription = await this.openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    language: 'hi', // Supports Hindi + English
  })
  
  return transcription.text
}
```

### Skill Extraction:
```
backend/src/routes/worker.routes.ts
  ↓ calls
backend/src/services/openai.service.ts → extractSkillsFromText()
```

**Uses this prompt:** `prompts/voice_to_skills.md`

**Actual Code:**
```typescript
async extractSkillsFromText(text: string): Promise<string[]> {
  const completion = await this.openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: VOICE_TO_SKILLS_PROMPT },
      { role: 'user', content: text }
    ],
    response_format: { type: 'json_object' }
  })
  
  const result = JSON.parse(completion.choices[0].message.content!)
  return result.skills // Array of skill names
}
```

### Bio Generation (Bilingual):
```
backend/src/services/openai.service.ts → generateWorkerBio()
```

**Uses this prompt:** `prompts/profile_generation.md`

**Returns:**
```json
{
  "bio_english": "Experienced plumber...",
  "bio_local": "अनुभवी प्लम्बर...",
  "suggested_rate": 500
}
```

### Job Parsing (AI Job Decoder):
```
backend/src/routes/job.routes.ts
  ↓ calls
backend/src/services/openai.service.ts → parseJobDescription()
```

**Uses this prompt:** `prompts/job_decoder.md`

**Example:**
Input: "Need someone to fix my bathroom pipe, it's leaking badly"

Output:
```json
{
  "title": "Bathroom Pipe Repair",
  "required_skills": ["Plumbing", "Pipe Fitting"],
  "urgency": "high",
  "estimated_duration": "2-4 hours"
}
```

---

## 💰 API Costs Breakdown

### OpenAI Pricing (Pay-as-you-go):

**Whisper (Audio Transcription):**
- $0.006 per minute
- Average worker intro (1 min) = **$0.006**

**GPT-4o-mini (Text Generation):**
- Input: $0.15 per 1M tokens
- Output: $0.60 per 1M tokens
- Skill extraction (~500 tokens) = **$0.0003**
- Bio generation (~1000 tokens) = **$0.0006**
- Job parsing (~800 tokens) = **$0.0005**

**Total per worker onboarding: ~$0.008 (less than 1 cent!)**

### Supabase Pricing:
- **Free tier**: 500MB database + 1GB storage + 50K MAU
- Perfect for development and small scale
- Paid plans start at $25/month for production

---

## 🧪 Testing the Voice Pipeline

### Option 1: Using Frontend UI (Recommended)
1. Open http://localhost:5173
2. Click "Sign in with Google" (after adding Supabase keys)
3. Choose "I'm a Worker"
4. Record voice intro
5. Upload photo
6. Submit
7. Check Network tab → POST /api/upload/voice (see transcription)
8. Check Network tab → POST /api/onboard/worker (see AI results)

### Option 2: Using curl (Direct API Test)
```bash
# 1. Get auth token (sign in via frontend first)
TOKEN="your-jwt-token-here"

# 2. Upload voice with transcription
curl -X POST http://localhost:3001/api/upload/voice?transcribe=true \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test_voice.webm"

# Response:
{
  "url": "https://supabase.co/storage/worker-voices/abc123.webm",
  "transcription": "Hello, I am a skilled plumber..."
}

# 3. Create worker profile (triggers AI pipeline)
curl -X POST http://localhost:3001/api/onboard/worker \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "voice_intro_url": "...",
    "voice_transcript": "Hello, I am a skilled plumber...",
    "location_city": "Mumbai"
  }'

# Response includes:
{
  "id": "...",
  "bio_generated": "Experienced plumber...",
  "bio_generated_local": "अनुभवी प्लम्बर...",
  "trustrank": 0.85,
  "skills": ["Plumbing", "Pipe Fitting"]
}
```

---

## 🔒 Security Notes

### API Key Safety:
- ✅ Never commit `.env` files to Git
- ✅ Both `.env` and `.env.local` are in `.gitignore`
- ✅ Backend validates all API calls with JWT tokens
- ✅ OpenAI API key only accessible on server (not exposed to frontend)

### Environment Variables Flow:
```
Frontend (.env.local)          Backend (.env)
─────────────────────          ──────────────
VITE_SUPABASE_URL     ────┐    SUPABASE_URL
VITE_SUPABASE_ANON_KEY ───┤    SUPABASE_ANON_KEY
                          │    SUPABASE_JWT_SECRET
                          │    OPENAI_API_KEY ← Only backend!
                          │    
User signs in with Google │
Supabase returns JWT token│
                          │
Frontend sends:           │
Authorization: Bearer ... ├──→ Backend validates token
                          │    using SUPABASE_JWT_SECRET
                          │
                          └──→ Makes OpenAI API calls
                               (user never sees API key!)
```

---

## 📝 Quick Start Checklist

- [x] Backend running on http://localhost:3001
- [x] Frontend running on http://localhost:5173
- [ ] Add OpenAI API key to `backend/.env`
- [ ] Add Supabase credentials to `backend/.env`
- [ ] Add Supabase credentials to `frontend/.env.local`
- [ ] Enable Google OAuth in Supabase Dashboard
- [ ] Create storage buckets (worker-photos, worker-voices)
- [ ] Run database schema from `/db/` folder
- [ ] Test sign in at http://localhost:5173/auth
- [ ] Test voice upload in worker onboarding

---

## 🆘 Troubleshooting

### "OpenAI API key not configured"
- Check `backend/.env` has `OPENAI_API_KEY=sk-...`
- Restart backend server after adding key

### "Supabase JWT validation failed"
- Verify `SUPABASE_JWT_SECRET` matches in backend
- Get it from Supabase Dashboard → Settings → API → JWT Secret

### "Storage bucket not found"
- Create buckets in Supabase: `worker-photos` and `worker-voices`
- Make them **public** (so URLs are accessible)

### "Transcription failed"
- Check OpenAI API key is valid and has credits
- Verify audio file is in supported format (.webm, .mp3, .wav, .m4a)
- Check OpenAI API status: [status.openai.com](https://status.openai.com)

---

## 🎯 Next Steps

1. **Add API Keys** (5 minutes)
   - Get OpenAI key
   - Get Supabase credentials
   - Update .env files

2. **Setup Supabase** (10 minutes)
   - Enable Google OAuth
   - Create storage buckets
   - Run database schema

3. **Test the Flow** (5 minutes)
   - Sign in with Google
   - Record voice intro
   - Watch the AI magic happen! ✨

---

Need help? Check the main `SETUP_GUIDE.md` for detailed instructions!
