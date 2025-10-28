# Google OAuth Setup Guide with Supabase

This backend now uses **Supabase Authentication with Google OAuth** instead of OTP-based login.

## 🔐 Authentication Flow

1. **Frontend**: User clicks "Sign in with Google"
2. **Supabase**: Handles Google OAuth redirect and user authentication
3. **Frontend**: Receives Supabase session with JWT token
4. **Frontend**: Sends JWT to `/api/auth/session` with `Authorization: Bearer <token>`
5. **Backend**: Verifies Supabase JWT and creates/retrieves user
6. **Backend**: Returns user data (including onboarding status)

---

## 📋 Setup Steps

### 1. Supabase Project Setup

#### Enable Google OAuth Provider
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find **Google** and click to configure
5. Enable the Google provider
6. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console

#### Get Required Environment Variables
1. **Supabase URL**:
   - Go to **Settings** > **API**
   - Copy **Project URL**

2. **Supabase Service Role Key**:
   - Go to **Settings** > **API**
   - Copy **service_role key** (secret, never expose to frontend!)

3. **Supabase Anon Key**:
   - Go to **Settings** > **API**
   - Copy **anon public key**

4. **Supabase JWT Secret**:
   - Go to **Settings** > **API**
   - Scroll down to **JWT Settings**
   - Copy **JWT Secret**

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure consent screen if prompted
6. Select **Web application**
7. Add **Authorized redirect URIs**:
   ```
   https://<your-project>.supabase.co/auth/v1/callback
   ```
8. Copy **Client ID** and **Client Secret**
9. Paste them in Supabase Google provider settings

### 3. Create Storage Buckets

The backend uses two Supabase Storage buckets:

#### worker-photos
```sql
-- In Supabase Dashboard > Storage > Create new bucket
Name: worker-photos
Public: Yes (checkbox checked)
Allowed MIME types: image/jpeg, image/png, image/webp
File size limit: 5MB
```

#### worker-voices
```sql
-- In Supabase Dashboard > Storage > Create new bucket
Name: worker-voices
Public: Yes (checkbox checked)
Allowed MIME types: audio/webm, audio/mpeg, audio/wav, audio/mp4
File size limit: 10MB
```

### 4. Backend Environment Variables

Create `/backend/.env` file:

```bash
# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Supabase (from steps above)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_JWT_SECRET=your-jwt-secret-here

# JWT (optional, for custom tokens)
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here

# Storage
STORAGE_BUCKET_PHOTOS=worker-photos
STORAGE_BUCKET_VOICES=worker-voices

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_TIMEWINDOW=60000
```

### 5. Frontend Environment Variables

Create `/frontend/.env.local` file:

```bash
# API
VITE_API_URL=http://localhost:3001

# Supabase (for client-side auth)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 🔧 API Endpoints

### Authentication

#### POST /api/auth/session
Verify Supabase token and create/retrieve user.

**Headers:**
```
Authorization: Bearer <supabase-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "auth_uid": "google-oauth-uid",
    "email": "user@example.com",
    "phone": "",
    "role": "worker" | "employer" | null,
    "created_at": "2025-10-29T00:00:00Z"
  },
  "message": "User authenticated" | "Please complete onboarding",
  "needsOnboarding": false | true
}
```

#### GET /api/auth/me
Get current user profile.

**Headers:**
```
Authorization: Bearer <supabase-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "auth_uid": "google-oauth-uid",
    "email": "user@example.com",
    "role": "worker",
    ...
  }
}
```

---

## 🧪 Testing the Auth Flow

### 1. Start Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Test with cURL (after getting Supabase token from frontend)

```bash
# Get user session
curl -X POST http://localhost:3001/api/auth/session \
  -H "Authorization: Bearer <your-supabase-jwt-token>"

# Get current user
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer <your-supabase-jwt-token>"
```

### 3. Frontend Integration

```typescript
// In your frontend auth service
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Sign in with Google
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
})

// After successful login, get session token
const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token

// Send token to backend
const response = await fetch('http://localhost:3001/api/auth/session', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

---

## 🚀 Deployment

### Backend (Render/Railway/Fly.io)

1. Set all environment variables in your hosting platform
2. Ensure `FRONTEND_URL` points to your Vercel deployment
3. Deploy the backend folder

### Frontend (Vercel)

1. Set environment variables:
   - `VITE_API_URL` → Your backend URL
   - `VITE_SUPABASE_URL` → Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` → Your Supabase anon key

2. Update Google OAuth redirect URIs in Google Cloud Console:
   ```
   https://your-frontend.vercel.app/auth/callback
   ```

3. Update Supabase Auth Settings:
   - Add Vercel URL to **Redirect URLs**
   - Add Vercel URL to **Site URL**

---

## 🔒 Security Notes

1. **Never** commit `.env` files to git
2. **Never** expose `SUPABASE_SERVICE_ROLE_KEY` to frontend
3. Frontend should only use `SUPABASE_ANON_KEY`
4. Backend validates all tokens using `SUPABASE_JWT_SECRET`
5. All protected routes require valid Supabase JWT token

---

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Fastify CORS Configuration](https://github.com/fastify/fastify-cors)
