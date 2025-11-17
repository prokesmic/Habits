import { createClient } from "@/lib/supabase/server";
import { ChallengeCard } from "@/components/cards/ChallengeCard";

export const dynamic = "force-dynamic";

export default async function DiscoverChallengesPage() {
  const supabase = await createClient();

  const { data: featured } = await supabase
    .from("challenges")
    .select("*, stake:stakes(*)")
    .eq("visibility", "public")
    .eq("featured", true)
    .eq("status", "active")
    .order("participant_count", { ascending: false });

  const { data: trending } = await supabase
    .from("challenges")
    .select("*, stake:stakes(*)")
    .eq("visibility", "public")
    .eq("status", "active")
    .gte("participant_count", 10)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Discover challenges</h1>
        <p className="mt-2 text-sm text-slate-500">
          Join public sprints or featured events curated by the Momentum team.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">⭐ Featured</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {featured?.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          )) ?? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
              Featured challenges will appear once seeded.
            </p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">🔥 Trending</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {trending?.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          )) ?? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
              No trending challenges yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

