# Deploy to Vercel - Quick Guide

## Prerequisites
- GitHub account
- Vercel account (free tier is fine)

## Step 1: Push to GitHub (if not already)
```bash
cd /Users/saivishwasgooty/Documents/skill-link
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: CLI (Fastest)
```bash
# Install Vercel CLI
npm i -g vercel

# Go to frontend directory
cd frontend

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: skill-link
# - Which directory? ./ (current)
# - Override settings? No

# Deploy to production
vercel --prod
```

### Option B: Web Dashboard (Recommended for Hackathon)

1. **Go to [vercel.com](https://vercel.com)** and sign in

2. **Click "Add New Project"**

3. **Import your GitHub repo** `G-SaiVishwas/skill-link`

4. **Configure Project:**
   - Framework Preset: **Vite**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Add Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-url.com
   VITE_SUPABASE_URL=https://xivxfpxsedlmvffrugqk.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpdnhmcHhzZWRsbXZmZnJ1Z3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1OTQ0NzQsImV4cCI6MjA3NzE3MDQ3NH0.VK9ykakaMhUxfdVHAa2fEHsdd-LT-I3fcVO4c27-d6o
   ```

6. **Click "Deploy"**

7. **Wait 2-3 minutes** - You'll get a URL like `https://skill-link-xxx.vercel.app`

## Step 3: Update Backend CORS

Update your backend `.env`:
```bash
FRONTEND_URL=https://skill-link-xxx.vercel.app
```

Restart backend:
```bash
cd backend
npm run dev
```

## Step 4: Deploy Backend (Optional - for production)

### Quick Option: Use Railway.app
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repo → Set root directory to `backend`
4. Add all environment variables from `.env`
5. Deploy - Get backend URL like `https://skill-link-backend.railway.app`

### Update Frontend with Backend URL
In Vercel dashboard:
- Go to your project
- Settings → Environment Variables
- Update `VITE_API_URL` to your Railway URL
- Redeploy

## Done! 🎉

Your app is live at: `https://skill-link-xxx.vercel.app`

## Quick Commands
```bash
# Deploy frontend updates
cd frontend
vercel --prod

# Check deployment
vercel ls

# View logs
vercel logs
```
