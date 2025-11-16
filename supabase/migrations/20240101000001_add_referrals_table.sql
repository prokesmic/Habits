-- Add referrals table for friend invitations
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid references auth.users on delete cascade,
  referred_email text not null,
  referral_code text not null,
  status text check (status in ('pending','accepted','expired')) default 'pending',
  created_at timestamptz default now(),
  accepted_at timestamptz
);

alter table public.referrals enable row level security;
drop policy if exists "Referrals readable by referrer" on public.referrals;
create policy "Referrals readable by referrer" on public.referrals
  for select using (referrer_id = auth.uid());
drop policy if exists "Referrals insertable by referrer" on public.referrals;
create policy "Referrals insertable by referrer" on public.referrals
  for insert with check (referrer_id = auth.uid());

