import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SocialDashboard } from "@/components/dashboard/SocialDashboard";
import { NotificationPermissionPrompt } from "@/components/notifications/NotificationPermissionPrompt";
import { MoneyWidget } from "@/components/money/MoneyWidget";
import { StreakProtection } from "@/components/retention/StreakProtection";
import { AchievementsWidget } from "@/components/retention/Achievements";

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
    .select("onboarding_completed")
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

  // Transform habits for SocialDashboard
  const socialHabits = (habits ?? []).map((h) => {
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
      hasStake: Math.random() > 0.7,
      stakeAmount: Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 10 : undefined,
    };
  });

  // Mock activity feed data
  const mockActivities = [
    {
      id: "activity-1",
      type: "checkin" as const,
      user: { name: "Emma" },
      habit: { name: "Morning Workout", emoji: "💪" },
      proof: {
        photoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
        note: "Crushed it! 30 min HIIT session done.",
      },
      reactions: [
        { type: "🔥", count: 5, userReacted: false },
        { type: "💪", count: 3, userReacted: true },
      ],
      commentCount: 2,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "activity-2",
      type: "streak_milestone" as const,
      user: { name: "John" },
      habit: { name: "Read 30 mins", emoji: "📚" },
      metadata: { days: 30 },
      reactions: [
        { type: "👏", count: 12, userReacted: false },
        { type: "🔥", count: 8, userReacted: false },
      ],
      commentCount: 5,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: "activity-3",
      type: "checkin" as const,
      user: { name: "Sarah" },
      habit: { name: "Meditation", emoji: "🧘" },
      proof: {
        note: "15 minutes of mindfulness. Feeling centered.",
      },
      reactions: [
        { type: "❤️", count: 4, userReacted: false },
      ],
      commentCount: 1,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
  ];

  // Mock week progress
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const todayIndex = new Date().getDay();
  const adjustedTodayIndex = todayIndex === 0 ? 6 : todayIndex - 1;
  const weekProgress = weekDays.map((day, i) => ({
    day,
    completed: i <= adjustedTodayIndex ? Math.floor(Math.random() * (socialHabits.length + 1)) : 0,
    total: socialHabits.length,
  }));

  // Mock squad stats
  const squadStats = {
    activeMembers: Math.floor(Math.random() * 8) + 2,
    totalCheckInsToday: Math.floor(Math.random() * 20) + 5,
    topPerformer: {
      name: "Emma",
      checkIns: Math.floor(Math.random() * 5) + 3,
    },
  };

  // Top streaks from user's habits
  const topStreaks = socialHabits
    .filter(h => h.currentStreak > 0)
    .sort((a, b) => b.currentStreak - a.currentStreak)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <NotificationPermissionPrompt />
      <div className="grid gap-4 md:grid-cols-2">
        <MoneyWidget />
        <StreakProtection
          currentStreak={Math.max(...socialHabits.map(h => h.currentStreak), 0)}
          missedDaysThisWeek={Math.random() < 0.3 ? 1 : 0}
        />
      </div>
      <AchievementsWidget />

      <SocialDashboard
        habits={socialHabits}
        activities={mockActivities}
        weekProgress={weekProgress}
        squadStats={squadStats}
        topStreaks={topStreaks}
        hasActiveStakes={socialHabits.some(h => h.hasStake)}
        activeStakesAmount={socialHabits.reduce((sum, h) => sum + (h.stakeAmount || 0), 0)}
      />
    </div>
  );
}
