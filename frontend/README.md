# SkillLink Frontend Placeholder

This directory is reserved for the standalone Next.js frontend that will consume the SkillLink backend APIs.

## Getting Started

1. Initialize a new Next.js project in this folder when frontend development begins.
2. Reuse the information in `../docs/website_flow.md` for page structure, flows, and API expectations.
3. Configure environment variables by copying `.env.example` to `.env.local` and populating the required keys.
4. Keep all UI-specific packages, configs, and scripts scoped to this directory so the backend can be deployed independently.

## Suggested Structure

```
frontend/
  app/              # Next.js App Router pages
  components/       # Shared UI components
  lib/              # Fetch helpers, clients
  public/           # Static assets
  styles/           # Global styles or Tailwind config
```

Feel free to adjust once the frontend implementation starts—this folder currently contains only configuration scaffolding.
