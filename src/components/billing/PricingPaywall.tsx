"use client";

import { useState } from "react";
import { subscriptionPlans } from "@/lib/billing/plans";

export function PricingPaywall({ feature }: { feature?: string }) {
  const [selectedPlan, setSelectedPlan] = useState<"pro" | "premium">("pro");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const handleSubscribe = async () => {
    const plan = subscriptionPlans.find((p) => p.id === selectedPlan)!;
    const res = await fetch("/api/subscriptions/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId: selectedPlan, priceId: plan.stripePriceIds[billingCycle], billingCycle }),
    });
    const { sessionId } = await res.json();
    // In mock mode, just navigate
    window.location.href = `/thank-you?session=${sessionId ?? "mock"}`;
  };

  const calcSavings = (planId: "pro" | "premium") => {
    const p = subscriptionPlans.find((x) => x.id === planId)!;
    return ((p.price.monthly * 12 - p.price.annual) / (p.price.monthly * 12)) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Upgrade to {feature ? `unlock ${feature}` : "Premium"}</h1>
          <p className="text-xl text-gray-600">Get more features, better insights, and unlimited possibilities</p>
        </div>
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-white p-1 shadow-sm">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-6 py-2 transition-colors ${billingCycle === "monthly" ? "bg-violet-600 text-white" : "text-gray-600"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`rounded-full px-6 py-2 transition-colors ${billingCycle === "annual" ? "bg-violet-600 text-white" : "text-gray-600"}`}
            >
              Annual
              <span className="ml-2 rounded-full bg-green-500 px-2 py-1 text-xs text-white">Save {calcSavings(selectedPlan).toFixed(0)}%</span>
            </button>
          </div>
        </div>
        <div className="mb-12 grid gap-6 md:grid-cols-2">
          {subscriptionPlans
            .filter((p) => p.tier !== "free")
            .map((plan) => {
              const price = billingCycle === "monthly" ? plan.price.monthly : plan.price.annual;
              const isSelected = selectedPlan === (plan.id as "pro" | "premium");
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id as "pro" | "premium")}
                  className={`rounded-2xl border-4 bg-white p-8 text-left transition-all ${
                    isSelected ? "scale-105 border-violet-600 shadow-xl" : "border-transparent shadow-md hover:shadow-lg"
                  }`}
                >
                  {plan.tier === "premium" && <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-3 py-1 text-sm font-semibold text-white">Most Popular</div>}
                  <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-gray-600">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                  </div>
                  <ul className="mb-6 space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-green-600">✓</span>
                      <span className="text-sm">{plan.features.maxHabits === -1 ? "Unlimited" : plan.features.maxHabits} habits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-green-600">✓</span>
                      <span className="text-sm">{plan.features.maxStakes === -1 ? "Unlimited" : plan.features.maxStakes} active stakes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-green-600">✓</span>
                      <span className="text-sm capitalize">{plan.features.analytics} analytics</span>
                    </li>
                    {plan.features.integrations && (
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-green-600">✓</span>
                        <span className="text-sm">Third-party integrations</span>
                      </li>
                    )}
                    {plan.features.aiCoach && (
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-green-600">✓</span>
                        <span className="text-sm">AI habit coach</span>
                      </li>
                    )}
                    {plan.features.prioritySupport && (
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-green-600">✓</span>
                        <span className="text-sm">Priority support</span>
                      </li>
                    )}
                    {plan.features.apiAccess && (
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-green-600">✓</span>
                        <span className="text-sm">API access</span>
                      </li>
                    )}
                  </ul>
                  {isSelected && <div className="text-center text-sm font-semibold text-violet-600">Selected ✓</div>}
                </button>
              );
            })}
        </div>
        <div className="text-center">
          <button onClick={handleSubscribe} className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl">
            Subscribe to {selectedPlan === "pro" ? "Pro" : "Premium"}
          </button>
          <p className="mt-4 text-sm text-gray-600">Cancel anytime. No questions asked.</p>
        </div>
        <div className="mt-12 rounded-xl bg-white p-8 text-center">
          <div className="mb-4 text-sm text-gray-600">Join 10,000+ users who upgraded</div>
          <div className="flex justify-center gap-4">
            <Stat label="Satisfaction" value="98%" />
            <Stat label="Better Results" value="2.5x" />
            <Stat label="Stakes Won" value="$50k+" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-violet-600">{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}


