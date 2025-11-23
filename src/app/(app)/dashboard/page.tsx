import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DesktopDashboardClient } from "@/components/dashboard/DesktopDashboardClient";
import { NotificationPermissionPrompt } from "@/components/notifications/NotificationPermissionPrompt";

export const dynamic = "force-dynamic";

type HabitSupabaseRow = {
  id: string | number;
  title: string;
  emoji: string | null;
  frequency: string;
  target_days_per_week: number | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth/sign-in");
  }

  // Parallelize initial checks
  const [profileResponse, habitsResponse] = await Promise.all([
    supabase
      .from("profiles")
      .select("onboarding_completed, full_name")
      .eq("id", user.id)
      .single(),
    supabase
      .from("habits")
      .select("id, title, emoji, frequency, target_days_per_week, current_streak, longest_streak, has_stake")
      .eq("user_id", user.id)
      .eq("archived", false)
  ]);

  const { data: profile, error: profileError } = profileResponse;

  // If profile doesn't exist or onboarding not completed, redirect immediately
  if (profileError || !profile || !profile.onboarding_completed) {
    redirect("/onboarding");
  }

  const { data: habits } = habitsResponse;

  // Use UTC date for consistency
  const today = new Date().toISOString().split("T")[0];

  // Fetch logs for today
  const { data: todayLogs } = await supabase
    .from("habit_logs")
    .select("habit_id")
    .eq("user_id", user.id)
    .eq("log_date", today)
    .eq("status", "done");

  const checkedInHabitIds = new Set((todayLogs ?? []).map(log => String(log.habit_id)));

  // Transform habits for dashboard
  const dashboardHabits = (habits ?? []).map((h) => {
    const idStr = String(h.id);
    const checkedIn = checkedInHabitIds.has(idStr);

    // Use real data where available, fallback to safe defaults
    // TODO: Replace mock squad members with real relation
    const mockSquadMembers = ["Emma", "John", "Sarah"]
      .map((name, i) => ({
        id: `member-${i}`,
        name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        checkedInToday: Math.random() > 0.4,
      }));

    return {
      id: idStr,
      name: h.title ?? "Habit",
      emoji: h.emoji ?? "✅",
      currentStreak: h.current_streak ?? 0,
      longestStreak: h.longest_streak ?? 0,
      checkedInToday: checkedIn,
      squadMembers: mockSquadMembers,
      hasStake: h.has_stake ?? false,
      stakeAmount: h.has_stake ? 50 : undefined, // Placeholder until stakes table linked
    };
  });

  // Mock activity feed data (TODO: Replace with real feed_events fetch)
  const mockActivities = [
    {
      id: "activity-1",
      user: { name: "Emma" },
      habit: { name: "Morning Workout", emoji: "💪" },
      proof: {
        photoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
      },
      reactions: 8,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  ];

  // Hot streaks (habits with 7+ day streaks)
  const hotStreaks = dashboardHabits
    .filter(h => h.currentStreak >= 7)
    .sort((a, b) => b.currentStreak - a.currentStreak)
    .slice(0, 5);

  // Mock achievements (TODO: Replace with real achievements)
  const mockAchievements = [
    { id: "1", name: "First Check-in", emoji: "🎯" },
    { id: "2", name: "7-Day Streak", emoji: "🔥" },
  ];

  const userName = profile?.full_name || user.email?.split("@")[0] || "User";
  const firstName = userName.split(" ")[0];
  const maxStreak = dashboardHabits.length > 0
    ? Math.max(...dashboardHabits.map(h => h.currentStreak))
    : 0;

  const hasActiveStakes = dashboardHabits.some(h => h.hasStake);
  const totalStakeAmount = dashboardHabits.reduce((sum, h) => sum + (h.stakeAmount || 0), 0);

  return (
    <>
      <NotificationPermissionPrompt />

      <DesktopDashboardClient
        user={{
          firstName,
          totalStreak: maxStreak,
        }}
        habits={dashboardHabits}
        activities={mockActivities}
        hotStreaks={hotStreaks}
        achievements={mockAchievements}
        stakes={hasActiveStakes ? { count: dashboardHabits.filter(h => h.hasStake).length, totalAmount: totalStakeAmount } : null}
        squadActiveNow={3}
      />
    </>
  );
}
