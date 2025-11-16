"use client";

import { useMemo, useState } from "react";
import confetti from "canvas-confetti";
import type { Habit } from "@/types/habit";

export type ChecklistItemData = {
  habit: Habit;
  checkedInToday: boolean;
  squadMembers: {
    totalMembers: number;
    checkedInMembers: { name: string; avatar: string }[];
  };
};

function squadProgress(checkedIn: number, total: number): number {
  return Math.round((checkedIn / Math.max(1, total)) * 100);
}

function isAtRisk(): boolean {
  const now = new Date();
  return now.getHours() >= 20; // after 8 PM
}

type ChecklistItemProps = {
  item: ChecklistItemData;
  onCheckIn?: (habitId: string) => Promise<void> | void;
};

export function ChecklistItem({ item, onCheckIn }: ChecklistItemProps) {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(item.checkedInToday);
  const atRisk = isAtRisk() && !checked;
  const progress = useMemo(
    () => squadProgress(item.squadMembers.checkedInMembers.length, item.squadMembers.totalMembers),
    [item.squadMembers.checkedInMembers.length, item.squadMembers.totalMembers],
  );

  async function handleCheckIn() {
    if (checked) return;
    try {
      setLoading(true);
      if (onCheckIn) {
        await onCheckIn(item.habit.id);
      }
      setChecked(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.7 } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={[
        "rounded-2xl border p-4 shadow-sm transition-all",
        checked
          ? "border-green-300 bg-green-50"
          : atRisk
          ? "border-amber-300 bg-amber-50 animate-[pulse_2s_ease-in-out_infinite]"
          : "border-slate-200 bg-white",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="text-2xl leading-none">{item.habit.emoji}</div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{item.habit.name}</p>
            <p className="text-xs text-slate-600">
              🔥 {item.habit.currentStreak}-day streak
              {item.habit.activeStake ? <> • ${item.habit.activeStake} stake active</> : null}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              ⚡️{" "}
              {item.squadMembers.checkedInMembers
                .slice(0, 3)
                .map((m) => m.name)
                .join(", ") || "No one"}{" "}
              {item.squadMembers.checkedInMembers.length ? "checked in" : ""}
            </p>
          </div>
        </div>
        <div className="text-right">
          {checked ? <span className="text-green-700">✅</span> : atRisk ? <span className="text-red-600">At risk!</span> : null}
        </div>
      </div>

      {/* Progress */}
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
          <span>Progress</span>
          <span className="font-semibold">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4">
        <button
          type="button"
          onClick={handleCheckIn}
          disabled={checked || loading}
          className={[
            "w-full rounded-full px-4 py-2 text-sm font-semibold text-white transition",
            checked
              ? "bg-green-600 opacity-70"
              : atRisk
              ? "bg-amber-600 hover:bg-amber-700"
              : "bg-blue-600 hover:bg-blue-700",
          ].join(" ")}
        >
          {checked ? "Checked in" : loading ? "Checking..." : "Check in"}
        </button>
      </div>
    </div>
  );
}


