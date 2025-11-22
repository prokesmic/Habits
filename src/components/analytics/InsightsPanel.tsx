"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lightbulb, TrendingUp, Trophy, Users, AlertTriangle, Calendar, ArrowRight, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

type Insight = {
  id: string;
  type: "pattern" | "achievement" | "recommendation" | "warning";
  category: "performance" | "habit" | "money" | "social";
  title: string;
  description: string;
  icon: string;
  priority: "high" | "medium" | "low";
  actionable: boolean;
  action?: { label: string; url: string };
};

const typeConfig: Record<Insight["type"], { bg: string; border: string; iconBg: string; Icon: React.ElementType }> = {
  pattern: {
    bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
    border: "border-blue-200",
    iconBg: "bg-blue-100 text-blue-600",
    Icon: Calendar,
  },
  achievement: {
    bg: "bg-gradient-to-br from-emerald-50 to-green-50",
    border: "border-emerald-200",
    iconBg: "bg-emerald-100 text-emerald-600",
    Icon: Trophy,
  },
  recommendation: {
    bg: "bg-gradient-to-br from-violet-50 to-purple-50",
    border: "border-violet-200",
    iconBg: "bg-violet-100 text-violet-600",
    Icon: Lightbulb,
  },
  warning: {
    bg: "bg-gradient-to-br from-amber-50 to-orange-50",
    border: "border-amber-200",
    iconBg: "bg-amber-100 text-amber-600",
    Icon: AlertTriangle,
  },
};

const priorityBadge: Record<Insight["priority"], string> = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-600",
};

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 bg-slate-100 rounded w-48" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl bg-slate-100 h-32" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="rounded-full bg-slate-100 p-4">
          <BarChart3 className="h-8 w-8 text-slate-400" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">No insights yet</h3>
      <p className="text-sm text-slate-500 mb-4">
        Keep tracking your habits to unlock personalized insights and recommendations.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
      >
        Go to Dashboard
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  const config = typeConfig[insight.type];
  const IconComponent = config.Icon;

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 md:p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]",
        config.bg,
        config.border
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn("rounded-xl p-2.5 flex-shrink-0", config.iconBg)}>
          <IconComponent className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-slate-900">{insight.title}</h4>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide flex-shrink-0", priorityBadge[insight.priority])}>
              {insight.priority}
            </span>
          </div>

          <p className="text-sm text-slate-600 mb-3">{insight.description}</p>

          {insight.actionable && insight.action && (
            <Link
              href={insight.action.url}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-white hover:text-indigo-700 transition-colors shadow-sm"
            >
              {insight.action.label}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {/* Emoji */}
        <span className="text-2xl flex-shrink-0">{insight.icon}</span>
      </div>
    </div>
  );
}

export function InsightsPanel() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Insight["type"]>("all");

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics/insights");
      const data = await res.json();
      setInsights(data);
    } catch {
      setInsights(mockInsights());
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSkeleton />;

  const filteredInsights = filter === "all" ? insights : insights.filter((i) => i.type === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-amber-100 p-2">
            <Lightbulb className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Insights & Recommendations</h2>
            <p className="text-xs text-slate-500">Personalized tips based on your habits</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex rounded-full bg-slate-100 p-1" role="group" aria-label="Filter insights">
          {(["all", "pattern", "achievement", "recommendation", "warning"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200",
                filter === f
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Insights List */}
      {filteredInsights.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {filteredInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {insights.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm p-4 md:p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Insight Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(["pattern", "achievement", "recommendation", "warning"] as const).map((type) => {
              const count = insights.filter((i) => i.type === type).length;
              const config = typeConfig[type];
              const Icon = config.Icon;
              return (
                <div key={type} className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5">
                  <div className={cn("rounded-lg p-1.5", config.iconBg)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-slate-900">{count}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">{type}s</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function mockInsights(): Insight[] {
  return [
    {
      id: "weekend-strength",
      type: "pattern",
      category: "performance",
      title: "Weekend Warrior",
      description: "You're 12% more likely to check in on weekends. Consider starting new habits on Saturdays!",
      icon: "📅",
      priority: "medium",
      actionable: true,
      action: { label: "Start new habit", url: "/habits/new" },
    },
    {
      id: "money-master",
      type: "achievement",
      category: "money",
      title: "Money Master",
      description: "80% win rate on staked habits! You're crushing it and earning rewards.",
      icon: "💎",
      priority: "medium",
      actionable: false,
    },
    {
      id: "join-squad",
      type: "recommendation",
      category: "social",
      title: "Join a Squad",
      description: "Users in squads are 23% more likely to succeed. Find your accountability crew!",
      icon: "👥",
      priority: "high",
      actionable: true,
      action: { label: "Browse squads", url: "/squads" },
    },
    {
      id: "morning-slump",
      type: "warning",
      category: "performance",
      title: "Morning Momentum Needed",
      description: "Your morning habits have a 45% success rate. Try setting earlier reminders.",
      icon: "⚠️",
      priority: "high",
      actionable: true,
      action: { label: "Adjust habits", url: "/habits" },
    },
    {
      id: "streak-milestone",
      type: "achievement",
      category: "habit",
      title: "7-Day Streak!",
      description: "You've maintained your Meditation habit for a week. Keep the momentum going!",
      icon: "🔥",
      priority: "low",
      actionable: false,
    },
  ];
}
