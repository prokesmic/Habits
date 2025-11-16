"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "./MetricCard";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

type Daily = { date: string; checkIns: number; possible: number; percentage: number };
type Weekday = { day: string; successRate: number };
type Hourly = { hour: number; count: number };
type HabitSlice = { habitId: string; habitName: string; habitEmoji: string; totalCheckIns: number; percentage: number; successRate: number };

type Metrics = {
  overall: { totalCheckIns: number; possibleCheckIns: number; successRate: number; averageStreakLength: number };
  trends: { successRateChange: number; streakChange: number; checkInsChange: number };
  dailyBreakdown: Daily[];
  weekdayBreakdown: Weekday[];
  timePatterns: { hourlyDistribution: Hourly[]; bestCheckInTime: string; averageCheckInTime: string };
  habitBreakdown: HabitSlice[];
};

const COLORS = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#14B8A6"];

export function PerformanceOverview() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "year">("30d");
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void load();
  }, [period]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/performance?period=${period}`);
      const data = await res.json();
      setMetrics(data);
    } catch (e) {
      // fallback mock
      setMetrics(mockMetrics());
    } finally {
      setLoading(false);
    }
  }

  if (loading || !metrics) return <div className="text-sm text-slate-600">Loading...</div>;

  const { overall, trends, dailyBreakdown, weekdayBreakdown, timePatterns, habitBreakdown } = metrics;

  return (
    <div className="space-y-8">
      <div className="flex gap-2">
        {[
          { value: "7d", label: "Last 7 days" },
          { value: "30d", label: "Last 30 days" },
          { value: "90d", label: "Last 90 days" },
          { value: "year", label: "This year" },
        ].map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value as any)}
            className={`rounded-lg px-4 py-2 ${period === p.value ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Overall Success Rate" value={`${overall.successRate.toFixed(1)}%`} change={trends.successRateChange} changeLabel="vs prev" icon="✅" />
        <MetricCard title="Average Streak" value={`${overall.averageStreakLength.toFixed(0)} days`} change={trends.streakChange} changeLabel="vs prev" icon="🔥" />
        <MetricCard title="Total Check-ins" value={overall.totalCheckIns} change={trends.checkInsChange} changeLabel="vs prev" icon="📊" />
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Check-ins Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyBreakdown}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="checkIns" stroke="#8B5CF6" strokeWidth={2} name="Check-ins" dot={false} />
            <Line type="monotone" dataKey="possible" stroke="#D1D5DB" strokeWidth={2} name="Possible" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Performance by Day of Week</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weekdayBreakdown}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="successRate" fill="#8B5CF6" name="Success Rate %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Time Patterns</h3>
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-violet-50 p-4 text-center">
            <div className="text-sm text-gray-600">Best Check-in Time</div>
            <div className="text-2xl font-bold text-violet-700">{timePatterns.bestCheckInTime}</div>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 text-center">
            <div className="text-sm text-gray-600">Average Check-in Time</div>
            <div className="text-2xl font-bold text-blue-700">{timePatterns.averageCheckInTime}</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={timePatterns.hourlyDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Check-ins by Habit</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={habitBreakdown} dataKey="totalCheckIns" nameKey="habitName" cx="50%" cy="50%" outerRadius={100} label>
                {habitBreakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3">
            {habitBreakdown.map((habit, i) => (
              <div key={habit.habitId} className="flex items-center gap-3">
                <div className="h-4 w-4 rounded" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-2xl">{habit.habitEmoji}</span>
                <div className="flex-1">
                  <div className="font-medium">{habit.habitName}</div>
                  <div className="text-sm text-gray-600">
                    {habit.totalCheckIns} check-ins • {habit.successRate.toFixed(0)}% success
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function mockMetrics(): Metrics {
  const dates = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split("T")[0];
  });
  const dailyBreakdown = dates.map((date) => {
    const possible = 3;
    const checkIns = Math.floor(Math.random() * 3);
    return { date, checkIns, possible, percentage: (checkIns / possible) * 100 };
  });
  const weekdayBreakdown = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => ({
    day,
    successRate: Math.random() * 40 + 50,
  }));
  const hourlyDistribution = Array.from({ length: 24 }).map((_, hour) => ({ hour, count: Math.floor(Math.random() * 10) }));
  const habitBreakdown = [
    { habitId: "h1", habitName: "Meditation", habitEmoji: "🧘", totalCheckIns: 22, percentage: 45, successRate: 75 },
    { habitId: "h2", habitName: "Gym", habitEmoji: "💪", totalCheckIns: 18, percentage: 35, successRate: 60 },
    { habitId: "h3", habitName: "Reading", habitEmoji: "📚", totalCheckIns: 12, percentage: 20, successRate: 50 },
  ];
  const totalCheckIns = dailyBreakdown.reduce((s, d) => s + d.checkIns, 0);
  const possibleCheckIns = dailyBreakdown.reduce((s, d) => s + d.possible, 0);
  return {
    overall: {
      totalCheckIns,
      possibleCheckIns,
      successRate: possibleCheckIns ? (totalCheckIns / possibleCheckIns) * 100 : 0,
      averageStreakLength: 8,
    },
    trends: { successRateChange: 2.1, streakChange: 1.2, checkInsChange: 5 },
    dailyBreakdown,
    weekdayBreakdown,
    timePatterns: { hourlyDistribution, bestCheckInTime: "07:00-08:00", averageCheckInTime: "07:34" },
    habitBreakdown,
  };
}


