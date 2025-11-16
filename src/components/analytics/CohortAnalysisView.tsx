"use client";

import { useEffect, useState } from "react";

type Cohort = {
  cohortDate: string;
  cohortSize: number;
  retention: Record<string, number>;
  revenue: Record<string, number>;
  averageLifetimeValue: number;
  churnRate: number;
};

export function CohortAnalysisView() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [metric, setMetric] = useState<"retention" | "revenue">("retention");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/analytics/cohorts?period=monthly");
      setCohorts(await res.json());
    };
    void load();
  }, []);

  const getHeat = (value: number) => {
    if (metric === "retention") {
      if (value >= 80) return "bg-green-600 text-white";
      if (value >= 60) return "bg-green-400";
      if (value >= 40) return "bg-yellow-400";
      if (value >= 20) return "bg-orange-400";
      return "bg-red-400";
    } else {
      const flat = cohorts.flatMap((c) => Object.values(c.revenue));
      const max = Math.max(1, ...flat);
      const pct = (value / max) * 100;
      if (pct >= 80) return "bg-blue-600 text-white";
      if (pct >= 60) return "bg-blue-400";
      if (pct >= 40) return "bg-blue-300";
      if (pct >= 20) return "bg-blue-200";
      return "bg-blue-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Cohort Analysis</h2>
        <div className="flex gap-2">
          <button onClick={() => setMetric("retention")} className={`rounded-lg px-4 py-2 ${metric === "retention" ? "bg-violet-600 text-white" : "bg-gray-100"}`}>
            Retention
          </button>
          <button onClick={() => setMetric("revenue")} className={`rounded-lg px-4 py-2 ${metric === "revenue" ? "bg-violet-600 text-white" : "bg-gray-100"}`}>
            Revenue
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="sticky left-0 bg-white px-4 py-3 text-left text-sm font-medium">Cohort</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Size</th>
              {Array.from({ length: 12 }).map((_, i) => (
                <th key={i} className="px-4 py-3 text-center text-sm font-medium">
                  W{i}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.map((c) => (
              <tr key={c.cohortDate} className="border-b">
                <td className="sticky left-0 bg-white px-4 py-3 font-medium">{c.cohortDate}</td>
                <td className="px-4 py-3 text-sm">{c.cohortSize.toLocaleString()}</td>
                {Array.from({ length: 12 }).map((_, i) => {
                  const v = metric === "retention" ? c.retention[`week${i}`] ?? 0 : c.revenue[`week${i}`] ?? 0;
                  return (
                    <td key={i} className={`px-4 py-3 text-center text-sm ${getHeat(v)}`}>
                      {metric === "retention" ? `${v.toFixed(0)}%` : `$${v.toFixed(0)}`}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border bg-white p-6">
          <div className="mb-1 text-sm text-gray-600">Avg. Week 4 Retention</div>
          <div className="text-3xl font-bold">
            {(cohorts.reduce((s, c) => s + (c.retention["week4"] ?? 0), 0) / Math.max(1, cohorts.length)).toFixed(1)}%
          </div>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <div className="mb-1 text-sm text-gray-600">Avg. LTV</div>
          <div className="text-3xl font-bold">
            $
            {(cohorts.reduce((s, c) => s + (c.averageLifetimeValue ?? 0), 0) / Math.max(1, cohorts.length)).toFixed(2)}
          </div>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <div className="mb-1 text-sm text-gray-600">Avg. Churn Rate</div>
          <div className="text-3xl font-bold">
            {(cohorts.reduce((s, c) => s + (c.churnRate ?? 0), 0) / Math.max(1, cohorts.length)).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}


