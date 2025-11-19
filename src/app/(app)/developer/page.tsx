"use client";

import { useEffect, useState } from "react";

type ApiKey = { id: string; name: string; createdAt: string; lastUsedAt?: string };

export default function DeveloperPortalPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [creating, setCreating] = useState(false);

  const createKey = async () => {
    setCreating(true);
    const res = await fetch("/api/developer/keys", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "My App", permissions: ["habits:read"] }) });
    const { key, record } = await res.json();
    // eslint-disable-next-line no-alert
    alert(`Your API key: ${key}\n\nSave it now, you won't see it again!`);
    setApiKeys((k) => [...k, record]);
    setCreating(false);
  };

  useEffect(() => {
    // In mock mode, empty list
    setApiKeys([]);
  }, []);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Developer Portal</h1>
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <InfoCard label="API Keys" value={apiKeys.length} />
        <InfoCard label="Requests Today" value={1247} />
        <InfoCard label="Webhooks Active" value={3} />
      </div>
      <div className="mb-6 rounded-lg border bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">API Keys</h2>
          <button onClick={createKey} disabled={creating} className="rounded-lg bg-violet-600 px-4 py-2 text-white">
            {creating ? "Creating..." : "Create New Key"}
          </button>
        </div>
        <div className="space-y-3">
          {apiKeys.map((k) => (
            <div key={k.id} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <div className="font-medium">{k.name}</div>
                <div className="text-sm text-gray-600">Created {new Date(k.createdAt).toDateString()}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => alert(`API Key: ${k.id}\nCreated: ${new Date(k.createdAt).toLocaleString()}`)} className="rounded border px-3 py-1 text-sm hover:bg-gray-50">View</button>
                <button onClick={() => { if (confirm(`Revoke API key "${k.name}"?`)) alert('API key revoked'); }} className="rounded border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50">Revoke</button>
              </div>
            </div>
          ))}
          {apiKeys.length === 0 && <div className="text-sm text-gray-600">No API keys yet.</div>}
        </div>
      </div>
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 font-semibold">Quick Start</h2>
        <pre className="overflow-x-auto rounded-lg bg-gray-50 p-4 text-sm">{`# Install SDK
npm install @habittracker/sdk

# Initialize
import HabitTracker from '@habittracker/sdk';

const client = new HabitTracker({ apiKey: 'your-api-key' });

# Create a habit
const habit = await client.habits.create({
  name: 'Morning Meditation',
  emoji: '🧘',
  frequency: 'daily'
});

# Check in
await client.habits.checkIn(habit.id);`}</pre>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="mb-1 text-sm text-gray-600">{label}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}


