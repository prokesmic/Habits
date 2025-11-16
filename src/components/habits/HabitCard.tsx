"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Habit, getLast14Days, hasCheckIn } from "@/types/habit";
import { Check } from "lucide-react";

type HabitCardProps = {
  habit: Habit;
  onQuickCheckIn?: (habitId: string) => Promise<void> | void;
};

export function HabitCard({ habit, onQuickCheckIn }: HabitCardProps) {
  const [loading, setLoading] = useState(false);
  const days = useMemo(() => getLast14Days(), []);

  const completedCount = days.filter((d) => hasCheckIn(d, habit.checkIns)).length;

  async function handleQuickCheckIn() {
    if (!onQuickCheckIn) return;
    try {
      setLoading(true);
      await onQuickCheckIn(habit.id);
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="text-2xl leading-none">{habit.emoji}</div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">{habit.name}</h3>
            <p className="text-xs text-slate-500">
              🎯 Target: {habit.targetPerWeek}/week • {habit.frequency}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-slate-500">🔥 Streak</p>
          <p className="text-xl font-bold text-slate-900">{habit.currentStreak} days</p>
          {habit.activeStake ? (
            <p className="mt-1 text-xs font-semibold text-green-700">💰 ${habit.activeStake} stake</p>
          ) : null}
        </div>
      </div>

      {/* Mini Calendar - 14 days */}
      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-slate-600">
          <span>Last 14 days</span>
          <span className="font-semibold">
            {completedCount}/{days.length} done
          </span>
        </div>
        <div className="grid grid-cols-14 gap-0.5">
          {days.map((date) => {
            const done = hasCheckIn(date, habit.checkIns);
            return (
              <div
                key={date}
                title={date}
                className={`flex h-5 w-5 items-center justify-center rounded-sm border ${
                  done
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-slate-200 bg-slate-100 text-slate-400"
                }`}
              >
                {done ? <Check className="h-3 w-3" /> : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <span>👥 In {habit.squads.length} squads</span>
        <span>Longest streak: {habit.longestStreak} days</span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleQuickCheckIn}
          disabled={!onQuickCheckIn || loading}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Checking in..." : "Quick check-in"}
        </button>
        <Link
          href={`/habits/${habit.id}`}
          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
        >
          Stats
        </Link>
        <Link
          href={`/habits/${habit.id}/edit`}
          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          onClick={() => {
            if (navigator.share) {
              void navigator.share({ title: habit.name, text: `I'm building a streak for ${habit.name}!` });
            }
          }}
        >
          Share
        </button>
      </div>
    </article>
  );
}


