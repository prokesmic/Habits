"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { habitSchema } from "@/lib/validators";
import { createHabit } from "@/server/actions/habits";
import { useState } from "react";
import { track, events } from "@/lib/analytics";
import Link from "next/link";

type HabitFormValues = z.input<typeof habitSchema>;

export default function NewHabitPage() {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      title: "",
      emoji: "✅",
      description: "",
      frequency: "daily",
      target_days_per_week: 7,
      is_public: true,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    await createHabit(values);
    track(events.habitCreated);
    window.location.assign("/habits");
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Create new habit</h1>
          <p className="text-sm text-slate-500">
            Keep it simple—frequency presets help you get started fast.
          </p>
        </div>
        <Link
          href="/habits"
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          Cancel
        </Link>
      </header>
      <form onSubmit={onSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Habit name
            <input
              {...form.register("title")}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="10 push-ups"
            />
            <ErrorMessage message={form.formState.errors.title?.message} />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Emoji
            <input
              {...form.register("emoji")}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <ErrorMessage message={form.formState.errors.emoji?.message} />
          </label>
        </div>
        <label className="block text-sm font-semibold text-slate-700">
          Description
          <textarea
            {...form.register("description")}
            rows={3}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Add context for your squad"
          />
          <ErrorMessage message={form.formState.errors.description?.message} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Frequency
            <select
              {...form.register("frequency")}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="daily">Daily</option>
              <option value="weekdays">Weekdays</option>
              <option value="custom">Custom</option>
            </select>
            <ErrorMessage message={form.formState.errors.frequency?.message} />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Target days per week
            <input
              type="number"
              min={1}
              max={7}
              {...form.register("target_days_per_week", { valueAsNumber: true })}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <ErrorMessage message={form.formState.errors.target_days_per_week?.message} />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input type="checkbox" {...form.register("is_public")} className="h-4 w-4 rounded border-slate-300" />
          Make this habit public (recommended for discovery)
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? "Creating..." : "Create habit"}
        </button>
      </form>
    </div>
  );
}

function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

