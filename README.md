# SkillLink

SkillLink is a voice-first AI matchmaking platform for informal workers and small employers. The repository is now organised so frontend and backend teams can collaborate in parallel without sharing source folders.

## Repository layout

```
skilllink/
	backend/              # Backend service placeholder + environment sample
	frontend/             # Next.js placeholder + UI configs (no UI code committed)
	db/                   # Supabase/Postgres schema and seed data
	docs/                 # Product flow documentation and hand-off notes
	prompts/              # AI prompt templates consumed by backend services
	LICENSE
	README.md
```

## Database (`db/`)

- `00_schema.sql`: enables required extensions, creates tables/functions/views, and seeds demo data.
- `01_*.sql` → `15_*.sql`: table DDL files covering users, worker/employer profiles, job requests, matches, messaging, trust/verification, and monetisation hooks.
- `16_functions.sql`: helper routines (`link_user_to_skill_by_slug`, `find_worker_matches`) that keep backend code lean.
- `17_views.sql`: API-friendly views (now exposing availability status, transcripts, and metadata for workers).
- `seed.sql`: representative data aligned with the latest product flow described in `docs/website_flow.md`.

Apply the schema from the repo root with Supabase credentials already configured:

```bash
psql "${SUPABASE_CONNECTION}" -f db/00_schema.sql
```

## Documentation & prompts

- `docs/website_flow.md`: end-to-end blueprint detailing navigation, feature responsibilities, and the REST endpoints the backend should expose. Share it with both frontend and backend owners before implementation begins.
- `prompts/`: reusable AI prompt templates (voice-to-skills, profile generation, job decoder, TrustRank, negotiation helper). Keep them in sync with backend logic.

## Frontend hand-off (`frontend/`)

- Contains only config scaffolding (`package.json`, `tsconfig.json`, Tailwind/PostCSS configs), a README, and `.env` example so the UI engineer can bootstrap a fresh Next.js App Router project when ready.
- No pages, components, or static assets are committed—start from a clean slate while following the structure laid out in the documentation.

## Backend hand-off (`backend/`)

- Currently empty aside from `.env.example`. Use this directory for the Fastify/Express/Edge runtime that will expose the REST endpoints defined in `docs/website_flow.md` and backed by Supabase.
- Keep all service code, tests, and deployment scripts scoped here to preserve the clean separation of concerns.

## Environment variables

- Frontend sample keys: `frontend/.env.example` (public Next.js values).
- Backend sample keys: `backend/.env.example` (Supabase service role, AI providers, messaging integrations).

## Next steps

1. Finalise backend API contracts inside `backend/`, reusing the schema in `db/` and the prompts in `prompts/`.
2. Once those contracts stabilise, bootstrap the Next.js application under `frontend/` and wire it to the new endpoints.
3. Maintain the separation so deployments (Vercel, Render, etc.) can target each folder independently.

Happy hacking! 🎤🛠️
