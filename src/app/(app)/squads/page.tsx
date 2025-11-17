import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { InstantValueBanner } from "@/components/squads/InstantValueBanner";
import { EnhancedSquadCard } from "@/components/squads/EnhancedSquadCard";
import { FiltersAndSort } from "@/components/squads/FiltersAndSort";
import { SmartRecommendations } from "@/components/squads/SmartRecommendations";
import { getFeaturedSquads, matchSquadsToHabits } from "@/data/mockSquadsFull";

export const dynamic = "force-dynamic";

export default async function SquadsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">
          Join the community by{" "}
          <Link href="/auth/sign-in" className="font-semibold text-blue-600">
            signing in
          </Link>
          .
        </p>
      </div>
    );
  }

  // Fetch user memberships
  const { data: memberships } = await supabase
    .from("squad_members")
    .select("role, joined_at, squad:squads(id, name, description, member_count, invite_code)")
    .eq("user_id", user.id);

  // Fetch user habits for smart recommendations
  const { data: habits } = await supabase
    .from("habits")
    .select("title")
    .eq("user_id", user.id)
    .eq("archived", false);

  const membershipRows = (memberships ?? []).map((entry) => ({
    id: (entry as any).squad?.id ? String((entry as any).squad.id) : undefined,
    name: (entry as any).squad?.name ?? "Squad",
    description: (entry as any).squad?.description ?? "Accountability crew",
    member_count: Number((entry as any).squad?.member_count ?? 0),
    invite_code: (entry as any).squad?.invite_code ?? "",
    role: (entry as any).role ?? "member",
  }));

  // Get mock featured squads
  const featuredSquads = getFeaturedSquads();

  // Get smart recommendations based on user habits
  const userHabitTitles = (habits ?? []).map((h) => h.title);
  const recommendedSquads = matchSquadsToHabits(userHabitTitles);

  const hasNoSquads = membershipRows.length === 0;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <section className="rounded-3xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
              <span>👥</span>
              <span>Better Together</span>
            </div>
            <h1 className="text-2xl font-bold">Squads</h1>
            <p className="mt-1 text-sm opacity-90">
              Rally buddies, share wins, and keep momentum together.
            </p>
          </div>
          <Link
            href="/squads/new"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-50 active:scale-95"
          >
            Create squad
          </Link>
        </div>
      </section>

      {/* Instant Value Banner - Show if user has no squads */}
      {hasNoSquads && <InstantValueBanner />}

      {/* Your Squads Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Your squads</h2>
          <Link href="/squads/join" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            Join with invite code →
          </Link>
        </div>
        {membershipRows.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {membershipRows.map((membership) => (
              <article
                key={membership.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-slate-900">
                    {membership.name}
                  </p>
                  <span className="rounded-full border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-500">
                    {membership.role}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {membership.description}
                </p>
                <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">
                  {membership.member_count} members
                </p>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      {/* Smart Recommendations - Show if user has habits */}
      {recommendedSquads.length > 0 && (
        <SmartRecommendations recommendedSquads={recommendedSquads} />
      )}

      {/* Featured Public Squads Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Featured public squads</h2>
        
        {/* Filters and Sort */}
        <FiltersAndSort />
        
        {/* Squad Grid */}
        {featuredSquads.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredSquads.map((squad) => (
              <EnhancedSquadCard key={squad.id} squad={squad} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
            Public squads will appear here once seeded.
          </div>
        )}
      </section>
    </div>
  );
}

