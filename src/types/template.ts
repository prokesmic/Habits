export type TemplateCategory = "health" | "mind" | "work" | "social" | "habits";

export interface HabitTemplate {
  id: string;
  name: string;
  emoji: string;
  category: TemplateCategory;
  defaultFrequency: "daily" | "weekly";
  defaultTarget: number; // times per week
  suggestedStake: number;
  description: string;
  popularity: number; // 1-100
}


