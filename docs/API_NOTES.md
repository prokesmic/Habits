# API & Data Notes

## Supabase Tables

| Table                   | Purpose                                                               | Key Columns / JSON                                      |
| ----------------------- | --------------------------------------------------------------------- | ------------------------------------------------------- |
| `profiles`              | User profile metadata                                                 | `username`, `premium_tier`, `onboarding_completed`      |
| `friendships`           | Buddy/follow relationships                                            | composite PK `(user_id, friend_id)`                     |
| `squads`                | Accountability groups                                                 | `invite_code`, `is_public`, `member_count`              |
| `squad_members`         | Membership join table                                                 | `role` (`owner`, `admin`, `member`)                     |
| `habits`                | Habit definitions                                                     | `frequency`, `target_days_per_week`, `buddy_user_id`    |
| `habit_logs`            | Daily check-ins                                                       | `status`, `note`, `streak_count`                        |
| `reactions`             | Emoji reactions on habit logs                                         | unique `(user_id, log_id, reaction_type)`               |
| `comments`              | Social comments on logs                                               | `text`, `log_id`                                        |
| `feed_events`           | Activity feed entries                                                 | `event_type`, `metadata` JSON                           |
| `challenges`            | Challenge definitions                                                 | `challenge_format`, `duration_days`, `visibility`       |
| `challenge_participants`| Users enrolled in challenges                                          | `score`, `completed_days`, `rank`                       |
| `stakes`                | Challenge stakes metadata                                             | `amount_cents`, `stake_type`, `platform_fee_percent`    |
| `stake_escrows`         | Stripe payment intents captured for stakes                           | `stripe_payment_intent_id`, `status`                    |
| `referrals`             | Referral tracking for viral loops                                     | `referrer_id`, `referral_code`, `status`                |
| `waitlist`              | Pre-launch waitlist entries                                           | `referral_code`, `referral_count`, `early_access`       |

## Server Action Contracts

### `createHabit(data)`
- **Input**: Matches `habitSchema` (see `src/lib/validators`).
- **Output**: `{ habit }` row from Supabase.
- **Side Effects**: Triggers dashboard revalidation.

### `checkIn({ habitId, date, note? })`
- **Validates** using `logSchema`.
- **Upserts** into `habit_logs` with auto streak calculation.
- **Creates** `feed_events` (types `check_in`, optionally `streak_milestone`).

### `addReaction({ logId, reaction_type })`
- Inserts into `reactions` table; revalidates dashboard.

### `inviteBuddy(email)`
- Inserts referral record, sends email via Resend stub.

### `createSquad({ name, description })`
- Creates `squads` row with unique invite code, adds creator as owner in `squad_members`.

### `createChallenge(data)`
- Persists challenge, auto-calculates `end_date`, joins creator as participant, optionally emits invite.

### `joinChallenge(challengeId)`
- Upsert into `challenge_participants`, adds feed event.

### `createStakeEscrow(stakeId, challengeId, amount)`
- Creates Stripe PaymentIntent (manual capture) and records `stake_escrows` row.

### `distributeStakePayout(challengeId)`
- Captures PaymentIntents, distributes transfers to winners, records platform revenue.

## Environment-Based Behaviour

- Analytics skip initialization when `NEXT_PUBLIC_POSTHOG_KEY` is missing or looks like a placeholder (`phc_xxx`).
- Server actions rely on Supabase Row Level Security; ensure policies match SQL blueprint.

## REST/Realtime Notes

- Realtime feed uses `supabase.channel('feed-events')` listening for `INSERT` on `feed_events`.
- Additional custom RPCs (e.g., notifications) can be defined as needed.

Keep this document updated when tables or server action contracts change.
