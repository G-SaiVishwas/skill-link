# SkillLink Backend API

Complete backend implementation for the SkillLink gig worker matching platform MVP.

## 🎯 Overview

This backend provides all the APIs needed by the SkillLink frontend to:
- Authenticate users with OTP-based login
- Onboard workers with AI-powered skill extraction and bio generation
- Onboard employers and enable job posting
- Match workers to jobs using intelligent ranking algorithms
- Enable real-time chat between workers and employers
- Handle file uploads (photos and voice recordings)
- Generate shareable SkillCards with QR codes

## 🛠️ Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Fastify 4.x (fast & lightweight)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **AI:** OpenAI GPT-4o-mini + Whisper
- **Storage:** Supabase Storage
- **Auth:** JWT tokens + OTP verification
- **Validation:** Zod schemas

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── index.ts           # Environment configuration
│   │   └── constants.ts       # App constants (enums, messages, etc.)
│   ├── services/
│   │   ├── supabase.service.ts    # Supabase DB operations
│   │   ├── openai.service.ts      # AI integrations (all prompts)
│   │   ├── auth.service.ts        # OTP & JWT management
│   │   ├── storage.service.ts     # File uploads & QR generation
│   │   ├── geo.service.ts         # Haversine distance calculations
│   │   └── matching.service.ts    # Worker-job matching algorithm
│   ├── routes/
│   │   ├── auth.routes.ts         # /api/auth/* endpoints
│   │   ├── worker.routes.ts       # /api/worker/* endpoints
│   │   ├── employer.routes.ts     # /api/employer/* endpoints
│   │   ├── job.routes.ts          # /api/job/* endpoints
│   │   ├── match.routes.ts        # /api/match/* endpoints
│   │   ├── chat.routes.ts         # /api/messages/* endpoints
│   │   └── upload.routes.ts       # /api/upload/* endpoints
│   ├── middleware/
│   │   └── auth.middleware.ts     # JWT verification & role guards
│   ├── validators/
│   │   └── schemas.ts             # Zod validation schemas
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   └── server.ts                  # Main entry point
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:

```bash
# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Supabase (from your Supabase project settings)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# Storage buckets (create these in Supabase)
STORAGE_BUCKET_PHOTOS=worker-photos
STORAGE_BUCKET_VOICES=worker-voices
```

### 3. Set Up Supabase

1. Run the database schema from `../db/00_schema.sql` in your Supabase SQL editor
2. Create storage buckets:
   - `worker-photos` (public)
   - `worker-voices` (public)
3. Enable Row Level Security policies as needed

### 4. Run the Server

Development mode (with hot reload):
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

The server will start on `http://localhost:3001`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | ❌ | Send OTP to phone |
| POST | `/api/auth/verify` | ❌ | Verify OTP & get JWT |
| POST | `/api/auth/refresh` | ✅ | Refresh access token |

### Worker APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/onboard/worker` | ✅ | Create worker profile with AI skill extraction |
| GET | `/api/worker/me` | ✅ | Get logged-in worker's profile |
| GET | `/api/worker/:id/skillcard` | ❌ | Get public SkillCard (shareable) |
| PATCH | `/api/worker/:id` | ✅ | Update worker profile |

### Employer APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/onboard/employer` | ✅ | Create employer profile |
| GET | `/api/employer/me` | ✅ | Get logged-in employer's profile |
| GET | `/api/employer/jobs` | ✅ | List employer's posted jobs |
| PATCH | `/api/employer/:id` | ✅ | Update employer profile |

### Job & Matching APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/job/create` | ✅ | Create job & get AI-matched workers |
| GET | `/api/job/:id` | ✅ | Get job details |
| GET | `/api/job/:id/matches` | ✅ | Get all matches for a job |
| GET | `/api/workers/search` | ✅ | Search workers by filters |

### Match APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/match/:id/contact` | ✅ | Shortlist worker & initiate chat |
| PATCH | `/api/match/:id/status` | ✅ | Update match status (hired/rejected) |
| GET | `/api/matches` | ✅ | Get matches (query: worker_id or employer_id) |

### Chat APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/messages/:match_id` | ✅ | Get all messages for a match |
| POST | `/api/message` | ✅ | Send new message |

### Upload APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/upload/photo` | ✅ | Upload & resize worker photo |
| POST | `/api/upload/voice` | ✅ | Upload voice (optional transcription) |

## 🧪 Testing

### Using Postman/Insomnia

1. **Login Flow:**
   ```json
   POST /api/auth/login
   {
     "phone": "+919100000001"
   }
   
   Response (dev mode includes OTP):
   {
     "success": true,
     "message": "OTP sent successfully",
     "debug": {
       "otp": "123456",
       "expiresAt": "2025-10-29T12:00:00Z"
     }
   }
   
   POST /api/auth/verify
   {
     "phone": "+919100000001",
     "otp": "123456"
   }
   
   Response:
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": { ... }
   }
   ```

2. **Worker Onboarding:**
   ```json
   POST /api/onboard/worker
   Authorization: Bearer <token>
   
   {
     "display_name": "Ramesh Kumar",
     "intro_text": "I am a cook specializing in vegetarian food with 5 years experience",
     "location": {
       "city": "Bengaluru",
       "lat": 12.9716,
       "lng": 77.5946
     },
     "rate_per_hour": 180,
     "languages": ["English", "Hindi", "Kannada"]
   }
   
   Response:
   {
     "success": true,
     "worker_profile": { ... },
     "skills": [ { "slug": "cook", "name": "Cook", ... } ],
     "skill_card": {
       "card_url": "http://localhost:3000/worker/xxx",
       "qr_code_data": "data:image/png;base64,..."
     }
   }
   ```

3. **Job Creation with Auto-Matching:**
   ```json
   POST /api/job/create
   Authorization: Bearer <employer_token>
   
   {
     "raw_text": "Need a cook who makes vegetarian dishes for my hotel",
     "location": {
       "city": "Bengaluru"
     }
   }
   
   Response:
   {
     "success": true,
     "job": { ... },
     "suggested_workers": [
       {
         "worker_id": "...",
         "match_id": "...",
         "score": 94,
         "name": "Ramesh Kumar",
         "skills": ["Cook", "Vegetarian"],
         "distance_km": 2.3,
         "trustrank": 4.2
       }
     ]
   }
   ```

### Using Seed Data

The backend works with the seed data from `../db/seed.sql`:
- 5 workers with different skills
- 3 employers
- 3 sample jobs

You can test login with:
- Worker: `+919100000001` (Cook specializing in vegetarian gobi)
- Employer: `+919200000001` (Hotel Gobi Palace)

## 🤖 AI Integration Details

### 1. Voice to Skills Extraction
Uses `prompts/voice_to_skills.md` logic:
- Transcribes voice using Whisper
- Extracts skills, experience years, languages
- Provides confidence score

### 2. Job Decoder
Uses `prompts/job_decoder.md` logic:
- Parses free-text job descriptions
- Extracts role, required skills, urgency
- Structures data for matching

### 3. Profile Generation
Uses `prompts/profile_generation.md` logic:
- Generates bilingual bios (English + Hindi)
- Suggests fair daily rate ranges
- Creates approachable, professional tone

### 4. TrustRank Calculation
Uses `prompts/trustrank.md` logic:
- Computes trust score (0-100)
- Considers sentiment, verifications, ratings
- Provides actionable recommendations

## 🧮 Matching Algorithm

The matching service ranks workers using weighted factors:

- **Skill Match (40%):** Jaccard similarity + bonus for extra skills
- **Distance (25%):** Exponential decay based on proximity
- **TrustRank (20%):** Normalized 0-5 score
- **Rate (10%):** Compatibility with budget
- **Availability (5%):** Current status

Minimum match threshold: 50%

## 🔐 Security

- JWT tokens with configurable expiry
- Phone number validation
- File type & size validation
- CORS protection
- Input validation with Zod
- SQL injection protection via Supabase client
- Service role key used for admin operations

## 📦 Deployment

### Railway / Render / Fly.io

1. Add environment variables in dashboard
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Deploy from GitHub

### Docker (Optional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

**Issue:** OTP not received
- **Solution:** Check console logs in development mode

**Issue:** File upload fails
- **Solution:** Verify Supabase storage buckets are public and CORS is enabled

**Issue:** Matching returns no workers
- **Solution:** Ensure worker profiles exist with `availability_status = 'available'`

**Issue:** AI features not working
- **Solution:** Verify `OPENAI_API_KEY` is valid and has credits

## 📞 Support

For issues or questions, check:
- Database schema: `../db/00_schema.sql`
- Frontend integration guide: `../FRONTEND_STRUCTURE.md`
- Prompt engineering: `../prompts/`

## 📄 License

MIT License - See LICENSE file for details
