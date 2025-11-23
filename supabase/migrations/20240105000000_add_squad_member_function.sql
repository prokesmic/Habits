-- Fix RLS policies for squad_members table
-- The "for all" policy might not work correctly, so we explicitly define INSERT and SELECT policies

-- Drop existing policies
DROP POLICY IF EXISTS "Manage own membership" ON public.squad_members;
DROP POLICY IF EXISTS "Squad members can view fellow members" ON public.squad_members;
DROP POLICY IF EXISTS "Users can insert own membership" ON public.squad_members;
DROP POLICY IF EXISTS "Users can view own membership" ON public.squad_members;
DROP POLICY IF EXISTS "Users can delete own membership" ON public.squad_members;
DROP POLICY IF EXISTS "Squad members can view all squad members" ON public.squad_members;

-- Enable RLS
ALTER TABLE public.squad_members ENABLE ROW LEVEL SECURITY;

-- INSERT: Users can insert their own membership
CREATE POLICY "Users can insert own membership" ON public.squad_members
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- SELECT: Users can see their own memberships AND all members of squads they belong to
CREATE POLICY "Squad members can view all squad members" ON public.squad_members
  FOR SELECT
  USING (
    -- User can see their own membership
    user_id = auth.uid()
    OR
    -- User can see other members if they are in the same squad
    EXISTS (
      SELECT 1 FROM public.squad_members my_membership
      WHERE my_membership.squad_id = squad_members.squad_id
      AND my_membership.user_id = auth.uid()
    )
  );

-- UPDATE: Users can update their own membership
CREATE POLICY "Users can update own membership" ON public.squad_members
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can delete their own membership
CREATE POLICY "Users can delete own membership" ON public.squad_members
  FOR DELETE
  USING (auth.uid() = user_id);
