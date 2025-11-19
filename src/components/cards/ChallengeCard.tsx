import Link from "next/link";
import { joinChallenge } from "@/server/actions/challenges";
import { TriforceBadges, createQuickTriforceInfo } from "@/components/ui/TriforceBadges";

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
  const stakeAmount = challenge.stake
    ? challenge.stake.amount_cents / 100
    : undefined;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{challenge.name}</h3>
          <p className="mt-2 text-sm text-slate-600">
            {challenge.description ?? "Stay accountable with friends worldwide."}
          </p>
          {/* Triforce badges - challenge/participants/stake */}
          <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2">
            <TriforceBadges
              info={createQuickTriforceInfo({
                challengeDays: challenge.duration_days ?? 7,
                memberCount: challenge.participant_count ?? 0,
                stakeAmount: stakeAmount,
              })}
              variant="inline"
            />
          </div>
        </div>
        <form
          action={async () => {
            "use server";
            await joinChallenge(challenge.id);
          }}
        >
          <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            {stakeAmount ? `Join · $${stakeAmount}` : "Join"}
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

