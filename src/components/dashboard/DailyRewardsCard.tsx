"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface DailyRewardsCardProps {
  currentDay: number;
  hasClaimedToday: boolean;
  weeklyRewards: { day: number; reward: string; claimed: boolean }[];
  onClaimReward?: () => void;
}

export function DailyRewardsCard({
  currentDay,
  hasClaimedToday,
  weeklyRewards,
  onClaimReward,
}: DailyRewardsCardProps) {
  const [isClaiming, setIsClaiming] = useState(false);
  const [justClaimed, setJustClaimed] = useState(false);

  const handleClaim = async () => {
    setIsClaiming(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Celebrate!
    confetti({
      particleCount: 50,
      spread: 40,
      origin: { y: 0.7 },
      colors: ["#f59e0b", "#8b5cf6", "#10b981"],
    });

    setJustClaimed(true);
    onClaimReward?.();
    setIsClaiming(false);
  };

  return (
    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500">
            <span className="text-sm">🎁</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-900">Daily Rewards</h3>
        </div>
        <span className="rounded-full bg-indigo-200 px-2 py-1 text-xs font-semibold text-indigo-800">
          Day {currentDay}
        </span>
      </div>

      {/* Weekly calendar */}
      <div className="mb-3 flex justify-between gap-1">
        {weeklyRewards.map((day) => (
          <div
            key={day.day}
            className={`flex flex-1 flex-col items-center rounded-lg p-2 ${
              day.day === currentDay
                ? "bg-white shadow-sm ring-2 ring-indigo-400"
                : day.claimed
                  ? "bg-white/50"
                  : "bg-white/30"
            }`}
          >
            <span className="text-[10px] font-medium text-slate-500">
              Day {day.day}
            </span>
            <span className="my-1 text-lg">
              {day.claimed ? "✅" : day.reward}
            </span>
            {day.day === currentDay && !hasClaimedToday && !justClaimed && (
              <motion.div
                className="h-1 w-1 rounded-full bg-indigo-500"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!hasClaimedToday && !justClaimed ? (
          <motion.button
            key="claim"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onClick={handleClaim}
            disabled={isClaiming}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-500/30 transition hover:shadow-md hover:shadow-indigo-500/40 active:scale-95 disabled:opacity-70"
          >
            {isClaiming ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  ⏳
                </motion.span>
                Claiming...
              </span>
            ) : (
              `🎁 Claim today's reward (${weeklyRewards[currentDay - 1]?.reward || "🌟"})`
            )}
          </motion.button>
        ) : (
          <motion.div
            key="claimed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-white/70 p-3 text-center"
          >
            <p className="text-sm font-semibold text-emerald-600">
              ✅ Today's reward claimed!
            </p>
            <p className="mt-1 text-[11px] text-slate-600">
              Come back tomorrow for more rewards
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Streak bonus info */}
      <div className="mt-3 rounded-lg bg-white/50 p-2">
        <p className="text-[11px] text-indigo-900">
          <span className="font-semibold">🔥 7-day bonus:</span> Complete all 7
          days for a special mystery reward!
        </p>
      </div>
    </div>
  );
}
