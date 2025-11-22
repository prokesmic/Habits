-- Squad email invitations table
create table if not exists public.squad_invitations (
  id uuid primary key default gen_random_uuid(),
  squad_id uuid references public.squads on delete cascade not null,
  inviter_id uuid references auth.users on delete cascade not null,
  invitee_email text not null,
  token text unique not null,
  status text check (status in ('pending', 'accepted', 'expired', 'cancelled')) default 'pending',
  personal_message text,
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '7 days'),
  accepted_at timestamptz
);

-- Indexes for efficient queries
create index if not exists idx_squad_invitations_squad_id on public.squad_invitations(squad_id);
create index if not exists idx_squad_invitations_token on public.squad_invitations(token);
create index if not exists idx_squad_invitations_invitee_email on public.squad_invitations(invitee_email);

-- RLS policies
alter table public.squad_invitations enable row level security;

-- Squad members can view invitations for their squads
create policy "Squad members can view invitations"
  on public.squad_invitations for select
  using (
    exists(
      select 1 from public.squad_members m
      where m.squad_id = squad_invitations.squad_id and m.user_id = auth.uid()
    )
  );

-- Squad members can create invitations
create policy "Squad members can create invitations"
  on public.squad_invitations for insert
  with check (
    auth.uid() = inviter_id
    and exists(
      select 1 from public.squad_members m
      where m.squad_id = squad_invitations.squad_id and m.user_id = auth.uid()
    )
  );

-- Inviters can update their own invitations (cancel)
create policy "Inviters can update own invitations"
  on public.squad_invitations for update
  using (auth.uid() = inviter_id);

-- Anyone can read invitation by token (for acceptance flow)
create policy "Anyone can read invitation by token"
  on public.squad_invitations for select
  using (true);
