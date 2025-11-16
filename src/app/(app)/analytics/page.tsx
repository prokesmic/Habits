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
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-500">Performance, habits, social and data exports</p>
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
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                tab === k ? "bg-violet-600 text-white" : "border border-slate-200 bg-white text-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>
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


