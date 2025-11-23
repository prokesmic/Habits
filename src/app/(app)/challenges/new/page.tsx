"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { challengeSchema } from "@/lib/validators";
import { createChallenge } from "@/server/actions/challenges";
import { useState } from "react";
import Link from "next/link";
import { track, events } from "@/lib/analytics";

type ChallengeFormValues = z.input<typeof challengeSchema>;

export default function NewChallengePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<ChallengeFormValues>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      name: "",
      description: "",
      challenge_format: "group",
      duration_days: 7,
      target_completions: 5,
      start_date: new Date().toISOString().slice(0, 10),
      visibility: "link",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);
    setError(null);
    try {
      await createChallenge(values);
      track(events.challengeCreated, { challenge_format: values.challenge_format });
      window.location.assign("/challenges");
    } catch {
      setError("Failed to create challenge. Please try again.");
      setLoading(false);
    }
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Hero Header */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 p-6 text-white shadow-sm shadow-slate-900/10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <span>🚀</span>
              <span>Launch</span>
            </span>
            <div>
              <h1 className="text-2xl font-semibold md:text-3xl">Create Challenge</h1>
              <p className="mt-1 text-sm opacity-95">
                Set the rules and invite your squad—or the whole world.
              </p>
            </div>
          </div>
          <Link
            href="/challenges"
            className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30"
          >
            Cancel
          </Link>
        </div>
      </section>
      <form onSubmit={onSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
        <label className="block text-sm font-semibold text-slate-700">
          Challenge name
          <input
            {...form.register("name")}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="7-day sunrise stretch"
            data-testid="challenge-name-input"
          />
          <Error message={form.formState.errors.name?.message} />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Description
          <textarea
            {...form.register("description")}
            rows={3}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="What are the ground rules?"
            data-testid="challenge-description-input"
          />
          <Error message={form.formState.errors.description?.message} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Format
            <select
              {...form.register("challenge_format")}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              data-testid="challenge-format-select"
            >
              <option value="solo">Solo</option>
              <option value="1v1">1v1 duel</option>
              <option value="group">Group</option>
              <option value="public">Public</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Duration (days)
            <input
              type="number"
              min={1}
              max={365}
              {...form.register("duration_days", { valueAsNumber: true })}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              data-testid="challenge-duration-input"
            />
            <Error message={form.formState.errors.duration_days?.message} />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Target completions
            <input
              type="number"
              min={1}
              {...form.register("target_completions", { valueAsNumber: true })}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              data-testid="challenge-target-input"
            />
            <Error message={form.formState.errors.target_completions?.message} />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Start date
            <input
              type="date"
              {...form.register("start_date")}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              data-testid="challenge-start-date-input"
            />
            <Error message={form.formState.errors.start_date?.message} />
          </label>
        </div>
        <label className="text-sm font-semibold text-slate-700">
          Visibility
          <select
            {...form.register("visibility")}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            data-testid="challenge-visibility-select"
          >
            <option value="private">Private</option>
            <option value="link">Link-only</option>
            <option value="public">Public</option>
          </select>
        </label>

        {/* Error message */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit button with extra spacing */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-amber-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-amber-500/30 transition hover:shadow-lg hover:shadow-amber-500/40 active:scale-95 disabled:opacity-60"
            data-testid="challenge-submit-button"
          >
            {loading ? "Launching..." : "Launch challenge"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Error({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

