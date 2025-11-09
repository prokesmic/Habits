-- Supabase schema for Habits MVP
-- Run in the Supabase SQL editor or via `supabase db remote commit`

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  premium_tier text check (premium_tier in ('free','premium','lifetime')) default 'free',
  premium_expires_at timestamptz,
  stripe_customer_id text,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Profiles readable" on public.profiles for select using (true);
create policy "Profiles updatable by owner" on public.profiles for update using (auth.uid() = id);

-- Friendships
create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  friend_id uuid references auth.users on delete cascade,
  status text check (status in ('pending','accepted','blocked')) default 'pending',
  created_at timestamptz default now(),
  unique (user_id, friend_id)
);

alter table public.friendships enable row level security;
create policy "Manage own friendships" on public.friendships
  for all using (auth.uid() = user_id or auth.uid() = friend_id)
  with check (auth.uid() = user_id);

-- Squads
create table public.squads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  avatar_url text,
  owner_id uuid references auth.users on delete cascade,
  invite_code text unique not null,
  is_public boolean default false,
  member_count integer default 1,
  created_at timestamptz default now()
);

alter table public.squads enable row level security;
create policy "Squad visible to members or public" on public.squads
  for select using (
    is_public = true
    or exists(
      select 1 from public.squad_members m
      where m.squad_id = squads.id and m.user_id = auth.uid()
    )
  );

create table public.squad_members (
  squad_id uuid references public.squads on delete cascade,
  user_id uuid references auth.users on delete cascade,
  role text check (role in ('owner','admin','member')) default 'member',
  joined_at timestamptz default now(),
  primary key (squad_id, user_id)
);

alter table public.squad_members enable row level security;
create policy "Manage own membership" on public.squad_members
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Habits
create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  title text not null,
  emoji text default '✅',
  description text,
  frequency text check (frequency in ('daily','weekdays','custom')) default 'daily',
  target_days_per_week integer default 7,
  reminder_time time,
  buddy_user_id uuid references auth.users,
  squad_id uuid references public.squads,
  is_public boolean default true,
  archived boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.habits enable row level security;
create policy "Manage own habits" on public.habits for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Public habit visibility" on public.habits for select using (is_public = true or buddy_user_id = auth.uid());

-- Habit logs
create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid references public.habits on delete cascade,
  user_id uuid references auth.users on delete cascade,
  log_date date not null,
  status text check (status in ('done','missed','skipped')) default 'done',
  note text,
  photo_url text,
  streak_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (habit_id, log_date)
);

alter table public.habit_logs enable row level security;
create policy "Manage own logs" on public.habit_logs for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Buddy visibility" on public.habit_logs for select using (
  exists(
    select 1 from public.habits h
    where h.id = habit_logs.habit_id and h.buddy_user_id = auth.uid()
  )
);

-- Reactions & comments
create table public.reactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  log_id uuid references public.habit_logs on delete cascade,
  reaction_type text check (reaction_type in ('fire','clap','muscle','heart','rocket')) not null,
  created_at timestamptz default now(),
  unique (user_id, log_id, reaction_type)
);

alter table public.reactions enable row level security;
create policy "Insert own reactions" on public.reactions for insert with check (auth.uid() = user_id);
create policy "Remove own reactions" on public.reactions for delete using (auth.uid() = user_id);
create policy "Read reactions" on public.reactions for select using (true);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  log_id uuid references public.habit_logs on delete cascade,
  text text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.comments enable row level security;
create policy "Insert comment" on public.comments for insert with check (auth.uid() = user_id);
create policy "Update/delete own comment" on public.comments for all using (auth.uid() = user_id);
create policy "Read comments" on public.comments for select using (true);

-- Feed events
create table public.feed_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  event_type text check (event_type in (
    'check_in','streak_milestone','challenge_join','challenge_complete','buddy_added','squad_join','challenge_invite'
  )) not null,
  habit_id uuid references public.habits,
  log_id uuid references public.habit_logs,
  challenge_id uuid references public.challenges,
  squad_id uuid references public.squads,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index idx_feed_events_created on public.feed_events(created_at desc);
create index idx_feed_events_user on public.feed_events(user_id);

alter table public.feed_events enable row level security;
create policy "Feed visibility" on public.feed_events for select using (
  user_id = auth.uid()
  or exists(select 1 from public.friendships f where f.user_id = auth.uid() and f.friend_id = feed_events.user_id and f.status = 'accepted')
  or exists(
    select 1 from public.squad_members sm1
    join public.squad_members sm2 on sm1.squad_id = sm2.squad_id
    where sm1.user_id = auth.uid() and sm2.user_id = feed_events.user_id
  )
);

-- Challenges & stakes (abridged)
create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references auth.users on delete cascade,
  name text not null,
  description text,
  challenge_format text check (challenge_format in ('solo','1v1','group','public')) default 'group',
  opponent_id uuid references auth.users,
  duration_days integer not null,
  target_completions integer not null,
  habit_type text,
  start_date date not null,
  end_date date not null,
  visibility text check (visibility in ('private','link','public')) default 'link',
  featured boolean default false,
  participant_count integer default 0,
  status text check (status in ('draft','active','completed','cancelled')) default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.challenge_participants (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid references public.challenges on delete cascade,
  user_id uuid references auth.users on delete cascade,
  joined_at timestamptz default now(),
  completed_days integer default 0,
  total_days integer default 0,
  score numeric default 0,
  rank integer,
  unique (challenge_id, user_id)
);

create table public.stakes (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid references public.challenges on delete cascade,
  amount_cents integer not null,
  currency text default 'EUR',
  stake_type text check (stake_type in ('winner_takes_all','split_winners','charity')) default 'winner_takes_all',
  platform_fee_percent numeric default 7.5,
  created_at timestamptz default now()
);

create table public.stake_escrows (
  id uuid primary key default gen_random_uuid(),
  stake_id uuid references public.stakes on delete cascade,
  user_id uuid references auth.users on delete cascade,
  amount_cents integer not null,
  currency text default 'EUR',
  stripe_payment_intent_id text unique,
  status text check (status in ('pending','held','released','refunded','failed')) default 'pending',
  payout_amount_cents integer,
  created_at timestamptz default now(),
  released_at timestamptz
);

-- Additional tables: referrals, waitlist (omitted for brevity)
