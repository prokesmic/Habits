"use client";

import { useState } from "react";
import Link from "next/link";
import { DollarSign, TrendingUp, Trophy, Calendar, Target, ArrowLeft, Plus, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type Stake = {
  id: string;
  habitName: string;
  habitEmoji: string;
  amount: number;
  potentialWin: number;
  startDate: string;
  endDate: string;
  weeklyProgress: number;
  status: "active" | "won" | "lost" | "pending";
  daysRemaining: number;
  completedDays: number;
  totalDays: number;
};

// Mock data - replace with real API call
const mockStakes: Stake[] = [
  {
    id: "1",
    habitName: "Morning Meditation",
    habitEmoji: "🧘",
    amount: 25,
    potentialWin: 37.5,
    startDate: "2024-11-18",
    endDate: "2024-11-24",
    weeklyProgress: 85,
    status: "active",
    daysRemaining: 3,
    completedDays: 4,
    totalDays: 7,
  },
  {
    id: "2",
    habitName: "Gym Workout",
    habitEmoji: "💪",
    amount: 50,
    potentialWin: 75,
    startDate: "2024-11-18",
    endDate: "2024-11-24",
    weeklyProgress: 60,
    status: "active",
    daysRemaining: 3,
    completedDays: 3,
    totalDays: 5,
  },
  {
    id: "3",
    habitName: "Read 30 mins",
    habitEmoji: "📚",
    amount: 20,
    potentialWin: 30,
    startDate: "2024-11-11",
    endDate: "2024-11-17",
    weeklyProgress: 100,
    status: "won",
    daysRemaining: 0,
    completedDays: 7,
    totalDays: 7,
  },
  {
    id: "4",
    habitName: "No Social Media",
    habitEmoji: "📵",
    amount: 15,
    potentialWin: 22.5,
    startDate: "2024-11-04",
    endDate: "2024-11-10",
    weeklyProgress: 42,
    status: "lost",
    daysRemaining: 0,
    completedDays: 3,
    totalDays: 7,
  },
];

type FilterType = "all" | "active" | "won" | "lost";

const statusConfig = {
  active: {
    label: "Active",
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
    Icon: Clock,
  },
  won: {
    label: "Won",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
    Icon: CheckCircle2,
  },
  lost: {
    label: "Lost",
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
    Icon: XCircle,
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
    Icon: Clock,
  },
};

function StakeCard({ stake }: { stake: Stake }) {
  const config = statusConfig[stake.status];
  const StatusIcon = config.Icon;

  return (
    <div className={cn(
      "rounded-2xl border bg-white p-4 md:p-5 shadow-sm transition-all duration-200 hover:shadow-md",
      stake.status === "active" ? "border-amber-200" : "border-slate-200"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 text-2xl">
            {stake.habitEmoji}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{stake.habitName}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                config.bg,
                config.text
              )}>
                <StatusIcon className="h-3 w-3" />
                {config.label}
              </span>
              {stake.status === "active" && stake.daysRemaining > 0 && (
                <span className="text-xs text-slate-500">
                  {stake.daysRemaining} days left
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Amount Info */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl bg-rose-50 p-3">
          <div className="flex items-center gap-1 text-xs text-slate-600 mb-1">
            <TrendingUp className="h-3 w-3" />
            At Risk
          </div>
          <div className="text-lg font-bold text-rose-600">${stake.amount}</div>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3">
          <div className="flex items-center gap-1 text-xs text-slate-600 mb-1">
            <Trophy className="h-3 w-3" />
            {stake.status === "won" ? "Won" : "To Win"}
          </div>
          <div className="text-lg font-bold text-emerald-600">${stake.potentialWin}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-600">
            Progress ({stake.completedDays}/{stake.totalDays} days)
          </span>
          <span className="font-semibold text-slate-900">{stake.weeklyProgress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              stake.weeklyProgress >= 80
                ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                : stake.weeklyProgress >= 50
                  ? "bg-gradient-to-r from-amber-400 to-amber-500"
                  : "bg-gradient-to-r from-rose-400 to-rose-500"
            )}
            style={{ width: `${stake.weeklyProgress}%` }}
          />
        </div>
      </div>

      {/* Date Range */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Calendar className="h-3 w-3" />
        <span>
          {new Date(stake.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          {" - "}
          {new Date(stake.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>

      {/* Status Message */}
      {stake.status === "active" && (
        <div className={cn(
          "mt-3 rounded-lg p-2 text-xs",
          stake.weeklyProgress >= 80
            ? "bg-emerald-50 text-emerald-800"
            : stake.weeklyProgress >= 50
              ? "bg-amber-50 text-amber-800"
              : "bg-rose-50 text-rose-800"
        )}>
          {stake.weeklyProgress >= 80 ? (
            <span><strong>On track!</strong> Keep it up to secure your win.</span>
          ) : stake.weeklyProgress >= 50 ? (
            <span><strong>Stay focused!</strong> You need {100 - stake.weeklyProgress}% more to win.</span>
          ) : (
            <span><strong>Risk alert!</strong> Catch up or lose ${stake.amount}.</span>
          )}
        </div>
      )}
    </div>
  );
}

export default function StakesPage() {
  const [filter, setFilter] = useState<FilterType>("all");

  const activeStakes = mockStakes.filter(s => s.status === "active");
  const totalAtRisk = activeStakes.reduce((sum, s) => sum + s.amount, 0);
  const totalPotentialWin = activeStakes.reduce((sum, s) => sum + s.potentialWin, 0);
  const totalWon = mockStakes.filter(s => s.status === "won").reduce((sum, s) => sum + s.potentialWin, 0);
  const totalLost = mockStakes.filter(s => s.status === "lost").reduce((sum, s) => sum + s.amount, 0);

  const filteredStakes = filter === "all"
    ? mockStakes
    : mockStakes.filter(s => s.status === filter);

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <div className="space-y-6">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Hero Header */}
        <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-5 md:p-6 text-white shadow-sm shadow-slate-900/10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  <DollarSign className="h-3 w-3" />
                  <span>Stakes</span>
                </span>
              </div>
              <h1 className="text-2xl font-semibold md:text-3xl">Your Stakes</h1>
              <p className="text-sm opacity-90">
                Track your habit stakes and winnings
              </p>
            </div>

            <Link
              href="/stakes/new"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-amber-600 shadow-sm hover:bg-amber-50 transition-colors"
              data-testid="add-stake-button"
            >
              <Plus className="h-4 w-4" />
              Add New Stake
            </Link>
          </div>
        </section>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-lg bg-blue-100 p-1.5">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-slate-600">Active</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{activeStakes.length}</div>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-red-50 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-lg bg-rose-100 p-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
              </div>
              <span className="text-xs font-medium text-slate-600">At Risk</span>
            </div>
            <div className="text-2xl font-bold text-rose-600">${totalAtRisk}</div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-lg bg-emerald-100 p-1.5">
                <Trophy className="h-4 w-4 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-slate-600">To Win</span>
            </div>
            <div className="text-2xl font-bold text-emerald-600">${totalPotentialWin}</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-lg bg-amber-100 p-1.5">
                <DollarSign className="h-4 w-4 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-slate-600">Net P/L</span>
            </div>
            <div className={cn(
              "text-2xl font-bold",
              totalWon - totalLost >= 0 ? "text-emerald-600" : "text-rose-600"
            )}>
              {totalWon - totalLost >= 0 ? "+" : "-"}${Math.abs(totalWon - totalLost)}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {(["all", "active", "won", "lost"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                filter === f
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {f === "all" ? "All Stakes" : f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="ml-1.5 text-xs opacity-70">
                ({f === "all" ? mockStakes.length : mockStakes.filter(s => s.status === f).length})
              </span>
            </button>
          ))}
        </div>

        {/* Stakes List */}
        {filteredStakes.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-slate-100 p-4">
                <DollarSign className="h-8 w-8 text-slate-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No stakes found</h3>
            <p className="text-sm text-slate-500 mb-4">
              {filter === "all"
                ? "You haven't created any stakes yet. Put money on your habits to stay motivated!"
                : `No ${filter} stakes to show.`}
            </p>
            <Link
              href="/stakes/new"
              className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
              data-testid="create-first-stake-button"
            >
              <Plus className="h-4 w-4" />
              Create Your First Stake
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredStakes.map((stake) => (
              <StakeCard key={stake.id} stake={stake} />
            ))}
          </div>
        )}

        {/* How Stakes Work */}
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">How Stakes Work</h3>
          <div className="grid gap-3 md:grid-cols-3 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-[10px]">1</span>
              <span>Choose a habit and stake amount ($5-$100)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-[10px]">2</span>
              <span>Complete 80%+ of your habit to win 1.5x your stake</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-[10px]">3</span>
              <span>Miss your target and your stake goes to the community pool</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
