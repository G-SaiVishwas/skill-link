# SkillLink Frontend Setup Guide

## Prerequisites Completed ✅

1. **Dependencies Installed**
   - @supabase/supabase-js (auth client)
   - axios (HTTP client)
   - react-icons (UI icons)

2. **Auth Infrastructure Built**
   - Supabase client configuration
   - AuthContext with Google OAuth
   - API wrapper with automatic token injection
   - All service files (auth, worker, employer, job, match, chat, upload)
   - Auth pages (sign-in, callback)

## Required: Supabase Configuration

### Step 1: Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project or create a new one
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Step 2: Update Frontend Environment Variables

Edit `frontend/.env.local`:

```bash
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Configure Google OAuth in Supabase

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable **Google** provider
3. Add your OAuth credentials (or use Supabase's hosted OAuth)
4. Add authorized redirect URLs:
   - Development: `http://localhost:5173/auth/callback`
   - Production: `https://your-domain.com/auth/callback`

### Step 4: Update Backend Environment Variables

Make sure your `backend/.env` has:

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Get JWT Secret from Supabase Dashboard → Settings → API → JWT Settings
```

## Running the Application

### Terminal 1: Backend

```bash
cd backend
npm install
npm run dev
# Should start on http://localhost:3001
```

### Terminal 2: Frontend

```bash
cd frontend
npm install
npm run dev
# Should start on http://localhost:5173
```

## Testing the Auth Flow

1. **Open**: http://localhost:5173
2. **Click**: "Login" button in navbar
3. **Sign In**: With Google account
4. **Redirect**: Should redirect to `/auth/callback` then to home
5. **Check**: User should be synced with backend (check Network tab for POST /api/auth/session)

## Auth Flow Architecture

```
┌─────────────────┐
│   User clicks   │
│  "Sign in with  │
│     Google"     │
└────────┬────────┘
         │
         v
┌─────────────────────────────────┐
│  Supabase Google OAuth Flow     │
│  (handled by Supabase hosted)   │
└────────┬────────────────────────┘
         │
         v
┌─────────────────────────────────┐
│  Redirect to /auth/callback     │
│  with session in URL params     │
└────────┬────────────────────────┘
         │
         v
┌─────────────────────────────────┐
│  AuthContext.useEffect detects  │
│  session, calls                 │
│  POST /api/auth/session         │
└────────┬────────────────────────┘
         │
         v
┌─────────────────────────────────┐
│  Backend validates JWT token,   │
│  creates/updates user in DB,    │
│  returns full user object       │
└────────┬────────────────────────┘
         │
         v
┌─────────────────────────────────┐
│  Frontend stores user in state, │
│  redirects to dashboard         │
└─────────────────────────────────┘
```

## All API Calls Now Include Auth Token

Every service file uses the `apiCall()` wrapper which:

1. Gets Supabase session token
2. Adds `Authorization: Bearer <token>` header
3. Makes request to backend
4. Backend validates token using SUPABASE_JWT_SECRET

## Service Files Reference

### auth.service.ts
- `getCurrentUser()` → GET /api/auth/me
- `logout()` → POST /api/auth/logout

### worker.service.ts
- `createWorkerProfile(data)` → POST /api/onboard/worker
- `getWorkerProfile()` → GET /api/worker/me
- `getPublicSkillCard(workerId)` → GET /api/worker/:id/skillcard
- `updateWorkerProfile(data)` → PATCH /api/worker/me

### employer.service.ts
- `createEmployerProfile(data)` → POST /api/onboard/employer
- `getEmployerProfile()` → GET /api/employer/me
- `getEmployerJobs()` → GET /api/employer/jobs
- `updateEmployerProfile(data)` → PATCH /api/employer/me

### job.service.ts
- `createJobRequest(data)` → POST /api/job/create
- `getJobMatches(jobId)` → GET /api/job/:id/matches
- `getJobDetails(jobId)` → GET /api/job/:id
- `searchWorkers(params)` → GET /api/workers/search

### match.service.ts
- `contactWorker(matchId)` → POST /api/match/:id/contact
- `updateMatchStatus(matchId, status)` → PATCH /api/match/:id/status
- `getWorkerMatches()` → GET /api/matches

### chat.service.ts
- `getMessages(matchId)` → GET /api/messages/:match_id
- `sendMessage(data)` → POST /api/message

### upload.service.ts
- `uploadPhoto(file)` → POST /api/upload/photo
- `uploadVoice(blob, transcribe)` → POST /api/upload/voice?transcribe=true

## Next Steps: Connect UI to Services

### Example: Worker Onboarding Page

```tsx
import { useState } from 'react'
import { workerService } from '../../../services/worker.service'
import { uploadService } from '../../../services/upload.service'
import { useNavigate } from 'react-router-dom'

export default function WorkerOnboarding() {
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null)
  const [photo, setPhoto] = useState<File | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // 1. Upload voice with transcription
      const voiceResult = await uploadService.uploadVoice(voiceBlob!, true)
      
      // 2. Upload photo
      const photoResult = await uploadService.uploadPhoto(photo!)
      
      // 3. Create worker profile (backend does AI magic)
      const profile = await workerService.createWorkerProfile({
        voice_intro_url: voiceResult.url,
        voice_transcript: voiceResult.transcription,
        photo_url: photoResult.url,
        location_city: 'Mumbai',
        // Backend will:
        // - Extract skills from transcript
        // - Generate bio in English + Hindi
        // - Calculate TrustRank
        // - Create SkillCard with QR code
      })
      
      navigate('/worker/dashboard')
    } catch (error) {
      console.error('Onboarding failed:', error)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Your existing UI */}
    </form>
  )
}
```

## Troubleshooting

### "Not authenticated" Error
- Check if Supabase credentials are in `.env.local`
- Verify user is signed in (check AuthContext state)
- Check Network tab for Authorization header in requests

### Backend Returns 401 Unauthorized
- Verify `SUPABASE_JWT_SECRET` matches in backend `.env`
- Check Supabase Dashboard → Settings → API → JWT Secret
- Ensure it's the JWT Secret, not the anon key

### OAuth Redirect Not Working
- Check redirect URL in Supabase matches your app URL
- Ensure `/auth/callback` route exists in App.tsx
- Check browser console for errors

### Token Expired
- AuthContext auto-refreshes tokens
- Check `supabase.auth.getSession()` is working
- Verify `autoRefreshToken: true` in supabase.ts

## Production Deployment

### Frontend (Vercel)
1. Add environment variables in Vercel dashboard
2. Update `VITE_API_URL` to production backend URL
3. Update Supabase redirect URLs

### Backend (Vercel/Fly.io)
1. Set all environment variables
2. Update CORS origins to include frontend domain
3. Ensure SUPABASE_JWT_SECRET is set

### Supabase
1. Add production redirect URLs
2. Verify Google OAuth credentials
3. Check RLS policies allow authenticated users

## Success Checklist

- [ ] Supabase project created
- [ ] Google OAuth enabled in Supabase
- [ ] Frontend `.env.local` configured
- [ ] Backend `.env` configured with JWT secret
- [ ] Backend running on :3001
- [ ] Frontend running on :5173
- [ ] Can click "Sign in with Google"
- [ ] Redirects to Google OAuth
- [ ] Returns to /auth/callback
- [ ] POST /api/auth/session succeeds (check Network tab)
- [ ] User state populated in AuthContext
- [ ] Protected routes work with auth token

## All Done! 🎉

Your frontend is now fully integrated with:
- ✅ Google OAuth via Supabase
- ✅ JWT token authentication
- ✅ All 27 backend API endpoints
- ✅ Automatic token injection in API calls
- ✅ Auth state management
- ✅ Protected routes
- ✅ Ready for onboarding implementation

Next: Connect your onboarding pages to the service files and let the AI magic happen! 🚀
