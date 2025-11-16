"use client";

import { useEffect, useState } from "react";

type Funnel = {
  name: string;
  steps: { name: string; users: number; dropoff: number; conversionRate: number }[];
  overallConversion: number;
};

export function FunnelView({ funnelName }: { funnelName: string }) {
  const [funnel, setFunnel] = useState<Funnel | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/analytics/funnels/${funnelName}`);
      setFunnel(await res.json());
    };
    void load();
  }, [funnelName]);

  if (!funnel) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{funnel.name}</h2>
      <div className="space-y-4">
        {funnel.steps.map((step, idx) => {
          const width = (step.users / funnel.steps[0].users) * 100;
          return (
            <div key={idx} className="relative">
              <div className="mb-2 flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 font-bold text-white">{idx + 1}</div>
                <div className="flex-1">
                  <div className="font-medium">{step.name}</div>
                  <div className="text-sm text-gray-600">
                    {step.users.toLocaleString()} users • {step.conversionRate.toFixed(1)}% conversion
                  </div>
                </div>
              </div>
              <div className="ml-12">
                <div className="h-12 overflow-hidden rounded-lg bg-violet-100">
                  <div
                    className="flex h-full items-center justify-between bg-gradient-to-r from-violet-500 to-violet-600 px-4 font-semibold text-white"
                    style={{ width: `${width}%` }}
                  >
                    <span>{step.users.toLocaleString()}</span>
                    <span>{step.conversionRate.toFixed(1)}%</span>
                  </div>
                </div>
                {idx < funnel.steps.length - 1 && step.dropoff > 0 && <div className="mt-2 text-sm text-red-600">⚠️ {step.dropoff.toFixed(1)}% drop-off</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="rounded-lg border border-violet-200 bg-violet-50 p-6">
        <div className="mb-1 text-sm text-gray-600">Overall Conversion</div>
        <div className="text-4xl font-bold text-violet-600">{funnel.overallConversion.toFixed(2)}%</div>
        <div className="mt-2 text-sm text-gray-600">
          {funnel.steps[funnel.steps.length - 1].users.toLocaleString()} of {funnel.steps[0].users.toLocaleString()} completed the entire funnel
        </div>
      </div>
    </div>
  );
}


