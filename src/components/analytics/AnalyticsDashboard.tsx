'use client';

import { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DailyData {
  date: string;
  completionRate: number;
}

interface CategoryData {
  [key: string]: {
    count: number;
  };
}

interface HabitData {
  id: string;
  emoji: string;
  name: string;
  currentStreak: number;
  completionRate: number;
}

interface InsightsData {
  bestDay: string;
  bestDayRate: number;
  comparisonToPrevious: number;
  projectedStreaks: number;
}

interface AnalyticsData {
  daily: DailyData[];
  byCategory: CategoryData;
  byDayOfWeek: number[];
  totalCheckIns: number;
  longestStreak: number;
  avgCompletionRate: number;
  activeHabits: number;
  topHabits: HabitData[];
  insights: InsightsData;
}

export const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?range=${timeRange}`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Completion Rate Over Time
  const completionData = {
    labels: analytics.daily.map(d => d.date),
    datasets: [
      {
        label: 'Completion Rate',
        data: analytics.daily.map(d => d.completionRate),
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Habits by Category
  const categoryData = {
    labels: Object.keys(analytics.byCategory),
    datasets: [
      {
        data: Object.values(analytics.byCategory).map((c) => c.count),
        backgroundColor: [
          'rgba(249, 115, 22, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ]
      }
    ]
  };

  // Best Day of Week
  const dayOfWeekData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Check-ins',
        data: analytics.byDayOfWeek,
        backgroundColor: 'rgba(249, 115, 22, 0.8)'
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics</h1>

        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                timeRange === range
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6">
          <div className="text-4xl mb-2">✓</div>
          <div className="text-3xl font-bold mb-1">{analytics.totalCheckIns}</div>
          <div className="text-orange-100">Total Check-ins</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
          <div className="text-4xl mb-2">🔥</div>
          <div className="text-3xl font-bold mb-1">{analytics.longestStreak}</div>
          <div className="text-green-100">Longest Streak</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <div className="text-4xl mb-2">📊</div>
          <div className="text-3xl font-bold mb-1">{analytics.avgCompletionRate}%</div>
          <div className="text-blue-100">Avg. Completion</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
          <div className="text-4xl mb-2">🎯</div>
          <div className="text-3xl font-bold mb-1">{analytics.activeHabits}</div>
          <div className="text-purple-100">Active Habits</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Completion Rate Over Time */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Completion Rate Over Time</h3>
          <Line
            data={completionData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: (value) => `${value}%`
                  }
                }
              }
            }}
          />
        </div>

        {/* Habits by Category */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Habits by Category</h3>
          <Doughnut
            data={categoryData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'right' }
              }
            }}
          />
        </div>

        {/* Best Day of Week */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Check-ins by Day of Week</h3>
          <Bar
            data={dayOfWeekData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false }
              }
            }}
          />
        </div>

        {/* Top Habits */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Top Performing Habits</h3>
          <div className="space-y-3">
            {analytics.topHabits.map((habit, i) => (
              <div key={habit.id} className="flex items-center gap-3">
                <div className="w-8 text-center font-bold text-gray-400">
                  #{i + 1}
                </div>
                <div className="text-2xl">{habit.emoji}</div>
                <div className="flex-1">
                  <div className="font-medium">{habit.name}</div>
                  <div className="text-sm text-gray-600">
                    {habit.currentStreak} day streak
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{habit.completionRate}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold mb-4">Insights</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span>✓</span>
            <span>Your best day is {analytics.insights.bestDay} with {analytics.insights.bestDayRate}% completion</span>
          </div>
          <div className="flex items-start gap-2">
            <span>⚡</span>
            <span>You&apos;re {analytics.insights.comparisonToPrevious}% better than last {timeRange}</span>
          </div>
          <div className="flex items-start gap-2">
            <span>🎯</span>
            <span>You&apos;re on track for {analytics.insights.projectedStreaks} new streak milestones</span>
          </div>
        </div>
      </div>
    </div>
  );
};
