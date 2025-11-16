"use client";

import { useState } from "react";

export default function CreateWorkspacePage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ name: "", slug: "", plan: "team", seats: 5, billingCycle: "monthly" });

  const plans = [
    { id: "team", name: "Team", price: { monthly: 12, annual: 120 }, features: ["Up to 25 members", "Team challenges", "Basic analytics", "Email support"] },
    { id: "business", name: "Business", price: { monthly: 20, annual: 200 }, features: ["Up to 100 members", "Advanced analytics", "Custom branding", "Priority support", "SSO integration"] },
    { id: "enterprise", name: "Enterprise", price: "custom", features: ["Unlimited members", "Dedicated account manager", "Custom integrations", "SLA guarantee", "On-premise option"] },
  ] as const;

  const create = async () => {
    const ws = await fetch("/api/workspaces", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json());
    // Mock subscription call
    void fetch("/api/workspaces/subscribe", { method: "POST", body: JSON.stringify({ workspaceId: ws.id }) });
    window.location.href = `/workspaces/${ws.id}`;
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-2 flex-1 rounded ${s <= step ? "bg-violet-600" : "bg-gray-200"} ${s < 3 ? "mr-2" : ""}`} />
          ))}
        </div>
        <div className="text-sm text-gray-600">Step {step} of 3</div>
      </div>
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Create Your Workspace</h2>
          <div>
            <label className="mb-2 block text-sm font-medium">Workspace Name</label>
            <input
              className="w-full rounded-lg border px-4 py-3"
              value={data.name}
              onChange={(e) => {
                const name = e.target.value;
                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                setData((d) => ({ ...d, name, slug }));
              }}
              placeholder="Acme Inc."
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Workspace URL</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">habittracker.com/</span>
              <input className="flex-1 rounded-lg border px-4 py-3" value={data.slug} onChange={(e) => setData((d) => ({ ...d, slug: e.target.value }))} placeholder="acme" />
            </div>
          </div>
          <button className="w-full rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white disabled:opacity-50" disabled={!data.name || !data.slug} onClick={() => setStep(2)}>
            Continue
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Choose Your Plan</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((p) => (
              <button
                key={p.id}
                onClick={() => setData((d) => ({ ...d, plan: p.id as any }))}
                className={`rounded-xl border-2 p-6 text-left ${data.plan === p.id ? "border-violet-600 bg-violet-50" : "border-gray-200 hover:border-gray-300"}`}
              >
                <h3 className="mb-2 text-xl font-bold">{p.name}</h3>
                <div className="mb-4 text-3xl font-bold">{typeof p.price === "object" ? <>${p.price.monthly}</> : <span className="text-lg">{p.price}</span>}</div>
                <ul className="space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
          {data.plan !== "enterprise" && (
            <div>
              <label className="mb-2 block text-sm font-medium">Number of Seats</label>
              <input type="number" min={5} className="w-full rounded-lg border px-4 py-3" value={data.seats} onChange={(e) => setData((d) => ({ ...d, seats: parseInt(e.target.value) }))} />
              <div className="mt-2 text-sm text-gray-600">Total: ${data.seats * 12}/month</div>
            </div>
          )}
          <div className="flex gap-4">
            <button className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold" onClick={() => setStep(1)}>
              Back
            </button>
            <button className="flex-1 rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white" onClick={() => setStep(3)}>
              Continue
            </button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Review & Payment</h2>
          <div className="space-y-3 rounded-lg bg-gray-50 p-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Workspace:</span>
              <span className="font-semibold">{data.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Plan:</span>
              <span className="font-semibold capitalize">{data.plan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Seats:</span>
              <span className="font-semibold">{data.seats}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Billing:</span>
              <span className="font-semibold capitalize">{data.billingCycle}</span>
            </div>
            <div className="flex justify-between border-t pt-3 text-lg">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-violet-600">${data.seats * 12}/{data.billingCycle === "monthly" ? "month" : "year"}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold" onClick={() => setStep(2)}>
              Back
            </button>
            <button className="flex-1 rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white" onClick={create}>
              Continue to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


