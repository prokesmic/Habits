-- Migration: Add check_in_habit RPC function for transactional check-ins

CREATE OR REPLACE FUNCTION check_in_habit(
  p_habit_id UUID,
  p_user_id UUID,
  p_date DATE,
  p_note TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_habit_frequency TEXT;
  v_previous_log RECORD;
  v_streak INTEGER;
  v_log_id UUID;
  v_log JSONB;
BEGIN
  -- 1. Get habit details
  SELECT frequency INTO v_habit_frequency
  FROM habits
  WHERE id = p_habit_id AND user_id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Habit not found or access denied';
  END IF;

  -- 2. Check if already checked in
  IF EXISTS (
    SELECT 1 FROM habit_logs
    WHERE habit_id = p_habit_id AND user_id = p_user_id AND log_date = p_date
  ) THEN
    RAISE EXCEPTION 'Already checked in for this date';
  END IF;

  -- 3. Get previous log for streak calculation
  SELECT * INTO v_previous_log
  FROM habit_logs
  WHERE habit_id = p_habit_id AND user_id = p_user_id
  ORDER BY log_date DESC
  LIMIT 1;

  -- 4. Calculate streak (Simplified logic inside SQL, ideally matches TS logic)
  -- Note: This is a basic implementation. For complex "weekdays" logic, 
  -- we might need more complex SQL or rely on the passed-in streak if we trust the client/server.
  -- However, for data integrity, it's best to calculate here or trust the previous streak + logic.
  
  v_streak := 1;
  IF v_previous_log IS NOT NULL THEN
    DECLARE
      v_diff_days INTEGER;
    BEGIN
      v_diff_days := p_date - v_previous_log.log_date;
      
      IF v_habit_frequency = 'daily' THEN
        IF v_diff_days = 1 THEN
          v_streak := v_previous_log.streak_count + 1;
        ELSE
          v_streak := 1;
        END IF;
      ELSIF v_habit_frequency = 'weekdays' THEN
        -- Allow weekend gaps (Friday to Monday is 3 days diff)
        IF v_diff_days <= 3 THEN
           v_streak := v_previous_log.streak_count + 1;
        ELSE
           v_streak := 1;
        END IF;
      ELSE
        -- Custom frequency logic would go here, defaulting to 1 for now if gap > 1
        IF v_diff_days = 1 THEN
          v_streak := v_previous_log.streak_count + 1;
        ELSE
          v_streak := 1;
        END IF;
      END IF;
    END;
  END IF;

  -- 5. Insert Log
  INSERT INTO habit_logs (habit_id, user_id, log_date, status, note, streak_count)
  VALUES (p_habit_id, p_user_id, p_date, 'done', p_note, v_streak)
  RETURNING id, streak_count INTO v_log_id, v_streak;

  -- 6. Insert Feed Event (Check-in)
  INSERT INTO feed_events (user_id, event_type, habit_id, log_id, metadata)
  VALUES (p_user_id, 'check_in', p_habit_id, v_log_id, jsonb_build_object('streak_count', v_streak));

  -- 7. Insert Feed Event (Milestone) if applicable
  IF v_streak IN (7, 14, 30, 60, 90, 100) THEN
    INSERT INTO feed_events (user_id, event_type, habit_id, log_id, metadata)
    VALUES (p_user_id, 'streak_milestone', p_habit_id, v_log_id, jsonb_build_object('streak_count', v_streak));
  END IF;

  -- 8. Update Habit Stats
  UPDATE habits
  SET current_streak = v_streak,
      longest_streak = GREATEST(longest_streak, v_streak),
      updated_at = NOW()
  WHERE id = p_habit_id;

  -- Return the created log as JSON
  SELECT jsonb_build_object(
    'id', v_log_id,
    'streak_count', v_streak,
    'status', 'done',
    'log_date', p_date
  ) INTO v_log;

  RETURN v_log;
END;
$$;
