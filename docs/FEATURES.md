# Feature Overview & Roadmap

## Implemented Features

### Marketing & Onboarding
- Landing page with hero stats, feature teasers, and CTA to sign in.
- Three-step onboarding: pick a habit, set reminder, invite a buddy.
- Confetti celebration and analytics tracking on onboarding completion.

### Habits
- Habit listing with quick access to creation form.
- Habit detail page with recent check-ins and streak indicators.
- Check-in server action that enforces one log per day and generates feed events.

### Squads & Social
- Squad directory page listing member squads and featured public squads.
- Squad creation flow with invite code generation.
- Reactions and comments on check-ins (client-side button + server actions).
- Activity feed subscribing to Supabase realtime events.

### Challenges & Stakes
- Challenge discovery (featured + trending public challenges).
- Challenge creation modal (supports solo, 1v1, group, public).
- Challenge detail page with leaderboard placeholder.
- Stake server actions ready for Stripe Connect escrow flows.

### Profiles & Settings
- Profile page summarizing user metadata and premium tier.
- Settings page placeholder for notification and account preferences.

### Tooling & Testing
- Lint/typecheck/test scripts with zero-warning lint policy.
- Vitest unit tests for streak calculation and stake fee helper.
- Playwright smoke test for landing page load.

## Planned Enhancements

| Category      | Enhancement                                                             | Priority |
| ------------- | ------------------------------------------------------------------------ | -------- |
| Habits        | Calendar heatmap, buddy-specific visibility controls                     | High     |
| Squads        | Realtime feed cards (Supabase realtime channel)                          | High     |
| Challenges    | Full leaderboard calculation, invitation flows, challenge recap shares  | High     |
| Monetization  | Stripe onboarding for Connect accounts, webhook handlers                 | High     |
| Growth        | Referral dashboard, public challenge landing pages                       | Medium   |
| Analytics     | PostHog funnel dashboards, Retention/Activation events                   | Medium   |
| Testing       | Playwright coverage for onboarding, habit creation, challenge join       | Medium   |
| Infrastructure| GitHub Actions CI (lint/typecheck/test/build)                            | Medium   |
| Mobile UX     | Bottom nav for small screens, improved gesture interactions              | Medium   |

## User Flows

1. **New user onboarding**: Land ➜ Sign in ➜ Pick habit ➜ Set reminder ➜ Invite buddy ➜ Dashboard.
2. **Daily check-in**: Dashboard ➜ Tap habit ➜ Server action logs entry ➜ Feed updates ➜ Buddy reacts.
3. **Challenge participation**: Browse discover ➜ Join public challenge ➜ Compete with stakes.
4. **Squad accountability**: Create squad ➜ Invite friends ➜ Share check-ins ➜ Nudge via reactions/comments.

## Growth & Viral Loops

- Referral links generated via `referrals` table (server action stub).
- Shareable weekly recap copy baked into marketing and roadmap.
- Featured public challenges designed to onboard cold users quickly.

Contribute ideas by opening an issue or updating this document via PR.
