import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Compass, TrendingUp, Users, Trophy, Dumbbell, Brain, Heart, Sparkles } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

// Mock popular habits data
const popularHabits = [
  {
    id: "1",
    name: "Morning Meditation",
    emoji: "🧘",
    category: "Mindfulness",
    users: 12500,
    avgStreak: 21,
  },
  {
    id: "2",
    name: "Daily Exercise",
    emoji: "💪",
    category: "Fitness",
    users: 18200,
    avgStreak: 14,
  },
  {
    id: "3",
    name: "Read 30 Minutes",
    emoji: "📚",
    category: "Learning",
    users: 9800,
    avgStreak: 18,
  },
  {
    id: "4",
    name: "Drink 8 Glasses Water",
    emoji: "💧",
    category: "Health",
    users: 15400,
    avgStreak: 12,
  },
  {
    id: "5",
    name: "Gratitude Journal",
    emoji: "🙏",
    category: "Mindfulness",
    users: 7600,
    avgStreak: 25,
  },
  {
    id: "6",
    name: "No Social Media",
    emoji: "📵",
    category: "Digital Wellness",
    users: 5200,
    avgStreak: 8,
  },
];

// Mock trending challenges
const trendingChallenges = [
  {
    id: "1",
    name: "30-Day Morning Routine",
    emoji: "🌅",
    participants: 342,
    daysLeft: 18,
    prize: "$500",
  },
  {
    id: "2",
    name: "Fitness February",
    emoji: "🏃",
    participants: 891,
    daysLeft: 24,
    prize: "$1,000",
  },
  {
    id: "3",
    name: "Mindful March",
    emoji: "🧘",
    participants: 156,
    daysLeft: 45,
    prize: "$250",
  },
];

// Habit categories
const categories = [
  { name: "Fitness", emoji: "💪", icon: Dumbbell, count: 156 },
  { name: "Mindfulness", emoji: "🧘", icon: Brain, count: 89 },
  { name: "Health", emoji: "❤️", icon: Heart, count: 124 },
  { name: "Learning", emoji: "📚", icon: Sparkles, count: 78 },
];

export default async function DiscoverPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 p-6 text-white shadow-sm shadow-slate-900/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <Compass className="h-3 w-3" />
              <span>Explore</span>
            </span>
            <div>
              <h1 className="text-2xl font-semibold md:text-3xl">Discover</h1>
              <p className="mt-1 text-sm md:text-base opacity-95">
                Find popular habits, join challenges, and connect with others
              </p>
            </div>
          </div>
          <Link
            href="/habits/new"
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-amber-600 shadow-sm shadow-slate-900/10 transition hover:bg-amber-50"
          >
            Create Custom Habit
          </Link>
        </div>
      </section>

      {/* Popular Habits Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-slate-900">Popular Habits</h2>
          </div>
          <Link href="/habits" className="text-sm font-semibold text-amber-600 hover:text-amber-700">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {popularHabits.map((habit) => (
            <article
              key={habit.id}
              className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 transition hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-500 text-2xl">
                  <span className="text-white">{habit.emoji}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 transition group-hover:text-amber-600">
                    {habit.name}
                  </h3>
                  <p className="text-xs text-slate-500">{habit.category}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {habit.users.toLocaleString()} users
                    </span>
                    <span>Avg {habit.avgStreak}d streak</span>
                  </div>
                </div>
              </div>
              <button className="mt-4 w-full rounded-full bg-amber-50 py-2 text-sm font-semibold text-amber-600 transition hover:bg-amber-100">
                Add to My Habits
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Trending Challenges Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-slate-900">Trending Challenges</h2>
          </div>
          <Link href="/challenges" className="text-sm font-semibold text-amber-600 hover:text-amber-700">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {trendingChallenges.map((challenge) => (
            <article
              key={challenge.id}
              className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-5 shadow-sm shadow-slate-900/5"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-xl">
                  {challenge.emoji}
                </div>
                <h3 className="font-semibold text-slate-900">{challenge.name}</h3>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between rounded-lg bg-white/60 px-3 py-2">
                  <span className="text-slate-600">Participants</span>
                  <span className="font-semibold text-slate-900">{challenge.participants}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-white/60 px-3 py-2">
                  <span className="text-slate-600">Days Left</span>
                  <span className="font-semibold text-slate-900">{challenge.daysLeft}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-white/60 px-3 py-2">
                  <span className="text-slate-600">Prize Pool</span>
                  <span className="font-bold text-indigo-600">{challenge.prize}</span>
                </div>
              </div>

              <Link
                href={`/challenges/${challenge.id}/join`}
                className="mt-4 flex w-full items-center justify-center rounded-full bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-500/40 transition hover:bg-indigo-700"
              >
                Join Challenge
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Browse by Category</h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((category) => {
            return (
              <Link
                key={category.name}
                href={`/discover?category=${category.name.toLowerCase()}`}
                className="group rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm shadow-slate-900/5 transition hover:border-amber-300 hover:shadow-md"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-500 text-2xl">
                  <span className="text-white">{category.emoji}</span>
                </div>
                <h3 className="font-semibold text-slate-900 transition group-hover:text-amber-600">
                  {category.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500">{category.count} habits</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Squads */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-900">Featured Squads</h2>
          </div>
          <Link href="/squads" className="text-sm font-semibold text-amber-600 hover:text-amber-700">
            View All
          </Link>
        </div>

        <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-8 text-center shadow-sm shadow-slate-900/5">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <Users className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Join a Squad</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            Accountability squads help you stay on track. Find like-minded people to build habits together and boost your success by 4.2x.
          </p>
          <Link
            href="/squads"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-500/40 transition hover:bg-indigo-700"
          >
            Find Your Squad
          </Link>
        </div>
      </section>
    </div>
  );
}
