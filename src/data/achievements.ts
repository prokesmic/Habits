export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt?: string;
  progress?: number; // 0-100
};

export const achievements: Achievement[] = [
  { id: "a-streak-7", title: "7-Day Streak", description: "Keep a habit for 7 days", icon: "🔥", earnedAt: new Date().toISOString() },
  { id: "a-streak-30", title: "30-Day Streak", description: "Keep a habit for 30 days", icon: "🏆", progress: 60 },
  { id: "a-early-bird", title: "Early Bird", description: "Check in before 7am five times", icon: "🌅", progress: 40 },
  { id: "a-money-100", title: "$100 Earned", description: "Win $100 total", icon: "💰", progress: 75 },
];


