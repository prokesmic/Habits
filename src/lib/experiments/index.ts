export type Experiment = {
  id: string;
  name: string;
  description: string;
  status: "draft" | "running" | "completed" | "stopped";
  variants: {
    id: string;
    name: string;
    description: string;
    weight: number;
    config: Record<string, any>;
  }[];
  targeting: {
    userSegments?: string[];
    platforms?: ("web" | "ios" | "android")[];
    countries?: string[];
    customRules?: { field: string; operator: "equals" | "contains" | "greater_than" | "less_than"; value: any }[];
  };
  metrics: { primary: string; secondary: string[] };
  startDate: string;
  endDate?: string;
  minimumSampleSize: number;
  confidenceLevel: number;
};

type ExperimentAssignment = {
  userId: string;
  experimentId: string;
  variantId: string;
  assignedAt: string;
  sticky: boolean;
};

// In-memory stores for demo/mocks
const experimentCache = new Map<string, Experiment>();
const assignmentStore = new Map<string, ExperimentAssignment>(); // key: `${userId}:${experimentId}`

export class ExperimentService {
  async getVariant(experimentId: string, userId: string): Promise<string | null> {
    const existing = assignmentStore.get(`${userId}:${experimentId}`);
    if (existing) return existing.variantId;

    const experiment = await this.getExperiment(experimentId);
    if (!experiment || experiment.status !== "running") return null;

    // For now, skip complex targeting in mock mode
    const variant = this.assignVariant(experiment.variants, userId);
    assignmentStore.set(`${userId}:${experimentId}`, {
      userId,
      experimentId,
      variantId: variant.id,
      assignedAt: new Date().toISOString(),
      sticky: true,
    });
    return variant.id;
  }

  private assignVariant(variants: Experiment["variants"], userId: string): Experiment["variants"][0] {
    const hashValue = this.hashString(userId) % 100;
    let cumulative = 0;
    for (const v of variants) {
      cumulative += v.weight;
      if (hashValue < cumulative) return v;
    }
    return variants[0];
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash);
  }

  async getConfig<T = any>(experimentId: string, userId: string, defaultConfig: T): Promise<T> {
    const variantId = await this.getVariant(experimentId, userId);
    if (!variantId) return defaultConfig;
    const experiment = await this.getExperiment(experimentId);
    const variant = experiment?.variants.find((v) => v.id === variantId);
    return ((variant?.config as T) ?? defaultConfig) as T;
  }

  async getExperiment(experimentId: string): Promise<Experiment | null> {
    if (experimentCache.has(experimentId)) return experimentCache.get(experimentId)!;
    // Seed a couple of example experiments in mock mode
    if (experimentId === "cta_color") {
      const exp: Experiment = {
        id: "cta_color",
        name: "CTA Button Color",
        description: "Test different primary button colors",
        status: "running",
        variants: [
          { id: "control", name: "Violet", description: "", weight: 25, config: { color: "violet" } },
          { id: "green", name: "Green", description: "", weight: 25, config: { color: "green" } },
          { id: "blue", name: "Blue", description: "", weight: 25, config: { color: "blue" } },
          { id: "red", name: "Red", description: "", weight: 25, config: { color: "red" } },
        ],
        targeting: {},
        metrics: { primary: "conversion_rate", secondary: ["retention_day_7"] },
        startDate: new Date().toISOString(),
        minimumSampleSize: 100,
        confidenceLevel: 95,
      };
      experimentCache.set(exp.id, exp);
      return exp;
    }
    if (experimentId === "pricing_test") {
      const exp: Experiment = {
        id: "pricing_test",
        name: "Pricing Test",
        description: "Vary monthly/yearly and trial days",
        status: "running",
        variants: [
          { id: "control", name: "Baseline", description: "", weight: 50, config: { monthlyPrice: 9.99, yearlyPrice: 99.99, trialDays: 7 } },
          { id: "alt", name: "Alt", description: "", weight: 50, config: { monthlyPrice: 7.99, yearlyPrice: 79.99, trialDays: 14 } },
        ],
        targeting: {},
        metrics: { primary: "conversion_rate", secondary: ["average_revenue"] },
        startDate: new Date().toISOString(),
        minimumSampleSize: 100,
        confidenceLevel: 95,
      };
      experimentCache.set(exp.id, exp);
      return exp;
    }
    return null;
  }

  async listExperiments(): Promise<Experiment[]> {
    await this.getExperiment("cta_color");
    await this.getExperiment("pricing_test");
    return Array.from(experimentCache.values());
  }
}

export const experimentService = new ExperimentService();

