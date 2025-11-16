"use client";

import type { User } from "@/types/challenge";

export function ChallengeSent({ challengeId, friend, onClose }: { challengeId: string; friend: User; onClose: () => void }) {
  const link = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/challenge/${challengeId}`;
  return (
    <div className="text-center">
      <p className="text-2xl">🎉</p>
      <h2 className="mt-2 text-lg font-semibold text-slate-900">Challenge sent to {friend.name}!</h2>
      <p className="mt-1 text-sm text-slate-600">They have 24 hours to accept</p>
      <p className="mt-4 text-xs text-slate-500 break-words">{link}</p>
      <div className="mt-6 flex justify-center gap-2">
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(link);
              alert("Share link copied!");
            } catch {
              // ignore
            }
          }}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
        >
          Share on social
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Done
        </button>
      </div>
    </div>
  );
}


