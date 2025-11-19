"use client";
import { Suspense, useState } from "react";
import { PerformanceOverview } from "@/components/analytics/PerformanceOverview";
import { HabitAnalytics } from "@/components/analytics/HabitAnalytics";
import { InsightsPanel } from "@/components/analytics/InsightsPanel";
import { DataExport } from "@/components/analytics/DataExport";

export default function AnalyticsDashboardPage() {
  const [tab, setTab] = useState<"overview" | "habit" | "insights" | "export">("overview");
  const [habitId, setHabitId] = useState("h1");
  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 p-6 text-white shadow-sm shadow-slate-900/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <span>📊</span>
              <span>Insights</span>
            </span>
            <div>
              <h1 className="text-2xl font-semibold md:text-3xl">Analytics</h1>
              <p className="mt-1 text-sm md:text-base opacity-95">
                Performance, habits, social and data exports
              </p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-2">
            {[
              ["overview", "Overview"],
              ["habit", "Habit"],
              ["insights", "Insights"],
              ["export", "Export"],
            ].map(([k, label]) => (
              <button
                key={k}
                onClick={() => setTab(k as any)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  tab === k
                    ? "bg-white text-amber-600 shadow-sm"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </section>
      {tab === "overview" && (
        <Suspense fallback={<div>Loading…</div>}>
          <PerformanceOverview />
        </Suspense>
      )}
      {tab === "habit" && (
        <div className="space-y-4">
          <div className="rounded-lg border bg-white p-4">
            <label className="text-sm font-semibold text-slate-700">
              Habit
              <select
                value={habitId}
                onChange={(e) => setHabitId(e.target.value)}
                className="ml-2 rounded-xl border border-slate-200 px-3 py-1.5 text-sm"
              >
                <option value="h1">Meditation</option>
                <option value="h2">Gym</option>
                <option value="h3">Reading</option>
              </select>
            </label>
          </div>
          <Suspense fallback={<div>Loading…</div>}>
            <HabitAnalytics habitId={habitId} />
          </Suspense>
        </div>
      )}
      {tab === "insights" && (
        <Suspense fallback={<div>Loading…</div>}>
          <InsightsPanel />
        </Suspense>
      )}
      {tab === "export" && (
        <Suspense fallback={<div>Loading…</div>}>
          <DataExport />
        </Suspense>
      )}
    </div>
  );
}


