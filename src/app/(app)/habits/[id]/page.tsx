"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CheckInCard } from "@/components/cards/CheckInCard";
import { Archive, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Habit = {
  id: string;
  title: string;
  emoji: string | null;
  description: string | null;
  frequency: string;
  target_days_per_week: number;
  archived: boolean;
};

type ParsedLog = {
  id: string;
  note: string | null;
  streak_count: number | null;
  habit: { title: string; emoji: string | null };
  user: { username: string };
  reactions?: Array<{ reaction_type: string; count: number }>;
};

export default function HabitDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const router = useRouter();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [logs, setLogs] = useState<ParsedLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function loadHabit() {
      const { id } = await Promise.resolve(params);
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/sign-in");
        return;
      }

      const { data: habitData, error: habitError } = await supabase
        .from("habits")
        .select("id, title, emoji, description, frequency, target_days_per_week, user_id, archived")
        .eq("id", id)
        .single();

      if (habitError || !habitData || habitData.user_id !== user.id) {
        router.push("/dashboard");
        return;
      }

      setHabit(habitData);

      const { data: logsData } = await supabase
        .from("habit_logs")
        .select(
          "id, note, streak_count, created_at, status, habit:habits(title, emoji), user:profiles(username)"
        )
        .eq("habit_id", id)
        .order("log_date", { ascending: false })
        .limit(20);

      const parsedLogs = (logsData ?? []).map((log) => ({
        id: String(log.id),
        note: (log.note as string) ?? null,
        streak_count: typeof log.streak_count === "number" ? log.streak_count : null,
        habit: {
          title: (log as any).habit?.title ?? habitData.title,
          emoji: (log as any).habit?.emoji ?? habitData.emoji ?? null,
        },
        user: {
          username: (log as any).user?.username ?? "Anonymous",
        },
        reactions: (log as any).reactions,
      }));

      setLogs(parsedLogs);
      setLoading(false);
    }

    loadHabit();
  }, [params, router]);

  async function handleArchive() {
    if (!habit) return;
    setActionLoading(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("habits")
      .update({ archived: !habit.archived })
      .eq("id", habit.id);

    if (error) {
      alert("Failed to update habit");
    } else {
      if (!habit.archived) {
        router.push("/dashboard");
      } else {
        setHabit({ ...habit, archived: !habit.archived });
      }
    }
    setActionLoading(false);
  }

  async function handleDelete() {
    if (!habit) return;
    setActionLoading(true);

    const supabase = createClient();

    // Delete habit logs first
    await supabase
      .from("habit_logs")
      .delete()
      .eq("habit_id", habit.id);

    // Then delete the habit
    const { error } = await supabase
      .from("habits")
      .delete()
      .eq("id", habit.id);

    if (error) {
      alert("Failed to delete habit");
      setActionLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  if (!habit) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Hero Header */}
      <header className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 p-6 text-white shadow-sm shadow-slate-900/10">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <span>{habit.emoji ?? "✅"}</span>
              <span>Habit</span>
            </span>
            <div>
              <h1 className="text-2xl font-semibold md:text-3xl">{habit.title}</h1>
              {habit.description && (
                <p className="mt-1 text-sm md:text-base opacity-95">{habit.description}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="rounded-full bg-white/20 px-3 py-1 font-medium">{habit.frequency}</span>
              <span className="rounded-full bg-white/20 px-3 py-1 font-medium">Target {habit.target_days_per_week}/week</span>
              {habit.archived && (
                <span className="rounded-full bg-amber-200 px-3 py-1 font-semibold text-amber-900">
                  Archived
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleArchive}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30 disabled:opacity-50"
            >
              <Archive className="h-4 w-4" />
              {habit.archived ? "Restore" : "Archive"}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-full bg-red-500/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </header>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Delete Habit?</h3>
            <p className="mt-2 text-sm text-slate-600">
              This will permanently delete "{habit.title}" and all {logs.length} check-in logs. This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent check-ins */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent check-ins</h2>
          <button
            onClick={() => alert("Check-in modal coming soon!")}
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/40 transition hover:bg-indigo-700"
          >
            Check in now
          </button>
        </div>
        {logs.length ? (
          <div className="space-y-3">
            {logs.map((log) => (
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
