import Link from "next/link";
import { joinChallenge } from "@/server/actions/challenges";

type ChallengeCardProps = {
  challenge: {
    id: string;
    name: string;
    description?: string | null;
    duration_days?: number | null;
    target_completions?: number | null;
    participant_count?: number | null;
    stake?: {
      amount_cents: number;
    } | null;
  };
};

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const stake = challenge.stake
    ? `€${(challenge.stake.amount_cents / 100).toFixed(2)} stake`
    : null;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{challenge.name}</h3>
          <p className="mt-2 text-sm text-slate-600">
            {challenge.description ?? "Stay accountable with friends worldwide."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-wide text-slate-400">
            <span>📅 {challenge.duration_days ?? 7} days</span>
            <span>
              🎯 {challenge.target_completions ?? 5}/{challenge.duration_days ?? 7}
            </span>
            <span>👥 {challenge.participant_count ?? 0} joined</span>
          </div>
          {stake ? (
            <div className="mt-3 rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-800">
              💰 {stake}
            </div>
          ) : null}
        </div>
        <form
          action={async () => {
            "use server";
            await joinChallenge(challenge.id);
          }}
        >
          <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            Join
          </button>
        </form>
      </div>
      <Link
        href={`/challenges/${challenge.id}`}
        className="mt-4 inline-block text-sm font-semibold text-blue-600"
      >
        View details
      </Link>
    </article>
  );
}

