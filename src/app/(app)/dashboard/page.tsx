import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { RichActivityFeed } from "@/components/dashboard/RichActivityFeed";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { DailyChecklist } from "@/components/dashboard/DailyChecklist";
import type { ChecklistItemData } from "@/components/dashboard/ChecklistItem";
import { FeaturedSquads } from "@/components/dashboard/FeaturedSquads";
import { EmptyStateCTA } from "@/components/dashboard/EmptyStateCTA";
import { CheckInButton } from "@/components/dashboard/CheckInButton";
import { ReferralWidget } from "@/components/referrals/ReferralWidget";
import { NotificationPermissionPrompt } from "@/components/notifications/NotificationPermissionPrompt";
import { MoneyWidget } from "@/components/money/MoneyWidget";
import { StreakProtection } from "@/components/retention/StreakProtection";
import { AchievementsWidget } from "@/components/retention/Achievements";

type HabitSupabaseRow = {
  id: string | number;
  title: string;
  emoji: string | null;
  frequency: string;
  target_days_per_week: number | null;
};

type SquadSupabaseRow = {
  role?: string;
  squad?: {
    id: string | number;
    name: string;
    member_count: number | null;
  } | null;
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

  const { data: squads } = await supabase
    .from("squad_members")
    .select("role, squad:squads(id, name, member_count)")
    .eq("user_id", user.id);

  // Build checklist items with mock squad member activity (placeholder)
  const checklistItems: ChecklistItemData[] = (habits ?? []).map((h) => {
    const row = h as unknown as HabitSupabaseRow;
    const idStr = String(row.id);
    const checkedIn = checkedInHabitIds.has(idStr);
    const mockCheckedNames = ["Emma", "John", "Sarah"].slice(0, Math.floor(Math.random() * 3) + 1);
    return {
      habit: {
        id: idStr,
        name: row.title ?? "Habit",
        emoji: row.emoji ?? "✅",
        frequency: (row.frequency as any) ?? "daily",
        targetPerWeek: (row.target_days_per_week as any) ?? 0,
        currentStreak: Math.floor(Math.random() * 15),
        longestStreak: Math.floor(Math.random() * 60) + 10,
        squads: [],
        visibility: "private",
        checkIns: [],
      },
      checkedInToday: checkedIn,
      squadMembers: {
        totalMembers: 5,
        checkedInMembers: mockCheckedNames.map((n) => ({
          name: n,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=random`,
        })),
      },
    };
  });

  const habitRows = (habits ?? []).map((habit) => {
    const row = habit as unknown as HabitSupabaseRow;
    return {
      id: String(row.id),
      title: row.title ?? "",
      emoji: row.emoji,
      frequency: row.frequency ?? "daily",
      target_days_per_week: row.target_days_per_week ?? 0,
      checkedIn: checkedInHabitIds.has(String(row.id)),
    };
  });

  const squadRows = (squads ?? []).map((entry) => {
    const row = entry as unknown as SquadSupabaseRow;
    return {
      id: row.squad?.id ? String(row.squad.id) : undefined,
      name: row.squad?.name ?? "Squad",
      member_count: row.squad?.member_count ?? 0,
      role: row.role ?? "member",
    };
  });

  return (
    <div className="space-y-8">
      <NotificationPermissionPrompt />
      <ReferralWidget />
      <MoneyWidget />
      <StreakProtection currentStreak={Math.floor(Math.random() * 10) + 1} missedDaysThisWeek={Math.random() < 0.3 ? 1 : 0} />
      <AchievementsWidget />
      <DashboardHero
        habits={checklistItems.map((i) => i.habit)}
        squadCheckedIn={{ checked: 4, total: 5 }}
      />

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Daily checklist</h2>
          {checklistItems.length ? (
            <DailyChecklist
              items={checklistItems}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
              No habits yet? Create your first one!
            </div>
          )}
        </div>
        <aside className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Your squads</h2>
          {squadRows.length ? (
            <ul className="space-y-3">
              {squadRows.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm"
                >
                  <p className="font-semibold text-slate-900">{entry.name}</p>
                  <p>{entry.member_count} members</p>
                </li>
              ))}
            </ul>
          ) : (
            <FeaturedSquads />
          )}
        </aside>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Activity feed</h2>
        </div>
        <RichActivityFeed />
      </section>
    </div>
  );
}
