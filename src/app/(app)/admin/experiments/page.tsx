"use client";

import { useEffect, useState } from "react";
import type { Experiment } from "@/lib/experiments";
import { format } from "date-fns";

export default function ExperimentDashboard() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/experiments");
      const data = await res.json();
      setExperiments(data);
      setLoading(false);
    };
    void load();
  }, []);

  if (loading) return <div className="p-6">Loading experiments...</div>;

  return (
    <div className="p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Experiments</h1>
          <button onClick={() => alert('Create Experiment form coming soon!')} className="rounded-lg bg-violet-600 px-4 py-2 text-white hover:bg-violet-700">Create Experiment</button>
        </div>
        <div className="space-y-4">
          {experiments.map((exp) => (
            <ExperimentCard key={exp.id} experiment={exp} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ExperimentCard({ experiment }: { experiment: Experiment }) {
  const [results, setResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const statusColors: Record<Experiment["status"], string> = {
    draft: "bg-gray-100 text-gray-700",
    running: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    stopped: "bg-red-100 text-red-700",
  };

  const loadResults = async () => {
    setLoading(true);
    const res = await fetch(`/api/experiments/${experiment.id}/results`);
    setResults(await res.json());
    setLoading(false);
  };

  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{experiment.name}</h3>
          <p className="text-sm text-gray-600">{experiment.description}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm ${statusColors[experiment.status]}`}>{experiment.status}</span>
      </div>
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div>
          <div className="text-sm text-gray-600">Variants</div>
          <div className="text-xl font-bold">{experiment.variants.length}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Primary Metric</div>
          <div className="text-sm font-medium">{experiment.metrics.primary}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Started</div>
          <div className="text-sm">{format(new Date(experiment.startDate), "MMM d, yyyy")}</div>
        </div>
      </div>
      {!results ? (
        <button onClick={loadResults} className="text-sm font-medium text-violet-600 hover:underline">
          {loading ? "Loading..." : "View Results →"}
        </button>
      ) : (
        <div className="border-t pt-4">
          <h4 className="mb-3 font-semibold">Results</h4>
          <div className="space-y-3">
            {results.map((r) => {
              const variant = experiment.variants.find((v) => v.id === r.variant);
              const primary = experiment.metrics.primary;
              return (
                <div key={r.variant} className="flex items-center justify-between rounded bg-gray-50 p-3">
                  <div>
                    <div className="font-medium">{variant?.name}</div>
                    <div className="text-sm text-gray-600">{r.sampleSize.toLocaleString()} users</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{Number(r.metricValues[primary]).toFixed(2)}%</div>
                    {r.winner && <div className="text-sm font-medium text-green-600">🏆 Winner</div>}
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


