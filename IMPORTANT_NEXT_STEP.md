# ⚠️ IMPORTANT: One More Step Required!

## ✅ What's Fixed:
Your frontend now uses the **correct Supabase URL** instead of localhost:54321

**Updated:** `frontend/.env.local`
```bash
VITE_SUPABASE_URL=https://xivxfpxsedlmvffrugqk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci... (your actual key)
```

Frontend restarted on: **http://localhost:5173**

---

## 🚨 CRITICAL: Add JWT Secret to Backend

Your backend needs the **JWT Secret** to validate Google OAuth tokens.

### How to Get It:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/xivxfpxsedlmvffrugqk
2. Click **Settings** (gear icon in sidebar)
3. Click **API**
4. Scroll down to **JWT Settings**
5. Copy the **JWT Secret** (it's a long string, NOT the same as the anon key)

### Where to Add It:

Edit `backend/.env` line 10:
```bash
SUPABASE_JWT_SECRET=TODO_GET_FROM_SUPABASE_DASHBOARD_SETTINGS_API_JWT_SECRET
```

Replace with:
```bash
SUPABASE_JWT_SECRET=your-actual-jwt-secret-here
```

### Then Restart Backend:

**IMPORTANT**: After adding the JWT secret, you MUST restart the backend:

```bash
# Stop the backend (Ctrl+C in the backend terminal)
# Then restart it:
cd backend
npm run dev
```

---

## 🎯 Then Test Google Sign-In:

1. Visit: **http://localhost:5173**
2. Click **"Login"** in navbar
3. Click **"Sign in with Google"**
4. You should now be redirected to Google OAuth (not localhost:54321!)
5. After signing in, you'll be redirected back to your app

---

## 📋 Checklist:

- [x] Frontend `.env.local` updated with correct Supabase URL
- [x] Frontend restarted on http://localhost:5173
- [ ] **Get JWT Secret from Supabase Dashboard → Settings → API → JWT Settings**
- [ ] **Add JWT Secret to `backend/.env`**
- [ ] **Restart backend server**
- [ ] Test Google sign-in

---

## 🆘 If Sign-In Still Doesn't Work:

### Make sure you've configured the redirect URL in Supabase:

1. Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add to **Redirect URLs**:
   ```
   http://localhost:5173/auth/callback
   ```
3. Save changes

### Also check that Google OAuth is enabled:

1. Supabase Dashboard → **Authentication** → **Providers**
2. Make sure **Google** is enabled (toggle should be green)
3. If using custom Google OAuth credentials, verify they're correct

---

**Next**: Get that JWT Secret and restart your backend! 🚀
