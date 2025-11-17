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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Compass className="w-8 h-8 text-orange-500" />
          Discover
        </h1>
        <p className="text-gray-600 mt-2">
          Find popular habits, join challenges, and connect with others
        </p>
      </div>

      {/* Popular Habits Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Popular Habits
          </h2>
          <button className="text-sm text-orange-600 font-medium hover:underline">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularHabits.map((habit) => (
            <div
              key={habit.id}
              className="bg-white rounded-xl border p-5 hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{habit.emoji}</div>
                <div className="flex-1">
                  <h3 className="font-semibold group-hover:text-orange-600 transition-colors">
                    {habit.name}
                  </h3>
                  <p className="text-sm text-gray-500">{habit.category}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {habit.users.toLocaleString()} users
                    </span>
                    <span>Avg {habit.avgStreak}d streak</span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 py-2 bg-orange-50 text-orange-600 font-medium rounded-lg hover:bg-orange-100 transition-colors">
                Add to My Habits
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Challenges Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Trending Challenges
          </h2>
          <Link
            href="/challenges"
            className="text-sm text-orange-600 font-medium hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trendingChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{challenge.emoji}</span>
                <h3 className="font-bold">{challenge.name}</h3>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Participants</span>
                  <span className="font-medium">{challenge.participants}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Days Left</span>
                  <span className="font-medium">{challenge.daysLeft}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prize Pool</span>
                  <span className="font-bold text-purple-600">{challenge.prize}</span>
                </div>
              </div>

              <button className="w-full mt-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
                Join Challenge
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Browse by Category */}
      <section>
        <h2 className="text-xl font-bold mb-4">Browse by Category</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                className="bg-white rounded-xl border p-6 hover:shadow-lg transition-all hover:border-orange-300 text-center group"
              >
                <div className="text-4xl mb-3">{category.emoji}</div>
                <h3 className="font-semibold group-hover:text-orange-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{category.count} habits</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Squads */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Featured Squads
          </h2>
          <Link
            href="/squads"
            className="text-sm text-orange-600 font-medium hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2">Join a Squad</h3>
            <p className="text-gray-600 mb-4">
              Accountability squads help you stay on track. Find like-minded people to build habits together.
            </p>
            <Link
              href="/squads"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Find Your Squad
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
