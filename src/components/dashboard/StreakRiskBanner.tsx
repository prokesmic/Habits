"use client";

import { motion } from "framer-motion";
import { Clock, Shield } from "lucide-react";

interface StreakRiskBannerProps {
  hoursRemaining: number;
  streakDays: number;
  hasStreakFreeze: boolean;
  onUseFreeze?: () => void;
  onCheckIn?: () => void;
}

export function StreakRiskBanner({
  hoursRemaining,
  streakDays,
  hasStreakFreeze,
  onUseFreeze,
  onCheckIn,
}: StreakRiskBannerProps) {
  const isUrgent = hoursRemaining <= 3;
  const isWarning = hoursRemaining <= 6;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl p-4 ${
        isUrgent
          ? "bg-gradient-to-r from-red-500 to-rose-600"
          : isWarning
            ? "bg-gradient-to-r from-amber-500 to-orange-500"
            : "bg-gradient-to-r from-amber-400 to-amber-500"
      }`}
    >
      {/* Animated pulse effect for urgent */}
      {isUrgent && (
        <motion.div
          className="absolute inset-0 bg-white/10"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div className="relative z-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div className="text-white">
            <p className="font-semibold">
              {isUrgent ? "⚠️ Streak at risk!" : "🔥 Don't break your streak!"}
            </p>
            <p className="text-sm opacity-90">
              {hoursRemaining <= 1
                ? "Less than 1 hour remaining"
                : `${hoursRemaining} hours remaining`}{" "}
              to maintain your{" "}
              <span className="font-bold">{streakDays}-day streak</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onCheckIn}
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-amber-600 shadow-sm transition hover:bg-amber-50 active:scale-95"
          >
            Check in now
          </button>
          {hasStreakFreeze && (
            <button
              onClick={onUseFreeze}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 active:scale-95"
            >
              <Shield className="h-4 w-4" />
              Use streak freeze
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
