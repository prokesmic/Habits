'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface SocialHabitCardProps {
  habit: {
    id: string;
    name: string;
    emoji: string;
    currentStreak: number;
    longestStreak: number;
    checkedInToday: boolean;
    lastCheckIn?: {
      proofPhotoUrl?: string;
      note?: string;
      timestamp: string;
    };
    squadMembers?: {
      id: string;
      name: string;
      avatar: string;
      checkedInToday: boolean;
    }[];
    hasStake?: boolean;
    stakeAmount?: number;
  };
  onCheckIn: (habitId: string) => Promise<void>;
}

export const SocialHabitCard = ({ habit, onCheckIn }: SocialHabitCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border-2 p-6 transition-all ${
        habit.checkedInToday
          ? 'border-green-500 bg-green-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="text-5xl">{habit.emoji}</div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold mb-1">{habit.name}</h3>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-orange-600 font-semibold">
                  <Flame className="w-4 h-4" />
                  <span>{habit.currentStreak} day streak</span>
                </div>

                <div className="text-gray-500">
                  Best: {habit.longestStreak} days
                </div>
              </div>
            </div>

            {habit.hasStake && (
              <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                ${habit.stakeAmount}
              </div>
            )}
          </div>

          {habit.squadMembers && habit.squadMembers.length > 0 && (
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">
                {habit.squadMembers.filter(m => m.checkedInToday).length} of {habit.squadMembers.length} checked in today
              </div>
              <div className="flex items-center gap-2">
                {habit.squadMembers.map((member) => (
                  <div
                    key={member.id}
                    className="relative"
                    title={member.name}
                  >
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold border-2 ${
                        member.checkedInToday
                          ? 'border-green-500'
                          : 'border-gray-300 opacity-50'
                      }`}
                    >
                      {member.name[0]}
                    </div>
                    {member.checkedInToday && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {habit.lastCheckIn?.proofPhotoUrl && (
            <div className="mb-4">
              <img
                src={habit.lastCheckIn.proofPhotoUrl}
                alt="Last check-in"
                className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90"
              />
              {habit.lastCheckIn.note && (
                <p className="text-sm text-gray-600 mt-2 italic">
                  "{habit.lastCheckIn.note}"
                </p>
              )}
            </div>
          )}

          {habit.checkedInToday ? (
            <div className="bg-green-100 border border-green-500 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                ✓
              </div>
              <div className="flex-1">
                <div className="font-semibold text-green-900">Completed! 🎉</div>
                {habit.lastCheckIn && (
                  <div className="text-sm text-green-700">
                    Checked in at {new Date(habit.lastCheckIn.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={handleCheckIn}
              disabled={isLoading}
              className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-xl">✓</span>
                  Check In Now
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
