# Habitio - Complete Technical Documentation

> A social habit-tracking platform built for accountability, growth, and real monetization.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Database Schema](#database-schema)
6. [API Routes](#api-routes)
7. [Components](#components)
8. [Authentication](#authentication)
9. [Third-Party Integrations](#third-party-integrations)
10. [Server Actions](#server-actions)
11. [Testing](#testing)
12. [Deployment](#deployment)
13. [Environment Variables](#environment-variables)

---

## Project Overview

**Habitio** is a comprehensive social habit-tracking platform that combines:

- Modern Next.js 16 stack with React 19, TypeScript, and Tailwind CSS
- Supabase for authentication, PostgreSQL persistence, and real-time features
- Stripe & Stripe Connect for subscription billing and prize payouts
- Social accountability mechanisms (squads, reactions, activity feeds, buddy system)
- Monetization layers (subscription tiers, stakes/challenges with real money, referral rewards)

### Project Statistics

| Metric | Value |
|--------|-------|
| Total Files | 200+ source files |
| API Routes | 39 endpoints |
| Components | 100+ individual components |
| Database Tables | 15+ core tables |
| Lines of Code | ~22,000 |

---

## Tech Stack

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.1 | App Router, SSR/SSG, API routes |
| React | 19.2.0 | UI component library |
| TypeScript | 5.x | Static type checking |
| Tailwind CSS | 4.x | Utility-first CSS framework |

### UI & Forms

| Technology | Purpose |
|------------|---------|
| shadcn/ui + Radix UI | Accessible component primitives |
| React Hook Form | Form state management |
| Zod | Schema validation |
| Framer Motion | Animations |
| Lucide React | Icons |

### Backend & Database

| Technology | Purpose |
|------------|---------|
| Supabase | Auth, PostgreSQL, Storage, Realtime |
| @supabase/ssr | Server-side session management |

### State & Data

| Technology | Purpose |
|------------|---------|
| TanStack React Query | Server state management |
| Jotai | Atomic client state |
| Zustand | Store patterns |

### Payments & Analytics

| Technology | Purpose |
|------------|---------|
| Stripe | Payment processing |
| Stripe Connect | Payouts to winners |
| PostHog | Product analytics |

### Additional Services

| Technology | Purpose |
|------------|---------|
| Resend | Transactional emails |
| web-push | Push notifications |
| Socket.io | Real-time messaging |
| Chart.js / Recharts | Data visualization |
| Sharp | Image processing |

### Testing & Quality

| Technology | Purpose |
|------------|---------|
| Vitest | Unit testing |
| Playwright | E2E testing |
| ESLint | Code linting |

---

## Project Structure

```
/Users/michal/Habits/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (marketing)/              # Public landing page
│   │   ├── (auth)/                   # Authentication flows
│   │   ├── (app)/                    # Authenticated routes
│   │   │   ├── dashboard/            # Main dashboard
│   │   │   ├── habits/               # Habit management
│   │   │   ├── squads/               # Squad social groups
│   │   │   ├── challenges/           # Challenge system
│   │   │   ├── onboarding/           # 3-step onboarding
│   │   │   ├── profile/              # User profile
│   │   │   ├── settings/             # User settings
│   │   │   ├── analytics/            # Analytics dashboard
│   │   │   ├── notifications/        # Notification center
│   │   │   ├── referrals/            # Referral program
│   │   │   ├── money/                # Stakes management
│   │   │   └── admin/                # Admin dashboard
│   │   ├── api/                      # API routes
│   │   └── r/[code]/                 # Referral redirects
│   ├── components/                   # React components
│   │   ├── ui/                       # Base UI components
│   │   ├── dashboard/                # Dashboard components
│   │   ├── habits/                   # Habit components
│   │   ├── challenges/               # Challenge components
│   │   ├── squads/                   # Squad components
│   │   ├── activity/                 # Activity feed
│   │   ├── layout/                   # Layout shells
│   │   ├── analytics/                # Analytics charts
│   │   ├── achievements/             # Achievement displays
│   │   ├── referrals/                # Referral widgets
│   │   ├── support/                  # Support UI
│   │   ├── pwa/                      # PWA components
│   │   └── legal/                    # Legal pages
│   ├── lib/                          # Utility libraries
│   │   ├── supabase/                 # Supabase clients
│   │   ├── stripe/                   # Stripe integration
│   │   ├── analytics/                # PostHog wrapper
│   │   ├── notifications/            # Push notifications
│   │   ├── email/                    # Resend service
│   │   ├── integrations/             # Third-party (Strava)
│   │   ├── habits/                   # Streak calculation
│   │   ├── billing/                  # Subscription plans
│   │   ├── validators/               # Zod schemas
│   │   └── share/                    # Share cards, QR codes
│   ├── server/actions/               # Server actions
│   │   ├── habits.ts                 # Habit operations
│   │   ├── social.ts                 # Reactions, comments
│   │   ├── challenges.ts             # Challenge operations
│   │   ├── stakes.ts                 # Stake operations
│   │   └── onboarding.ts             # Onboarding flow
│   ├── types/                        # TypeScript types
│   └── data/                         # Mock data
├── supabase/migrations/              # Database migrations
├── docs/                             # Documentation
├── tests/                            # Test files
├── public/                           # Static assets
└── .github/workflows/                # CI/CD
```

---

## Features

### Core Habit Features

- **Habit Creation**: Title, emoji, description, frequency (daily/weekdays/custom), target days
- **Daily Check-ins**: Done/missed/skipped with optional notes and photos
- **Streak Tracking**: Current and longest streak with milestones (7, 14, 30, 60, 90, 100+)
- **Visibility Settings**: Public, private, or squad-specific
- **Reminders**: Optional notification times
- **Proof Requirements**: Photo/proof for high-stakes habits
- **Buddy System**: Assign accountability partners

### Social & Community

- **Squads**: Create/join groups with invite codes, roles, and chat
- **Reactions**: Fire, clap, muscle, heart, rocket on check-ins
- **Comments**: Threaded comments on activities
- **Activity Feeds**: Real-time stream of check-ins, milestones, challenges
- **Leaderboards**: Rankings by completion rate, streak, etc.

### Challenges & Stakes

- **Challenge Types**: Solo, 1v1, group, public
- **Duration**: 1-365 days with target completions
- **Stakes**: Monetary stakes via Stripe Connect
  - Winner takes all
  - Split winners
  - Charity donation
- **Escrow System**: Hold funds during challenge
- **Discovery**: Browse featured and trending challenges

### Monetization

**Subscription Tiers:**

| Tier | Price | Habits | Squads | Stakes | Features |
|------|-------|--------|--------|--------|----------|
| Free | $0 | 3 | 2 | 1 | Basic analytics, 90-day retention |
| Pro | $9.99/mo | 10 | 10 | 5 | Advanced analytics, integrations, AI coach |
| Premium | $19.99/mo | Unlimited | Unlimited | Unlimited | Custom branding, API access, priority support |

### Onboarding

1. Pick an initial habit (from templates or custom)
2. Set reminder time
3. Invite a buddy

### Growth Features

- **Referral Program**: Codes, tracking, leaderboard, rewards
- **Shareable Links**: `/r/[code]` referral redirects
- **QR Codes**: Challenge and squad sharing
- **Share Cards**: Visual achievement images

### Additional Features

- **Achievements System**: Badges for milestones
- **Push Notifications**: Reminders, squad activity, milestones
- **PWA Support**: Installable on mobile/desktop
- **Weekly/Monthly Recaps**: Shareable summaries
- **A/B Testing**: Experiment framework
- **Admin Panel**: User management, reports

---

## Database Schema

### Core Tables

#### profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  premium_tier TEXT DEFAULT 'free', -- free, premium, lifetime
  premium_expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### habits
```sql
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  emoji TEXT,
  description TEXT,
  frequency TEXT DEFAULT 'daily', -- daily, weekdays, custom
  target_days_per_week INTEGER,
  reminder_time TIME,
  buddy_user_id UUID REFERENCES auth.users,
  squad_id UUID REFERENCES squads,
  is_public BOOLEAN DEFAULT false,
  archived BOOLEAN DEFAULT false,
  requires_proof BOOLEAN DEFAULT false,
  has_stake BOOLEAN DEFAULT false,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### habit_logs
```sql
CREATE TABLE habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES habits NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  log_date DATE NOT NULL,
  status TEXT NOT NULL, -- done, missed, skipped
  note TEXT,
  photo_url TEXT,
  streak_count INTEGER DEFAULT 0,
  proof_type TEXT, -- simple, photo, note, integration
  proof_metadata JSONB,
  verification_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### squads
```sql
CREATE TABLE squads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  owner_id UUID REFERENCES auth.users NOT NULL,
  invite_code TEXT UNIQUE,
  is_public BOOLEAN DEFAULT false,
  member_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### squad_members
```sql
CREATE TABLE squad_members (
  squad_id UUID REFERENCES squads NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  role TEXT DEFAULT 'member', -- owner, admin, member
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (squad_id, user_id)
);
```

#### challenges
```sql
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  challenge_format TEXT NOT NULL, -- solo, 1v1, group, public
  duration_days INTEGER NOT NULL,
  target_completions INTEGER,
  habit_type TEXT,
  start_date DATE,
  end_date DATE,
  visibility TEXT DEFAULT 'private', -- private, link, public
  featured BOOLEAN DEFAULT false,
  participant_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft', -- draft, active, completed, cancelled
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### stakes
```sql
CREATE TABLE stakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES challenges NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD', -- EUR, USD, GBP
  stake_type TEXT NOT NULL, -- winner_takes_all, split_winners, charity
  platform_fee_percent NUMERIC DEFAULT 7.5,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### stake_escrows
```sql
CREATE TABLE stake_escrows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stake_id UUID REFERENCES stakes NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending', -- pending, held, released, refunded, failed
  payout_amount_cents INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  released_at TIMESTAMPTZ
);
```

#### reactions
```sql
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  log_id UUID REFERENCES habit_logs NOT NULL,
  reaction_type TEXT NOT NULL, -- fire, clap, muscle, heart, rocket
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, log_id, reaction_type)
);
```

#### feed_events
```sql
CREATE TABLE feed_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  event_type TEXT NOT NULL, -- check_in, streak_milestone, challenge_join, etc.
  habit_id UUID REFERENCES habits,
  log_id UUID REFERENCES habit_logs,
  challenge_id UUID REFERENCES challenges,
  squad_id UUID REFERENCES squads,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Row Level Security (RLS)

All tables have RLS enabled with policies for:
- **Profiles**: Readable to all, insertable/updatable by owner
- **Habits**: Manageable by owner, public visibility readable to all
- **Squads**: Visible to members or if public, manageable by owner
- **Challenges**: Visible based on visibility setting
- **Feed Events**: Visible to owner, friends, or squad members

---

## API Routes

### Public API (v1)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET/POST | `/api/v1/habits` | List/create habits |
| GET/PUT/DELETE | `/api/v1/habits/[id]` | Habit CRUD |
| POST | `/api/v1/habits/[id]/checkin` | Check-in endpoint |

### Habits & Check-ins

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET/POST | `/api/habits` | Habit management |
| POST | `/api/check-in` | Log check-in |
| POST | `/api/upload-proof` | Upload photo proof |

### Challenges & Squads

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET/POST | `/api/challenges` | Challenge listing/creation |
| GET/POST | `/api/squads` | Squad management |

### Analytics

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/analytics/insights` | User insights |
| GET | `/api/analytics/performance` | App metrics |
| GET | `/api/analytics/cohorts` | Cohort analysis |
| GET | `/api/analytics/export` | Data export |
| GET | `/api/analytics/funnels/[name]` | Funnel analytics |

### Admin

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/metrics` | System metrics |
| GET | `/api/admin/reports` | User reports |
| POST | `/api/admin/reports/resolve` | Resolve reports |

### Integrations

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/integrations` | List integrations |
| POST | `/api/integrations/authorize` | Start OAuth |
| GET | `/api/integrations/[provider]/auth` | OAuth callback |
| POST | `/api/integrations/[provider]/disconnect` | Disconnect |
| GET | `/api/integrations/strava/callback` | Strava OAuth |

### Referrals

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/referrals/info` | User referral info |
| GET | `/api/referrals/stats` | Statistics |
| GET | `/api/referrals/leaderboard` | Top referrers |
| GET | `/api/referrals/recent` | Recent referrals |

### Support & Notifications

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/notifications/subscribe` | Push subscription |
| POST | `/api/support/tickets` | Create ticket |
| POST | `/api/support/chat/messages` | Support chat |

### Workspaces

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET/POST | `/api/workspaces` | Workspace management |
| GET/PUT | `/api/workspaces/[id]` | Workspace details |
| GET/POST | `/api/workspaces/[id]/members` | Members |
| GET/POST | `/api/workspaces/[id]/challenges` | Challenges |
| GET | `/api/workspaces/[id]/analytics` | Analytics |

---

## Components

### Dashboard Components

| Component | Purpose |
|-----------|---------|
| `DailyChecklist.tsx` | Quick habit check-in list |
| `CheckInButton.tsx` | Mark habit as done |
| `DesktopDashboardClient.tsx` | Main dashboard layout |
| `RichActivityFeed.tsx` | Real-time activity stream |
| `StreakFreezeCard.tsx` | Streak protection |
| `StakesCard.tsx` | Active stakes display |
| `ProgressCard.tsx` | Progress visualization |

### Habit Components

| Component | Purpose |
|-----------|---------|
| `HabitForm.tsx` | Create/edit habit |
| `HabitCard.tsx` | Habit display card |
| `StreakDisplay.tsx` | Streak visualization |
| `TemplateLibraryModal.tsx` | Habit templates |

### Challenge Components

| Component | Purpose |
|-----------|---------|
| `ChallengeCard.tsx` | Challenge preview |
| `ChallengeForm.tsx` | Create challenge |
| `ChallengeLeaderboard.tsx` | Rankings |
| `ChallengeModal.tsx` | Challenge details |

### Social Components

| Component | Purpose |
|-----------|---------|
| `ReactionButton.tsx` | Add reactions |
| `CommentThread.tsx` | Comments |
| `ActivityFeed.tsx` | Activity stream |
| `SquadChat.tsx` | Real-time messaging |

### Layout Components

| Component | Purpose |
|-----------|---------|
| `TopNavigation.tsx` | Header navigation |
| `BottomNavigation.tsx` | Mobile nav |
| `SidebarNavigation.tsx` | Desktop sidebar |
| `AppProviders.tsx` | Global providers |

### UI Components (shadcn/ui)

| Component | Purpose |
|-----------|---------|
| `button.tsx` | Button variants |
| `card.tsx` | Card container |
| `avatar.tsx` | User avatars |
| `badge.tsx` | Status badges |
| `skeleton.tsx` | Loading states |

---

## Authentication

### System Overview

- **Provider**: Supabase Auth with @supabase/ssr
- **Methods**: Email/password, OAuth (Google, GitHub via Supabase config)
- **Session**: Server-side hydration, client-side real-time updates

### Flow

1. User signs up via email/password
2. `auth.users` entry created
3. `handle_new_user()` trigger creates profile
4. Username generated from email
5. `onboarding_completed` set to false
6. User completes onboarding wizard

### Protected Routes

- `(app)` layout requires authenticated session
- Redirects to `/auth/sign-in` if not logged in
- Onboarding check enforces completion before dashboard

### Supabase Clients

```typescript
// Server-side (src/lib/supabase/server.ts)
import { createClient } from '@/lib/supabase/server';
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

// Client-side (src/lib/supabase/client.ts)
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
```

---

## Third-Party Integrations

### Stripe

- **Payment Processing**: Subscriptions and one-time charges
- **Stripe Connect**: Seller onboarding and payouts
- **Payment Intents**: Secure payment creation
- **Webhooks**: Async event handling

### Strava

- **OAuth 2.0**: User authorization
- **Activity Sync**: Auto-sync workouts to check-ins
- **Token Refresh**: Automatic renewal
- **Webhook**: Activity updates

```typescript
// src/lib/integrations/strava.ts
class StravaIntegration {
  authorize(userId: string): string
  handleCallback(code: string, state: string): Promise<void>
  fetchActivities(userId: string): Promise<Activity[]>
  refreshToken(userId: string): Promise<void>
}
```

### Resend

- **Transactional Email**: Invites, notifications
- **React Email**: Type-safe templates

### PostHog

- **Product Analytics**: Behavior tracking
- **Feature Flags**: A/B testing
- **Custom Events**: Habit checks, challenge joins

### Web Push

- **VAPID**: Push notification standard
- **Features**: Reminders, alerts, milestones

---

## Server Actions

### habits.ts

```typescript
// Create new habit
createHabit(data: HabitInput): Promise<Habit>

// Log check-in with streak calculation
checkIn(data: CheckInInput): Promise<HabitLog>
```

**Check-in Flow:**
1. Validate input with Zod schema
2. Calculate streak (increment if previous day logged)
3. Create habit_log entry
4. Emit check_in feed event
5. Emit streak_milestone for special numbers (7, 14, 30, etc.)
6. Update habit streak counters

### social.ts

```typescript
addReaction(logId: string, type: ReactionType): Promise<void>
postComment(logId: string, text: string): Promise<Comment>
inviteBuddy(email: string, habitId: string): Promise<void>
```

### challenges.ts

```typescript
createChallenge(data: ChallengeInput): Promise<Challenge>
joinChallenge(challengeId: string): Promise<void>
completeChallenge(challengeId: string): Promise<void>
inviteToChallenge(challengeId: string, userId: string): Promise<void>
```

### stakes.ts

```typescript
createStake(data: StakeInput): Promise<Stake>
capturePayment(escrowId: string): Promise<void>
releaseStake(stakeId: string): Promise<void>
refundStake(escrowId: string): Promise<void>
```

---

## Testing

### Unit Tests (Vitest)

```bash
pnpm test           # Run tests
pnpm test:watch     # Watch mode
```

**Coverage:**
- Streak calculation logic
- Stake fee computations
- Validator schemas

### E2E Tests (Playwright)

```bash
npx playwright install  # Install browsers
pnpm test:e2e           # Run E2E tests
```

**Coverage:**
- Landing page load
- Auth flow (sign-up, sign-in)
- Onboarding flow
- Habit creation and check-in
- Challenge participation

### CI/CD

GitHub Actions runs on PR and push:
- Install dependencies
- Lint
- Type check
- Unit tests
- Build

---

## Deployment

### Build Commands

```bash
pnpm install    # Install dependencies
pnpm build      # Production build
pnpm start      # Run production server
```

### Deployment Targets

- **Frontend**: Vercel (serverless Next.js)
- **Database**: Supabase (managed PostgreSQL)
- **Payments**: Stripe

### Vercel Setup

1. Create project from GitHub repo
2. Configure environment variables
3. Enable preview deployments for PRs

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_CONNECT_CLIENT_ID=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Email
RESEND_API_KEY=

# Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=

# Integrations
STRAVA_CLIENT_ID=
STRAVA_CLIENT_SECRET=
```

---

## Scripts

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Development server |
| `pnpm dev:turbo` | Dev with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | TypeScript check |
| `pnpm test` | Unit tests |
| `pnpm test:e2e` | E2E tests |

---

## Architecture Decisions

### Why Next.js App Router?

- Server components for optimal performance
- Built-in API routes
- Server actions for mutations
- Streaming and suspense

### Why Supabase?

- Integrated auth with RLS
- PostgreSQL with full SQL power
- Real-time subscriptions
- Edge functions

### Why Stripe Connect?

- Handle multi-party payments
- Built-in compliance
- Instant payouts
- International support

### Why TanStack Query?

- Server state management
- Automatic caching
- Background refetching
- Optimistic updates

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Run `pnpm lint && pnpm typecheck && pnpm test`
5. Submit a pull request

---

## License

Proprietary - All rights reserved.

---

*Generated on November 19, 2025*
