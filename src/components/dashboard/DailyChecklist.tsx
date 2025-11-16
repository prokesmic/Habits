"use client";

import type { ChecklistItemData } from "./ChecklistItem";
import { ChecklistItem } from "./ChecklistItem";

type DailyChecklistProps = {
  items: ChecklistItemData[];
  onCheckIn?: (habitId: string) => Promise<void> | void;
};

function isAtRisk(): boolean {
  const now = new Date();
  return now.getHours() >= 20;
}

export function DailyChecklist({ items, onCheckIn }: DailyChecklistProps) {
  const sorted = [...items].sort((a, b) => {
    const aRisk = isAtRisk() && !a.checkedInToday ? 0 : 1;
    const bRisk = isAtRisk() && !b.checkedInToday ? 0 : 1;
    if (aRisk !== bRisk) return aRisk - bRisk;
    if (a.checkedInToday !== b.checkedInToday) return a.checkedInToday ? 1 : -1;
    return a.habit.name.localeCompare(b.habit.name);
  });

  return (
    <ul className="space-y-3">
      {sorted.map((item) => (
        <li key={item.habit.id}>
          <ChecklistItem item={item} onCheckIn={onCheckIn} />
        </li>
      ))}
    </ul>
  );
}


