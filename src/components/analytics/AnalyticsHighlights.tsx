"use client";

import { cn } from "@/lib/utils";
import { Sparkles, TrendingUp, Flame, Calendar, Target, Trophy } from "lucide-react";

export interface Highlight {
  id: string;
  type: "success" | "streak" | "day" | "habit" | "milestone";
  text: string;
  emphasis?: string;
  isPositive?: boolean;
}

interface AnalyticsHighlightsProps {
  highlights: Highlight[];
  isLoading?: boolean;
  className?: string;
}

const iconMap: Record<string, React.ElementType> = {
  success: TrendingUp,
  streak: Flame,
  day: Calendar,
  habit: Target,
  milestone: Trophy,
};

const colorMap: Record<string, { bg: string; icon: string }> = {
  success: { bg: "bg-emerald-50", icon: "text-emerald-600" },
  streak: { bg: "bg-amber-50", icon: "text-amber-600" },
  day: { bg: "bg-blue-50", icon: "text-blue-600" },
  habit: { bg: "bg-violet-50", icon: "text-violet-600" },
  milestone: { bg: "bg-rose-50", icon: "text-rose-600" },
};

function HighlightItem({ highlight }: { highlight: Highlight }) {
  const Icon = iconMap[highlight.type] || Sparkles;
  const colors = colorMap[highlight.type] || { bg: "bg-slate-100", icon: "text-slate-600" };

  return (
    <div className="flex items-start gap-3 py-2">
      <div className={cn("rounded-full p-1.5 mt-0.5", colors.bg)}>
        <Icon className={cn("h-3.5 w-3.5", colors.icon)} />
      </div>
      <p className="text-sm text-slate-700 leading-relaxed">
        {highlight.text}
        {highlight.emphasis && (
          <span className={cn(
            "font-semibold",
            highlight.isPositive !== false ? "text-emerald-600" : "text-rose-600"
          )}>
            {" "}{highlight.emphasis}
          </span>
        )}
      </p>
    </div>
  );
}

function HighlightsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start gap-3 py-2">
          <div className="rounded-full p-1.5 bg-slate-100 animate-pulse">
            <div className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsHighlights({ highlights, isLoading, className }: AnalyticsHighlightsProps) {
  return (
    <div className={cn(
      "rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm p-4 md:p-5",
      "hover:shadow-md transition-all duration-200",
      className
    )}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-amber-500" />
        <h3 className="text-base font-semibold text-slate-900">Highlights</h3>
      </div>

      {isLoading ? (
        <HighlightsSkeleton />
      ) : highlights.length === 0 ? (
        <p className="text-sm text-slate-500 py-2">
          No highlights yet. Keep tracking your habits!
        </p>
      ) : (
        <div className="divide-y divide-slate-100">
          {highlights.map((highlight) => (
            <HighlightItem key={highlight.id} highlight={highlight} />
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function to generate highlights from metrics
export function generateHighlights(metrics: {
  successRateChange?: number;
  longestStreak?: number;
  longestStreakHabit?: string;
  bestDay?: string;
  bestDayRate?: number;
  totalCheckIns?: number;
  milestone?: number;
}): Highlight[] {
  const highlights: Highlight[] = [];

  // Success rate change
  if (typeof metrics.successRateChange === "number") {
    const isPositive = metrics.successRateChange > 0;
    highlights.push({
      id: "success-rate",
      type: "success",
      text: isPositive ? "Success rate up" : "Success rate down",
      emphasis: `${isPositive ? "+" : ""}${metrics.successRateChange.toFixed(1)}% vs previous period`,
      isPositive,
    });
  }

  // Longest streak
  if (metrics.longestStreak && metrics.longestStreak > 0) {
    highlights.push({
      id: "streak",
      type: "streak",
      text: `Longest streak:`,
      emphasis: `${metrics.longestStreak} days${metrics.longestStreakHabit ? ` (${metrics.longestStreakHabit})` : ""}`,
    });
  }

  // Best day
  if (metrics.bestDay) {
    highlights.push({
      id: "best-day",
      type: "day",
      text: "Most consistent day:",
      emphasis: metrics.bestDay + (metrics.bestDayRate ? ` (${metrics.bestDayRate.toFixed(0)}% success)` : ""),
    });
  }

  // Milestone
  if (metrics.totalCheckIns && metrics.totalCheckIns >= 100) {
    const milestone = Math.floor(metrics.totalCheckIns / 100) * 100;
    highlights.push({
      id: "milestone",
      type: "milestone",
      text: "Milestone reached:",
      emphasis: `${milestone}+ total check-ins!`,
    });
  }

  return highlights;
}
