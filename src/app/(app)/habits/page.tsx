import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { HabitsDashboard } from "@/components/habits/HabitsDashboard";

export const dynamic = "force-dynamic";

export default async function HabitsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">
          You need to{" "}
          <Link href="/auth/sign-in" className="font-semibold text-blue-600">
            sign in
          </Link>{" "}
          to manage habits.
        </p>
      </div>
    );
  }

  // Get user profile for name
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name")
    .eq("id", user.id)
    .single();

  const userName = profile?.full_name || profile?.username || user.email?.split("@")[0] || "there";

  // Get habits with today's check-in status
  const today = new Date().toISOString().split("T")[0];

  const { data: habits } = await supabase
    .from("habits")
    .select(
      `
      id,
      title,
      emoji,
      description,
      frequency,
      requires_proof,
      has_stake,
      stake_amount,
      current_streak,
      longest_streak,
      habit_logs!inner(
        log_date,
        created_at
      )
    `,
    )
    .eq("user_id", user.id)
    .eq("archived", false)
    .order("created_at", { ascending: false });

  // Also get habits without logs
  const { data: allHabits } = await supabase
    .from("habits")
    .select(
      `
      id,
      title,
      emoji,
      description,
      frequency,
      requires_proof,
      has_stake,
      stake_amount,
      current_streak,
      longest_streak
    `,
    )
    .eq("user_id", user.id)
    .eq("archived", false)
    .order("created_at", { ascending: false });

  // Get today's logs separately
  const { data: todayLogs } = await supabase
    .from("habit_logs")
    .select("habit_id, log_date, created_at")
    .eq("user_id", user.id)
    .eq("log_date", today);

  // Merge habits with their check-in status
  const habitsWithLogs =
    allHabits?.map((habit) => {
      const todayLog = todayLogs?.find((log) => log.habit_id === habit.id);
      return {
        ...habit,
        requires_proof: habit.requires_proof ?? false,
        has_stake: habit.has_stake ?? false,
        stake_amount: habit.stake_amount ?? undefined,
        current_streak: habit.current_streak ?? 0,
        longest_streak: habit.longest_streak ?? 0,
        last_check_in: todayLog ? today : undefined,
        last_check_in_time: todayLog?.created_at,
      };
    }) || [];

  return <HabitsDashboard habits={habitsWithLogs} userName={userName} />;
}

