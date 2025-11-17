"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Plus, Check } from "lucide-react";

interface StreakFreezeCardProps {
  freezesAvailable: number;
  freezesUsedThisMonth: number;
  maxFreezes: number;
  onPurchaseFreeze?: () => void;
}

export function StreakFreezeCard({
  freezesAvailable,
  freezesUsedThisMonth,
  maxFreezes,
  onPurchaseFreeze,
}: StreakFreezeCardProps) {
  const [showPurchaseOptions, setShowPurchaseOptions] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">
            Streak Freeze
          </h3>
        </div>
        <span className="rounded-full bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700">
          {freezesAvailable} available
        </span>
      </div>

      <p className="mb-3 text-xs text-slate-600">
        Protect your streak on days you can't check in. Use wisely – you have{" "}
        <span className="font-semibold">{maxFreezes - freezesUsedThisMonth}</span>{" "}
        freezes left this month.
      </p>

      {/* Freeze indicators */}
      <div className="mb-3 flex gap-1">
        {Array.from({ length: maxFreezes }).map((_, i) => (
          <motion.div
            key={i}
            className={`h-2 flex-1 rounded-full ${
              i < freezesAvailable
                ? "bg-gradient-to-r from-sky-400 to-indigo-400"
                : i < maxFreezes - (freezesUsedThisMonth - freezesAvailable)
                  ? "bg-slate-200"
                  : "bg-slate-100"
            }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>

      {!showPurchaseOptions ? (
        <button
          onClick={() => setShowPurchaseOptions(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-2 text-sm font-medium text-slate-600 transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600"
        >
          <Plus className="h-4 w-4" />
          Get more freezes
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-2"
        >
          <p className="text-xs font-medium text-slate-700">
            Choose your protection:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onPurchaseFreeze?.();
                setShowPurchaseOptions(false);
              }}
              className="rounded-xl bg-slate-50 p-3 text-left transition hover:bg-sky-50"
            >
              <div className="text-sm font-semibold text-slate-900">1 Freeze</div>
              <div className="text-xs text-slate-600">$1.99</div>
            </button>
            <button
              onClick={() => {
                onPurchaseFreeze?.();
                setShowPurchaseOptions(false);
              }}
              className="relative rounded-xl bg-gradient-to-tr from-sky-50 to-indigo-50 p-3 text-left transition hover:from-sky-100 hover:to-indigo-100"
            >
              <div className="absolute -right-1 -top-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                BEST
              </div>
              <div className="text-sm font-semibold text-slate-900">5 Freezes</div>
              <div className="text-xs text-slate-600">
                $7.99 <span className="text-emerald-600">(save 20%)</span>
              </div>
            </button>
          </div>
          <button
            onClick={() => setShowPurchaseOptions(false)}
            className="w-full text-xs text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>
        </motion.div>
      )}

      {/* Pro tip */}
      <div className="mt-3 rounded-lg bg-amber-50 p-2">
        <p className="text-[11px] text-amber-800">
          <span className="font-semibold">💡 Pro tip:</span> Premium members get
          2 free freezes per month. <span className="font-medium underline cursor-pointer">Upgrade now</span>
        </p>
      </div>
    </div>
  );
}
