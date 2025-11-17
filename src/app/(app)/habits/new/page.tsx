"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { habitSchema } from "@/lib/validators";
import { createHabit } from "@/server/actions/habits";
import { useState } from "react";
import { track, events } from "@/lib/analytics";
import Link from "next/link";
import { useRouter } from "next/navigation";

type HabitFormValues = z.input<typeof habitSchema>;

export default function NewHabitPage() {
  const router = useRouter();
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
    router.push("/dashboard");
    router.refresh();
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 p-6 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
              <span>✨</span>
              <span>New Habit</span>
            </div>
            <h1 className="text-2xl font-bold">Create new habit</h1>
            <p className="mt-1 text-sm opacity-90">
              Keep it simple—frequency presets help you get started fast.
            </p>
          </div>
          <Link
            href="/habits"
            className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30"
          >
            Cancel
          </Link>
        </div>
      </section>

      <form onSubmit={onSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Habit name
            <input
              {...form.register("title")}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              placeholder="10 push-ups"
            />
            <ErrorMessage message={form.formState.errors.title?.message} />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Emoji
            <input
              {...form.register("emoji")}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            <ErrorMessage message={form.formState.errors.emoji?.message} />
          </label>
        </div>
        <label className="block text-sm font-semibold text-slate-700">
          Description
          <textarea
            {...form.register("description")}
            rows={3}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            placeholder="Add context for your squad"
          />
          <ErrorMessage message={form.formState.errors.description?.message} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Frequency
            <select
              {...form.register("frequency")}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
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
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            <ErrorMessage message={form.formState.errors.target_days_per_week?.message} />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input type="checkbox" {...form.register("is_public")} className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500" />
          Make this habit public (recommended for discovery)
        </label>

        {/* Motivation tip */}
        <div className="rounded-xl bg-amber-50 p-4">
          <p className="text-sm text-amber-900">
            <span className="font-semibold">💡 Pro tip:</span> Users who add at least one squad member have a <strong>40% higher</strong> success rate.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-gradient-to-r from-amber-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-amber-500/30 transition hover:shadow-lg hover:shadow-amber-500/40 active:scale-95 disabled:opacity-60"
        >
          {submitting ? "Creating your habit..." : "Create habit & start tracking"}
        </button>
      </form>
    </div>
  );
}

function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

