# 🚀 SkillLink - Complete Implementation Plan

## Current Status: HARDCODED DATA EVERYWHERE ❌

Everything is currently using mock/hardcoded data. We need to connect EVERYTHING to the backend.

---

## ✅ What's Already Working (Backend)

### Backend Routes READY:
1. ✅ `/api/auth/*` - Google OAuth, session management
2. ✅ `/api/onboard/worker` - Create worker profile with AI
3. ✅ `/api/worker/me` - Get worker profile
4. ✅ `/api/worker/:id/skillcard` - Public skill card
5. ✅ `/api/job/create` - Create job with AI parsing
6. ✅ `/api/job/:id` - Get job details
7. ✅ `/api/job/:id/matches` - Get job matches
8. ✅ `/api/workers/search` - Search workers by filters
9. ✅ `/api/upload/photo` - Photo upload to Supabase
10. ✅ `/api/upload/voice` - Voice upload to Supabase

### Database Schema READY:
- ✅ 15 tables created
- ✅ Enums, views, triggers, functions
- ✅ RLS policies
- ✅ Full schema in `db/INIT_DATABASE.sql`

---

## ❌ What's BROKEN (Frontend Using Mock Data)

### 1. **Worker Onboarding** (`/worker/onboard`)
**Status**: Voice recording works, but doesn't submit to backend

**What it needs**:
- Call `/api/onboard/worker` on Step 7 completion
- Upload photo to `/api/upload/photo`
- Upload voice to `/api/upload/voice`
- Send transcript, skills, bio to backend
- Navigate to `/worker/jobs` after success

---

### 2. **Worker Profile** (`/worker/profile`)
**Status**: 100% HARDCODED - showing fake "Rajesh Kumar" data

**Hardcoded data**:
```typescript
// Line 21-50 - ALL FAKE DATA
const workerProfile = {
  name: "Rajesh Kumar",
  verified: true,
  specialization: "Residential Plumbing",
  city: "Mumbai",
  experience: "5-10 years",
  rating: 4.8,
  jobsCompleted: 127,
  completionRate: 98,
  responseTime: "< 2 hours",
  // ... ALL HARDCODED
};
```

**What it needs**:
- Fetch from `/api/worker/me` on mount
- Display real user data from database
- Handle loading/error states
- Update UI with actual profile data

---

### 3. **Worker Jobs Page** (`/worker/jobs`)
**Status**: 100% HARDCODED - showing 4 fake jobs

**Hardcoded data**:
```typescript
// Line 45-117 - ALL FAKE JOBS
const mockJobs: JobOpportunity[] = [
  {
    id: "1",
    employer: {
      name: "Priya Sharma",
      verified: true,
      avatar: "https://api.dicebear.com/...",
      rating: 4.9,
      totalHires: 45,
    },
    title: "Bathroom Renovation",
    description: "Need plumber for complete bathroom renovation...",
    // ... ALL FAKE
  },
  // ... 3 more fake jobs
];
```

**What it needs**:
- Fetch from `/api/workers/jobs` (NEW ROUTE NEEDED)
- Show REAL job posts from employers
- Filter by worker's location
- Match by worker's skills
- Real-time updates when employers post jobs

**Backend Route Needed**:
```typescript
GET /api/workers/jobs
- Get jobs matching worker's skills
- Filter by distance from worker
- Sort by urgency, match score
- Return with employer info
```

---

### 4. **Employer Matches Page** (`/employer/matches`)
**Status**: 100% HARDCODED - showing 15 fake workers

**Hardcoded data**:
```typescript
// Line 29-113 - ALL FAKE WORKERS
const mockWorkers: Worker[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    skills: ["Plumbing", "Pipe Installation"],
    experience: "5-10 years",
    rating: 4.8,
    // ... ALL FAKE
  },
  // ... 14 more fake workers
];
```

**What it needs**:
- When employer creates job, show real matched workers
- Call `/api/job/:id/matches` to get workers
- Display real worker profiles from database
- Click worker card → view real skill card
- Send contact request to real workers

---

### 5. **Employer Post Job** (`/employer/post`)
**Status**: Form exists but doesn't submit

**What it needs**:
- Call `/api/job/create` on submit
- Upload voice if provided
- AI parses job description
- Navigate to `/employer/matches/:jobId`
- Show matched workers immediately

---

### 6. **Employer Settings** (`/employer/settings`)
**Status**: Has comment "Mock data - replace with actual data from API"

**What it needs**:
- Fetch from `/api/employer/me` (NEW ROUTE NEEDED)
- Update employer profile
- Manage subscription
- Update payment methods

---

## 🔥 CRITICAL MISSING BACKEND ROUTES

### 1. **GET `/api/workers/jobs`**
Get job opportunities for logged-in worker

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "employer": {
        "name": "Priya Sharma",
        "org_name": "Sharma Construction",
        "verified": true,
        "rating": 4.9,
        "photo_url": "https://..."
      },
      "title": "Bathroom Renovation",
      "description": "...",
      "skills_required": ["plumbing", "bathroom-fitting"],
      "location": {
        "city": "Mumbai",
        "distance_km": 5.2
      },
      "urgency": "high",
      "created_at": "2025-10-29T10:00:00Z"
    }
  ]
}
```

### 2. **GET `/api/employer/me`**
Get logged-in employer's profile

### 3. **PATCH `/api/employer/:id`**
Update employer profile

### 4. **POST `/api/match/contact`**
Employer contacts a worker

### 5. **GET `/api/worker/matches`**
Get workers who matched with employer's job

---

## 📋 STEP-BY-STEP IMPLEMENTATION

### Phase 1: Worker Flow (HIGHEST PRIORITY)

1. **Fix Worker Onboarding Submit**
   - Update `frontend/src/app/worker/onboard/page.tsx`
   - Add `handleComplete()` function
   - Upload photo → get URL
   - Upload voice → get URL
   - Submit to `/api/onboard/worker`
   - Handle success/error
   - Navigate to `/worker/jobs`

2. **Fix Worker Profile Page**
   - Update `frontend/src/app/worker/profile/page.tsx`
   - Remove all hardcoded data
   - Add `useEffect(() => fetchProfile(), [])`
   - Call `/api/worker/me`
   - Display real data
   - Add loading skeleton
   - Add error handling

3. **Create Worker Jobs Backend Route**
   - File: `backend/src/routes/job.routes.ts`
   - Add `GET /api/workers/jobs`
   - Query `job_requests` table
   - Join with `employer_profiles`
   - Filter by worker's skills
   - Calculate distance from worker
   - Sort by match score

4. **Fix Worker Jobs Page**
   - Update `frontend/src/app/worker/jobs/page.tsx`
   - Remove all mock data
   - Fetch from `/api/workers/jobs`
   - Display real jobs
   - Add filters (location, skills, urgency)
   - Add pagination

### Phase 2: Employer Flow

5. **Create Employer Profile Routes**
   - Add `GET /api/employer/me`
   - Add `PATCH /api/employer/:id`

6. **Fix Employer Post Job**
   - Submit to `/api/job/create`
   - Navigate to matches page with job ID
   - Show real matched workers

7. **Fix Employer Matches Page**
   - Fetch from `/api/job/:id/matches`
   - Display real workers
   - Add contact functionality

8. **Fix Employer Settings**
   - Fetch/update employer profile
   - Manage subscription

### Phase 3: Matching & Communication

9. **Contact/Messaging**
   - Add contact worker endpoint
   - Add messaging routes
   - Real-time chat with WebSocket

10. **Notifications**
    - Job matches notification
    - Contact requests
    - Message alerts

---

## 🎯 IMMEDIATE ACTION ITEMS

### RIGHT NOW (Do First):

1. ✅ **Create `/api/workers/jobs` route** in backend
2. ✅ **Fix Worker Jobs page** to fetch real data
3. ✅ **Fix Worker Profile page** to fetch real data
4. ✅ **Fix Worker Onboarding submit** to backend
5. ✅ **Fix Employer Matches** to show real workers

### After That:

6. Create employer profile routes
7. Fix employer post job flow
8. Add contact/messaging
9. Add notifications
10. Testing & bug fixes

---

## 🔧 CODE CHANGES NEEDED

### Backend Files to Modify:
1. `backend/src/routes/job.routes.ts` - Add worker jobs endpoint
2. `backend/src/routes/employer.routes.ts` - Add employer endpoints
3. `backend/src/routes/match.routes.ts` - Add contact endpoint

### Frontend Files to Modify:
1. `frontend/src/app/worker/onboard/page.tsx` - Submit to backend
2. `frontend/src/app/worker/profile/page.tsx` - Fetch real data
3. `frontend/src/app/worker/jobs/page.tsx` - Fetch real jobs
4. `frontend/src/app/employer/matches/page.tsx` - Fetch real workers
5. `frontend/src/app/employer/post/page.tsx` - Submit job
6. `frontend/src/app/employer/settings/page.tsx` - Fetch/update profile

---

## 🚨 CRITICAL NOTES

1. **NO MORE MOCK DATA** - Every component must fetch from backend
2. **Error Handling** - All API calls need try/catch
3. **Loading States** - Add skeletons/spinners
4. **Auth Check** - Verify user is logged in
5. **Real-time Updates** - Jobs should update live

---

## ✨ Expected End Result

### Worker Experience:
1. Signs up with Google → Onboarding
2. Records voice → AI extracts skills
3. Uploads photo → Profile created
4. Goes to Jobs page → Sees REAL job posts from employers
5. Clicks job → Views details, contacts employer
6. Gets hired → Job tracked in database

### Employer Experience:
1. Signs up with Google → Onboarding
2. Posts job (text/voice) → AI parses requirements
3. Goes to Matches → Sees REAL workers from database
4. Views worker SkillCard → Sees real profile, reviews
5. Contacts worker → Real message sent
6. Hires worker → Job status updated

---

## 🎉 SUCCESS CRITERIA

- ✅ NO hardcoded data anywhere
- ✅ All data comes from Supabase database
- ✅ Workers see real jobs from employers
- ✅ Employers see real workers from database
- ✅ Profile pages show actual user data
- ✅ Job posting works end-to-end
- ✅ Matching algorithm works
- ✅ Contact/messaging works
- ✅ Everything is REAL and FUNCTIONAL

---

**LET'S BUILD THIS FOR REAL! 🔥**
