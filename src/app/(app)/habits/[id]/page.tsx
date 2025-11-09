import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CheckInCard } from "@/components/cards/CheckInCard";

type HabitPageProps = {
  params: { id: string };
};

export default async function HabitDetailPage({ params }: HabitPageProps) {
  const supabase = await createClient();
  const { data: habit } = await supabase
    .from("habits")
    .select("id, title, emoji, description, frequency, target_days_per_week")
    .eq("id", params.id)
    .single();

  if (!habit) {
    notFound();
  }

  const { data: logs } = await supabase
    .from("habit_logs")
    .select(
      "id, note, streak_count, created_at, status, habit:habits(title, emoji), user:profiles(username)",
    )
    .eq("habit_id", habit.id)
    .order("log_date", { ascending: false })
    .limit(20);

  const parsedLogs =
    (logs ?? []).map((log) => ({
      id: String(log.id),
      note: (log.note as string) ?? null,
      streak_count: typeof log.streak_count === "number" ? log.streak_count : null,
      habit: {
        title: (log as any).habit?.title ?? habit.title,
        emoji: (log as any).habit?.emoji ?? habit.emoji ?? null,
      },
      user: {
        username: (log as any).user?.username ?? "Anonymous",
      },
      reactions: (log as any).reactions,
    })) as Array<{
      id: string;
      note: string | null;
      streak_count: number | null;
      habit: { title: string; emoji: string | null };
      user: { username: string };
      reactions?: Array<{ reaction_type: string; count: number }>;
    }>;

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-slate-400">Habit</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          {habit.emoji ?? "✅"} {habit.title}
        </h1>
        <p className="mt-3 text-sm text-slate-600">{habit.description}</p>
        <div className="mt-4 flex gap-4 text-xs uppercase tracking-wide text-slate-400">
          <span>{habit.frequency}</span>
          <span>Target {habit.target_days_per_week}/week</span>
        </div>
      </header>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent check-ins</h2>
          <button className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-700">
            Check in now
          </button>
        </div>
        {parsedLogs.length ? (
          <div className="space-y-3">
            {parsedLogs.map((log) => (
              <CheckInCard key={log.id} log={log} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
            No logs yet. Log your first win to start a streak!
          </div>
        )}
      </section>
    </div>
  );
}

