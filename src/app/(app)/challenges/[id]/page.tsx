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
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-slate-400">Challenge</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">{challenge.name}</h1>
        <p className="mt-3 text-sm text-slate-600">
          {challenge.description ?? "Compete with your squad and keep consistency high."}
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs uppercase tracking-wide text-slate-400">
          <span>{challenge.challenge_format}</span>
          <span>
            {challenge.duration_days} days • target {challenge.target_completions}
          </span>
          <span>{challenge.participant_count} participants</span>
          <span>Status: {challenge.status}</span>
        </div>
        {challenge.stake ? (
          <div className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-800">
            💰 €{(challenge.stake.amount_cents / 100).toFixed(2)} stake • Fee{" "}
            {challenge.stake.platform_fee_percent ?? 7.5}%
          </div>
        ) : null}
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Leaderboard</h2>
          <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            Join challenge
          </button>
        </div>
        <table className="mt-4 w-full table-auto text-sm text-slate-600">
          <thead className="text-left text-xs uppercase tracking-wide text-slate-400">
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

