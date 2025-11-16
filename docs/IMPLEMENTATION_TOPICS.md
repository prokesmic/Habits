# Implementation Topics Roadmap

This document outlines the major topics we will implement/refine next. It acts as a checklist and high-level guide for both frontend and backend workstreams.

## 1) Frontend ⇄ Backend Integration
- API contract docs (request/response DTOs)
- Server Actions vs. REST/Route Handlers (performance, caching)
- Error handling patterns (user-facing vs. logging)
- RLS-aware queries (Supabase policies and UI fallbacks)
- Pagination, infinite scroll, and optimistic updates

## 2) Authentication, Profiles, and RLS
- Auth flow hardening (signup/login/reset)
- Profile bootstrap (triggers vs. upsert strategies)
- Row Level Security alignment for all tables (habits, squads, challenges, referrals, money)
- Session persistence and token refresh

## 3) Stripe Setup (Monetization & Payouts)
- Stripe account + Connect onboarding
- Webhooks (event verification, retries, idempotency keys)
- Escrow-like “stakes” flow (hold → resolve win/loss → payout/refund)
- Platform fees and reporting
- PCI and secure key management

## 4) Challenges Lifecycle
- Create/accept/decline/expire challenge
- Status transitions (pending → active → completed/expired)
- Stakes binding to challenge state
- Leaderboards and payout logic by format (1v1, squad, public)
- Anti-cheating and dispute workflows

## 5) Stakes & Escrow Logic
- Stake creation/edit/cancel rules
- Forfeiture conditions and win resolution
- Edge cases (ties, no-shows, incomplete rosters)
- Accounting consistency (double-entry style history)

## 6) Transactions & Wallet
- Transaction log (stake, win, payout, refund, fees)
- Aggregates (net income, pending, lifetime earnings)
- CSV export and date range filters
- Reconciliation jobs and alerts

## 7) Referral System (Growth Engine)
- Code generation & uniqueness
- Referral tracking: invited → signed_up → active
- Credits awarding (signup + milestones 3/10/25)
- Fraud prevention heuristics
- Referral dashboard and share tooling

## 8) Realtime & Chat (Engagement)
- Socket server (auth, rooms, rate limits)
- Message persistence & pagination
- Typing indicators, reactions, system events (check-ins, wins)
- Offline notifications bridge
- Moderation and safety tools

## 9) Notifications (Retention)
- Push subscription storage
- Preference center (per-type toggles, quiet hours)
- Daily reminders (cron) and real-time events (squad activity, challenges)
- Click tracking and delivery analytics
- Fallback channels (email/SMS) strategy (future)

## 10) Share Cards & Social
- Canvas generator performance (web worker, memoized assets)
- QR code/link deep linking
- Templates (streak, money, challenge, milestone)
- One-click share to major platforms (desktop/mobile parity)

## 11) Analytics & Experimentation
- Event taxonomy (check-in, challenge_sent, referral_share, payout)
- Funnel dashboards (activation, retention, monetization)
- A/B tests (modal frequency, copy, pricing)

## 12) Data Model & Migrations
- Finalize ERD for habits, logs, squads, challenges, finances, referrals
- Safe migrations (online, backward-compatible)
- Seed data for demos/e2e tests

## 13) Performance & Caching
- Route-level caching & revalidation
- Client-side memoization and virtualization
- Image optimization (avatars, share assets)
- DB indices and slow-query review

## 14) Security & Compliance
- Secrets management & environment separation
- RLS verification tests and least-privilege policies
- Webhook signature verification
- PII handling & data retention policy

## 15) Testing Strategy
- Unit tests (UI logic, helpers, share card functions)
- Integration tests (server actions, routes)
- E2E tests (onboarding → check-in → challenge → payout)
- Load tests for socket/chat and notification bursts

## 16) Deployment & Observability
- Environments: dev/staging/prod
- Logging & tracing (server actions, webhooks, sockets)
- Error monitoring/alerting
- Rollback plan and feature flags

## 17) Internationalization & Accessibility
- Date/number localization
- Copy externalization and future translations
- Keyboard navigation and screen-reader labels

## 18) Mobile & PWA Enhancements
- Home screen install prompts
- Offline states and caching strategy
- Safe-area insets & small-screen layout QA

---

### Quick Checklist
- [ ] Frontend/Backend API contracts finalized
- [ ] Stripe Connect + webhooks wired
- [ ] Challenge lifecycle + stakes resolution
- [ ] Wallet + transactions + payouts
- [ ] Referrals tracked and rewarded
- [ ] Realtime chat + notifications
- [ ] Share cards + social hooks
- [ ] RLS policies tested
- [ ] Tests & analytics in place
- [ ] Deployment & observability ready

---

## Outstanding Backend & Integration Tasks (Actionable)

1) Challenges & Stakes
- [ ] Server actions/route handlers to create/accept/decline/expire challenges
- [ ] Scheduled expiry job for pending challenges (>24h) and status transitions
- [ ] Stakes escrow logic: hold → resolve (win/loss/tie) → payout/refund
- [ ] Idempotent operations for stake updates (avoid duplicate charges/refunds)
- [ ] Leaderboards aggregation queries (global/squad/friends/local)

2) Stripe & Payouts
- [ ] Stripe Connect onboarding links and account status polling
- [ ] Webhooks: payment_intent.*, transfer.*, account.updated (verify signatures, idempotency)
- [ ] Payout queue + reconciliation job (handle failures/retries)
- [ ] Platform fee calculation + monthly reporting export
- [ ] Secure secrets management + environment separation

3) Referrals
- [ ] Referral code issuance on signup; uniqueness guarantee
- [ ] Referral tracking: invited → signed_up → active (first habit)
- [ ] Rewards: $5 signup both sides + milestones (3/10/25) awarding + audit log
- [ ] Fraud heuristics (device/email/IP checks) and dispute flow

4) Notifications
- [ ] Persist push subscriptions (user/device) and prune invalid ones
- [ ] send API (web-push) with quiet-hours check and per-type preferences
- [ ] Cron for daily reminders (per-user local time) + streak/milestone forecasting
- [ ] In-app notifications store and read/unread state

5) Realtime Chat
- [ ] Socket.io server: auth, room membership checks, rate limits (10/min)
- [ ] Message persistence, pagination, and basic moderation (delete/pin)
- [ ] Auto-post system messages for check-ins/achievements
- [ ] Offline push notifications for mentions/new messages

6) Share Cards
- [ ] Server-side/generated image endpoint (Edge Function/OG image) for reliable social sharing
- [ ] Asset caching and CDN, QR deep links to app routes
- [ ] Templates for money and challenge-won variants

7) Data Model & Migrations
- [ ] Finalize schema for money (stakes, transfers, fees), referrals, notifications, chat
- [ ] Comprehensive RLS for all new tables; tests to validate least privilege
- [ ] Indices for feed, transactions, chat, and leaderboards

8) Analytics & Events
- [ ] Event taxonomy implementation (check_in, challenge_sent, referral_share, payout)
- [ ] Backend logging for critical flows (webhooks, stake resolution, payouts)
- [ ] Dashboards for activation/retention/monetization funnels

9) Testing & Quality
- [ ] Unit tests for server actions, webhook handlers, and RLS policy expectations
- [ ] Integration tests for challenge lifecycle and stake resolution
- [ ] E2E for onboarding → check-in → challenge → payout path
- [ ] Load tests for sockets and notification bursts

10) Deployment & Ops
- [ ] Staging environment with test Stripe keys + seed data
- [ ] Observability/alerts on webhook failures and payout errors
- [ ] Rollback plan + feature flags for risky changes

---

## Outstanding Analytics Tasks (Actionable)

1) Performance/Overview
- [ ] Compute performance metrics from DB (habits/logs) for arbitrary periods (7/30/90d/year)
- [ ] Timezone-aware date windows; week starts (locale) and DST handling
- [ ] Cache layer for heavy aggregations (user+period key) with revalidation strategy
- [ ] Daily/weekday/hourly breakdown queries with proper indices

2) Habit Analytics & Predictions
- [ ] Habit-specific analytics API (success rate, gaps, perfect weeks/months)
- [ ] Prediction engine (risk days, probability) based on historical check-ins + streak bonus
- [ ] Integrate freeze/paid recovery into timeline and predictions
- [ ] “Best check-in time” heuristic from hourly distribution (per habit)

3) Money Analytics
- [ ] Compute total won/lost/net, ROI, win-rate across stake sizes/durations
- [ ] Timeline/cumulative net series and breakdown by category (fees, referrals, payouts)
- [ ] Backfill script to reconcile historical transactions into analytics tables

4) Social Analytics
- [ ] Squad/challenge/referral aggregations (rates, ranks, conversion)
- [ ] Influence score definition and computation (posts, reactions, comments, wins)
- [ ] Leaderboard data sources (global/squad/friends/local) with snapshots

5) Insights Engine
- [ ] Implement insight rules (pattern/achievement/recommendation/warning) in backend
- [ ] Priority scoring, de-duplication, and cap (top N) per user
- [ ] Action links and tracking (click-through) to measure impact

6) Export
- [ ] CSV/JSON export from real data; background job for large exports + email link
- [ ] PDF generation (Puppeteer/jsPDF) with visual charts and insights
- [ ] Rate limits, audit logs, and data privacy safeguards (PII scrub where needed)

7) API & Security
- [ ] Route handlers with auth & RLS checks; input validation (Zod)
- [ ] Pagination/streaming for large analytics payloads
- [ ] Service-level error handling and observability for analytics endpoints

8) UI/Charts
- [ ] Install `recharts` and verify SSR behavior (lazy-load on client to avoid hydration issues)
- [ ] A11y: color contrast, keyboard support, chart descriptions
- [ ] Mobile responsiveness and performance (virtualization where needed)

9) Testing
- [ ] Golden tests for aggregations (fixed fixtures → expected outputs)
- [ ] Contract tests for analytics API (schemas and edge cases)
- [ ] Visual QA for charts with seeded data (storybook/screenshots)


