export type HabitLog = {
  log_date: string;
  streak_count: number;
};

export function calculateStreak(previousLog: HabitLog | null, currentDate: string, frequency: string) {
  if (!previousLog) {
    return 1;
  }

  const prev = new Date(previousLog.log_date);
  const curr = new Date(currentDate);
  const diffDays = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

  if (frequency === "daily") {
    return diffDays === 1 ? previousLog.streak_count + 1 : 1;
  }

  if (frequency === "weekdays") {
    // If it's Monday (1) and previous was Friday (5), diff is 3 days, which is valid.
    // If it's any other day, diff must be 1.
    const isMonday = curr.getDay() === 1;
    const wasFriday = prev.getDay() === 5;

    if (isMonday && wasFriday && diffDays <= 3) {
      return previousLog.streak_count + 1;
    }

    return diffDays === 1 ? previousLog.streak_count + 1 : 1;
  }

  return previousLog.streak_count + 1;
}

