# SkillLink Frontend Architecture & Backend Integration Guide

**For Backend Developer**  
**Date:** October 28, 2025

This document shows the complete frontend structure and **exactly what APIs backend needs to expose** for each frontend module.

---

## 📁 Complete Frontend Folder Structure

```
frontend/
├── .env.local                          # Environment variables (copy from .env.example)
├── .env.example                        # Template: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SUPABASE_URL, etc.
├── package.json                        # Dependencies & scripts
├── next.config.js                      # Next.js configuration
├── tailwind.config.ts                  # Tailwind CSS config
├── tsconfig.json                       # TypeScript config
├── middleware.ts                       # 🔐 Route protection (checks auth before /worker or /employer)
│
├── public/                             # Static assets
│   ├── workers.json                    # 📦 Fallback demo data (if backend API fails)
│   ├── jobs.json                       # 📦 Fallback demo data
│   ├── logo.svg
│   └── favicon.ico
│
└── src/
    ├── app/                            # 🎯 Next.js App Router (Pages)
    │   ├── page.tsx                    # Landing page: "I'm looking for work" / "I'm hiring"
    │   ├── layout.tsx                  # Root layout with providers
    │   │
    │   ├── auth/
    │   │   └── page.tsx                # 📱 OTP login page
    │   │                               # API: POST /api/auth/login, POST /api/auth/verify
    │   │
    │   ├── worker/                     # 👷 Worker-specific routes
    │   │   ├── layout.tsx              # Worker navbar & sidebar
    │   │   │
    │   │   ├── onboard/
    │   │   │   └── page.tsx            # 🎤 Worker onboarding (voice/text + photo + skills)
    │   │   │                           # API: POST /api/onboard/worker
    │   │   │                           # API: POST /api/upload/photo
    │   │   │                           # API: POST /api/upload/voice
    │   │   │
    │   │   ├── dashboard/
    │   │   │   └── page.tsx            # 📊 Worker dashboard (profile summary, recent matches)
    │   │   │                           # API: GET /api/worker/me
    │   │   │                           # API: GET /api/matches?worker_id={id}
    │   │   │
    │   │   ├── profile/
    │   │   │   └── [id]/
    │   │   │       └── page.tsx        # 🪪 Public SkillCard (shareable profile with QR)
    │   │   │                           # API: GET /api/worker/:id/skillcard (PUBLIC, no auth)
    │   │   │
    │   │   └── settings/
    │   │       └── page.tsx            # ⚙️ Edit profile, rate, availability
    │   │                               # API: PATCH /api/worker/:id
    │   │
    │   ├── employer/                   # 🏢 Employer-specific routes
    │   │   ├── layout.tsx              # Employer navbar & sidebar
    │   │   │
    │   │   ├── dashboard/
    │   │   │   └── page.tsx            # 📊 Employer dashboard (job list, stats)
    │   │   │                           # API: GET /api/employer/me
    │   │   │                           # API: GET /api/employer/jobs
    │   │   │
    │   │   ├── post-job/
    │   │   │   └── page.tsx            # 💼 Post new job (text or voice input)
    │   │   │                           # API: POST /api/job/create
    │   │   │                           # Returns: job + AI-matched workers
    │   │   │
    │   │   ├── matches/
    │   │   │   └── page.tsx            # 💘 Swipeable worker matches for a job
    │   │   │                           # API: GET /api/job/:id/matches
    │   │   │                           # API: POST /api/match/:id/contact (shortlist action)
    │   │   │
    │   │   ├── search/
    │   │   │   └── page.tsx            # 🔍 Search workers by skill/location/rate
    │   │   │                           # API: GET /api/workers/search?skills=cook&city=Bangalore&rate_min=100&rate_max=500
    │   │   │
    │   │   ├── jobs/
    │   │   │   └── [id]/
    │   │   │       └── page.tsx        # 📋 Single job details + matched workers
    │   │   │                           # API: GET /api/job/:id
    │   │   │
    │   │   └── settings/
    │   │       └── page.tsx            # ⚙️ Edit employer profile
    │   │                               # API: PATCH /api/employer/:id
    │   │
    │   └── chat/
    │       └── [matchId]/
    │           └── page.tsx            # 💬 Chat between worker & employer
    │                                   # API: GET /api/messages/:match_id
    │                                   # API: POST /api/message
    │
    ├── components/                     # 🧩 Reusable UI components
    │   ├── ui/                         # Base UI components (shadcn/ui style)
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── badge.tsx
    │   │   ├── input.tsx
    │   │   ├── textarea.tsx
    │   │   ├── select.tsx
    │   │   ├── toast.tsx
    │   │   └── spinner.tsx
    │   │
    │   ├── layout/                     # Layout components
    │   │   ├── Header.tsx              # Top navigation bar
    │   │   ├── Sidebar.tsx             # Role-based sidebar menu
    │   │   └── Footer.tsx              # Footer links
    │   │
    │   ├── auth/                       # 🔐 Auth-related components
    │   │   ├── RoleSelector.tsx        # Choose Worker / Employer on landing
    │   │   ├── PhoneInput.tsx          # Phone number input with validation
    │   │   └── OTPInput.tsx            # 6-digit OTP input
    │   │
    │   ├── worker/                     # 👷 Worker-specific components
    │   │   ├── OnboardingForm.tsx      # Multi-step onboarding wizard
    │   │   ├── VoiceRecorder.tsx       # 🎤 Record & upload voice intro
    │   │   ├── PhotoUpload.tsx         # 📸 Upload & crop profile photo
    │   │   ├── SkillBadge.tsx          # Display single skill tag
    │   │   ├── SkillCard.tsx           # 🪪 Full public SkillCard display
    │   │   └── WorkerCard.tsx          # Worker preview card (in match list)
    │   │
    │   ├── employer/                   # 🏢 Employer-specific components
    │   │   ├── JobForm.tsx             # Form to create job (text/voice)
    │   │   ├── JobCard.tsx             # Job summary card
    │   │   ├── MatchCard.tsx           # Worker match card with "Hire" button
    │   │   └── SearchFilters.tsx       # Filter panel (skills, location, rate)
    │   │
    │   └── chat/                       # 💬 Chat components
    │       ├── ChatWindow.tsx          # Scrollable message list
    │       ├── MessageBubble.tsx       # Single message (sent/received)
    │       ├── MessageInput.tsx        # Text input + voice record button
    │       └── ChatHeader.tsx          # Participant info + TrustRank badge
    │
    ├── lib/                            # 🔧 Utility functions
    │   ├── api.ts                      # Fetch wrapper with auth token handling
    │   ├── constants.ts                # App constants (roles, routes, etc.)
    │   ├── utils.ts                    # Helper functions (cn, formatDate, etc.)
    │   ├── geolocation.ts              # Calculate distance (Haversine formula)
    │   ├── storage.ts                  # localStorage/sessionStorage helpers
    │   └── qr.ts                       # Generate QR code for SkillCard
    │
    ├── services/                       # 🔌 Backend API integration layer
    │   │                               # ⚠️ BACKEND DEV: These are the EXACT endpoints frontend will call
    │   │
    │   ├── auth.service.ts             # 🔐 Authentication
    │   │   ├── sendOTP(phone)          → POST /api/auth/login
    │   │   └── verifyOTP(phone, otp)   → POST /api/auth/verify
    │   │
    │   ├── worker.service.ts           # 👷 Worker operations
    │   │   ├── createWorkerProfile()   → POST /api/onboard/worker
    │   │   ├── getWorkerProfile()      → GET /api/worker/me
    │   │   ├── getPublicSkillCard(id)  → GET /api/worker/:id/skillcard
    │   │   └── updateWorkerProfile()   → PATCH /api/worker/:id
    │   │
    │   ├── employer.service.ts         # 🏢 Employer operations
    │   │   ├── createEmployerProfile() → POST /api/onboard/employer
    │   │   ├── getEmployerProfile()    → GET /api/employer/me
    │   │   ├── getEmployerJobs()       → GET /api/employer/jobs
    │   │   └── updateEmployerProfile() → PATCH /api/employer/:id
    │   │
    │   ├── job.service.ts              # 💼 Job operations
    │   │   ├── createJobRequest()      → POST /api/job/create
    │   │   ├── getJobMatches(jobId)    → GET /api/job/:id/matches
    │   │   ├── getJobDetails(jobId)    → GET /api/job/:id
    │   │   └── searchWorkers(filters)  → GET /api/workers/search
    │   │
    │   ├── match.service.ts            # 💘 Match operations
    │   │   ├── contactWorker(matchId)  → POST /api/match/:id/contact
    │   │   ├── updateMatchStatus()     → PATCH /api/match/:id/status
    │   │   └── getWorkerMatches()      → GET /api/matches?worker_id={id}
    │   │
    │   ├── chat.service.ts             # 💬 Chat/messaging
    │   │   ├── getMessages(matchId)    → GET /api/messages/:match_id
    │   │   └── sendMessage(matchId)    → POST /api/message
    │   │
    │   └── upload.service.ts           # 📤 File uploads
    │       ├── uploadPhoto(file)       → POST /api/upload/photo
    │       └── uploadVoice(file)       → POST /api/upload/voice
    │
    ├── hooks/                          # 🪝 Custom React hooks
    │   ├── useAuth.ts                  # Auth state (current user, login, logout)
    │   ├── useUser.ts                  # Current user profile data
    │   ├── useChat.ts                  # Chat state (messages, send, polling)
    │   ├── useGeolocation.ts           # Get user's city via browser API
    │   ├── useUpload.ts                # File upload with progress tracking
    │   ├── useDebounce.ts              # Input debouncing for search
    │   └── useLocalStorage.ts          # Persistent state helper
    │
    ├── context/                        # 🌐 React Context providers
    │   ├── AuthContext.tsx             # Global auth state (user, session)
    │   ├── ThemeContext.tsx            # Dark/light mode (optional)
    │   └── ToastContext.tsx            # Global toast notifications
    │
    ├── types/                          # 📘 TypeScript type definitions
    │   ├── user.ts                     # User, WorkerProfile, EmployerProfile
    │   ├── job.ts                      # JobRequest, JobAIResponse
    │   ├── match.ts                    # Match, MatchStatus
    │   ├── chat.ts                     # Message, ChatThread
    │   ├── api.ts                      # ApiResponse<T>, ErrorResponse
    │   └── common.ts                   # LatLng, TrustRank, etc.
    │
    └── config/                         # ⚙️ Configuration files
        ├── env.ts                      # Validate env vars (NEXT_PUBLIC_API_URL, etc.)
        ├── routes.ts                   # Route constants for navigation
        └── skills.ts                   # Static skill categories for autocomplete

```

---

## 🔌 CRITICAL: Backend API Endpoints Required

**⚠️ Backend developer must implement these exact endpoints:**

### 1. Authentication

```
POST /api/auth/login          - Send OTP to phone
POST /api/auth/verify         - Verify OTP & return JWT token
POST /api/auth/refresh        - Refresh access token
```

### 2. Worker APIs

```
POST   /api/onboard/worker         - Create worker profile (with AI skill extraction)
GET    /api/worker/me              - Get logged-in worker's profile
GET    /api/worker/:id/skillcard   - Public SkillCard (NO AUTH REQUIRED)
PATCH  /api/worker/:id             - Update worker profile
```

### 3. Employer APIs

```
POST   /api/onboard/employer   - Create employer profile
GET    /api/employer/me        - Get logged-in employer's profile
GET    /api/employer/jobs      - List employer's posted jobs
PATCH  /api/employer/:id       - Update employer profile
```

### 4. Job APIs

```
POST   /api/job/create         - Create job & return AI-matched workers
GET    /api/job/:id            - Get job details
GET    /api/job/:id/matches    - Get all matches for a job
GET    /api/workers/search     - Search workers (filters: skill, city, rate)
```

### 5. Match APIs

```
POST   /api/match/:id/contact  - Shortlist worker & initiate chat
PATCH  /api/match/:id/status   - Update match status (hired/rejected)
GET    /api/matches            - Get matches (query: ?worker_id= or ?employer_id=)
```

### 6. Chat APIs

```
GET    /api/messages/:match_id - Get all messages for a match
POST   /api/message            - Send new message
```

### 7. Upload APIs

```
POST   /api/upload/photo       - Upload & resize photo to Supabase Storage
POST   /api/upload/voice       - Upload voice & optionally transcribe
```

---

## 📦 Request/Response Examples

### Example 1: Worker Onboarding

**Frontend calls:**

```typescript
// src/services/worker.service.ts
await createWorkerProfile({
  display_name: "Ramesh Kumar",
  intro_text: "I cook vegetarian food in hotels",
  photo_url: "https://storage.../photo.jpg",
  voice_url: "https://storage.../voice.mp3",
  location: { city: "Bengaluru", lat: 12.97, lng: 77.59 },
  rate_per_hour: 150,
});
```

**Backend must return:**

```json
{
  "success": true,
  "worker_profile": {
    "id": "worker-uuid",
    "display_name": "Ramesh Kumar",
    "bio_generated": "Experienced vegetarian cook...",
    "bio_generated_local": "अनुभवी शाकाहारी रसोइया...",
    "trustrank": 4.2,
    "suggested_rate": 180
  },
  "skills": [{ "slug": "cook", "name": "Cook", "proficiency": "expert" }],
  "skill_card": {
    "card_url": "/worker/worker-uuid",
    "qr_code_data": "https://skilllink.demo/worker/worker-uuid"
  }
}
```

---

### Example 2: Employer Posts Job

**Frontend calls:**

```typescript
// src/services/job.service.ts
await createJobRequest({
  raw_text: "Need a cook who makes gobi for my hotel",
  location: { city: "Hyderabad", lat: 17.38, lng: 78.48 },
});
```

**Backend must return:**

```json
{
  "success": true,
  "job": {
    "id": "job-uuid",
    "role_text": "Hotel Cook",
    "ai_skills": ["cook", "vegetarian", "gobi"],
    "urgency": "urgent",
    "status": "open"
  },
  "suggested_workers": [
    {
      "worker_id": "worker-uuid",
      "match_id": "match-uuid",
      "score": 92.5,
      "name": "Ramesh Kumar",
      "photo_url": "...",
      "bio": "Experienced vegetarian cook...",
      "skills": ["Cook", "Vegetarian"],
      "rate_per_hour": 180,
      "distance_km": 2.3,
      "trustrank": 4.5
    }
  ]
}
```

---

### Example 3: Chat Message

**Frontend calls:**

```typescript
// src/services/chat.service.ts
await sendMessage({
  match_id: "match-uuid",
  message_text: "Can you start tomorrow?",
});
```

**Backend must return:**

```json
{
  "success": true,
  "message": {
    "id": "message-uuid",
    "match_id": "match-uuid",
    "sender_id": "employer-uuid",
    "message_text": "Can you start tomorrow?",
    "direction": "employer_to_worker",
    "created_at": "2025-10-28T11:30:00Z"
  }
}
```

---

## 🔑 Environment Variables

**Backend needs to provide base URL. Frontend will configure:**

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001    # Backend API base URL
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
```

**Backend .env:**

```bash
PORT=3001
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1...
OPENAI_API_KEY=sk-...
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

---

## 🧪 Testing Strategy

### Backend Developer Can Test Independently:

1. Use Postman to test each endpoint
2. Use seed data from `db/seed.sql` (5 workers, 3 employers, 3 jobs)
3. Check response format matches examples above

### Frontend Developer Can Test Independently:

1. Use mock data from `public/workers.json` and `public/jobs.json`
2. Service layer has fallback logic if API fails
3. Once backend is ready, update `NEXT_PUBLIC_API_URL` and everything auto-connects

---

## 🚀 Parallel Development Workflow

### Day 1-2: Setup Phase

- **Backend:** Set up server, database, auth middleware
- **Frontend:** Set up Next.js, install dependencies, create UI components

### Day 3-4: Core Features

- **Backend:** Implement worker onboarding API + job creation API
- **Frontend:** Build onboarding UI + job posting UI with mock data

### Day 5-6: Integration

- **Backend:** Implement chat & match APIs
- **Frontend:** Connect services to real APIs, replace mocks

### Day 7: Polish & Demo

- **Both:** Test full flow, fix bugs, prepare demo script

---

## 📋 Backend Developer Checklist

- [ ] Set up Fastify/Express server on port 3001
- [ ] Connect to Supabase (use `db/00_schema.sql`)
- [ ] Implement JWT auth middleware
- [ ] Set up CORS to allow `http://localhost:3000`
- [ ] Implement all 7 endpoint groups listed above
- [ ] Use AI prompts from `prompts/` folder for skill extraction
- [ ] Test with Postman (create collection)
- [ ] Share Postman collection with frontend dev
- [ ] Deploy to staging (Render/Railway/Fly.io)

---

## 📋 Frontend Developer Checklist

- [ ] Install dependencies: `cd frontend && npm install`
- [ ] Create `.env.local` from `.env.example`
- [ ] Create folder structure as shown above
- [ ] Implement UI components (button, card, input, etc.)
- [ ] Build pages with mock data first
- [ ] Implement service layer with fetch calls
- [ ] Connect to real backend once APIs are ready
- [ ] Test full flow: worker onboard → employer search → chat
- [ ] Deploy to Vercel

---

**Share this document with your backend developer. It contains everything they need to know about what APIs to build!** 🚀
