import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { allSquads } from "@/data/mockSquadsFull";

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
    entryStake: mockSquad.entryStake,
    poolAmount: mockSquad.totalPool,
    topHabits: mockSquad.topHabits,
  };
}

export default async function SquadsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-card border border-border-soft bg-white p-6 shadow-card ring-1 ring-border-soft">
        <p className="text-sm text-slate-600">
          Join the community by{" "}
          <Link href="/auth/sign-in" className="font-semibold text-accent-600 hover:text-accent-700">
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

  // Transform user's squads
  const yourSquads: Squad[] = (memberships ?? []).map((entry) => {
    const squadData = (entry as any).squad;
    return {
      id: squadData?.id ? String(squadData.id) : "",
      name: squadData?.name ?? "Squad",
      emoji: "👥",
      gradientFrom: "from-indigo-500",
      gradientTo: "to-violet-500",
      tagline: squadData?.description ?? "Accountability crew",
      members: Number(squadData?.member_count ?? 0),
      dailyCheckinsPercent: 85,
      successPercent: 85,
      entryStake: 0,
      poolAmount: 0,
      topHabits: [],
      isJoined: true,
    };
  }).filter(s => s.id);

  // Get featured squads from mock data
  const featuredSquads = allSquads.filter(s => s.featured).map(transformSquadData);

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
              <h2 className="text-section-title text-slate-900">
                Explore public squads
              </h2>
              <p className="text-meta text-slate-500">
                Filter by focus, stakes, or vibe - then join the ones that fit.
              </p>
            </div>
            <div className="flex items-center gap-2 text-meta text-slate-500">
              <span>Sort by:</span>
              <button className="inline-flex items-center gap-1 rounded-chip bg-white px-3 py-1 font-medium text-slate-800 shadow-soft ring-1 ring-border-soft hover:bg-slate-50">
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
    <section className="rounded-card bg-gradient-hero p-6 text-white shadow-elevated">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 rounded-chip bg-white/15 px-3 py-1 text-chip font-semibold uppercase tracking-wide">
            <span>👥</span>
            <span>Better together</span>
          </span>
          <div>
            <h1 className="text-page-title">Squads</h1>
            <p className="mt-1 text-sm md:text-base opacity-95">
              Rally buddies, share wins, and keep momentum together. Squads boost
              habit success by <span className="font-semibold">4.2x</span>.
            </p>
          </div>
          <p className="text-meta opacity-90">
            Join a public squad or create your own private crew.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <Link
            href="/squads/new"
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-600 shadow-soft transition hover:bg-primary-50 active:scale-95"
          >
            Create a squad
          </Link>
          <Link
            href="/squads/join"
            className="inline-flex items-center justify-center rounded-full border border-white/50 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20"
          >
            Join with invite code
          </Link>
          {userHasSquads && (
            <p className="text-chip opacity-80">
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
    <section className="rounded-card border border-border-soft bg-white p-5 shadow-card ring-1 ring-border-soft">
      <div className="mb-4 space-y-1">
        <h2 className="text-section-title text-slate-900">
          Join your first squad
        </h2>
        <p className="text-meta text-slate-500">
          Pick a starting squad that matches your current focus. You can always
          join or create more later.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-6">
        {squads.map((squad) => (
          <Link
            key={squad.id}
            href={`/squads/${squad.id}/join`}
            className="flex flex-col items-center gap-1 rounded-inner border border-border-soft bg-slate-50 px-3 py-3 text-center text-xs font-medium text-slate-800 shadow-soft hover:bg-white hover:shadow-card hover:-translate-y-0.5 transition-all"
          >
            <div className={`mb-1 flex h-9 w-9 items-center justify-center rounded-inner bg-gradient-to-tr ${squad.gradientFrom} ${squad.gradientTo} text-lg`}>
              <span className="text-white">{squad.emoji}</span>
            </div>
            <span className="truncate text-card-title">
              {squad.name}
            </span>
            <span className="text-chip text-success-600">
              From ${squad.entryStake}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-meta">
        <span className="text-slate-500">Prefer something custom?</span>
        <Link
          href="/squads/new"
          className="inline-flex items-center gap-1 rounded-full bg-accent-600 px-4 py-1.5 font-semibold text-white shadow-soft hover:bg-accent-700 hover:shadow-elevated active:scale-95 transition-all"
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
        <h2 className="text-section-title text-slate-900">Your squads</h2>
        <p className="text-meta text-slate-500">
          Tap a squad to view the feed, members, and challenges.
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {squads.map((squad) => (
          <Link
            key={squad.id}
            href={`/squads/${squad.id}`}
            className="min-w-[210px] flex-1 rounded-inner bg-white shadow-soft ring-1 ring-border-soft hover:shadow-card hover:-translate-y-0.5 transition-all"
          >
            <div
              className={`rounded-t-2xl bg-gradient-to-r ${squad.gradientFrom} ${squad.gradientTo} px-4 py-3 text-sm font-semibold text-white flex items-center gap-2`}
            >
              <span>{squad.emoji}</span>
              <span>{squad.name}</span>
            </div>
            <div className="px-4 py-3 text-body text-slate-600">
              <p className="mb-1">
                🔥 <span className="font-semibold">{squad.successPercent}%</span>{" "}
                success · {squad.members.toLocaleString()} members
              </p>
              <p className="text-chip text-slate-500">
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
        <span className="text-meta font-medium text-slate-500 self-center">Focus:</span>
        {categories.map((cat, idx) => (
          <button
            key={cat.label}
            className={
              idx === 0
                ? "rounded-chip bg-accent-600 px-3 py-1.5 text-chip font-semibold text-white flex items-center gap-1"
                : "rounded-chip bg-white px-3 py-1.5 text-chip font-medium text-slate-600 shadow-soft ring-1 ring-border-soft hover:bg-slate-50 flex items-center gap-1"
            }
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex flex-wrap gap-2">
        <span className="text-meta font-medium text-slate-500 self-center">Sort:</span>
        {sortOptions.map((label, idx) => (
          <button
            key={label}
            className={
              idx === 0
                ? "rounded-chip bg-slate-900 px-3 py-1 text-chip font-semibold text-white"
                : "rounded-chip bg-white px-3 py-1 text-chip font-medium text-slate-600 shadow-soft ring-1 ring-border-soft hover:bg-slate-50"
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
    <article className="flex h-full flex-col overflow-hidden rounded-card bg-white shadow-card ring-1 ring-border-soft hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
      {/* Gradient header */}
      <div
        className={`flex items-center justify-center bg-gradient-to-r ${squad.gradientFrom} ${squad.gradientTo} px-4 py-5`}
      >
        <span className="text-4xl">{squad.emoji}</span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 px-4 py-4 text-body">
        <div>
          <h3 className="text-card-title text-slate-900">
            {squad.name}
          </h3>
          <p className="mt-1 text-meta text-slate-500">{squad.tagline}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-meta text-slate-600">
          <span className="inline-flex items-center gap-1">
            👥 {squad.members.toLocaleString()} members
          </span>
          <span className="inline-flex items-center gap-1">
            🔁 {squad.dailyCheckinsPercent}% daily check-ins
          </span>
          <span className="inline-flex items-center gap-1 text-success-600">
            📈 {squad.successPercent}% success
          </span>
        </div>

        <div className="rounded-inner bg-success-50 px-3 py-2 text-meta text-success-800">
          <div className="flex items-center justify-between">
            <span>
              ${squad.entryStake} entry stake
            </span>
            <span className="font-semibold">
              ${squad.poolAmount.toLocaleString()} pool
            </span>
          </div>
        </div>

        <div className="space-y-1 text-meta">
          <p className="text-slate-500">Top habits:</p>
          <div className="flex flex-wrap gap-1">
            {squad.topHabits.map((habit) => (
              <span
                key={habit}
                className="rounded-chip bg-slate-50 px-2 py-0.5 text-chip text-slate-700"
              >
                {habit}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-border-soft bg-slate-50 px-4 py-3">
        <Link
          href={squad.isJoined ? `/squads/${squad.id}` : `/squads/${squad.id}/join`}
          className="flex w-full items-center justify-center rounded-full bg-accent-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-accent-700 hover:shadow-elevated active:scale-95 transition-all"
        >
          {squad.isJoined ? "View squad" : `Join for $${squad.entryStake}`}
        </Link>
      </div>
    </article>
  );
}
