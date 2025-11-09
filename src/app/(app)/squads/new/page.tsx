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
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Create a squad</h1>
          <p className="text-sm text-slate-500">
            Name your crew and choose how to share the invite code.
          </p>
        </div>
        <Link
          href="/squads"
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          Cancel
        </Link>
      </header>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
      >
        <label className="block text-sm font-semibold text-slate-700">
          Squad name
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Morning Movement Crew"
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
          />
        </label>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create squad"}
        </button>
      </form>
    </div>
  );
}

