import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ChallengeTypesShowcase } from "@/components/challenges/ChallengeTypesShowcase";
import { ChallengeTemplates } from "@/components/challenges/ChallengeTemplates";
import { ActiveChallengeCard } from "@/components/challenges/ActiveChallengeCard";
import { ChallengeFilters } from "@/components/challenges/ChallengeFilters";
import { activeChallenges } from "@/data/mockChallenges";

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
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Challenges</h1>
          <p className="text-sm text-slate-500">
            Launch 1v1 duels, group sprints, or discover public showdowns.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/challenges/new"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Create challenge
          </Link>
        </div>
      </header>

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
                <div className="mt-3 flex flex-wrap gap-4 text-xs uppercase tracking-wide text-slate-400">
                  <span>{entry.challenge_format}</span>
                  <span>{entry.participant_count} participants</span>
                  <span>{entry.status}</span>
                </div>
                <Link
                  href={`/challenges/${entry.id}`}
                  className="mt-4 inline-block text-sm font-semibold text-blue-600"
                >
                  View details
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
            className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            View winnings
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

