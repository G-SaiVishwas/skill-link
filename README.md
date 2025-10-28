# SkillLink

*This repo was scaffolded by Copilot (gpt-5) using a product prompt. Fill environment variables and run the schema in Supabase to seed demo data.*

SkillLink is a voice-first AI matchmaking platform for informal workers and small employers. The stack is Next.js (App Router) + TailwindCSS on the frontend, Supabase for auth/Postgres/storage, and serverless API routes for orchestration.

## Project structure
```
skilllink/
  db/
  prompts/
  src/
	 app/
	 lib/
	 pages/api/
  public/
  package.json
  tsconfig.json
  tailwind.config.ts
  next.config.js
  env.local.example
```

### Database (`db/`)
- `00_schema.sql`: orchestrates extension enablement, table creation, functions, and seeds.
- `01_*.sql` → `15_*.sql`: individual table DDL files covering users, profiles, jobs, matches, messaging, monetisation hooks, etc.
- `16_functions.sql`: Postgres helper functions (`link_user_to_skill_by_slug`, `find_worker_matches`).
- `17_views.sql`: `worker_profiles_view` and `matches_view` for faster API consumption.
- `seed.sql`: demo data (5 workers, 3 employers, canonical jobs, sample matches & ratings).

Run everything with:
```bash
psql "$SUPABASE_CONNECTION" -f db/00_schema.sql
```
Or copy each file into Supabase SQL editor in order.

## Environment variables
See `env.local.example`. Key vars:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase client.
- `SUPABASE_SERVICE_ROLE_KEY`: secure RPC/tasks.
- `OPENAI_API_KEY`, `CRZY_API_KEY`: AI assistants.
- `GOOGLE_TTS_API_KEY` or `ELEVENLABS_API_KEY`: voice playback.
- `NEXT_PUBLIC_VERCEL_URL`: used for QR/links.
- Optional: Twilio WhatsApp creds for escalation.

## Getting started
1. **Install dependencies**
	```bash
	npm install
	```
2. **Configure env**
	```bash
	cp env.local.example .env.local
	# fill in Supabase + AI keys
	```
3. **Apply database schema + seed**
	- Using Supabase SQL editor: paste `db/00_schema.sql` (it cascades includes).
	- Or locally with `psql` pointing to Supabase connection string.
4. **Dev server**
	```bash
	npm run dev
	```
	Visit `http://localhost:3000`.
5. **Deploy**
	- **Frontend**: push to GitHub, connect Vercel (Next.js). Define env vars.
	- **Backend**: API routes bundled with Next on Vercel. For heavier workloads, move RPCs to Supabase Edge Functions.
	- **Database**: Supabase project with SQL schema applied.
6. **Storage setup**
	- Create Supabase bucket `skilllink-assets` with public access for demo.
	- Configure RLS policies aligning with `users.role`.

## API overview
REST stubs live in `src/pages/api`. Each returns JSON with documented shapes.

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/onboard/worker` | POST (multipart) | Store worker profile, invoke AI prompts, create SkillCard. |
| `/api/job/create` | POST (JSON) | Decode employer request via AI, save job, return initial matches. |
| `/api/job/:id/matches` | GET | List matches sorted by score from `matches_view`. |
| `/api/match/:id/contact` | POST | Mark match as contacted, drop system chat message. |
| `/api/message` | POST | Append chat message (text/voice). |
| `/api/worker/:id/skillcard` | GET | Public SkillCard payload. |

Sample cURL:
```bash
curl -X POST http://localhost:3000/api/onboard/worker \
  -F auth_uid=auth-worker-001 \
  -F display_name="Anita Devi" \
  -F location_city=Hyderabad \
  -F selected_skills='["cook","gobi"]' \
  -F raw_text="I cook vegetarian dishes for hotels" \
  -F photo_url=https://storage.supabase.co/worker.jpg \
  -F voice_url=https://storage.supabase.co/voice.mp3

curl -X POST http://localhost:3000/api/job/create \
  -H 'Content-Type: application/json' \
  -d '{"auth_uid":"auth-employer-001","raw_text":"Need cook who cooks gobi for my hotel","location_city":"Hyderabad"}'

curl http://localhost:3000/api/job/<JOB_ID>/matches
```

### RPC helpers (Postgres)
- `link_user_to_skill_by_slug(auth_uid, slug)`: ensures skill exists, links to user.
- `find_worker_matches(job_request_id)`: returns top matches (score, metadata) using `matches` table.

## AI integration notes
### Providers
- **crzy**: Use for audio diarisation & transcription. Provide `CRZY_API_KEY`, base URL, and set `assertCrzyConfigured()` before hitting voice flows.
- **OpenAI**: `callOpenAiChat(prompt)` currently defaults to `gpt-4o-mini`. Swap to GPT-5, gpt-4o, or host-specific per environment.
- **TTS**: integrate ElevenLabs or Google TTS in `/worker/[id]` voice card placeholder.

### Prompt templates
All prompts live in `prompts/` and are documented in README for quick copy.

1. `voice_to_skills.md`: Transcript → skill tags, experience, languages, preferred roles.
2. `profile_generation.md`: Bilingual profile copy + daily rate guidance.
3. `job_decoder.md`: Employer raw text → structured job object with AI skills.
4. `trustrank.md`: Heuristic score (0-100) with breakdown & improvement tips.
5. `negotiation_helper.md`: Rate recommendation + message template for negotiation.

### TrustRank roadmap
- MVP formula uses sentiment, verifications, ratings, account age, penalties.
- Extend with chat responsiveness, repeat hires, geo verification, offline agent logs.

### Voice & messaging escalations
- Use Supabase Storage for raw audio; pair with `crzy` for transcription.
- Optional Twilio WhatsApp bridging for high-urgency leads (store logs in `admin_audit_logs`).

## Frontend walkthrough
- `/` Landing page with CTAs for worker/employer flows.
- `/worker/onboard` Client component with voice-record placeholder, photo URL, skill chips.
- `/worker/[id]` Server component showing SkillCard preview (pulls `worker_profiles_view`).
- `/employer/post` Job intake form hitting `/api/job/create` and printing AI parse.
- `/employer/matches` Swipe-style matches list using seeded data.
- `/chat/[match_id]` Conversation stub with sample messages.

Tailwind classes are in place; fine-tune UI quickly. All components assume mobile-first design.

## Deployment checklist (Vercel + Supabase)
- [ ] Create Supabase project; run `db/00_schema.sql`.
- [ ] Configure Auth providers (email OTP, optional phone).
- [ ] Set Storage bucket & RLS policies.
- [ ] Update environment variables in Vercel project settings.
- [ ] Push repo to GitHub; import into Vercel.
- [ ] Enable QRs (use Vercel Edge function or third-party) if needed.

## Postman collection (optional)
Export API definitions via VS Code REST or create a `postman_collection.json` later for team testing.

## Build plan (12 hours)
1. **Hour 0-1** – Setup repo, configure Supabase project, run schema, verify seeds.
2. **Hour 1-2** – Wire Supabase auth in Next, ensure environment scaffolding works.
3. **Hour 2-4** – Implement worker onboarding flow (voice upload placeholder, AI prompts mocked, SkillCard creation).
4. **Hour 4-5** – Employer job post page + API route, hook AI decoder, return seeded matches.
5. **Hour 5-6** – Build employer match UI with swipe actions and contact API stub.
6. **Hour 6-7** – Chat interface, message API stub, voice message placeholder.
7. **Hour 7-8** – Admin dashboard skeleton (extend `/chat` or new page), integrate translation/TTS notes.
8. **Hour 8-9** – TrustRank display, rating flow, DB triggers validation.
9. **Hour 9-10** – Polish UI, add loading states, ensure mobile responsiveness.
10. **Hour 10-11** – Integration tests/manual QA, adjust seeds for hero demo (“gobi cook” flow).
11. **Hour 11-11.5** – Deploy to Vercel, connect custom domain, run live smoke tests.
12. **Hour 11.5-12** – Prepare demo script, backup recordings, finalize pitch deck screenshots.

## 60-second demo script
1. **00:00-00:10** – “SkillLink lets workers speak their story and get hired instantly.” Show landing page and start worker onboarding recording.
2. **00:10-00:25** – Submit voice + photo; highlight AI-generated SkillCard with QR and bilingual bio.
3. **00:25-00:35** – Switch to employer view, paste “Need a cook who cooks gobi for my hotel”, run AI decode.
4. **00:35-00:45** – Show instant matches page; play worker voice snippet, tap “Like & contact”.
5. **00:45-00:55** – Jump into chat stub, show TrustRank + rating snippet.
6. **00:55-01:00** – Close with “Launch in minutes on Vercel + Supabase. Voice-first hiring for the informal economy.”

## Testing & QA ideas
- Add Vitest or Playwright for UI flows.
- Use Supabase row-level security tests (SQL) to confirm role separation.
- Validate AI prompt outputs with JSON schema (e.g., `ajv`).

## Future enhancements
- Payment capture via Razorpay/Stripe hooking into `payments`.
- Multi-language transcripts with Google Speech, translation caching.
- Offline agent mobile app writing into `admin_audit_logs`.
- Geo-indexes with PostGIS for sub-city distance ranking.

Happy hacking! 🎤🛠️