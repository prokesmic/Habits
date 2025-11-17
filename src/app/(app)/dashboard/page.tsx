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

  // Check profile and redirect to onboarding if needed
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("onboarding_completed, full_name")
    .eq("id", user.id)
    .single();

  // If profile doesn't exist or onboarding not completed, redirect immediately
  if (profileError || !profile || !profile.onboarding_completed) {
    redirect("/onboarding");
  }

  // Only fetch data if onboarding is completed
  const today = new Date().toISOString().split("T")[0];

  const { data: habits } = await supabase
    .from("habits")
    .select("id, title, emoji, frequency, target_days_per_week")
    .eq("user_id", user.id)
    .eq("archived", false);

  // Check which habits have been checked in today
  const { data: todayLogs } = await supabase
    .from("habit_logs")
    .select("habit_id")
    .eq("user_id", user.id)
    .eq("log_date", today)
    .eq("status", "done");

  const checkedInHabitIds = new Set((todayLogs ?? []).map(log => String(log.habit_id)));

  // Transform habits for dashboard
  const dashboardHabits = (habits ?? []).map((h) => {
    const row = h as unknown as HabitSupabaseRow;
    const idStr = String(row.id);
    const checkedIn = checkedInHabitIds.has(idStr);
    const currentStreak = Math.floor(Math.random() * 15);
    const mockSquadMembers = ["Emma", "John", "Sarah", "Mike", "Lisa"]
      .slice(0, Math.floor(Math.random() * 5) + 1)
      .map((name, i) => ({
        id: `member-${i}`,
        name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        checkedInToday: Math.random() > 0.4,
      }));

    return {
      id: idStr,
      name: row.title ?? "Habit",
      emoji: row.emoji ?? "✅",
      currentStreak,
      longestStreak: Math.floor(Math.random() * 60) + currentStreak,
      checkedInToday: checkedIn,
      squadMembers: mockSquadMembers,
      hasStake: Math.random() > 0.8,
      stakeAmount: Math.random() > 0.8 ? Math.floor(Math.random() * 50) + 10 : undefined,
    };
  });

  // Mock activity feed data
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
    {
      id: "activity-2",
      user: { name: "John" },
      habit: { name: "Read 30 mins", emoji: "📚" },
      reactions: 5,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: "activity-3",
      user: { name: "Sarah" },
      habit: { name: "Meditation", emoji: "🧘" },
      reactions: 4,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
    {
      id: "activity-4",
      user: { name: "Mike" },
      habit: { name: "Daily Walk", emoji: "🚶" },
      reactions: 3,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: "activity-5",
      user: { name: "Lisa" },
      habit: { name: "Journaling", emoji: "📝" },
      reactions: 6,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
  ];

  // Hot streaks (habits with 7+ day streaks)
  const hotStreaks = dashboardHabits
    .filter(h => h.currentStreak >= 7)
    .sort((a, b) => b.currentStreak - a.currentStreak)
    .slice(0, 5);

  // Mock achievements
  const mockAchievements = [
    { id: "1", name: "First Check-in", emoji: "🎯" },
    { id: "2", name: "7-Day Streak", emoji: "🔥" },
    { id: "3", name: "Early Bird", emoji: "🌅" },
    { id: "4", name: "Squad Leader", emoji: "👑" },
    { id: "5", name: "Consistency King", emoji: "⭐" },
    { id: "6", name: "Photo Pro", emoji: "📸" },
  ];

  const userName = profile?.full_name || user.email?.split("@")[0] || "User";
  const firstName = userName.split(" ")[0];
  const maxStreak = dashboardHabits.length > 0
    ? Math.max(...dashboardHabits.map(h => h.currentStreak))
    : 0;

  const hasActiveStakes = dashboardHabits.some(h => h.hasStake);
  const totalStakeAmount = dashboardHabits.reduce((sum, h) => sum + (h.stakeAmount || 0), 0);

  return (
    <div className="space-y-6">
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
        squadActiveNow={Math.floor(Math.random() * 8) + 2}
      />
    </div>
  );
}
