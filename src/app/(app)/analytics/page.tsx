"use client";

import { Suspense, useState } from "react";
import { Download, BarChart3, LineChart, Lightbulb, FileDown } from "lucide-react";
import { PerformanceOverview } from "@/components/analytics/PerformanceOverview";
import { HabitAnalytics } from "@/components/analytics/HabitAnalytics";
import { InsightsPanel } from "@/components/analytics/InsightsPanel";
import { DataExport } from "@/components/analytics/DataExport";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TabKey = "overview" | "habit" | "insights" | "export";

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "habit", label: "Habit", icon: LineChart },
  { key: "insights", label: "Insights", icon: Lightbulb },
  { key: "export", label: "Export", icon: FileDown },
];

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-slate-100 rounded-full w-64" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-slate-100 rounded-2xl" />
        ))}
      </div>
      <div className="h-80 bg-slate-100 rounded-2xl" />
    </div>
  );
}

export default function AnalyticsDashboardPage() {
  const [tab, setTab] = useState<TabKey>("overview");
  const [habitId, setHabitId] = useState("h1");

  const handleExportCSV = async () => {
    try {
      const response = await fetch("/api/analytics/export?format=csv");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `habitio-analytics-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <div className="space-y-6">
        {/* Hero Header */}
        <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 p-5 md:p-6 text-white shadow-sm shadow-slate-900/10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Left side: Title */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  <span>📊</span>
                  <span>Insights</span>
                </span>
              </div>
              <h1 className="text-2xl font-semibold md:text-3xl">Analytics</h1>
              <p className="text-sm opacity-90">
                Performance, habits, squads & exports
              </p>
            </div>

            {/* Right side: Tabs + Export */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Tab Navigation */}
              <nav
                role="tablist"
                aria-label="Analytics sections"
                className="inline-flex rounded-full bg-white/15 p-1"
              >
                {tabs.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    role="tab"
                    aria-selected={tab === key}
                    aria-controls={`panel-${key}`}
                    onClick={() => setTab(key)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                      tab === key
                        ? "bg-white text-amber-600 shadow-sm"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </nav>

              {/* Export Button */}
              <Button
                variant="white"
                size="sm"
                onClick={handleExportCSV}
                className="gap-1.5"
                aria-label="Export analytics data as CSV"
              >
                <Download className="h-3.5 w-3.5 text-amber-600" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </section>

        {/* Tab Panels */}
        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={tab}>
          {tab === "overview" && (
            <Suspense fallback={<LoadingSkeleton />}>
              <PerformanceOverview />
            </Suspense>
          )}

          {tab === "habit" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm p-4">
                <label className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700">Select habit:</span>
                  <select
                    value={habitId}
                    onChange={(e) => setHabitId(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="h1">🧘 Meditation</option>
                    <option value="h2">💪 Gym</option>
                    <option value="h3">📚 Reading</option>
                  </select>
                </label>
              </div>
              <Suspense fallback={<LoadingSkeleton />}>
                <HabitAnalytics habitId={habitId} />
              </Suspense>
            </div>
          )}

          {tab === "insights" && (
            <Suspense fallback={<LoadingSkeleton />}>
              <InsightsPanel />
            </Suspense>
          )}

          {tab === "export" && (
            <Suspense fallback={<LoadingSkeleton />}>
              <DataExport />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}
