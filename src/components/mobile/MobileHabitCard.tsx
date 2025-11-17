'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Users } from 'lucide-react';

interface MobileHabitCardProps {
  habit: {
    id: string;
    name: string;
    emoji: string;
    currentStreak: number;
    checkedInToday: boolean;
    squadMembers: {
      id: string;
      avatar: string;
      name: string;
      checkedInToday: boolean;
    }[];
    hasStake?: boolean;
  };
  onCheckIn: (habitId: string) => void;
  delay?: number;
}

export const MobileHabitCard = ({ habit, onCheckIn, delay = 0 }: MobileHabitCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const checkedInCount = habit.squadMembers.filter(m => m.checkedInToday).length;

  const handleCheckIn = async () => {
    setIsLoading(true);
    try {
      await onCheckIn(habit.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-orange-500 transition-colors"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Emoji */}
          <div className="text-4xl">{habit.emoji}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="font-semibold mb-1">{habit.name}</div>

            {/* Meta Info */}
            <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
              {habit.currentStreak > 0 && (
                <div className="flex items-center gap-1 text-orange-600 font-semibold">
                  <Flame className="w-3 h-3" />
                  {habit.currentStreak}d
                </div>
              )}

              {habit.squadMembers.length > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {checkedInCount}/{habit.squadMembers.length} done
                </div>
              )}

              {habit.hasStake && (
                <div className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                  Stake
                </div>
              )}
            </div>

            {/* Squad Avatars */}
            {habit.squadMembers.length > 0 && (
              <div className="flex -space-x-2 mb-3">
                {habit.squadMembers.slice(0, 5).map((member) => (
                  <div key={member.id} className="relative">
                    <div
                      className={`w-6 h-6 rounded-full border-2 border-white bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold ${
                        member.checkedInToday ? '' : 'opacity-40'
                      }`}
                      title={member.name}
                    >
                      {member.name[0]}
                    </div>
                    {member.checkedInToday && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Check-In Button */}
            <button
              onClick={handleCheckIn}
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>✓</span>
                  Check In
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
