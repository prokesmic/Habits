"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, DollarSign, ArrowLeft } from "lucide-react";

type JoinSquadPageProps = {
  params: { id: string };
};

export default function JoinSquadPage({ params }: JoinSquadPageProps) {
  const router = useRouter();
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
    setJoining(true);
    setError(null);

    try {
      const response = await fetch(`/api/squads/${params.id}/join`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to join squad");
      }

      // Redirect to squad detail page
      router.push(`/squads/${params.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setJoining(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <section className="rounded-3xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 p-6 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
              <span>👥</span>
              <span>Join Squad</span>
            </div>
            <h1 className="text-2xl font-bold">Join this Squad</h1>
            <p className="mt-1 text-sm opacity-90">
              Become part of the accountability crew
            </p>
          </div>
          <Link
            href={`/squads/${params.id}`}
            className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Join Form */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Confirm Membership</h2>
        <p className="mt-2 text-sm text-slate-600">
          By joining this squad, you'll be able to:
        </p>

        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Share your daily check-ins with squad members
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Chat with squad members in real-time
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Get support and accountability from the community
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            See squad member activity in your feed
          </li>
        </ul>

        {/* Stakes Info (placeholder - can be populated from squad data) */}
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-900">No entry fee</p>
              <p className="mt-1 text-sm text-amber-700">
                This squad is free to join. Start building accountability today!
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-900">{error}</p>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleJoin}
            disabled={joining}
            className="flex-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-md active:scale-95 disabled:opacity-60"
          >
            {joining ? "Joining..." : "Join Squad"}
          </button>
          <Link
            href={`/squads/${params.id}`}
            className="rounded-full border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
        <p className="font-semibold">Privacy Notice</p>
        <p className="mt-1 text-blue-700">
          Your activity will be visible to other squad members. You can leave the
          squad at any time from the squad settings.
        </p>
      </div>
    </div>
  );
}
