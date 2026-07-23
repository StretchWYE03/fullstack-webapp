# Level Up — product context

## Product direction

**Level Up** is a personal, gamified self-improvement app. It turns small habits into daily quests, awards XP for completion, and makes personal momentum feel visible through levels, streaks, and colourful progress cues.

The primary experience must feel welcoming on a phone, while remaining excellent as a desktop web app. The app should work as a responsive website and be easy to save or install: use a web app manifest, a service worker, and a clear browser install/bookmark path. Do not assume native mobile apps are required.

## Principles

- Make the next useful action obvious; avoid productivity-tool clutter.
- Use playful, warm visual feedback without infantilizing the user.
- Treat health, learning, focus, and personal routines as flexible quests—not rigid obligations.
- Support private, personal use first. Social/competitive features are optional and must never be required.
- Respect accessibility: semantic controls, keyboard access, readable contrast, responsive touch targets, and reduced-motion-safe effects.

## Free-first technical choices

- **Frontend:** React + Vite, deployed on a free static host (Cloudflare Pages, Netlify, or Vercel free tier).
- **Authentication and hosted database:** Supabase free tier. Email/password is the baseline; avoid paid identity providers.
- **API:** FastAPI. Keep it optional for an MVP when Supabase Row Level Security can safely own simple per-user data.
- **Installability:** browser PWA support, not an app-store dependency.
- Do not introduce a paid-only service or dependency without calling it out and providing a free alternative.

## Current state (July 2026)

- Supabase email/password authentication is wired through environment variables.
- The dashboard is a responsive interactive prototype: completing a quest updates the daily score and XP in-memory.
- A basic manifest/service worker enables installation when deployed over HTTPS.
- Generic template CRUD (`Example`/`items`) is legacy code and should be replaced before production use.

## Suggested next milestones

1. Create `quests`, `quest_completions`, and `profiles` tables in Supabase, with Row Level Security based on `auth.uid()`.
2. Replace in-memory dashboard data with the authenticated user’s data and add the custom-quest flow.
3. Add recurring schedule, XP rules, level progression, and a durable streak calculation.
4. Add onboarding, account recovery, confirmation-email handling, and deployed-environment configuration.
5. Test PWA install/offline behavior on Android/iOS and desktop browsers.

## Required environment variables

`frontend/.env.local` (never commit):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8000
```

`backend/.env` (never commit):

```env
DATABASE_URL=postgresql+psycopg2://...
SUPABASE_JWK_X=...
SUPABASE_JWK_Y=...
```
