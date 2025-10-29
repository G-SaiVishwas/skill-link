# 🗄️ Database Setup Instructions

## Problem

Your backend is successfully verifying Google OAuth tokens, but failing with:
```
PGRST116: The result contains 0 rows - Cannot coerce the result to a single JSON object
```

This means **the database tables don't exist yet!**

## ✅ Solution: Run Database Schema

You need to run all SQL files in the `/db/` folder to create the database structure.

### Method 1: Supabase Dashboard (Recommended)

1. **Go to SQL Editor:**
   https://supabase.com/dashboard/project/xivxfpxsedlmvffrugqk/sql

2. **Run each file in order:**
   - Click "New Query"
   - Copy content from each file
   - Paste and click "Run"
   - Repeat for all 18 files

   **Order (IMPORTANT):**
   ```
   00_schema.sql          ← Start here (creates database structure)
   01_users.sql           ← Users table
   02_worker_profiles.sql
   03_employer_profiles.sql
   04_skills.sql
   05_user_skills.sql
   06_job_requests.sql
   07_matches.sql
   08_messages.sql
   09_skill_cards.sql
   10_verifications.sql
   11_ratings.sql
   12_payments.sql
   13_admin_audit.sql
   14_skill_card_paid_verification.sql
   15_employer_subscriptions.sql
   16_functions.sql       ← Database functions
   17_views.sql           ← Database views
   seed.sql               ← Optional: Sample data
   ```

### Method 2: Command Line (If you have psql)

```bash
# Get your database password from Supabase Dashboard → Settings → Database

# Run all files in order
cd db
for file in $(ls *.sql | grep -E '^[0-9]' | sort); do
  echo "Running $file..."
  psql "postgresql://postgres:[YOUR-PASSWORD]@db.xivxfpxsedlmvffrugqk.supabase.co:5432/postgres" -f "$file"
done
```

### Method 3: Combined Script (All-in-One)

I can create a single combined SQL file that you can run once. Would you like me to do that?

---

## After Running Schema

Once you've run all the SQL files:

1. **Refresh your browser** (clear cache: Cmd+Shift+R)
2. **Click "Sign in with Google"** again
3. **Check backend logs** - you should see:
   ```
   ✅ Token verified, auth_uid: 3cc3a94f-4b14-45d0-b3ef-0c34f9150999
   ✅ User created/found in database
   ```
4. **Browser should redirect to home page** with worker/employer selection

---

## Why This Happens

Your auth flow:
1. ✅ Google OAuth works (Supabase handles this)
2. ✅ JWT token is valid (backend verifies it)
3. ❌ Database query fails (no tables exist)
4. ❌ Backend returns 401 error
5. ❌ Frontend redirects to /auth

The tables are needed for:
- Storing user profiles
- Worker skills and bios (AI-generated)
- Employer job postings
- Matching algorithm
- Chat messages
- Payment tracking
- TrustRank scores

---

## Next Steps

1. Run database schema (choose method above)
2. Test Google sign-in again
3. You should be able to complete worker/employer onboarding
4. AI features will work (voice transcription, skill extraction, etc.)

Need help running the SQL files? Let me know!
