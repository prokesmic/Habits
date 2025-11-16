-- Migration to fix missing RLS policies and add auto-profile creation trigger
-- This fixes the onboarding screen errors

-- Add missing INSERT policy for profiles
drop policy if exists "Profiles insertable by owner" on public.profiles;
create policy "Profiles insertable by owner" on public.profiles 
  for insert with check (auth.uid() = id);

-- Add missing INSERT, UPDATE, DELETE policies for squads
drop policy if exists "Squads insertable by owner" on public.squads;
create policy "Squads insertable by owner" on public.squads 
  for insert with check (auth.uid() = owner_id);
drop policy if exists "Squads updatable by owner" on public.squads;
create policy "Squads updatable by owner" on public.squads 
  for update using (auth.uid() = owner_id);
drop policy if exists "Squads deletable by owner" on public.squads;
create policy "Squads deletable by owner" on public.squads 
  for delete using (auth.uid() = owner_id);

-- Add missing INSERT policy for feed_events
drop policy if exists "Feed events insertable by owner" on public.feed_events;
create policy "Feed events insertable by owner" on public.feed_events 
  for insert with check (auth.uid() = user_id);

-- Enable RLS and add policies for challenges
alter table public.challenges enable row level security;
drop policy if exists "Challenges readable" on public.challenges;
create policy "Challenges readable" on public.challenges for select using (
  visibility = 'public'
  or (visibility = 'link' and true)
  or creator_id = auth.uid()
  or exists(select 1 from public.challenge_participants cp where cp.challenge_id = challenges.id and cp.user_id = auth.uid())
);
drop policy if exists "Challenges insertable by creator" on public.challenges;
create policy "Challenges insertable by creator" on public.challenges 
  for insert with check (auth.uid() = creator_id);
drop policy if exists "Challenges updatable by creator" on public.challenges;
create policy "Challenges updatable by creator" on public.challenges 
  for update using (auth.uid() = creator_id);

-- Enable RLS and add policies for challenge_participants
alter table public.challenge_participants enable row level security;
drop policy if exists "Challenge participants readable" on public.challenge_participants;
create policy "Challenge participants readable" on public.challenge_participants for select using (
  exists(select 1 from public.challenges c where c.id = challenge_participants.challenge_id and (c.visibility = 'public' or c.creator_id = auth.uid() or challenge_participants.user_id = auth.uid()))
);
drop policy if exists "Challenge participants insertable" on public.challenge_participants;
create policy "Challenge participants insertable" on public.challenge_participants 
  for insert with check (auth.uid() = user_id);
drop policy if exists "Challenge participants updatable by owner" on public.challenge_participants;
create policy "Challenge participants updatable by owner" on public.challenge_participants 
  for update using (auth.uid() = user_id);

-- Enable RLS and add policies for stakes
alter table public.stakes enable row level security;
drop policy if exists "Stakes readable" on public.stakes;
create policy "Stakes readable" on public.stakes for select using (
  exists(select 1 from public.challenges c where c.id = stakes.challenge_id and (c.visibility = 'public' or c.creator_id = auth.uid() or exists(select 1 from public.challenge_participants cp where cp.challenge_id = c.id and cp.user_id = auth.uid())))
);
drop policy if exists "Stakes insertable by challenge creator" on public.stakes;
create policy "Stakes insertable by challenge creator" on public.stakes 
  for insert with check (
  exists(select 1 from public.challenges c where c.id = stakes.challenge_id and c.creator_id = auth.uid())
);

-- Enable RLS and add policies for stake_escrows
alter table public.stake_escrows enable row level security;
drop policy if exists "Stake escrows readable by owner" on public.stake_escrows;
create policy "Stake escrows readable by owner" on public.stake_escrows 
  for select using (auth.uid() = user_id);
drop policy if exists "Stake escrows insertable by owner" on public.stake_escrows;
create policy "Stake escrows insertable by owner" on public.stake_escrows 
  for insert with check (auth.uid() = user_id);
drop policy if exists "Stake escrows updatable by owner" on public.stake_escrows;
create policy "Stake escrows updatable by owner" on public.stake_escrows 
  for update using (auth.uid() = user_id);

-- Function to automatically create profile when user signs up
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

