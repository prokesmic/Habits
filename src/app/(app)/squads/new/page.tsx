"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createSquad } from "@/server/actions/social";
import { track, events } from "@/lib/analytics";

export default function NewSquadPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const squad = await createSquad(name, description);
      track(events.squadCreated, { squad_id: squad.id });
      window.location.assign("/squads");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Hero Header */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 p-6 text-white shadow-sm shadow-slate-900/10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <span>👥</span>
              <span>New Squad</span>
            </span>
            <div>
              <h1 className="text-2xl font-semibold md:text-3xl">Create a Squad</h1>
              <p className="mt-1 text-sm opacity-95">
                Name your crew and choose how to share the invite code.
              </p>
            </div>
          </div>
          <Link
            href="/squads"
            className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30"
          >
            Cancel
          </Link>
        </div>
      </section>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5"
      >
        <label className="block text-sm font-semibold text-slate-700">
          Squad name
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Morning Movement Crew"
            data-testid="squad-name-input"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Description
          <textarea
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="What keeps this squad accountable?"
            data-testid="squad-description-input"
          />
        </label>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-gradient-to-r from-amber-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-amber-500/30 transition hover:shadow-lg hover:shadow-amber-500/40 active:scale-95 disabled:opacity-60"
          data-testid="squad-submit-button"
        >
          {loading ? "Creating..." : "Create squad"}
        </button>
      </form>
    </div>
  );
}

