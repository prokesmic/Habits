"use client";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardData {
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

interface AnalyticsStatCardProps {
  stat: StatCardData;
  className?: string;
  isLoading?: boolean;
}

export function AnalyticsStatCard({ stat, className, isLoading }: AnalyticsStatCardProps) {
  const { label, value, trend, trendLabel = "vs prev", icon: Icon, iconBgColor = "bg-indigo-50", iconColor = "text-indigo-600" } = stat;

  const isPositive = typeof trend === "number" && trend > 0;
  const isNegative = typeof trend === "number" && trend < 0;

  if (isLoading) {
    return (
      <div className={cn(
        "rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm p-4 flex flex-col gap-3",
        "hover:shadow-md hover:-translate-y-[1px] transition-all duration-200",
        className
      )}>
        <div className="flex items-center gap-3">
          <div className="rounded-full p-2.5 bg-slate-100 animate-pulse">
            <div className="h-5 w-5" />
          </div>
          <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="h-8 w-20 bg-slate-100 rounded animate-pulse" />
        <div className="h-5 w-28 bg-slate-100 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm p-4 flex flex-col gap-2",
      "hover:shadow-md hover:-translate-y-[1px] transition-all duration-200",
      className
    )}>
      {/* Icon + Label */}
      <div className="flex items-center gap-3">
        <div className={cn("rounded-full p-2.5", iconBgColor)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
      </div>

      {/* Main Value */}
      <div className="text-2xl font-semibold tracking-tight text-slate-900">{value}</div>

      {/* Trend */}
      {typeof trend === "number" && (
        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium w-fit",
            isPositive && "bg-emerald-50 text-emerald-700",
            isNegative && "bg-rose-50 text-rose-700",
            !isPositive && !isNegative && "bg-slate-100 text-slate-600"
          )}
        >
          {isPositive && (
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
              <path d="M6 9V3M6 3L3 6M6 3L9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {isNegative && (
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
              <path d="M6 3V9M6 9L3 6M6 9L9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          <span>
            {isPositive && "+"}
            {trend.toFixed(1)}% {trendLabel}
          </span>
        </div>
      )}
    </div>
  );
}

export function AnalyticsStatCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm p-4 flex flex-col gap-3",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="rounded-full p-2.5 bg-slate-100 animate-pulse">
          <div className="h-5 w-5" />
        </div>
        <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
      </div>
      <div className="h-8 w-20 bg-slate-100 rounded animate-pulse" />
      <div className="h-5 w-28 bg-slate-100 rounded animate-pulse" />
    </div>
  );
}
