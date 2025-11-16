"use client";

import Link from "next/link";
import { habitTemplates } from "@/data/habitTemplates";

export function HabitTemplatesQuickAdd() {
  const top = [...habitTemplates].sort((a, b) => b.popularity - a.popularity).slice(0, 8);
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">🎯 Popular Habits (tap to add)</h3>
        <Link href="/habits/templates" className="text-xs font-semibold text-blue-600">
          Browse templates →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {top.map((t) => (
          <Link
            key={t.id}
            href={`/habits/new?name=${encodeURIComponent(t.name)}&emoji=${encodeURIComponent(
              t.emoji,
            )}&frequency=${t.defaultFrequency}&target=${t.defaultTarget}&stake=${t.suggestedStake}`}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            <span className="mr-1">{t.emoji}</span>
            {t.name}
          </Link>
        ))}
      </div>
    </section>
  );
}


