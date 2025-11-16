"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "./MetricCard";

type TimelineDay = { date: string; completed: boolean; frozen: boolean; paidRecovery: boolean };
type Consistency = { perfectWeeks: number; perfectMonths: number; longestGap: number; averageGap: number };
type Performance = { totalCheckIns: number; possibleCheckIns: number; successRate: number; currentStreak: number; longestStreak: number; averageStreak: number };
type Predictions = { probabilityOfSuccess: number; riskDays: string[]; recommendedActions: string[] };

type HabitAnalyticsData = {
  habitName: string;
  performance: Performance;
  consistency: Consistency;
  timeline: TimelineDay[];
  predictions: Predictions;
};

export function HabitAnalytics({ habitId }: { habitId: string }) {
  const [data, setData] = useState<HabitAnalyticsData | null>(null);
  useEffect(() => {
    void load();
  }, [habitId]);
  async function load() {
    try {
      const res = await fetch(`/api/analytics/habits/${habitId}`);
      const d = await res.json();
      setData(d);
    } catch {
      setData(mockHabitAnalytics());
    }
  }
  if (!data) return <div className="text-sm text-slate-600">Loading...</div>;
  const { performance, consistency, timeline, predictions } = data;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{data.habitName} Analytics</h2>
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Success Rate" value={`${performance.successRate.toFixed(1)}%`} icon="✅" />
        <MetricCard title="Current Streak" value={`${performance.currentStreak} days`} icon="🔥" />
        <MetricCard title="Longest Streak" value={`${performance.longestStreak} days`} icon="🏆" />
        <MetricCard title="Average Streak" value={`${performance.averageStreak.toFixed(0)} days`} icon="📊" />
      </div>
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Consistency</h3>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-violet-600">{consistency.perfectWeeks}</div>
            <div className="text-sm text-gray-600">Perfect Weeks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-violet-600">{consistency.perfectMonths}</div>
            <div className="text-sm text-gray-600">Perfect Months</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">{consistency.longestGap}</div>
            <div className="text-sm text-gray-600">Longest Gap (days)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{consistency.averageGap.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Avg Gap (days)</div>
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Timeline</h3>
        <HabitHeatmap timeline={timeline} />
      </div>
      <div className="rounded-lg border border-violet-200 bg-violet-50 p-6">
        <h3 className="mb-4 text-lg font-semibold">📈 Predictions & Recommendations</h3>
        <div className="mb-4">
          <div className="mb-1 text-sm text-gray-600">Probability of 7-day success</div>
          <div className="flex items-center gap-4">
            <div className="h-4 flex-1 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full bg-gradient-to-r from-green-500 to-green-600" style={{ width: `${predictions.probabilityOfSuccess}%` }} />
            </div>
            <div className="text-2xl font-bold text-green-600">{predictions.probabilityOfSuccess}%</div>
          </div>
        </div>
        {predictions.riskDays.length > 0 && (
          <div className="mb-4">
            <div className="mb-2 text-sm font-medium">⚠️ Risk Days</div>
            <div className="flex gap-2">
              {predictions.riskDays.map((d) => (
                <span key={d} className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700">
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}
        <div>
          <div className="mb-2 text-sm font-medium">💡 Recommended Actions</div>
          <ul className="space-y-2">
            {predictions.recommendedActions.map((a, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-violet-600">•</span>
                <span className="text-sm">{a}</span>
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
      <div className="inline-flex gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => {
              let bg = "bg-gray-100";
              if (day.completed) bg = "bg-green-500";
              if (day.frozen) bg = "bg-blue-500";
              if (day.paidRecovery) bg = "bg-purple-500";
              return <div key={di} className={`h-3 w-3 rounded-sm ${bg}`} title={day.date} />;
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
    predictions: { probabilityOfSuccess: 78, riskDays: ["Thursday", "Sunday"], recommendedActions: ["Set a 7am reminder", "Prepare environment night before"] },
  };
}


