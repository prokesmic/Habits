"use client";

import { useState } from "react";

type Props = {
  habitId?: string;
  challengeId?: string;
};

export function StakesManager({ habitId, challengeId }: Props) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(10);
  const [autoRenew, setAutoRenew] = useState(false);
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    try {
      // call backend to create/update stake
      console.log("Saving stake", { habitId, challengeId, amount, autoRenew });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
      >
        Manage stake
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">Stake settings</h2>
            <p className="mt-1 text-sm text-slate-600">
              Set the amount you commit. If you miss, you lose the stake; if you win, you earn.
            </p>
            <div className="mt-4 grid gap-3">
              <label className="text-sm font-semibold text-slate-700">
                Amount
                <select
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                >
                  {[5, 10, 15, 20, 25, 50, 100].map((v) => (
                    <option key={v} value={v}>
                      ${v}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={autoRenew}
                  onChange={(e) => setAutoRenew(e.target.checked)}
                  className="h-4 w-4"
                />
                Auto-renew weekly
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={loading}
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save stake"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


