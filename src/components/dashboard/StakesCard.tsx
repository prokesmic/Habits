"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Trophy } from "lucide-react";
import Link from "next/link";

interface StakesCardProps {
  activeStakes: number;
  totalAtRisk: number;
  potentialWinnings: number;
  weeklyProgress: number;
  onAddStake?: () => void;
}

export function StakesCard({
  activeStakes,
  totalAtRisk,
  potentialWinnings,
  weeklyProgress,
  onAddStake,
}: StakesCardProps) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">
            Stakes & Rewards
          </h3>
        </div>
        {activeStakes > 0 && (
          <span className="rounded-full bg-amber-200 px-2 py-1 text-xs font-semibold text-amber-800">
            {activeStakes} active
          </span>
        )}
      </div>

      {activeStakes > 0 ? (
        <>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/70 p-3">
              <div className="mb-1 flex items-center gap-1 text-xs text-slate-600">
                <TrendingUp className="h-3 w-3" />
                At Risk
              </div>
              <div className="text-lg font-bold text-rose-600">
                ${totalAtRisk}
              </div>
            </div>
            <div className="rounded-xl bg-white/70 p-3">
              <div className="mb-1 flex items-center gap-1 text-xs text-slate-600">
                <Trophy className="h-3 w-3" />
                To Win
              </div>
              <div className="text-lg font-bold text-emerald-600">
                ${potentialWinnings}
              </div>
            </div>
          </div>

          {/* Weekly progress */}
          <div className="mb-3">
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-slate-600">Weekly completion</span>
              <span className="font-semibold text-slate-900">
                {weeklyProgress}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white">
              <motion.div
                className={`h-full rounded-full ${
                  weeklyProgress >= 80
                    ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                    : weeklyProgress >= 50
                      ? "bg-gradient-to-r from-amber-400 to-amber-500"
                      : "bg-gradient-to-r from-rose-400 to-rose-500"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${weeklyProgress}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>

          <div className="rounded-lg bg-white/70 p-2">
            <p className="text-[11px] text-amber-900">
              {weeklyProgress >= 80 ? (
                <>
                  <span className="font-semibold">🎉 On track!</span> Keep it up
                  to win ${potentialWinnings} this week
                </>
              ) : weeklyProgress >= 50 ? (
                <>
                  <span className="font-semibold">⚠️ Stay focused!</span> You need{" "}
                  {100 - weeklyProgress}% more to secure your stake
                </>
              ) : (
                <>
                  <span className="font-semibold">🚨 Risk alert!</span> You may
                  lose ${totalAtRisk} if you don't catch up
                </>
              )}
            </p>
          </div>

          <Link
            href="/stakes"
            className="mt-3 block w-full rounded-xl bg-white py-2 text-center text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
          >
            View stake details →
          </Link>
        </>
      ) : (
        <div className="text-center">
          <p className="mb-3 text-xs text-slate-600">
            Put money on your habits to stay extra motivated. Lose focus = lose
            cash. Stay consistent = win big!
          </p>
          <button
            onClick={onAddStake}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-amber-500/30 transition hover:shadow-md hover:shadow-amber-500/40 active:scale-95"
          >
            💰 Add your first stake
          </button>
          <p className="mt-2 text-[11px] text-slate-500">
            Start with as little as $5
          </p>
        </div>
      )}
    </div>
  );
}
