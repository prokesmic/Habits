# Habits

Habit tracker MVP focused on social accountability, viral loops, and real monetization. Built with Next.js 16 (App Router), Supabase, Stripe, PostHog, and a Tailwind/shadcn UI layer.

## Key Features
- Social core: squads, reactions, comments, and activity feed.
- 1v1 and group challenges with Stripe Connect stakes.
- Onboarding flow that seeds the user with habits and buddy invitations.
- Analytics hooks via PostHog plus referral instrumentation.
- Playwright/Vitest test scaffolding and GitHub Actions-ready scripts.

## Getting Started

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000) to explore the marketing landing page and authenticated app shell.

Set the required environment variables using `.env.example` before running Supabase-dependent flows.

## Scripts

- `pnpm dev` – run Next.js (Turbopack) locally.
- `pnpm lint` – lint with ESLint.
- `pnpm typecheck` – run TypeScript checks.
- `pnpm test` – execute Vitest unit tests.
- `pnpm test:e2e` – run Playwright end-to-end smoke tests.

## License

MIT
