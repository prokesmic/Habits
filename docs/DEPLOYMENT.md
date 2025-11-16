# Deployment Guide (Vercel + Railway + GitHub)

This project is designed to deploy the Next.js frontend (and serverless API routes) to Vercel. Optionally, you can deploy any long‑running backend services (e.g., websockets, background workers) to Railway.

## 1) Prerequisites

- GitHub repository (push this project)
- Vercel account (with GitHub integration)
- Optional: Railway account
- Environment variables ready (from your Supabase/Stripe/Resend/PostHog/etc.)

## 2) Connect GitHub → Vercel (Frontend)

1. Commit and push all code to a GitHub repository.
2. In Vercel dashboard → “Add New Project” → “Import Git Repository” → select your repo.
3. Framework: Next.js (detected automatically). The repo includes `vercel.json` (build uses `npm run build`).
4. Configure Environment Variables in Vercel (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_POSTHOG_KEY` (optional)
   - `NEXT_PUBLIC_POSTHOG_HOST` (optional, default: `https://app.posthog.com`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (optional)
   - `STRIPE_SECRET_KEY` (optional)
   - `STRIPE_WEBHOOK_SECRET` (optional)
   - `RESEND_API_KEY` (optional)
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` (optional)
5. Click “Deploy”. On success you’ll get a preview URL; promote to Production when ready.

Notes:
- Static assets are under `/public`.
- Serverless API routes are under `src/app/api/**/route.ts` and run on Vercel Functions automatically.
- If you see “workspace root” warnings, ensure there’s no conflicting lockfile in a higher directory. We’ve added `turbopack.root` to `next.config.ts`.

## 3) CI with GitHub Actions (Build/Test)

We’ve added `.github/workflows/ci.yml` to run install, typecheck, lint, and tests on PRs and pushes. Vercel will handle deployments after merges to the main branch once connected to your repo. Adjust Matrix Node versions as needed.

## 4) Optional: Railway (Long‑running Backend)

If you later add a dedicated Node service (e.g., websockets, background jobs), deploy it to Railway:

1. Create a `railway` folder (already present) with your service (e.g., `server.ts`) and a `Dockerfile` or `Procfile`.
2. In Railway dashboard, create a new project → “Deploy from Repo” (select the same GitHub repo).
3. Configure environment variables (e.g., `PORT`, `SUPABASE_SERVICE_ROLE_KEY`, `POSTGRES_URL`, etc.).
4. Expose the service and copy the public URL to `REALTIME_SERVER_URL` (set in Vercel project envs if the frontend needs it).

This repo doesn’t require a separate backend for basic features because Next.js API routes run on Vercel. Use Railway only if you need persistent connections or long‑running tasks.

## 5) Environment Variables Reference

Store secrets in Vercel/ Railway dashboards, not in git.

- `NEXT_PUBLIC_SUPABASE_URL` – your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase anon key
- `NEXT_PUBLIC_POSTHOG_KEY` (optional) – PostHog public key
- `NEXT_PUBLIC_POSTHOG_HOST` (optional) – defaults to `https://app.posthog.com`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` (optional)
- `RESEND_API_KEY` (optional) – email sending
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` (optional) – web push
- `REALTIME_SERVER_URL` (optional) – if you deploy a separate realtime backend

## 6) Local Development

```bash
cp .env.example .env.local   # if you create one locally; do not commit secrets
npm install
npm run dev
```

## 7) Troubleshooting

- Port already in use: kill running dev (`pkill -f "next dev"`), clear `.next`, re-run `npm run dev -p 3001`.
- Turbopack root warning: ensure no `package-lock.json` at a parent dir; or keep `turbopack.root` in `next.config.ts`.
- 500 on `/`: run dev in foreground and read the first stack trace lines; fix the offending import/route.


