# Architecture Overview

This document breaks down the Habits application architecture, covering routes, server actions, data flows, and integration touchpoints.

## App Router Structure

```
src/app
├─ (marketing)/page.tsx        # Public landing page
├─ (auth)/                     # Auth layout & sign-in screen
│  ├─ layout.tsx
│  └─ sign-in/page.tsx
└─ (app)/                      # Authenticated shell
   ├─ layout.tsx               # Navigation + Supabase session fetch
   ├─ dashboard/page.tsx       # Daily checklist & activity feed
   ├─ onboarding/page.tsx      # 3-step onboarding flow
   ├─ habits/...
   ├─ squads/...
   ├─ challenges/...
   ├─ profile/page.tsx
   └─ settings/page.tsx
```

### Routing Principles

- **Public vs Authenticated**: `(marketing)` and `(auth)` are public; `(app)` requires a Supabase session and gatekeeps onboarding completion.
- **Nested segments**: Domain features (`habits`, `squads`, `challenges`) own their own pages and detail routes.
- **Client vs Server components**: Data-heavy pages are server components fetching from Supabase; interactive widgets (`ReactionButton`, onboarding steps) are client components.

## Supabase Integration

Supabase handles authentication, Postgres storage, storage buckets (future), and realtime notifications.

### Connection Utilities

- `src/lib/supabase/server.ts` uses `@supabase/ssr` to hydrate session cookies in server components/actions.
- `src/lib/supabase/client.ts` creates a browser client with persisted sessions for client hooks (e.g., realtime feed updates).

### Database Mapping

Key tables are documented in [`docs/API_NOTES.md`](API_NOTES.md). In summary:

- `profiles` – user metadata, onboarding status, premium flags.
- `habits` / `habit_logs` – core habit workflow with buddy visibility.
- `squads` / `squad_members` – group accountability structures.
- `challenges` / `challenge_participants` – competitions and leaderboards.
- `stakes` / `stake_escrows` – Stripe Connect escrow tracking.
- `feed_events`, `reactions`, `comments` – social activity stream.

## Server Actions

Server actions encapsulate write operations and integrate with Supabase/Stripe/Resend.

| File                            | Purpose                                                         |
| ------------------------------- | --------------------------------------------------------------- |
| `src/server/actions/habits.ts`  | Create habits, log check-ins, emit feed events + streaks.        |
| `src/server/actions/social.ts`  | Add reactions/comments, invite buddies, create squads.           |
| `src/server/actions/challenges.ts` | Create/join challenges, emit invites.                        |
| `src/server/actions/stakes.ts`  | Create Stripe payment intents, capture/release escrows.         |

All actions rely on `createClient()` (server) to enforce row-level security, and they expect Zod-validated payloads defined in `src/lib/validators`.

## UI Component Layers

- `src/components/cards/*` – Reusable UI for check-ins, challenges, reactions.
- `src/components/feed/ActivityFeed.tsx` – Client component subscribing to Supabase realtime feed.
- `src/components/onboarding/*` – Multistep onboarding wizard steps.
- `src/components/layout/AppProviders.tsx` – Bootstraps analytics and future client-side providers.

## Analytics Layer

`src/lib/analytics.ts` wraps PostHog initialization. Analytics only activates when real keys are provided, preventing dev-console noise. Tracking functions are used throughout onboarding and social flows to populate funnels.

## Future Enhancements

- Edge functions (Supabase) for complex analytics or scheduled stake evaluations.
- GitHub Actions workflow for automated lint/typecheck/test.
- Additional server actions for invitations, referrals, and Stripe webhook processing.

Refer to [`docs/FEATURES.md`](FEATURES.md) for roadmap details.
