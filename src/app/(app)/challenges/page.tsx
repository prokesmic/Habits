import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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
          <Link href="/sign-in" className="font-semibold text-blue-600">
            signing in
          </Link>
          .
        </p>
      </div>
    );
  }

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
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Challenges</h1>
          <p className="text-sm text-slate-500">
            Launch 1v1 duels, group sprints, or discover public showdowns.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/challenges/discover"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            Discover
          </Link>
          <Link
            href="/challenges/new"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Create challenge
          </Link>
        </div>
      </header>

      {challengeRows.length ? (
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
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
          Join a public challenge to get started!
        </div>
      )}
    </div>
  );
}

