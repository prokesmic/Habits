"use client";

import { useEffect, useState } from "react";

export default function WorkspaceDashboardPage({ params }: { params: { id: string } }) {
  const [workspace, setWorkspace] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [w, a, m] = await Promise.all([
        fetch(`/api/workspaces/${params.id}`).then((r) => r.json()),
        fetch(`/api/workspaces/${params.id}/analytics`).then((r) => r.json()),
        fetch(`/api/workspaces/${params.id}/members`).then((r) => r.json()),
      ]);
      setWorkspace(w);
      setAnalytics(a);
      setMembers(m);
    };
    void load();
  }, [params.id]);

  if (!workspace || !analytics) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {workspace.logo && <img src={workspace.logo} alt={workspace.name} className="h-16 w-16 rounded-lg" />}
          <div>
            <h1 className="text-2xl font-bold">{workspace.name}</h1>
            <p className="text-gray-600">{workspace.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a href={`/workspaces/${workspace.id}/settings`} className="rounded-lg border px-4 py-2 hover:bg-gray-50">
            Settings
          </a>
          <a href={`/workspaces/${workspace.id}/invite`} className="rounded-lg bg-violet-600 px-4 py-2 text-white">
            Invite Members
          </a>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Active Members" value={`${analytics.engagement.activeUsers}/${analytics.engagement.totalUsers}`} icon="👥" />
        <Metric title="Participation Rate" value={`${analytics.engagement.participationRate.toFixed(1)}%`} icon="📊" />
        <Metric title="Total Check-ins" value={analytics.engagement.totalCheckIns.toLocaleString()} icon="✅" />
        <Metric title="Avg. per User" value={analytics.engagement.averageCheckInsPerUser.toFixed(1)} icon="🎯" />
      </div>
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 font-semibold">Members</h3>
        <div className="flex flex-wrap gap-3">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-2 rounded border px-3 py-2">
              <img src={m.avatar} className="h-6 w-6 rounded-full" />
              <span className="text-sm">{m.name}</span>
              <span className="text-xs text-gray-500">({m.role})</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 font-semibold">📈 Most Popular Habits</h3>
        <div className="space-y-3">
          {analytics.habitAdoption.map((h: any) => (
            <div key={h.habitName}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium">{h.habitName}</span>
                <span className="text-gray-600">
                  {h.userCount} users • {h.completionRate.toFixed(0)}% completion
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full bg-gradient-to-r from-violet-500 to-violet-600" style={{ width: `${(h.userCount / analytics.engagement.totalUsers) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border bg-gradient-to-br from-violet-50 to-blue-50 p-6">
        <h3 className="mb-4 font-semibold">📊 Industry Benchmarks</h3>
        <div className="grid grid-cols-3 gap-6">
          <Bench label="Your Workspace" value={`${analytics.benchmarks.yourWorkspace}%`} accent="text-violet-600" />
          <Bench label="Industry Average" value={`${analytics.benchmarks.industryAverage}%`} />
          <Bench label="Your Percentile" value={`${analytics.benchmarks.percentile}th`} accent="text-green-600" />
        </div>
      </div>
    </div>
  );
}

function Metric({ title, value, icon }: { title: string; value: string | number; icon: string }) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="mb-1 flex items-center gap-2 text-sm text-gray-600">
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function Bench({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="text-center">
      <div className="mb-1 text-sm text-gray-600">{label}</div>
      <div className={`text-3xl font-bold ${accent ?? ""}`}>{value}</div>
    </div>
  );
}


