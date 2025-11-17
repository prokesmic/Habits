'use client';

import { Flame } from 'lucide-react';

interface CompletedHabitCardProps {
  habit: {
    id: string;
    name: string;
    emoji: string;
    currentStreak: number;
  };
}

export const CompletedHabitCard = ({ habit }: CompletedHabitCardProps) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3 opacity-75">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0">
          ✓
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">{habit.emoji}</span>
            <span className="font-medium text-sm line-through text-gray-600">
              {habit.name}
            </span>
          </div>
        </div>

        {habit.currentStreak > 0 && (
          <div className="flex items-center gap-1 text-xs text-orange-600 font-semibold flex-shrink-0">
            <Flame className="w-3 h-3" />
            {habit.currentStreak}
          </div>
        )}
      </div>
    </div>
  );
};
