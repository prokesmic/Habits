export type Frequency = "daily" | "weekly";

export type CheckIn = {
  date: string; // ISO date (yyyy-mm-dd)
  completed: boolean;
};

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  frequency: Frequency;
  targetPerWeek: number;
  currentStreak: number;
  longestStreak: number;
  activeStake?: number;
  squads: string[]; // squad IDs
  visibility: "public" | "private" | "squad";
  checkIns: CheckIn[];
}

export function getLast14Days(): string[] {
  const days: string[] = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split("T")[0]);
  }
  return days;
}

export function hasCheckIn(date: string, checkIns: CheckIn[]): boolean {
  return checkIns.some((ci) => ci.date === date && ci.completed);
}


