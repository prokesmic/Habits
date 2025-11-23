import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

type JoinChallengePageProps = {
  params: { id: string };
};

export default async function JoinChallengePage({ params }: JoinChallengePageProps) {
  const supabase = await createClient();

  const { data: challenge } = await supabase
    .from("challenges")
    .select("id, name, description, challenge_format, duration_days, target_completions, status, participant_count, start_date, stake:stakes(amount_cents)")
    .eq("id", params.id)
    .single();

  if (!challenge) {
    notFound();
  }

  const { data: { user } } = await supabase.auth.getUser();

  // Check if already a participant
  if (user) {
    const { data: existingParticipant } = await supabase
      .from("challenge_participants")
      .select("id")
      .eq("challenge_id", challenge.id)
      .eq("user_id", user.id)
      .single();

    if (existingParticipant) {
      redirect(`/challenges/${challenge.id}`);
    }
  }

  const stakeAmount = challenge.stake?.[0]?.amount_cents ? (challenge.stake[0].amount_cents / 100).toFixed(2) : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Hero Header */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 p-6 text-white shadow-sm shadow-slate-900/10">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <span>🏆</span>
            <span>Join Challenge</span>
          </span>
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">{challenge.name}</h1>
            <p className="mt-1 text-sm opacity-95">
              {challenge.description ?? "Join this challenge and compete with others!"}
            </p>
          </div>
        </div>
      </section>

      {/* Challenge Details */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Challenge Details</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Format</p>
            <p className="font-semibold capitalize text-slate-900">{challenge.challenge_format}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Duration</p>
            <p className="font-semibold text-slate-900">{challenge.duration_days} days</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Target</p>
            <p className="font-semibold text-slate-900">{challenge.target_completions} completions</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Participants</p>
            <p className="font-semibold text-slate-900">{challenge.participant_count} joined</p>
          </div>
        </div>

        {stakeAmount && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-800">💰 This challenge has a stake</p>
            <p className="mt-1 text-2xl font-bold text-amber-900">${stakeAmount}</p>
            <p className="text-xs text-amber-700">Put money on the line to boost your commitment</p>
          </div>
        )}

        {!user ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-slate-600">Sign in to join this challenge</p>
            <Link
              href="/auth/sign-in"
              className="block w-full rounded-full bg-gradient-to-r from-amber-500 to-indigo-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:shadow-lg active:scale-95"
              data-testid="challenge-join-signin"
            >
              Sign in to Join
            </Link>
          </div>
        ) : (
          <form action={`/api/challenges/${challenge.id}/join`} method="POST" className="mt-6">
            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-amber-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg active:scale-95"
              data-testid="challenge-join-button"
            >
              Join Challenge
            </button>
          </form>
        )}
      </div>

      {/* Back Link */}
      <div className="text-center">
        <Link
          href={`/challenges/${challenge.id}`}
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to challenge details
        </Link>
      </div>
    </div>
  );
}
