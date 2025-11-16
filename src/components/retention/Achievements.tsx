"use client";

import { achievements } from "@/data/achievements";

export function AchievementsWidget() {
  return (
    <section className="rounded-2xl border border-purple-200 bg-purple-50 p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">Achievements</p>
        <a href="/recap" className="text-xs font-semibold text-purple-700">
          View recap →
        </a>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {achievements.map((a) => (
          <li key={a.id} className="flex items-center gap-3 rounded-xl border border-purple-200 bg-white p-3">
            <span className="text-2xl">{a.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">{a.title}</p>
              <p className="text-xs text-slate-600">{a.description}</p>
              {"progress" in a && a.progress !== undefined ? (
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full bg-purple-500" style={{ width: `${a.progress}%` }} />
                </div>
              ) : null}
            </div>
            {a.earnedAt ? (
              <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                Earned
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}


