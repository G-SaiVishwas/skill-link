# 🧠 SkillLink Website Design & Flow (End-to-End Blueprint)

> Updated October 28, 2025 — build-ready handoff

---

## 🌍 High-Level Structure

Two primary user journeys share Supabase authentication but diverge immediately after login.

- **Worker Flow** (informal worker onboarding and visibility)
- **Employer Flow** (job posting and hiring)

All public web UI lives inside the Next.js frontend (`apps/frontend`). All business logic and data mutations live inside the standalone Fastify backend (`apps/backend`). This lets us deploy frontend to Vercel (or any static host) and backend to Render/Fly/Azure Functions independently.

---

## 🧭 Website Navigation Overview

```
Home (/)
├── Worker Flow
│   ├── Worker Onboarding (/worker/onboard)
│   ├── Worker Dashboard (/worker/dashboard)
│   ├── Public SkillCard (/worker/[id])
│   ├── Chat (/chat/[match_id])
│   └── Settings (/worker/settings)
│
└── Employer Flow
    ├── Employer Job Post (/employer/post)
    ├── Match Results (/employer/matches)
    ├── Chat (/chat/[match_id])
    └── Settings (/employer/settings)
```

Shared primitives (chat, settings) consume backend REST endpoints hosted under `${API_BASE_URL}`.

---

## 🏠 1. Landing Page — `/`

**Goal:** Guide visitors to pick a role.

### Features

- Hero headline: _“Where skills meet opportunity.”_
- Two CTA buttons linking to worker onboarding and employer post flow.
- Optional explainer animation.
- Navbar: `Home | About | Contact | Login`
- Footer: `© SkillLink 2025 | Privacy | Terms`

### Frontend Tasks

- Build `HeroSection`, `RoleSelector`, `Footer` components with Tailwind + optional Framer Motion.
- Optional stats widget fetched via `GET ${API_BASE_URL}/stats`.

### Backend Tasks

- Optional `/stats` endpoint returning counts for display.

---

## 👷 2. Worker Onboarding — `/worker/onboard`

**Goal:** Produce a polished profile & SkillCard in 5 minutes.

### Steps / Features

1. **Voice Intro** — 10s recording; upload to Supabase Storage; send URL to backend → AI extracts tags.
2. **Photo Upload** — capture/upload image; store in Supabase bucket.
3. **Skill Tagging** — AI-suggested tags + manual chips.
4. **Location & Rate** — city selector, rate suggestion.
5. **Profile Generation** — backend builds bilingual bio and suggested rate range.
6. **Preview SkillCard** — show shareable card with QR preview.
7. **Persist** — save to `worker_profiles`, `user_skills`, `skill_cards` tables.

### Frontend Tasks

- Client form wizard (`VoiceRecorder`, `PhotoUploader`, `SkillSelector`, `ProfilePreview`).
- POST JSON/multipart to backend `POST ${API_BASE_URL}/onboard/worker`.
- Use `NEXT_PUBLIC_API_BASE_URL` to keep deployment agnostic.

### Backend Tasks

- Fastify route `POST /onboard/worker` handles uploads & AI prompts.
- Uses Supabase Service Role for inserts + `link_user_to_skill_by_slug` function.
- Generates QR code URL placeholder.

---

## 💼 3. Employer Job Post — `/employer/post`

**Goal:** Capture requirements via voice/text and surface candidate matches instantly.

### Steps / Features

1. Input (text or voice).
2. AI parsing into structured job JSON (role, skills, urgency, location).
3. Summary card for review.
4. Persist job in `job_requests`.
5. Redirect to match page.

### Frontend Tasks

- `JobInputBox`, `VoiceRecorder`, `JobSummaryCard` components.
- POST to `POST ${API_BASE_URL}/job/create`.
- Display loading UI while waiting for AI parse.

### Backend Tasks

- Fastify route to orchestrate AI call (OpenAI/crzy) and write `job_requests` + `matches`.
- Returns `job_request_id` + top matches array.

---

## 🔍 4. Match Results — `/employer/matches`

**Goal:** Browse recommended workers and initiate chats.

### Features

- Swipe deck or card grid with photo, bio, rate, TrustRank.
- Filters (distance, rating, rate range).
- `Hire` button triggers contact flow.

### Frontend Tasks

- Fetch `GET ${API_BASE_URL}/job/:id/matches`.
- On like, trigger `POST ${API_BASE_URL}/match/:id/contact` then route to chat.

### Backend Tasks

- Read matches from view/function.
- Contact endpoint marks match `contacted` + seeds first message.

---

## 💬 5. Chat — `/chat/[match_id]`

**Goal:** Enable real-time communication.

### Features

- Text + optional voice snippets.
- Auto translation indicator if languages differ.
- “Mark job complete” CTA.

### Frontend Tasks

- Chat UI using Supabase Realtime or polling `GET ${API_BASE_URL}/messages/:match_id`.
- POST messages via `POST ${API_BASE_URL}/message`.

### Backend Tasks

- Persist chat to `messages` table.
- Optional translation hook before returning payload.

---

## 🪪 6. Public SkillCard — `/worker/[id]`

**Goal:** Public, shareable profile card.

### Features

- Photo, AI bio (EN + local language), skills, rate, TrustRank.
- Audio playback of worker intro.
- QR code for print/share.
- CTA to “Contact via SkillLink” (redirects to employer login).

### Frontend Tasks

- Fetch `GET ${API_BASE_URL}/worker/:id/skillcard` server-side.
- Render `SkillCardView`, `QRCodeGenerator` components.

### Backend Tasks

- Public route reading from `worker_profiles_view` + `skill_cards`.

---

## ⚙️ 7. Settings Pages

### Worker Settings `/worker/settings`

- Edit profile basics, toggle availability, update rate.
- Endpoint: `PATCH ${API_BASE_URL}/worker/:id`.

### Employer Settings `/employer/settings`

- Manage org info, add team members (future), subscription state.
- Endpoint: `PATCH ${API_BASE_URL}/employer/:id`.

---

## 🧩 8. Admin Dashboard `/admin`

- Overview of signups, jobs, matches, verifications.
- Flag/unflag profiles.
- Backend endpoints behind admin auth (Supabase role check).

---

## 📄 Supporting Pages

- `/about`, `/contact`, `/privacy`, `/terms` as static content.

---

## 🧰 Technical Division (Deployable Separation)

| Frontend (Next.js @ `apps/frontend`)                             | Backend (Fastify + Supabase @ `apps/backend`)                            |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Tailwind UI, routing, client forms                               | REST endpoints, Supabase data access, RLS-aware service role usage       |
| Voice recorder UI (mic access)                                   | File uploads to Supabase Storage (signed URLs)                           |
| Fetch data from `${API_BASE_URL}` (no direct DB access)          | AI prompt orchestration (OpenAI/crzy)                                    |
| Swipe deck, chat UI, QR code rendering                           | Matching logic, TrustRank calculations, rate heuristics                  |
| Static marketing pages                                           | Messaging persistence + translation hooks                                |
| Env: `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Env: `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`, AI keys, storage creds |
| Deploy to Vercel/Netlify                                         | Deploy to Render/Fly/Docker container (exposes `/api/*`)                 |

**_Frontends and backends communicate over HTTPS; no server-to-server coupling to keep deployments independent._**

---

## 🔗 Page ⇄ API Map

| Page                | HTTP Calls                                        |
| ------------------- | ------------------------------------------------- |
| `/worker/onboard`   | `POST /onboard/worker`                            |
| `/worker/[id]`      | `GET /worker/:id/skillcard`                       |
| `/employer/post`    | `POST /job/create`                                |
| `/employer/matches` | `GET /job/:id/matches`, `POST /match/:id/contact` |
| `/chat/[match_id]`  | `GET /messages/:match_id`, `POST /message`        |
| `/settings`         | `PATCH /worker/:id` or `PATCH /employer/:id`      |
| `/admin`            | `GET /admin/overview`, `PATCH /admin/flags`       |

All endpoints are namespaced under `/api` when deployed (e.g., `https://api.skilllink.com/api/job/create`).

---

## 🎯 User Journeys

**Worker:** Home → Onboard → AI profile preview → SkillCard share → Chat/hire → Ratings boost TrustRank.

**Employer:** Home → Post job → AI summary → Swipe matches → Contact via chat → Hire & rate.

---

## 🧱 File Structure Overview

```
skilllink/
  apps/
    frontend/          # Next.js app (App Router)
      app/
      lib/
      public/
    backend/           # Fastify REST API
      src/
      package.json
  db/
  prompts/
  docs/
  README.md
```

This split allows different pipelines (e.g., Vercel for frontend, Docker/Render for backend).

---

## 💬 Frontend ↔ Backend Contract (example)

```ts
// Worker Onboarding submission (frontend)
await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/onboard/worker`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    auth_uid,
    voice_url,
    photo_url,
    skills: ["cook", "vegetarian"],
    location_city: "Bengaluru",
  }),
});
```

Backend expects JSON and responds with `{ worker_profile_id, skill_card_id, ai_summary }`.

---

## 🚀 Delivery Notes

- Supabase schema + prompts already live in `/db` and `/prompts`.
- Update `env.local.example` with `NEXT_PUBLIC_API_BASE_URL` for frontend and `.env` under `apps/backend` with service keys.
- Coordinate deployments via GitHub Actions or separate pipelines.

Happy building! 🛠️
