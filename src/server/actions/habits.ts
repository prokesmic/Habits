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

  // Database has 'emoji' column but form sends 'icon' (Lucide icon name)
  // Store the icon name in emoji field for now (will be used for display)
  const { icon, ...rest } = validated;
  const habitData = {
    ...rest,
    emoji: icon || rest.emoji || "✅", // Use icon as emoji, fallback to emoji field or default
    user_id: user.id,
  };

  const { data: habit, error } = await supabase
    .from("habits")
    .insert(habitData)
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

  const { data: log, error } = await supabase.rpc("check_in_habit", {
    p_habit_id: habitId,
    p_user_id: user.id,
    p_date: date,
    p_note: note,
  });

  if (error) {
    throw new Error(`Check-in failed: ${error.message}`);
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
