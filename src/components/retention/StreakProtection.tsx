"use client";

import { useMemo, useState } from "react";

type Props = {
  currentStreak: number;
  missedDaysThisWeek?: number;
  freezeTokens?: number;
};

export function StreakProtection({ currentStreak, missedDaysThisWeek = 0, freezeTokens = 1 }: Props) {
  const [tokens, setTokens] = useState(freezeTokens);
  const atRisk = useMemo(() => currentStreak > 0 && missedDaysThisWeek > 0, [currentStreak, missedDaysThisWeek]);

  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Streak Protection</p>
          <p className="text-xs text-slate-600">
            {atRisk ? "You missed a day. Protect your streak!" : "Your streak is safe. You have protection options."}
          </p>
        </div>
        <div className="rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-semibold text-amber-700">
          🔒 Freezes: {tokens}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!atRisk || tokens <= 0}
          onClick={() => {
            if (tokens <= 0) return;
            setTokens(tokens - 1);
            alert("Streak frozen for yesterday. Keep going!");
          }}
          className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Use freeze token
        </button>
        <button
          type="button"
          onClick={() => alert("Recovery purchased. Your streak is restored!")}
          className="rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
        >
          Recover streak ($4.99)
        </button>
        <button
          type="button"
          onClick={() => alert("You earned +1 freeze token by completing 7 days in a row!")}
          className="rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
        >
          Earn more
        </button>
      </div>
    </section>
  );
}


