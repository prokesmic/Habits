"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Flame, Trophy, TrendingUp, Calendar, AlertTriangle, Lightbulb, Target } from "lucide-react";
import { AnalyticsStatCard, type StatCardData } from "./AnalyticsStatCard";
import { cn } from "@/lib/utils";

type TimelineDay = { date: string; completed: boolean; frozen: boolean; paidRecovery: boolean };
type Consistency = { perfectWeeks: number; perfectMonths: number; longestGap: number; averageGap: number };
type Performance = { totalCheckIns: number; possibleCheckIns: number; successRate: number; currentStreak: number; longestStreak: number; averageStreak: number };
type Predictions = { probabilityOfSuccess: number; riskDays: string[]; recommendedActions: string[] };

type HabitAnalyticsData = {
  habitName: string;
  habitEmoji?: string;
  performance: Performance;
  consistency: Consistency;
  timeline: TimelineDay[];
  predictions: Predictions;
};

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-slate-100 rounded-lg w-48" />
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-100 rounded-2xl" />
        ))}
      </div>
      <div className="h-40 bg-slate-100 rounded-2xl" />
      <div className="h-32 bg-slate-100 rounded-2xl" />
      <div className="h-48 bg-slate-100 rounded-2xl" />
    </div>
  );
}

export function HabitAnalytics({ habitId }: { habitId: string }) {
  const [data, setData] = useState<HabitAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void load();
  }, [habitId]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/habits/${habitId}`);
      const d = await res.json();
      setData(d);
    } catch {
      setData(mockHabitAnalytics());
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSkeleton />;
  if (!data) return <LoadingSkeleton />;

  const { performance, consistency, timeline, predictions } = data;

  const statCards: StatCardData[] = [
    {
      label: "Success Rate",
      value: `${performance.successRate.toFixed(1)}%`,
      icon: CheckCircle2,
      iconBgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Current Streak",
      value: `${performance.currentStreak} days`,
      icon: Flame,
      iconBgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Longest Streak",
      value: `${performance.longestStreak} days`,
      icon: Trophy,
      iconBgColor: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      label: "Average Streak",
      value: `${performance.averageStreak.toFixed(0)} days`,
      icon: TrendingUp,
      iconBgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-2xl text-white">
          {data.habitEmoji || "🧘"}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{data.habitName} Analytics</h2>
          <p className="text-sm text-slate-500">Detailed performance breakdown</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {statCards.map((stat) => (
          <AnalyticsStatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Consistency Section */}
      <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm p-4 md:p-6 hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-indigo-600" />
          <h3 className="text-base font-semibold text-slate-900">Consistency</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 p-4 text-center border border-violet-100">
            <div className="text-3xl font-bold text-violet-700">{consistency.perfectWeeks}</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Perfect Weeks</div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 p-4 text-center border border-emerald-100">
            <div className="text-3xl font-bold text-emerald-700">{consistency.perfectMonths}</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Perfect Months</div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 text-center border border-amber-100">
            <div className="text-3xl font-bold text-amber-700">{consistency.longestGap}</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Longest Gap</div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4 text-center border border-blue-100">
            <div className="text-3xl font-bold text-blue-700">{consistency.averageGap.toFixed(1)}</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Avg Gap (days)</div>
          </div>
        </div>
      </div>

      {/* Timeline Heatmap */}
      <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm p-4 md:p-6 hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-indigo-600" />
          <h3 className="text-base font-semibold text-slate-900">Activity Timeline</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">Your check-in history over the last 10 weeks</p>
        <HabitHeatmap timeline={timeline} />
        <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-emerald-500" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-blue-500" />
            <span>Frozen</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-violet-500" />
            <span>Recovered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-slate-200" />
            <span>Missed</span>
          </div>
        </div>
      </div>

      {/* Predictions & Recommendations */}
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 shadow-sm p-4 md:p-6 hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-indigo-600" />
          <h3 className="text-base font-semibold text-slate-900">Predictions & Recommendations</h3>
        </div>

        {/* Success Probability */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">7-day success probability</span>
            <span className="text-lg font-bold text-emerald-600">{predictions.probabilityOfSuccess}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500"
              style={{ width: `${predictions.probabilityOfSuccess}%` }}
            />
          </div>
        </div>

        {/* Risk Days */}
        {predictions.riskDays.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-slate-700">Risk Days</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {predictions.riskDays.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Actions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-violet-600" />
            <span className="text-sm font-medium text-slate-700">Recommended Actions</span>
          </div>
          <ul className="space-y-2">
            {predictions.recommendedActions.map((action, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl bg-white/60 p-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
                  {i + 1}
                </div>
                <span className="text-sm text-slate-700">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function HabitHeatmap({ timeline }: { timeline: TimelineDay[] }) {
  const weeks: TimelineDay[][] = [];
  let current: TimelineDay[] = [];
  timeline.forEach((d, idx) => {
    current.push(d);
    if ((idx + 1) % 7 === 0) {
      weeks.push(current);
      current = [];
    }
  });
  if (current.length) weeks.push(current);

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-1.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1.5">
            {week.map((day, di) => {
              let bg = "bg-slate-200";
              if (day.completed) bg = "bg-emerald-500";
              if (day.frozen) bg = "bg-blue-500";
              if (day.paidRecovery) bg = "bg-violet-500";

              const date = new Date(day.date);
              const formatted = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

              return (
                <div
                  key={di}
                  className={cn(
                    "h-4 w-4 rounded-sm transition-all duration-200 hover:scale-125 cursor-pointer",
                    bg
                  )}
                  title={`${formatted}: ${day.completed ? "Completed" : day.frozen ? "Frozen" : day.paidRecovery ? "Recovered" : "Missed"}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function mockHabitAnalytics(): HabitAnalyticsData {
  const timeline = Array.from({ length: 70 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (69 - i));
    const completed = Math.random() > 0.3;
    return {
      date: d.toISOString().split("T")[0],
      completed,
      frozen: !completed && Math.random() < 0.2,
      paidRecovery: !completed && Math.random() < 0.1,
    };
  });
  return {
    habitName: "Meditation",
    habitEmoji: "🧘",
    performance: {
      totalCheckIns: timeline.filter((t) => t.completed).length,
      possibleCheckIns: timeline.length,
      successRate: (timeline.filter((t) => t.completed).length / timeline.length) * 100,
      currentStreak: 6,
      longestStreak: 21,
      averageStreak: 8,
    },
    consistency: { perfectWeeks: 2, perfectMonths: 0, longestGap: 3, averageGap: 1.2 },
    timeline,
    predictions: {
      probabilityOfSuccess: 78,
      riskDays: ["Thursday", "Sunday"],
      recommendedActions: ["Set a 7am reminder", "Prepare environment night before", "Track your mood after completing"],
    },
  };
}
