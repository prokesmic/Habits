-- Squad chat messages table
create table if not exists public.squad_messages (
  id uuid primary key default gen_random_uuid(),
  squad_id uuid references public.squads on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  content text not null,
  message_type text check (message_type in ('text', 'checkin', 'achievement', 'system')) default 'text',
  created_at timestamptz default now()
);

-- Index for efficient queries
create index if not exists idx_squad_messages_squad_id on public.squad_messages(squad_id);
create index if not exists idx_squad_messages_created_at on public.squad_messages(created_at);

-- RLS policies
alter table public.squad_messages enable row level security;

-- Members can view messages in their squads
create policy "Squad members can view messages"
  on public.squad_messages for select
  using (
    exists(
      select 1 from public.squad_members m
      where m.squad_id = squad_messages.squad_id and m.user_id = auth.uid()
    )
  );

-- Members can insert messages in their squads
create policy "Squad members can send messages"
  on public.squad_messages for insert
  with check (
    auth.uid() = user_id
    and exists(
      select 1 from public.squad_members m
      where m.squad_id = squad_messages.squad_id and m.user_id = auth.uid()
    )
  );

-- Users can delete their own messages
create policy "Users can delete own messages"
  on public.squad_messages for delete
  using (auth.uid() = user_id);
