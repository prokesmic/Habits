"use client";

import { useEffect, useState } from "react";

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

export function InsightsPanel() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
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
  if (loading) return <div className="text-sm text-slate-600">Loading insights...</div>;
  const color = (t: Insight["type"]) =>
    t === "achievement" ? "border-green-500 bg-green-50" : t === "pattern" ? "border-blue-500 bg-blue-50" : t === "recommendation" ? "border-violet-500 bg-violet-50" : "border-amber-500 bg-amber-50";
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">💡 Insights & Recommendations</h3>
      {insights.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <div className="mb-2 text-4xl">📊</div>
          <p>Keep tracking to unlock insights!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((i) => (
            <div key={i.id} className={`rounded-lg border-l-4 p-4 ${color(i.type)}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{i.icon}</span>
                <div className="flex-1">
                  <h4 className="mb-1 font-semibold">{i.title}</h4>
                  <p className="mb-2 text-sm text-gray-700">{i.description}</p>
                  {i.actionable && i.action && (
                    <a href={i.action.url} className="text-sm font-medium text-violet-600 hover:underline">
                      {i.action.label} →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
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
      description: "80% win rate! You're crushing it. 💰",
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
      priority: "medium",
      actionable: true,
      action: { label: "Browse squads", url: "/squads" },
    },
  ];
}


