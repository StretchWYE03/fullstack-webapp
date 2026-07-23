# Level Up

A responsive, installable self-improvement app foundation: daily quests, XP, streaks, and Supabase email/password authentication.

See [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) for the product direction, free-tier stack, setup variables, and recommended milestones.

## Run locally

1. Copy the frontend environment variables described in `PROJECT_CONTEXT.md` into `frontend/.env.local`.
2. In `frontend`, run `npm ci` then `npm run dev`.
3. Configure the backend `.env` if you want to use the role API, then install `backend/requirements.txt` and start FastAPI with Uvicorn.

The visible dashboard is currently an interactive UI prototype; quest changes reset after refresh until persistence is added.

