-- Complete Supabase schema for Habits MVP
-- This creates all tables first, then sets up RLS policies
-- Run this in your Supabase SQL Editor

-- Step 1: Create all tables (in dependency order)

-- Profiles
create table if not exists public.profiles (
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

-- Friendships
create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  friend_id uuid references auth.users on delete cascade,
  status text check (status in ('pending','accepted','blocked')) default 'pending',
  created_at timestamptz default now(),
  unique (user_id, friend_id)
);

-- Squads
create table if not exists public.squads (
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

-- Squad members
create table if not exists public.squad_members (
  squad_id uuid references public.squads on delete cascade,
  user_id uuid references auth.users on delete cascade,
  role text check (role in ('owner','admin','member')) default 'member',
  joined_at timestamptz default now(),
  primary key (squad_id, user_id)
);

-- Habits
create table if not exists public.habits (
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

-- Habit logs
create table if not exists public.habit_logs (
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

-- Challenges (create before feed_events and challenge_participants)
create table if not exists public.challenges (
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

-- Challenge participants (create after challenges)
create table if not exists public.challenge_participants (
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

-- Feed events (references challenges, so create after challenges)
create table if not exists public.feed_events (
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

-- Reactions & comments
create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  log_id uuid references public.habit_logs on delete cascade,
  reaction_type text check (reaction_type in ('fire','clap','muscle','heart','rocket')) not null,
  created_at timestamptz default now(),
  unique (user_id, log_id, reaction_type)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  log_id uuid references public.habit_logs on delete cascade,
  text text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Stakes (references challenges)
create table if not exists public.stakes (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid references public.challenges on delete cascade,
  amount_cents integer not null,
  currency text default 'EUR',
  stake_type text check (stake_type in ('winner_takes_all','split_winners','charity')) default 'winner_takes_all',
  platform_fee_percent numeric default 7.5,
  created_at timestamptz default now()
);

create table if not exists public.stake_escrows (
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

-- Step 2: Create indexes
create index if not exists idx_feed_events_created on public.feed_events(created_at desc);
create index if not exists idx_feed_events_user on public.feed_events(user_id);

-- Step 3: Enable RLS and create policies (now that all tables exist)

-- Profiles policies
alter table public.profiles enable row level security;
drop policy if exists "Profiles readable" on public.profiles;
create policy "Profiles readable" on public.profiles for select using (true);
drop policy if exists "Profiles insertable by owner" on public.profiles;
create policy "Profiles insertable by owner" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "Profiles updatable by owner" on public.profiles;
create policy "Profiles updatable by owner" on public.profiles for update using (auth.uid() = id);

-- Friendships policies
alter table public.friendships enable row level security;
drop policy if exists "Manage own friendships" on public.friendships;
create policy "Manage own friendships" on public.friendships
  for all using (auth.uid() = user_id or auth.uid() = friend_id)
  with check (auth.uid() = user_id);

-- Squads policies
alter table public.squads enable row level security;
drop policy if exists "Squad visible to members or public" on public.squads;
create policy "Squad visible to members or public" on public.squads
  for select using (
    is_public = true
    or exists(
      select 1 from public.squad_members m
      where m.squad_id = squads.id and m.user_id = auth.uid()
    )
  );
drop policy if exists "Squads insertable by owner" on public.squads;
create policy "Squads insertable by owner" on public.squads for insert with check (auth.uid() = owner_id);
drop policy if exists "Squads updatable by owner" on public.squads;
create policy "Squads updatable by owner" on public.squads for update using (auth.uid() = owner_id);
drop policy if exists "Squads deletable by owner" on public.squads;
create policy "Squads deletable by owner" on public.squads for delete using (auth.uid() = owner_id);

-- Squad members policies
alter table public.squad_members enable row level security;
drop policy if exists "Manage own membership" on public.squad_members;
create policy "Manage own membership" on public.squad_members
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Habits policies
alter table public.habits enable row level security;
drop policy if exists "Manage own habits" on public.habits;
create policy "Manage own habits" on public.habits for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "Public habit visibility" on public.habits;
create policy "Public habit visibility" on public.habits for select using (is_public = true or buddy_user_id = auth.uid());

-- Habit logs policies
alter table public.habit_logs enable row level security;
drop policy if exists "Manage own logs" on public.habit_logs;
create policy "Manage own logs" on public.habit_logs for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "Buddy visibility" on public.habit_logs;
create policy "Buddy visibility" on public.habit_logs for select using (
  exists(
    select 1 from public.habits h
    where h.id = habit_logs.habit_id and h.buddy_user_id = auth.uid()
  )
);

-- Reactions policies
alter table public.reactions enable row level security;
drop policy if exists "Insert own reactions" on public.reactions;
create policy "Insert own reactions" on public.reactions for insert with check (auth.uid() = user_id);
drop policy if exists "Remove own reactions" on public.reactions;
create policy "Remove own reactions" on public.reactions for delete using (auth.uid() = user_id);
drop policy if exists "Read reactions" on public.reactions;
create policy "Read reactions" on public.reactions for select using (true);

-- Comments policies
alter table public.comments enable row level security;
drop policy if exists "Insert comment" on public.comments;
create policy "Insert comment" on public.comments for insert with check (auth.uid() = user_id);
drop policy if exists "Update/delete own comment" on public.comments;
create policy "Update/delete own comment" on public.comments for all using (auth.uid() = user_id);
drop policy if exists "Read comments" on public.comments;
create policy "Read comments" on public.comments for select using (true);

-- Feed events policies (can now reference challenges and challenge_participants)
alter table public.feed_events enable row level security;
drop policy if exists "Feed visibility" on public.feed_events;
create policy "Feed visibility" on public.feed_events for select using (
  user_id = auth.uid()
  or exists(select 1 from public.friendships f where f.user_id = auth.uid() and f.friend_id = feed_events.user_id and f.status = 'accepted')
  or exists(
    select 1 from public.squad_members sm1
    join public.squad_members sm2 on sm1.squad_id = sm2.squad_id
    where sm1.user_id = auth.uid() and sm2.user_id = feed_events.user_id
  )
);
drop policy if exists "Feed events insertable by owner" on public.feed_events;
create policy "Feed events insertable by owner" on public.feed_events for insert with check (auth.uid() = user_id);

-- Challenges policies (can now reference challenge_participants since it exists)
alter table public.challenges enable row level security;
drop policy if exists "Challenges readable" on public.challenges;
create policy "Challenges readable" on public.challenges for select using (
  visibility = 'public'
  or (visibility = 'link' and true)
  or creator_id = auth.uid()
  or exists(select 1 from public.challenge_participants cp where cp.challenge_id = challenges.id and cp.user_id = auth.uid())
);
drop policy if exists "Challenges insertable by creator" on public.challenges;
create policy "Challenges insertable by creator" on public.challenges for insert with check (auth.uid() = creator_id);
drop policy if exists "Challenges updatable by creator" on public.challenges;
create policy "Challenges updatable by creator" on public.challenges for update using (auth.uid() = creator_id);

-- Challenge participants policies
alter table public.challenge_participants enable row level security;
drop policy if exists "Challenge participants readable" on public.challenge_participants;
create policy "Challenge participants readable" on public.challenge_participants for select using (
  exists(select 1 from public.challenges c where c.id = challenge_participants.challenge_id and (c.visibility = 'public' or c.creator_id = auth.uid() or challenge_participants.user_id = auth.uid()))
);
drop policy if exists "Challenge participants insertable" on public.challenge_participants;
create policy "Challenge participants insertable" on public.challenge_participants for insert with check (auth.uid() = user_id);
drop policy if exists "Challenge participants updatable by owner" on public.challenge_participants;
create policy "Challenge participants updatable by owner" on public.challenge_participants for update using (auth.uid() = user_id);

-- Stakes policies
alter table public.stakes enable row level security;
drop policy if exists "Stakes readable" on public.stakes;
create policy "Stakes readable" on public.stakes for select using (
  exists(select 1 from public.challenges c where c.id = stakes.challenge_id and (c.visibility = 'public' or c.creator_id = auth.uid() or exists(select 1 from public.challenge_participants cp where cp.challenge_id = c.id and cp.user_id = auth.uid())))
);
drop policy if exists "Stakes insertable by challenge creator" on public.stakes;
create policy "Stakes insertable by challenge creator" on public.stakes for insert with check (
  exists(select 1 from public.challenges c where c.id = stakes.challenge_id and c.creator_id = auth.uid())
);

-- Stake escrows policies
alter table public.stake_escrows enable row level security;
drop policy if exists "Stake escrows readable by owner" on public.stake_escrows;
create policy "Stake escrows readable by owner" on public.stake_escrows for select using (auth.uid() = user_id);
drop policy if exists "Stake escrows insertable by owner" on public.stake_escrows;
create policy "Stake escrows insertable by owner" on public.stake_escrows for insert with check (auth.uid() = user_id);
drop policy if exists "Stake escrows updatable by owner" on public.stake_escrows;
create policy "Stake escrows updatable by owner" on public.stake_escrows for update using (auth.uid() = user_id);

-- Step 4: Create function and trigger for auto-profile creation
create or replace function public.handle_new_user()
returns trigger as $$
declare
  username_base text;
  final_username text;
  counter int := 0;
begin
  -- Generate username from email (part before @) or use user ID
  if new.email is not null and new.email != '' then
    username_base := lower(split_part(new.email, '@', 1));
    
    -- Remove special characters and ensure it's valid
    username_base := regexp_replace(username_base, '[^a-z0-9]', '', 'g');
    
    -- Ensure minimum length
    if length(username_base) < 3 then
      username_base := 'user' || substr(new.id::text, 1, 8);
    end if;
  else
    -- Fallback if no email
    username_base := 'user' || substr(new.id::text, 1, 8);
  end if;
  
  -- Try to find unique username (only if profile doesn't already exist)
  if not exists(select 1 from public.profiles where profiles.id = new.id) then
    final_username := username_base;
    while exists(select 1 from public.profiles where profiles.username = final_username) loop
      counter := counter + 1;
      final_username := username_base || counter::text;
    end loop;
    
    -- Insert profile
    insert into public.profiles (id, username, onboarding_completed)
    values (new.id, final_username, false);
  end if;
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function when a new user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
