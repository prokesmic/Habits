import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ChallengeTypesShowcase } from "@/components/challenges/ChallengeTypesShowcase";
import { ChallengeTemplates } from "@/components/challenges/ChallengeTemplates";
import { ActiveChallengeCard } from "@/components/challenges/ActiveChallengeCard";
import { ChallengeFilters } from "@/components/challenges/ChallengeFilters";
import { activeChallenges } from "@/data/mockChallenges";

export const dynamic = "force-dynamic";

export default async function ChallengesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">
          Join the action by{" "}
          <Link href="/auth/sign-in" className="font-semibold text-blue-600">
            signing in
          </Link>
          .
        </p>
      </div>
    );
  }

  // Fetch user's challenges
  const { data: challenges } = await supabase
    .from("challenge_participants")
    .select(
      "challenge:challenges(id, name, description, challenge_format, start_date, end_date, participant_count, status)",
    )
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false });

  const challengeRows = (challenges ?? []).map((entry) => {
    const challenge = (entry as any).challenge ?? {};
    return {
      id: challenge.id ? String(challenge.id) : undefined,
      name: challenge.name ?? "Challenge",
      description: challenge.description ?? null,
      challenge_format: challenge.challenge_format ?? "group",
      participant_count: Number(challenge.participant_count ?? 0),
      status: challenge.status ?? "draft",
    };
  });

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
              <span>🏆</span>
              <span>Compete & Win</span>
            </div>
            <h1 className="text-2xl font-bold">Challenges</h1>
            <p className="mt-1 text-sm opacity-90">
              Launch 1v1 duels, group sprints, or discover public showdowns.
            </p>
          </div>
          <Link
            href="/challenges/new"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-amber-600 shadow-sm transition hover:bg-amber-50 active:scale-95"
          >
            Create challenge
          </Link>
        </div>
      </section>

      {/* Challenge Types Showcase */}
      <ChallengeTypesShowcase />

      {/* Challenge Templates */}
      <ChallengeTemplates />

      {/* User's Active Challenges */}
      {challengeRows.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Your challenges</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {challengeRows.map((entry) => (
              <article
                key={entry.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-slate-900">{entry.name}</h2>
                <p className="mt-2">{entry.description}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs uppercase tracking-wide text-slate-600">
                  <span>{entry.challenge_format}</span>
                  <span>{entry.participant_count} participants</span>
                  <span>{entry.status}</span>
                </div>
                <Link
                  href={`/challenges/${entry.id}`}
                  className="mt-4 inline-block text-sm font-semibold text-amber-600 hover:text-amber-700"
                >
                  View details →
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Active Challenges Marketplace (discovery enhanced) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Active Challenges Marketplace</h2>
          <a
            href="/money/transactions"
            className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
          >
            💰 View winnings
          </a>
        </div>
        
        {/* Filters */}
        <ChallengeFilters />
        
        {/* Challenges Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeChallenges.map((challenge) => (
            <ActiveChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </section>
    </div>
  );
}

