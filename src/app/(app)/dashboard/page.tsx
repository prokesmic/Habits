import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ActivityFeed } from "@/components/feed/ActivityFeed";

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
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  const { data: habits } = await supabase
    .from("habits")
    .select("id, title, emoji, frequency, target_days_per_week")
    .eq("user_id", user.id)
    .eq("archived", false);

  const { data: squads } = await supabase
    .from("squad_members")
    .select("role, squad:squads(id, name, member_count)")
    .eq("user_id", user.id);

  const habitRows = (habits ?? []).map((habit) => {
    const row = habit as unknown as HabitSupabaseRow;
    return {
      id: String(row.id),
      title: row.title ?? "",
      emoji: row.emoji,
      frequency: row.frequency ?? "daily",
      target_days_per_week: row.target_days_per_week ?? 0,
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
      <section>
        <h1 className="text-2xl font-semibold text-slate-900">Today&apos;s focus</h1>
        <p className="text-sm text-slate-500">
          Check in, cheer on your squad, and keep streaks alive.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Daily checklist</h2>
          {habitRows.length ? (
            <ul className="space-y-3">
              {habitRows.map((habit) => (
                <li
                  key={habit.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{habit.emoji ?? "✅"}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{habit.title}</p>
                      <p className="text-xs text-slate-500">
                        {habit.frequency} • target {habit.target_days_per_week}/week
                      </p>
                    </div>
                  </div>
                  <button className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-700">
                    Check in
                  </button>
                </li>
              ))}
            </ul>
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
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
              Join a public squad to get started!
            </div>
          )}
        </aside>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Activity feed</h2>
        <ActivityFeed userId={user.id} />
      </section>
    </div>
  );
}
