-- Fix squads SELECT policy to allow owners to view their own squads
-- This is needed because when creating a squad, the owner might not be a member yet
-- or the SELECT happens before the member is added

alter table public.squads enable row level security;
drop policy if exists "Squad visible to members or public" on public.squads;
create policy "Squad visible to members or public" on public.squads
  for select using (
    is_public = true
    or owner_id = auth.uid()  -- Allow owners to always see their squads
    or exists(
      select 1 from public.squad_members m
      where m.squad_id = squads.id and m.user_id = auth.uid()
    )
  );

