"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

type Integration = {
  id: string;
  provider: string;
  name: string;
  status: "connected" | "disconnected" | "error";
  syncSettings?: { autoSync: boolean; syncFrequency: string; lastSyncAt?: string };
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/integrations");
      setIntegrations(await res.json());
    };
    void load();
  }, []);

  const available = [
    { provider: "google_calendar", name: "Google Calendar", icon: "📅", description: "Add habit reminders to your calendar", benefits: ["Auto-schedule reminders", "Sync with daily routine"] },
    { provider: "strava", name: "Strava", icon: "🏃", description: "Auto-check-in from your runs and rides", benefits: ["Automatic check-ins", "Track distance & duration"] },
  ] as const;

  const isConnected = (provider: string) => integrations.some((i) => i.provider === provider && i.status === "connected");
  const connectedIntegration = (provider: string) => integrations.find((i) => i.provider === provider);

  const handleConnect = (provider: string) => {
    window.location.href = `/api/integrations/${provider}/auth`;
  };
  const handleDisconnect = async (provider: string) => {
    await fetch(`/api/integrations/${provider}/disconnect`, { method: "POST" });
    const res = await fetch("/api/integrations");
    setIntegrations(await res.json());
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Integrations</h1>
      <p className="text-gray-600">Connect your favorite apps to make habit tracking effortless</p>
      <div className="grid gap-4 md:grid-cols-2">
        {available.map((int) => {
          const connected = isConnected(int.provider);
          const integ = connectedIntegration(int.provider);
          return (
            <div key={int.provider} className="rounded-lg border bg-white p-6">
              <div className="mb-4 flex items-start gap-4">
                <div className="text-4xl">{int.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{int.name}</h3>
                  <p className="text-sm text-gray-600">{int.description}</p>
                </div>
              </div>
              <div className="mb-4 space-y-2">
                {int.benefits.map((b) => (
                  <div key={b} className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
              {connected ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <span>✓</span>
                    <span>Connected</span>
                    {integ?.syncSettings?.lastSyncAt && (
                      <span className="text-gray-500">
                        • Last sync: {formatDistanceToNow(new Date(integ.syncSettings.lastSyncAt), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => router.push(`/integrations/${int.provider}/settings`)} className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-50">
                      Settings
                    </button>
                    <button onClick={() => handleDisconnect(int.provider)} className="rounded-lg border border-red-300 px-4 py-2 text-red-600 hover:bg-red-50">
                      Disconnect
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => handleConnect(int.provider)} className="w-full rounded-lg bg-violet-600 px-4 py-2 text-white hover:bg-violet-700">
                  Connect {int.name}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


