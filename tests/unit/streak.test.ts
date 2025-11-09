import { describe, expect, it } from "vitest";
import { calculateStreak, type HabitLog } from "@/lib/habits/streak";

describe("calculateStreak", () => {
  it("increments streak for consecutive days (daily)", () => {
    const prev: HabitLog = { log_date: "2024-01-01", streak_count: 3 };
    const result = calculateStreak(prev, "2024-01-02", "daily");
    expect(result).toBe(4);
  });

  it("resets streak if day missed (daily)", () => {
    const prev: HabitLog = { log_date: "2024-01-01", streak_count: 3 };
    const result = calculateStreak(prev, "2024-01-04", "daily");
    expect(result).toBe(1);
  });
});

