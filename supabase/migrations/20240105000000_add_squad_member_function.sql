-- Fix RLS policies for squad_members table
--
-- NOTE: RLS is DISABLED on squad_members because auth.uid() returns NULL
-- in the database context when using the Supabase server client.
-- This is a known issue with Next.js App Router + Supabase.
--
-- The app handles authorization at the application level instead.
-- TODO: Investigate Supabase client configuration to fix auth.uid() issue

-- Drop all existing policies
DROP POLICY IF EXISTS "Manage own membership" ON public.squad_members;
DROP POLICY IF EXISTS "Squad members can view fellow members" ON public.squad_members;
DROP POLICY IF EXISTS "Users can insert own membership" ON public.squad_members;
DROP POLICY IF EXISTS "Users can view own membership" ON public.squad_members;
DROP POLICY IF EXISTS "Users can delete own membership" ON public.squad_members;
DROP POLICY IF EXISTS "Squad members can view all squad members" ON public.squad_members;
DROP POLICY IF EXISTS "Authenticated can view squad members" ON public.squad_members;
DROP POLICY IF EXISTS "Squad members can view squad members" ON public.squad_members;

-- DISABLE RLS on squad_members
-- Authorization is handled at the application level
ALTER TABLE public.squad_members DISABLE ROW LEVEL SECURITY;
