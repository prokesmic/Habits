import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { allSquads } from "@/data/mockSquadsFull";
import { TriforceMetaLine, createQuickTriforceInfo } from "@/components/ui/TriforceBadges";

export const dynamic = "force-dynamic";

type Squad = {
  id: string;
  name: string;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  tagline: string;
  members: number;
  dailyCheckinsPercent: number;
  successPercent: number;
  // Triforce: Challenge info (optional - squad may have active challenge)
  challengeDays?: number;
  // Triforce: Stake info (optional - challenge may have stakes)
  entryStake: number;
  poolAmount: number;
  topHabits: string[];
  isJoined?: boolean;
};

// Transform mock data to new format
function transformSquadData(mockSquad: typeof allSquads[0]): Squad {
  // Map cover colors to gradient classes
  const gradientMap: Record<string, { from: string; to: string }> = {
    "from-orange-400 to-red-500": { from: "from-amber-500", to: "to-rose-500" },
    "from-blue-400 to-purple-500": { from: "from-indigo-500", to: "to-violet-500" },
    "from-green-400 to-teal-500": { from: "from-emerald-500", to: "to-teal-500" },
    "from-indigo-400 to-blue-600": { from: "from-indigo-500", to: "to-blue-600" },
    "from-pink-400 to-rose-500": { from: "from-pink-500", to: "to-rose-500" },
    "from-yellow-400 to-orange-500": { from: "from-amber-500", to: "to-orange-500" },
    "from-purple-400 to-indigo-600": { from: "from-purple-500", to: "to-indigo-600" },
    "from-emerald-400 to-green-600": { from: "from-emerald-500", to: "to-green-600" },
    "from-red-400 to-pink-500": { from: "from-red-500", to: "to-pink-500" },
    "from-amber-400 to-yellow-600": { from: "from-amber-500", to: "to-yellow-600" },
    "from-cyan-400 to-blue-500": { from: "from-cyan-500", to: "to-blue-500" },
    "from-violet-400 to-purple-600": { from: "from-violet-500", to: "to-purple-600" },
  };

  const gradient = gradientMap[mockSquad.coverColor] || { from: "from-amber-500", to: "to-indigo-500" };

  return {
    id: mockSquad.id,
    name: mockSquad.name,
    emoji: mockSquad.emoji,
    gradientFrom: gradient.from,
    gradientTo: gradient.to,
    tagline: mockSquad.description || "Join the accountability crew.",
    members: mockSquad.memberCount,
    dailyCheckinsPercent: mockSquad.checkInRate,
    successPercent: mockSquad.checkInRate,
    // Triforce: Default to 30-day challenge if there's a stake
    challengeDays: mockSquad.entryStake > 0 ? 30 : undefined,
    entryStake: mockSquad.entryStake,
    poolAmount: mockSquad.totalPool,
    topHabits: mockSquad.topHabits,
  };
}

export default async function SquadsPage() {
  let user = null;
  let memberships = null;

  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    user = authUser;

    if (user) {
      // Fetch user memberships only if user is authenticated
      const { data } = await supabase
        .from("squad_members")
        .select("role, joined_at, squad:squads(id, name, description, member_count, invite_code)")
        .eq("user_id", user.id);

      memberships = data;
    }
  } catch (error) {
    console.error("Error fetching squads data:", error);
    // Continue with null user - will show sign-in prompt
  }

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

  // Transform user's squads with safe error handling
  const yourSquads: Squad[] = [];
  for (const entry of memberships ?? []) {
    try {
      const squadData = (entry as any).squad;
      if (!squadData || !squadData.id) continue;
      yourSquads.push({
        id: String(squadData.id),
        name: squadData.name ?? "Squad",
        emoji: "👥",
        gradientFrom: "from-indigo-500",
        gradientTo: "to-violet-500",
        tagline: squadData.description ?? "Accountability crew",
        members: Number(squadData.member_count ?? 0),
        dailyCheckinsPercent: 85,
        successPercent: 85,
        entryStake: 0,
        poolAmount: 0,
        topHabits: [],
        isJoined: true,
      });
    } catch (e) {
      console.error("Error transforming squad data:", e);
    }
  }

  // Get featured squads from mock data with safe error handling
  let featuredSquads: Squad[] = [];
  try {
    featuredSquads = allSquads.filter(s => s.featured).map(transformSquadData);
  } catch (e) {
    console.error("Error loading featured squads:", e);
  }

  const userHasSquads = yourSquads.length > 0;

  return (
    <div className="space-y-8">
      <SquadHero userHasSquads={userHasSquads} squadCount={yourSquads.length} />

      <div className="space-y-8">
        {!userHasSquads && (
          <JoinFirstSquadPanel squads={featuredSquads.slice(0, 6)} />
        )}

        {userHasSquads && yourSquads.length > 0 && (
          <YourSquadsRow squads={yourSquads} />
        )}

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Explore public squads
              </h2>
              <p className="text-xs text-slate-500">
                Filter by focus, stakes, or vibe - then join the ones that fit.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Sort by:</span>
              <button className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-medium text-slate-800 shadow-sm shadow-slate-900/5 hover:bg-slate-50">
                Most active
              </button>
            </div>
          </div>

          <SquadFiltersBar />

          <SquadCardGrid squads={featuredSquads} />
        </section>
      </div>
    </div>
  );
}

/* ===== HERO ===== */

function SquadHero({ userHasSquads, squadCount }: { userHasSquads: boolean; squadCount: number }) {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 p-6 text-white shadow-sm shadow-slate-900/10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <span>👥</span>
            <span>Better together</span>
          </span>
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">Squads</h1>
            <p className="mt-1 text-sm md:text-base opacity-95">
              Rally buddies, share wins, and keep momentum together. Squads boost
              habit success by <span className="font-semibold">4.2x</span>.
            </p>
          </div>
          <p className="text-xs opacity-90">
            Join a public squad or create your own private crew.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <Link
            href="/squads/new"
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-amber-600 shadow-sm shadow-slate-900/10 transition hover:bg-amber-50"
          >
            Create a squad
          </Link>
          <Link
            href="/squads/join"
            className="inline-flex items-center justify-center rounded-full border border-white/50 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15"
          >
            Join with invite code
          </Link>
          {userHasSquads && (
            <p className="text-[11px] opacity-80">
              You&apos;re already in{" "}
              <span className="font-semibold">{squadCount} squad{squadCount !== 1 ? "s" : ""}</span>. Explore more or
              start your own.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ===== JOIN FIRST SQUAD PANEL ===== */

function JoinFirstSquadPanel({ squads }: { squads: Squad[] }) {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-900/5">
      <div className="mb-4 space-y-1">
        <h2 className="text-base font-semibold text-slate-900">
          Join your first squad
        </h2>
        <p className="text-xs text-slate-500">
          Pick a starting squad that matches your current focus. You can always
          join or create more later.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-6">
        {squads.map((squad) => (
          <Link
            key={squad.id}
            href={`/squads/${squad.id}/join`}
            className="flex flex-col items-center gap-1 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-center text-xs font-medium text-slate-800 shadow-sm shadow-slate-900/5 hover:bg-white hover:shadow-md transition"
          >
            <div className={`mb-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr ${squad.gradientFrom} ${squad.gradientTo} text-lg`}>
              <span className="text-white">{squad.emoji}</span>
            </div>
            <span className="truncate text-[13px] font-semibold">
              {squad.name}
            </span>
            <span className="text-[11px] text-emerald-600">
              From ${squad.entryStake}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-slate-500">Prefer something custom?</span>
        <Link
          href="/squads/new"
          className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-4 py-1.5 font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          Create your own
        </Link>
      </div>
    </section>
  );
}

/* ===== YOUR SQUADS ROW ===== */

function YourSquadsRow({ squads }: { squads: Squad[] }) {
  if (!squads.length) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Your squads</h2>
        <p className="text-xs text-slate-500">
          Tap a squad to view the feed, members, and challenges.
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {squads.map((squad) => (
          <Link
            key={squad.id}
            href={`/squads/${squad.id}`}
            className="min-w-[210px] flex-1 rounded-2xl bg-white shadow-sm shadow-slate-900/5 hover:shadow-md transition"
          >
            <div
              className={`rounded-t-2xl bg-gradient-to-r ${squad.gradientFrom} ${squad.gradientTo} px-4 py-3 text-sm font-semibold text-white flex items-center gap-2`}
            >
              <span>{squad.emoji}</span>
              <span>{squad.name}</span>
            </div>
            <div className="px-4 py-3 text-xs text-slate-600">
              <p className="mb-1">
                🔥 <span className="font-semibold">{squad.successPercent}%</span>{" "}
                success · {squad.members.toLocaleString()} members
              </p>
              <p className="text-[11px] text-slate-500">
                Tap to jump into the squad feed.
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ===== FILTERS BAR ===== */

function SquadFiltersBar() {
  const categories = [
    { label: "All", emoji: "✨" },
    { label: "Fitness", emoji: "💪" },
    { label: "Reading", emoji: "📚" },
    { label: "Mindfulness", emoji: "🧘" },
    { label: "Productivity", emoji: "⚡" },
    { label: "Health", emoji: "🥗" },
    { label: "Learning", emoji: "🎯" },
  ];

  const sortOptions = [
    "Trending",
    "New",
    "High stakes",
    "Most active",
    "Beginner friendly",
  ];

  return (
    <div className="space-y-3">
      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-medium text-slate-500 self-center">Focus:</span>
        {categories.map((cat, idx) => (
          <button
            key={cat.label}
            className={
              idx === 0
                ? "rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white flex items-center gap-1"
                : "rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm shadow-slate-900/5 hover:bg-slate-50 flex items-center gap-1"
            }
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-medium text-slate-500 self-center">Sort:</span>
        {sortOptions.map((label, idx) => (
          <button
            key={label}
            className={
              idx === 0
                ? "rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
                : "rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm shadow-slate-900/5 hover:bg-slate-50"
            }
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ===== SQUAD CARDS GRID ===== */

function SquadCardGrid({ squads }: { squads: Squad[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {squads.map((squad) => (
        <SquadCard key={squad.id} squad={squad} />
      ))}
    </div>
  );
}

function SquadCard({ squad }: { squad: Squad }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm shadow-slate-900/8 ring-1 ring-slate-100">
      {/* Gradient header */}
      <div
        className={`flex items-center justify-center bg-gradient-to-r ${squad.gradientFrom} ${squad.gradientTo} px-4 py-5`}
      >
        <span className="text-4xl">{squad.emoji}</span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 px-4 py-4 text-sm">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {squad.name}
          </h3>
          <p className="mt-1 text-xs text-slate-500">{squad.tagline}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1">
            👥 {squad.members.toLocaleString()} members
          </span>
          <span className="inline-flex items-center gap-1">
            🔁 {squad.dailyCheckinsPercent}% daily check-ins
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-600">
            📈 {squad.successPercent}% success
          </span>
        </div>

        {/* Triforce: Squad / Challenge / Stakes */}
        <div className="rounded-2xl bg-slate-50 px-3 py-2">
          <TriforceMetaLine
            info={createQuickTriforceInfo({
              squadName: squad.name,
              memberCount: squad.members,
              challengeDays: squad.challengeDays,
              stakeAmount: squad.entryStake > 0 ? squad.entryStake : undefined,
              totalPool: squad.poolAmount > 0 ? squad.poolAmount : undefined,
            })}
          />
        </div>

        <div className="space-y-1 text-xs">
          <p className="text-slate-500">Top habits:</p>
          <div className="flex flex-wrap gap-1">
            {squad.topHabits.map((habit) => (
              <span
                key={habit}
                className="rounded-full bg-slate-50 px-2 py-0.5 text-[11px] text-slate-700"
              >
                {habit}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
        <Link
          href={squad.isJoined ? `/squads/${squad.id}` : `/squads/${squad.id}/join`}
          className="flex w-full items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/40 hover:bg-indigo-700 transition"
        >
          {squad.isJoined
            ? "View squad"
            : squad.entryStake > 0
              ? `Join challenge · $${squad.entryStake}`
              : "Join squad"
          }
        </Link>
      </div>
    </article>
  );
}
