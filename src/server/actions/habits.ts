'use server';

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { habitSchema, logSchema } from "@/lib/validators";
import { calculateStreak } from "@/lib/habits/streak";

export async function createHabit(payload: unknown) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const validated = habitSchema.parse(payload);

  const { data: habit, error } = await supabase
    .from("habits")
    .insert({ ...validated, user_id: user.id })
    .select()
    .single();

  if (error) {
    // Provide more detailed error information
    const errorMessage = error.message || JSON.stringify(error);
    const errorCode = error.code || 'unknown';
    throw new Error(`Failed to create habit: ${errorMessage} (code: ${errorCode})`);
  }

  revalidatePath("/dashboard");
  return habit;
}

export async function checkIn(habitId: string, date: string, note?: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  logSchema.parse({
    habit_id: habitId,
    log_date: date,
    status: "done",
    note,
  });

  const { data: habit } = await supabase
    .from("habits")
    .select("*")
    .eq("id", habitId)
    .single();

  const { data: previousLog } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("habit_id", habitId)
    .eq("user_id", user.id)
    .order("log_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  const streak = calculateStreak(previousLog, date, habit?.frequency ?? "daily");

  const { data: log, error } = await supabase
    .from("habit_logs")
    .insert({
      habit_id: habitId,
      user_id: user.id,
      log_date: date,
      status: "done",
      note,
      streak_count: streak,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  await supabase.from("feed_events").insert({
    user_id: user.id,
    event_type: "check_in",
    habit_id: habitId,
    log_id: log.id,
    metadata: { streak_count: streak },
  });

  if ([7, 14, 30, 60, 90, 100].includes(streak)) {
    await supabase.from("feed_events").insert({
      user_id: user.id,
      event_type: "streak_milestone",
      habit_id: habitId,
      log_id: log.id,
      metadata: { streak_count: streak },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath(`/habits/${habitId}`);

  return log;
}

export async function completeOnboarding() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ onboarding_completed: true })
    .eq("id", user.id);

  if (error) {
    throw new Error(`Failed to complete onboarding: ${error.message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/onboarding");
}
