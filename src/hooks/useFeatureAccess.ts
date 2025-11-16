"use client";

import { subscriptionPlans } from "@/lib/billing/plans";
import { useEffect, useState } from "react";

// Placeholder auth hook for demo purposes
function useAuth() {
  const [user, setUser] = useState<{ subscriptionTier: string; locale?: string; currency?: string } | null>(null);
  useEffect(() => {
    setUser({ subscriptionTier: "free", locale: "en-US", currency: "USD" });
  }, []);
  return { user };
}

export const useFeatureAccess = () => {
  const { user } = useAuth();
  const plan = subscriptionPlans.find((p) => p.id === (user?.subscriptionTier ?? "free"));

  const canAccess = (feature: keyof typeof plan.features) => {
    if (!plan) return false;
    return Boolean(plan.features[feature]);
  };

  const checkLimit = (limitType: keyof typeof plan.limits, current: number) => {
    if (!plan) return false;
    const limit = plan.limits[limitType];
    if (limit === -1) return true;
    return current < limit;
  };

  const requiresPremium = (feature: keyof typeof plan.features) => {
    return !canAccess(feature);
  };

  return { canAccess, checkLimit, requiresPremium, planTier: plan?.tier ?? "free" };
};


