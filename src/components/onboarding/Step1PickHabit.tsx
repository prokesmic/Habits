"use client";

import { useState } from "react";

const popularHabits = [
  { title: "Morning Meditation", emoji: "🧘" },
  { title: "Daily Exercise", emoji: "🏃" },
  { title: "Read for 20 min", emoji: "📚" },
  { title: "Drink 8 glasses of water", emoji: "💧" },
  { title: "Journal", emoji: "📝" },
] as const;

type Step1PickHabitProps = {
  onNext: (habit: { title: string; emoji: string }) => void;
};

export function Step1PickHabit({ onNext }: Step1PickHabitProps) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState("");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">What habit do you want to build?</h1>
      <div className="space-y-3">
        {popularHabits.map((habit) => (
          <button
            key={habit.title}
            type="button"
            onClick={() => onNext(habit)}
            className="flex w-full items-center gap-3 rounded-2xl border-2 border-slate-200 px-4 py-3 text-left transition hover:border-blue-500"
          >
            <span className="text-2xl">{habit.emoji}</span>
            <span className="text-sm font-semibold text-slate-800">{habit.title}</span>
          </button>
        ))}
        {customOpen ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 p-4">
            <label className="block text-sm font-semibold text-slate-700">
              Custom habit
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Describe your habit"
                value={customTitle}
                onChange={(event) => setCustomTitle(event.target.value)}
              />
            </label>
            <button
              type="button"
              className="mt-3 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
              onClick={() =>
                customTitle.trim() &&
                onNext({
                  title: customTitle.trim(),
                  emoji: "✨",
                })
              }
            >
              Continue
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setCustomOpen(true)}
            className="w-full rounded-2xl border-2 border-dashed border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-500"
          >
            ✨ Create custom habit
          </button>
        )}
      </div>
    </div>
  );
}

