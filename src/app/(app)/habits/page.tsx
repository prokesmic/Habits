import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { HabitTemplatesQuickAdd } from "@/components/habits/HabitTemplates";
import { TemplateLibraryModal } from "@/components/habits/TemplateLibraryModal";

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
          <Link href="/sign-in" className="font-semibold text-blue-600">
            sign in
          </Link>{" "}
          to manage habits.
        </p>
      </div>
    );
  }

  const { data: habits } = await supabase
    .from("habits")
    .select("id, title, emoji, description, is_public, target_days_per_week, frequency")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Your habits</h1>
          <p className="text-sm text-slate-500">
            Create, edit, and organize the systems you&apos;re tracking.
          </p>
        </div>
        <Link
          href="/habits/new"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + New habit
        </Link>
      </header>
      <div className="flex items-center justify-between">
        <HabitTemplatesQuickAdd />
        <TemplateLibraryModal />
      </div>
      {habits?.length ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {habits.map((habit) => (
            <li key={habit.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    {habit.emoji ?? "✅"} {habit.title}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    {habit.frequency} • target {habit.target_days_per_week}/week
                  </p>
                </div>
                <span className="rounded-full border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-500">
                  {habit.is_public ? "Public" : "Private"}
                </span>
              </div>
              {habit.description ? (
                <p className="mt-3 text-sm text-slate-600">{habit.description}</p>
              ) : null}
              <div className="mt-4 flex gap-3">
                <Link
                  href={`/habits/${habit.id}`}
                  className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  View stats
                </Link>
                <Link
                  href={`/habits/${habit.id}/edit`}
                  className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
                >
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
          No habits yet? Create your first one!
        </div>
      )}
    </div>
  );
}

