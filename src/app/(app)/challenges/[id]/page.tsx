import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ChallengePageProps = {
  params: { id: string };
};

export default async function ChallengeDetailPage({ params }: ChallengePageProps) {
  const supabase = await createClient();

  const { data: challenge } = await supabase
    .from("challenges")
    .select("*, stake:stakes(*), participants:challenge_participants(user_id, score, rank)")
    .eq("id", params.id)
    .single();

  if (!challenge) {
    notFound();
  }

  const participants =
    (challenge.participants as Array<{ user_id: string; score: number | null; rank: number | null }>) ??
    [];

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <header className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 p-6 text-white shadow-sm shadow-slate-900/10">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <span>🏆</span>
            <span>Challenge</span>
          </span>
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">{challenge.name}</h1>
            <p className="mt-1 text-sm md:text-base opacity-95">
              {challenge.description ?? "Compete with your squad and keep consistency high."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="rounded-full bg-white/20 px-3 py-1 font-medium">{challenge.challenge_format}</span>
            <span className="rounded-full bg-white/20 px-3 py-1 font-medium">
              {challenge.duration_days} days • target {challenge.target_completions}
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 font-medium">{challenge.participant_count} participants</span>
            <span className="rounded-full bg-white/20 px-3 py-1 font-medium capitalize">{challenge.status}</span>
          </div>
          {challenge.stake && (
            <div className="mt-2 inline-flex items-center rounded-full bg-amber-200 px-4 py-2 text-sm font-semibold text-amber-900">
              💰 €{(challenge.stake.amount_cents / 100).toFixed(2)} stake • Fee{" "}
              {challenge.stake.platform_fee_percent ?? 7.5}%
            </div>
          )}
        </div>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Leaderboard</h2>
          <button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/40 transition hover:bg-indigo-700">
            Join challenge
          </button>
        </div>
        <table className="mt-4 w-full table-auto text-sm text-slate-600">
          <thead className="text-left text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="pb-2">Rank</th>
              <th className="pb-2">Participant</th>
              <th className="pb-2 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {participants.length ? (
              participants.map((participant, index) => (
              <tr key={participant.user_id} className="border-t border-slate-100">
                <td className="py-3">{participant.rank ?? index + 1}</td>
                <td className="py-3">User {participant.user_id.slice(0, 6)}</td>
                <td className="py-3 text-right font-semibold">{participant.score ?? 0}</td>
              </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-4 text-center text-sm text-slate-500">
                  Be the first to join this challenge!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

