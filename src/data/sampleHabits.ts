import type { Habit } from "@/types/habit";

const iso = (d: Date) => d.toISOString().split("T")[0];
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return iso(d);
};

export const sampleHabits: Habit[] = [
  {
    id: "h1",
    name: "Morning Meditation",
    emoji: "🧘",
    frequency: "daily",
    targetPerWeek: 7,
    currentStreak: 7,
    longestStreak: 21,
    activeStake: 10,
    squads: ["s1", "s2"],
    visibility: "squad",
    checkIns: Array.from({ length: 14 }).map((_, i) => {
      const date = daysAgo(13 - i);
      const completed = [0, 1, 2, 4, 5, 6, 8, 9, 11, 12, 13].includes(i);
      return { date, completed };
    }),
  },
  {
    id: "h2",
    name: "Gym",
    emoji: "💪",
    frequency: "daily",
    targetPerWeek: 5,
    currentStreak: 3,
    longestStreak: 12,
    activeStake: 20,
    squads: ["s3"],
    visibility: "public",
    checkIns: Array.from({ length: 14 }).map((_, i) => {
      const date = daysAgo(13 - i);
      const completed = [1, 3, 4, 7, 10, 13].includes(i);
      return { date, completed };
    }),
  },
  {
    id: "h3",
    name: "Read 20 pages",
    emoji: "📚",
    frequency: "daily",
    targetPerWeek: 5,
    currentStreak: 2,
    longestStreak: 15,
    squads: [],
    visibility: "private",
    checkIns: Array.from({ length: 14 }).map((_, i) => {
      const date = daysAgo(13 - i);
      const completed = [0, 2, 5, 6, 9, 12].includes(i);
      return { date, completed };
    }),
  },
];


