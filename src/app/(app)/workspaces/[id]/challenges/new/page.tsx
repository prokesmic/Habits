"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTeamChallengePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<any>({
    name: "",
    type: "team_streak",
    goal: { type: "total_checkins", target: 100, unit: "check-ins" },
  });
  const types = [
    { id: "team_streak", name: "Team Streak", description: "Everyone maintains their streaks together", icon: "🔥" },
    { id: "collective_goal", name: "Collective Goal", description: "Team works together to hit a total", icon: "🎯" },
    { id: "participation", name: "Participation Challenge", description: "Get the most people checking in", icon: "👥" },
    { id: "competition", name: "Team Competition", description: "Teams compete against each other", icon: "🏆" },
  ];

  const create = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/workspaces/${params.id}/challenges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(challenge),
      });
      if (res.ok) {
        router.push(`/workspaces/${params.id}`);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to create challenge. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Failed to create challenge. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Create Team Challenge</h1>
      <div>
        <label className="mb-2 block text-sm font-medium">Challenge Type</label>
        <div className="grid grid-cols-2 gap-3">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setChallenge((c: any) => ({ ...c, type: t.id }))}
              className={`rounded-lg border-2 p-4 text-left ${challenge.type === t.id ? "border-violet-600 bg-violet-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <div className="mb-2 text-2xl">{t.icon}</div>
              <div className="mb-1 font-semibold">{t.name}</div>
              <div className="text-sm text-gray-600">{t.description}</div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Challenge Name</label>
        <input
          className="w-full rounded-lg border px-4 py-3"
          value={challenge.name}
          onChange={(e) => setChallenge((c: any) => ({ ...c, name: e.target.value }))}
          placeholder="30-Day Team Fitness Challenge"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Goal</label>
        <div className="flex gap-4">
          <input
            type="number"
            className="w-32 rounded-lg border px-4 py-3"
            value={challenge.goal.target}
            onChange={(e) => setChallenge((c: any) => ({ ...c, goal: { ...c.goal, target: parseInt(e.target.value) } }))}
          />
          <select
            className="flex-1 rounded-lg border px-4 py-3"
            value={challenge.goal.type}
            onChange={(e) => setChallenge((c: any) => ({ ...c, goal: { ...c.goal, type: e.target.value } }))}
          >
            <option value="total_checkins">Total Check-ins</option>
            <option value="participation_rate">Participation Rate (%)</option>
            <option value="team_average">Team Average Streak</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Start Date</label>
          <input
            type="date"
            className="w-full rounded-lg border px-4 py-3"
            onChange={(e) => setChallenge((c: any) => ({ ...c, duration: { ...(c.duration || {}), startDate: e.target.value } }))}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">End Date</label>
          <input
            type="date"
            className="w-full rounded-lg border px-4 py-3"
            onChange={(e) => setChallenge((c: any) => ({ ...c, duration: { ...(c.duration || {}), endDate: e.target.value } }))}
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Submit button with extra spacing */}
      <div className="pt-2">
        <button
          onClick={create}
          disabled={loading || !challenge.name || !challenge.goal}
          className="w-full rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Challenge"}
        </button>
      </div>
    </div>
  );
}


