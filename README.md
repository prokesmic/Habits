# Habits

Habit tracker MVP engineered around social accountability, viral loops, and real monetization. The stack combines Next.js 16 (App Router), Supabase, Stripe, PostHog, and a Tailwind/shadcn UI layer to deliver a mobile-first web experience focused on squads, challenges, and stakes.

> 🚀 This repository is now the canonical location for the Habits project. Contributions are welcome—see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Table of Contents

1. [High-Level Overview](#high-level-overview)
2. [Tech Stack](#tech-stack)
3. [System Architecture](#system-architecture)
4. [Local Development](#local-development)
    - [Prerequisites](#prerequisites)
    - [Initial Setup](#initial-setup)
    - [Environment Variables](#environment-variables)
    - [Supabase Setup](#supabase-setup)
5. [Available Scripts](#available-scripts)
6. [Testing Strategy](#testing-strategy)
7. [Quality & Tooling](#quality--tooling)
8. [Deployment Notes](#deployment-notes)
9. [Documentation Map](#documentation-map)
10. [Contributing](#contributing)

## High-Level Overview

Habits is a social habit-tracking platform with:

- **Social Core** – squads, reactions, comments, activity feeds, and buddy invitations.
- **Challenges & Stakes** – 1v1 and group challenges backed by Stripe Connect escrow flows.
- **Onboarding** – guided three-step onboarding that seeds a habit, reminder, and social invite.
- **Growth Mechanisms** – referrals, public challenges, shareable recaps, and analytics instrumentation.
- **Monetization Ready** – subscription paywall plus real-money stakes.

## Tech Stack

| Layer              | Technology                                                                 |
| ------------------ | --------------------------------------------------------------------------- |
| Frontend           | Next.js 16 (App Router, React Server Components), TypeScript, Tailwind, shadcn/ui |
| State & Forms      | React Hook Form + Zod, Jotai/Zustand (planned usage)                        |
| Backend Services   | Supabase (Auth, Postgres, Storage, Realtime)                                |
| Payments           | Stripe + Stripe Connect (via server actions)                                |
| Analytics          | PostHog (client-side wrapper with opt-out in development)                   |
| Email              | Resend + React Email templates                                             |
| Testing            | Vitest + Testing Library, Playwright                                        |
| Tooling            | pnpm, ESLint, TypeScript, Turbopack                                         |

## System Architecture

The high-level architecture and feature breakdown live in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). It covers the App Router structure, server action flows, Supabase schema alignment, and planned Stripe Connect integrations.

## Local Development

### Prerequisites

- Node.js 20+
- pnpm (preferred)
- Supabase CLI (for migrations/seed)
- Optional: Stripe CLI, Playwright browsers (`npx playwright install`)

### Initial Setup

```bash
pnpm install
pnpm dev
```

The dev server runs at [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required keys:

| Variable                          | Description                                    |
| --------------------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`        | Supabase project URL                           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Supabase anon key                              |
| `SUPABASE_SERVICE_ROLE_KEY`       | Supabase service role (secure server actions)  |
| `NEXT_PUBLIC_POSTHOG_KEY`         | (Optional) PostHog key                         |
| `NEXT_PUBLIC_POSTHOG_HOST`        | (Optional) PostHog API host                    |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key                     |
| `STRIPE_SECRET_KEY`               | Stripe secret key                              |
| `STRIPE_WEBHOOK_SECRET`           | Stripe webhook secret                          |
| `STRIPE_CONNECT_CLIENT_ID`        | Stripe Connect client ID                       |
| `RESEND_API_KEY`                  | Resend API key                                 |

> ℹ️ If you are developing without PostHog credentials, leave the defaults—analytics will automatically noop in that case.

### Supabase Setup

1. Create a Supabase project and note the URL/keys above.
2. Run the SQL schema provided in [`docs/SUPABASE_SCHEMA.sql`](docs/SUPABASE_SCHEMA.sql) (download from the blueprint section or generate from the README snippet).
3. Optional: Seed demo squads and challenges using the statements in the same document.

## Available Scripts

| Command                | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `pnpm dev`             | Run Next.js in development mode (Turbopack).        |
| `pnpm build`           | Production build.                                   |
| `pnpm start`           | Run production build locally.                       |
| `pnpm lint`            | ESLint with zero-warning policy.                    |
| `pnpm typecheck`       | TypeScript project checks.                          |
| `pnpm test`            | Vitest unit/integration tests.                      |
| `pnpm test:e2e`        | Playwright end-to-end smoke suite.                  |

## Testing Strategy

- **Unit tests** (Vitest) cover utility logic such as streak calculations and stake fee splits.
- **E2E smoke tests** (Playwright) validate marketing and onboarding flows. Each contributor should install Playwright browsers via `npx playwright install` before running the suite.
- **CI-ready**: scripts are designed to plug into GitHub Actions or other CI tools (`lint`, `typecheck`, `test`, `build`).

## Quality & Tooling

- ESLint (`pnpm lint`) configured with zero-warning enforcement.
- TypeScript strict mode + path aliases.
- Tailwind with custom rounding tokens and app-wide base styles.
- Analytics wrapper guards against placeholder keys to keep console clean in development.

## Deployment Notes

- Built to target Vercel + Supabase, but any Next.js-compatible platform works.
- Ensure environment variables are configured in the hosting platform.
- Stripe Connect payouts require production-mode accounts and webhook endpoints.
- See **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** for end-to-end steps (Vercel frontend, optional Railway backend, and GitHub Actions CI).

## Documentation Map

| Document                             | Purpose                                                     |
| ------------------------------------ | ----------------------------------------------------------- |
| [`README.md`](README.md)             | High-level overview, setup instructions, scripts.           |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Contribution workflow, coding standards, review checklist.  |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | System architecture, routes, server actions, data model. |
| [`docs/FEATURES.md`](docs/FEATURES.md) | Feature spec, user flows, roadmap.                        |
| [`docs/API_NOTES.md`](docs/API_NOTES.md) | Supabase table notes, server action expectations.        |

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Branching and commit conventions.
- Adding Supabase migrations and seeds.
- Testing requirements before opening a PR.
- Code style and linting expectations.

Happy building! 🎉
