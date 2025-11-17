-- Migration: Add proof and verification fields for check-ins
-- Run this in Supabase SQL Editor to upgrade your schema

-- Add proof fields to habit_logs
ALTER TABLE public.habit_logs
ADD COLUMN IF NOT EXISTS proof_type text CHECK (proof_type IN ('simple', 'photo', 'note', 'integration')) DEFAULT 'simple',
ADD COLUMN IF NOT EXISTS proof_metadata jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS requires_verification boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS verified_by uuid[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS disputed_by uuid[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS verification_status text CHECK (verification_status IN ('pending', 'approved', 'disputed'));

-- Add proof requirement fields to habits
ALTER TABLE public.habits
ADD COLUMN IF NOT EXISTS requires_proof boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS allowed_proof_types text[] DEFAULT ARRAY['simple', 'photo', 'note'],
ADD COLUMN IF NOT EXISTS has_stake boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS stake_amount decimal(10,2),
ADD COLUMN IF NOT EXISTS stake_participants uuid[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS current_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_streak integer DEFAULT 0;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_habit_logs_verification ON public.habit_logs(verification_status) WHERE requires_verification = true;
CREATE INDEX IF NOT EXISTS idx_habits_stakes ON public.habits(has_stake) WHERE has_stake = true;

-- Update RLS policy for habit_logs to allow squad members to verify
CREATE POLICY IF NOT EXISTS "Squad members can verify logs"
ON public.habit_logs
FOR UPDATE
USING (
  -- User can verify if they're in the same squad as the habit owner
  EXISTS (
    SELECT 1 FROM public.habits h
    JOIN public.squad_members sm1 ON h.squad_id = sm1.squad_id
    JOIN public.squad_members sm2 ON sm1.squad_id = sm2.squad_id
    WHERE h.id = habit_logs.habit_id
    AND sm1.user_id = habit_logs.user_id
    AND sm2.user_id = auth.uid()
  )
)
WITH CHECK (
  -- Only allow updating verification fields
  requires_verification = OLD.requires_verification
  AND proof_type = OLD.proof_type
  AND proof_metadata = OLD.proof_metadata
);

COMMENT ON COLUMN public.habit_logs.proof_type IS 'Type of proof provided: simple, photo, note, or integration';
COMMENT ON COLUMN public.habit_logs.proof_metadata IS 'Additional metadata like EXIF data, GPS coordinates, integration data';
COMMENT ON COLUMN public.habit_logs.verification_status IS 'For habits with stakes - pending/approved/disputed';
COMMENT ON COLUMN public.habits.requires_proof IS 'Whether this habit requires photo/proof for check-in';
COMMENT ON COLUMN public.habits.has_stake IS 'Whether this habit has money on the line (de-emphasized feature)';
