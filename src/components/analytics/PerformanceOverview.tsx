"use client";

import { useEffect, useState, useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { CheckCircle2, Flame, BarChart3 } from "lucide-react";
import { AnalyticsStatCard, type StatCardData } from "./AnalyticsStatCard";
import { TimeRangeSelector, type TimeRange } from "./TimeRangeSelector";
import { AnalyticsChart, type ChartDataPoint } from "./AnalyticsChart";
import { AnalyticsHighlights, generateHighlights, type Highlight } from "./AnalyticsHighlights";
import { cn } from "@/lib/utils";

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
  const [period, setPeriod] = useState<TimeRange>("30d");
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

  // Prepare stat cards data
  const statCards: StatCardData[] = useMemo(() => {
    if (!metrics) return [];
    const { overall, trends } = metrics;
    return [
      {
        label: "Success Rate",
        value: `${overall.successRate.toFixed(1)}%`,
        trend: trends.successRateChange,
        icon: CheckCircle2,
        iconBgColor: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
      {
        label: "Average Streak",
        value: `${overall.averageStreakLength.toFixed(0)} days`,
        trend: trends.streakChange,
        icon: Flame,
        iconBgColor: "bg-amber-50",
        iconColor: "text-amber-600",
      },
      {
        label: "Total Check-ins",
        value: overall.totalCheckIns.toLocaleString(),
        trend: trends.checkInsChange,
        icon: BarChart3,
        iconBgColor: "bg-indigo-50",
        iconColor: "text-indigo-600",
      },
    ];
  }, [metrics]);

  // Prepare chart data
  const chartData: ChartDataPoint[] = useMemo(() => {
    if (!metrics) return [];
    return metrics.dailyBreakdown;
  }, [metrics]);

  // Generate highlights
  const highlights: Highlight[] = useMemo(() => {
    if (!metrics) return [];

    // Find best day from weekday breakdown
    const bestDay = metrics.weekdayBreakdown.reduce(
      (best, current) => (current.successRate > best.successRate ? current : best),
      metrics.weekdayBreakdown[0]
    );

    return generateHighlights({
      successRateChange: metrics.trends.successRateChange,
      longestStreak: metrics.overall.averageStreakLength + 2, // Mock: best streak is a bit higher
      longestStreakHabit: metrics.habitBreakdown[0]?.habitName,
      bestDay: bestDay?.day,
      bestDayRate: bestDay?.successRate,
      totalCheckIns: metrics.overall.totalCheckIns,
    });
  }, [metrics]);

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <TimeRangeSelector value={period} onChange={setPeriod} />
        <p className="text-xs text-slate-500">
          {period === "7d" && "Last 7 days"}
          {period === "30d" && "Last 30 days"}
          {period === "90d" && "Last 90 days"}
          {period === "year" && "This year"}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <>
            <AnalyticsStatCard stat={{ label: "", value: "", icon: CheckCircle2 }} isLoading />
            <AnalyticsStatCard stat={{ label: "", value: "", icon: Flame }} isLoading />
            <AnalyticsStatCard stat={{ label: "", value: "", icon: BarChart3 }} isLoading />
          </>
        ) : (
          statCards.map((stat) => (
            <AnalyticsStatCard key={stat.label} stat={stat} />
          ))
        )}
      </div>

      {/* Chart and Highlights Grid */}
      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <AnalyticsChart data={chartData} isLoading={loading} />
        <AnalyticsHighlights highlights={highlights} isLoading={loading} />
      </div>

      {/* Performance by Day of Week */}
      <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm p-4 md:p-6 hover:shadow-md transition-all duration-200">
        <h3 className="text-base font-semibold text-slate-900 mb-1">Performance by day</h3>
        <p className="text-xs text-slate-500 mb-4">Success rate breakdown by day of week</p>
        {loading ? (
          <div className="h-[200px] flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={metrics?.weekdayBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 11 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 11 }} dx={-10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.95)",
                  border: "1px solid #E2E8F0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                }}
                labelStyle={{ color: "#64748B", fontWeight: 500, marginBottom: 4 }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, "Success Rate"]}
              />
              <Bar dataKey="successRate" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Time Patterns */}
      <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm p-4 md:p-6 hover:shadow-md transition-all duration-200">
        <h3 className="text-base font-semibold text-slate-900 mb-1">Time patterns</h3>
        <p className="text-xs text-slate-500 mb-4">When you complete your habits</p>

        {loading ? (
          <div className="h-[200px] flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 p-4 text-center border border-violet-100">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Best Check-in Time</div>
                <div className="text-2xl font-bold text-violet-700 mt-1">{metrics?.timePatterns.bestCheckInTime}</div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4 text-center border border-blue-100">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Average Check-in Time</div>
                <div className="text-2xl font-bold text-blue-700 mt-1">{metrics?.timePatterns.averageCheckInTime}</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={metrics?.timePatterns.hourlyDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} vertical={false} />
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 10 }}
                  tickFormatter={(h) => (h % 6 === 0 ? `${h}:00` : "")}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                  }}
                  labelFormatter={(h) => `${h}:00 - ${h}:59`}
                  formatter={(value: number) => [value, "Check-ins"]}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </div>

      {/* Habits Breakdown */}
      <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm p-4 md:p-6 hover:shadow-md transition-all duration-200">
        <h3 className="text-base font-semibold text-slate-900 mb-1">Check-ins by habit</h3>
        <p className="text-xs text-slate-500 mb-4">Distribution across your habits</p>

        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={metrics?.habitBreakdown}
                  dataKey="totalCheckIns"
                  nameKey="habitName"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={2}
                >
                  {metrics?.habitBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                  }}
                  formatter={(value: number, name: string) => [value, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 flex flex-col justify-center">
              {metrics?.habitBreakdown.map((habit, i) => (
                <div key={habit.habitId} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xl flex-shrink-0">{habit.habitEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 truncate">{habit.habitName}</div>
                    <div className="text-xs text-slate-500">
                      {habit.totalCheckIns} check-ins • {habit.successRate.toFixed(0)}% success
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
    const checkIns = Math.floor(Math.random() * 3) + 1;
    return { date, checkIns, possible, percentage: (checkIns / possible) * 100 };
  });
  const weekdayBreakdown = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
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
