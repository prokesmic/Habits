export type SubscriptionPlan = {
  id: string;
  name: string;
  tier: "free" | "pro" | "premium" | "enterprise";
  price: { monthly: number; annual: number; currency: "USD" | "EUR" | "GBP" };
  features: {
    maxHabits: number;
    maxSquads: number;
    maxStakes: number;
    analytics: "basic" | "advanced" | "premium";
    integrations: boolean;
    customBranding: boolean;
    prioritySupport: boolean;
    aiCoach: boolean;
    exportData: boolean;
    apiAccess: boolean;
  };
  limits: { freezesPerMonth: number; challengesActive: number; dataRetention: number };
  stripePriceIds: { monthly: string; annual: string };
};

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    tier: "free",
    price: { monthly: 0, annual: 0, currency: "USD" },
    features: {
      maxHabits: 3,
      maxSquads: 2,
      maxStakes: 1,
      analytics: "basic",
      integrations: false,
      customBranding: false,
      prioritySupport: false,
      aiCoach: false,
      exportData: false,
      apiAccess: false,
    },
    limits: { freezesPerMonth: 2, challengesActive: 1, dataRetention: 90 },
    stripePriceIds: { monthly: "", annual: "" },
  },
  {
    id: "pro",
    name: "Pro",
    tier: "pro",
    price: { monthly: 9.99, annual: 99.99, currency: "USD" },
    features: {
      maxHabits: 10,
      maxSquads: 10,
      maxStakes: 5,
      analytics: "advanced",
      integrations: true,
      customBranding: false,
      prioritySupport: false,
      aiCoach: true,
      exportData: true,
      apiAccess: false,
    },
    limits: { freezesPerMonth: 5, challengesActive: 5, dataRetention: 365 },
    stripePriceIds: { monthly: "price_pro_monthly", annual: "price_pro_annual" },
  },
  {
    id: "premium",
    name: "Premium",
    tier: "premium",
    price: { monthly: 19.99, annual: 199.99, currency: "USD" },
    features: {
      maxHabits: -1,
      maxSquads: -1,
      maxStakes: -1,
      analytics: "premium",
      integrations: true,
      customBranding: true,
      prioritySupport: true,
      aiCoach: true,
      exportData: true,
      apiAccess: true,
    },
    limits: { freezesPerMonth: -1, challengesActive: -1, dataRetention: -1 },
    stripePriceIds: { monthly: "price_premium_monthly", annual: "price_premium_annual" },
  },
];


