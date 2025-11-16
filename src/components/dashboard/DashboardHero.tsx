"use client";

import { useEffect, useMemo, useState } from "react";
import type { Habit } from "@/types/habit";

type DashboardHeroProps = {
  habits: Habit[];
  squadCheckedIn?: { checked: number; total: number };
};

function getLongestStreak(habits: Habit[]): number {
  return Math.max(0, ...habits.map((h) => h.currentStreak));
}

function getActiveStakes(habits: Habit[]): number {
  const today = new Date().toISOString().split("T")[0];
  return habits
    .filter((h) => h.activeStake && !h.checkIns.some((ci) => ci.date === today && ci.completed))
    .reduce((sum, h) => sum + (h.activeStake || 0), 0);
}

function getTimeToMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { hours, minutes };
}

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split("T")[0]);
  }
  return days;
}

export function DashboardHero({ habits, squadCheckedIn }: DashboardHeroProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeToMidnight());
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeToMidnight()), 60_000);
    return () => clearInterval(id);
  }, []);

  const longestStreak = useMemo(() => getLongestStreak(habits), [habits]);
  const stakes = useMemo(() => getActiveStakes(habits), [habits]);
  const checked = squadCheckedIn?.checked ?? 0;
  const total = squadCheckedIn?.total ?? Math.max(checked, 5);

  const last7 = getLast7Days();
  const anyCheckedByDay = last7.map((d) =>
    habits.some((h) => h.checkIns.some((ci) => ci.date === d && ci.completed)),
  );
  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <section className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">🔥 Your Streak</p>
          <p className="text-3xl font-bold text-slate-900">{longestStreak} days</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">💰 Stakes Active</p>
          <p className="text-3xl font-bold text-slate-900">${stakes}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">👥 Squad Status</p>
          <p className="text-3xl font-bold text-slate-900">
            {checked}/{total} checked in
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">This week</p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {dayLabels.map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {anyCheckedByDay.map((done, i) => (
            <div
              key={i}
              className={`h-3 w-full rounded-full ${done ? "bg-green-500" : "bg-slate-200"}`}
              title={last7[i]}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm font-semibold text-slate-900">Don&apos;t break it now! 🎯</p>
        <p className="mt-1 text-xs text-slate-600">
          ⏰ {timeLeft.hours}h {timeLeft.minutes}m left today
        </p>
      </div>
    </section>
  );
}


