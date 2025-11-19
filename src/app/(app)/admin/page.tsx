"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "@/components/analytics/MetricCard";

type AdminMetrics = {
  users: { total: number; activeToday: number; newToday: number };
  money: { totalStaked: number; activeStakes: number; platformRevenue: number };
  engagement: { dau: number; mau: number; dauMauRatio: number; retention: { day1: number; day7: number; day30: number } };
};

type ContentReport = {
  id: string;
  reportedBy: string;
  reportedUser: string;
  contentType: "message" | "post" | "comment";
  reason: string;
  createdAt: string;
};

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [reports, setReports] = useState<ContentReport[]>([]);

  const load = async () => {
    const m = await fetch("/api/admin/metrics").then((r) => r.json());
    setMetrics(m);
    const r = await fetch("/api/admin/reports?status=pending").then((r) => r.json());
    setReports(r);
  };

  useEffect(() => {
    void load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  if (!metrics) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <MetricCard title="Total Users" value={metrics.users.total.toLocaleString()} icon="👥" />
          <MetricCard
            title="Active Today"
            value={metrics.users.activeToday.toLocaleString()}
            changeLabel={`${((metrics.users.activeToday / Math.max(1, metrics.users.total)) * 100).toFixed(1)}% of total`}
            icon="✅"
          />
          <MetricCard title="Total Stakes" value={`$${metrics.money.totalStaked.toLocaleString()}`} changeLabel={`${metrics.money.activeStakes} active`} icon="💰" />
          <MetricCard title="Platform Revenue" value={`$${metrics.money.platformRevenue.toLocaleString()}`} changeLabel="This month" icon="📊" />
        </div>
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">Engagement</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-violet-600">{metrics.engagement.dau.toLocaleString()}</div>
              <div className="text-sm text-gray-600">DAU</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{metrics.engagement.mau.toLocaleString()}</div>
              <div className="text-sm text-gray-600">MAU</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{(metrics.engagement.dauMauRatio * 100).toFixed(1)}%</div>
              <div className="text-sm text-gray-600">DAU/MAU</div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <RetentionBar label="Day 1" percentage={metrics.engagement.retention.day1} />
            <RetentionBar label="Day 7" percentage={metrics.engagement.retention.day7} />
            <RetentionBar label="Day 30" percentage={metrics.engagement.retention.day30} />
          </div>
        </div>
        {reports.length > 0 && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-bold">Pending Reports ({reports.length})</h2>
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="rounded border p-4">
                  <div className="mb-1 font-semibold">Report from @{r.reportedBy}</div>
                  <div className="mb-2 text-sm text-gray-600">
                    Against @{r.reportedUser} • {r.contentType}
                  </div>
                  <div className="rounded bg-gray-50 p-3 text-sm text-gray-700">Reason: {r.reason}</div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => alert(`Report ${r.id} dismissed`)} className="rounded border px-3 py-1 text-sm hover:bg-gray-50">Dismiss</button>
                    <button onClick={() => alert(`Warning sent to @${r.reportedUser}`)} className="rounded border border-amber-500 px-3 py-1 text-sm text-amber-700 hover:bg-amber-50">Warn User</button>
                    <button onClick={() => alert(`Content removed for @${r.reportedUser}`)} className="rounded border border-red-500 px-3 py-1 text-sm text-red-700 hover:bg-red-50">Remove Content</button>
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

function RetentionBar({ label, percentage }: { label: string; percentage: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-semibold">{percentage.toFixed(1)}%</span>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-gray-200">
        <div className="h-full bg-gradient-to-r from-violet-500 to-blue-500" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}


