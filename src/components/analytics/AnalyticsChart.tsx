"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
} from "recharts";
import { cn } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

export interface ChartDataPoint {
  date: string;
  checkIns: number;
  possible: number;
  percentage: number;
}

interface AnalyticsChartProps {
  data: ChartDataPoint[];
  isLoading?: boolean;
  className?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;

  const checkIns = payload.find((p) => p.dataKey === "checkIns")?.value ?? 0;
  const possible = payload.find((p) => p.dataKey === "possible")?.value ?? 0;
  const percentage = possible ? ((checkIns as number) / (possible as number) * 100).toFixed(0) : 0;

  // Format date nicely
  const formattedDate = new Date(label).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 backdrop-blur-sm p-3 shadow-lg">
      <p className="text-xs font-medium text-slate-500 mb-1.5">{formattedDate}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-indigo-500" />
          <span className="text-sm text-slate-700">
            <span className="font-semibold">{checkIns}</span> check-ins
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-slate-300" />
          <span className="text-sm text-slate-700">
            <span className="font-semibold">{possible}</span> possible
          </span>
        </div>
        <div className="pt-1 border-t border-slate-100 mt-1">
          <span className="text-xs font-semibold text-emerald-600">{percentage}% success</span>
        </div>
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-[280px] w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
        <span className="text-sm text-slate-500">Loading chart...</span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-[280px] w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center px-4">
        <div className="rounded-full bg-slate-100 p-4">
          <BarChart3 className="h-8 w-8 text-slate-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">No check-ins for this period</p>
          <p className="text-xs text-slate-500 mt-1">Try selecting a different time range</p>
        </div>
      </div>
    </div>
  );
}

export function AnalyticsChart({ data, isLoading, className }: AnalyticsChartProps) {
  // Format dates for display
  const formattedData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      displayDate: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }));
  }, [data]);

  const hasData = data.length > 0 && data.some((d) => d.checkIns > 0 || d.possible > 0);

  return (
    <div className={cn(
      "rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm",
      className
    )}>
      <div className="p-4 md:p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-900">Check-ins over time</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily check-ins compared to your total possible habits
          </p>
        </div>

        {isLoading ? (
          <ChartSkeleton />
        ) : !hasData ? (
          <EmptyState />
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="checkInsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="possibleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#CBD5E1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#CBD5E1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                  strokeOpacity={0.6}
                  vertical={false}
                />
                <XAxis
                  dataKey="displayDate"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 11 }}
                  dy={10}
                  interval="preserveStartEnd"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 11 }}
                  dx={-10}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="possible"
                  stroke="#CBD5E1"
                  strokeWidth={2}
                  fill="url(#possibleGradient)"
                  name="Possible"
                />
                <Area
                  type="monotone"
                  dataKey="checkIns"
                  stroke="#6366F1"
                  strokeWidth={2}
                  fill="url(#checkInsGradient)"
                  name="Check-ins"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Legend */}
      {!isLoading && hasData && (
        <div className="border-t border-slate-100 px-4 md:px-6 py-3 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
            <span className="text-xs text-slate-600">Check-ins</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span className="text-xs text-slate-600">Possible</span>
          </div>
        </div>
      )}
    </div>
  );
}
