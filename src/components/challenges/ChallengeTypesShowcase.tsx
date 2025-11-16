import Link from "next/link";
import { Swords, Users, Trophy } from "lucide-react";

export function ChallengeTypesShowcase() {
  return (
    <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 sm:p-8">
      <h2 className="mb-6 text-xl font-bold text-slate-900 sm:text-2xl">
        Choose Your Challenge Type:
      </h2>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* 1v1 Duel */}
        <div className="rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-2xl">
              ⚔️
            </div>
            <h3 className="text-lg font-bold text-slate-900">1v1 DUEL</h3>
          </div>
          <p className="mb-4 text-sm text-slate-700">
            Challenge a friend to head-to-head
          </p>
          <p className="mb-2 text-xs font-semibold text-slate-600">Winner takes the pot</p>
          <p className="mb-4 text-xs text-slate-500">Suggested stakes: $10-$100</p>
          <Link
            href="/challenges?filter=1v1"
            className="inline-block rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            Browse duels
          </Link>
        </div>

        {/* Squad Sprint */}
        <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl">
              👥
            </div>
            <h3 className="text-lg font-bold text-slate-900">SQUAD SPRINT</h3>
          </div>
          <p className="mb-4 text-sm text-slate-700">
            Team challenge with shared goals
          </p>
          <p className="mb-2 text-xs font-semibold text-slate-600">Top performers split the pool</p>
          <p className="mb-4 text-xs text-slate-500">Suggested stakes: $15-$50</p>
          <Link
            href="/challenges?filter=squad"
            className="inline-block rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Browse sprints
          </Link>
        </div>

        {/* Public Showdown */}
        <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-2xl">
              🏆
            </div>
            <h3 className="text-lg font-bold text-slate-900">PUBLIC SHOWDOWN</h3>
          </div>
          <p className="mb-4 text-sm text-slate-700">
            Compete against strangers
          </p>
          <p className="mb-2 text-xs font-semibold text-slate-600">Leaderboard-based payouts</p>
          <p className="mb-4 text-xs font-semibold text-purple-700">This week: $2,400 in prizes</p>
          <Link
            href="/challenges?filter=public"
            className="inline-block rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Join showdown
          </Link>
        </div>
      </div>
    </div>
  );
}

