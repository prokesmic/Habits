import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface CheckInProof {
  type: "simple" | "photo" | "note" | "integration";
  photoUrl?: string;
  note?: string;
  integrationData?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { habitId, proof, timestamp } = body as {
      habitId: string;
      proof?: CheckInProof;
      timestamp: string;
    };

    if (!habitId) {
      return NextResponse.json({ error: "Habit ID required" }, { status: 400 });
    }

    // Verify the habit belongs to the user
    const { data: habit, error: habitError } = await supabase
      .from("habits")
      .select("id, requires_proof, has_stake, current_streak, longest_streak")
      .eq("id", habitId)
      .eq("user_id", user.id)
      .single();

    if (habitError || !habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    // Check if already checked in today
    const today = new Date().toISOString().split("T")[0];
    const { data: existingLog } = await supabase
      .from("habit_logs")
      .select("id")
      .eq("habit_id", habitId)
      .eq("user_id", user.id)
      .eq("log_date", today)
      .single();

    if (existingLog) {
      return NextResponse.json({ error: "Already checked in today" }, { status: 400 });
    }

    // Validate proof if required
    if ((habit.requires_proof || habit.has_stake) && (!proof || proof.type === "simple")) {
      return NextResponse.json({ error: "Photo proof required for this habit" }, { status: 400 });
    }

    // Calculate new streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const { data: yesterdayLog } = await supabase
      .from("habit_logs")
      .select("id")
      .eq("habit_id", habitId)
      .eq("user_id", user.id)
      .eq("log_date", yesterdayStr)
      .single();

    const newStreak = yesterdayLog ? (habit.current_streak || 0) + 1 : 1;
    const newLongestStreak = Math.max(habit.longest_streak || 0, newStreak);

    // Create the check-in log
    const { data: newLog, error: logError } = await supabase
      .from("habit_logs")
      .insert({
        habit_id: habitId,
        user_id: user.id,
        log_date: today,
        status: "done",
        streak_count: newStreak,
        note: proof?.note,
        photo_url: proof?.photoUrl,
        proof_type: proof?.type || "simple",
        proof_metadata: proof?.integrationData ? { integrationData: proof.integrationData } : {},
        requires_verification: habit.has_stake || false,
        verification_status: habit.has_stake ? "pending" : null,
      })
      .select()
      .single();

    if (logError) {
      console.error("Error creating log:", logError);
      return NextResponse.json({ error: "Failed to create check-in" }, { status: 500 });
    }

    // Update habit streaks
    const { error: updateError } = await supabase
      .from("habits")
      .update({
        current_streak: newStreak,
        longest_streak: newLongestStreak,
        updated_at: new Date().toISOString(),
      })
      .eq("id", habitId);

    if (updateError) {
      console.error("Error updating streak:", updateError);
    }

    return NextResponse.json({
      success: true,
      log: newLog,
      streak: newStreak,
      longestStreak: newLongestStreak,
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json({ error: "Check-in failed" }, { status: 500 });
  }
}
