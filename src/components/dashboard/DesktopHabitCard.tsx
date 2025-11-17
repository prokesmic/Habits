'use client';

import { useState } from 'react';
import { Flame, Users } from 'lucide-react';

interface DesktopHabitCardProps {
  habit: {
    id: string;
    name: string;
    emoji: string;
    currentStreak: number;
    checkedInToday: boolean;
    lastCheckIn?: {
      proofPhotoUrl?: string;
      note?: string;
      timestamp: string;
    };
    squadMembers: {
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

export const DesktopHabitCard = ({ habit, onCheckIn }: DesktopHabitCardProps) => {
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
    <div
      className={`bg-white rounded-xl border-2 p-6 transition-all ${
        habit.checkedInToday
          ? 'border-green-500 bg-green-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-6">
        {/* Emoji */}
        <div className="text-5xl">{habit.emoji}</div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{habit.name}</h3>

          <div className="flex items-center gap-6 text-sm mb-3">
            {/* Streak */}
            {habit.currentStreak > 0 && (
              <div className="flex items-center gap-1 text-orange-600 font-semibold">
                <Flame className="w-4 h-4" />
                <span>{habit.currentStreak} day streak</span>
              </div>
            )}

            {/* Squad members */}
            {habit.squadMembers.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {habit.squadMembers.slice(0, 3).map((member) => (
                    <div
                      key={member.id}
                      className={`w-6 h-6 rounded-full border-2 border-white bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold ${
                        member.checkedInToday ? '' : 'opacity-40'
                      }`}
                      title={member.name}
                    >
                      {member.name[0]}
                    </div>
                  ))}
                </div>
                <span className="text-gray-600">
                  {habit.squadMembers.filter(m => m.checkedInToday).length}/{habit.squadMembers.length} done
                </span>
              </div>
            )}

            {/* Subtle stake indicator */}
            {habit.hasStake && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                ${habit.stakeAmount}
              </span>
            )}
          </div>

          {/* Proof from last check-in */}
          {habit.lastCheckIn?.proofPhotoUrl && (
            <img
              src={habit.lastCheckIn.proofPhotoUrl}
              alt="Last proof"
              className="w-full max-w-md h-32 object-cover rounded-lg mb-3"
            />
          )}
        </div>

        {/* Check-in button */}
        <div className="flex-shrink-0">
          {habit.checkedInToday ? (
            <div className="flex items-center gap-3 bg-green-100 border border-green-500 rounded-xl px-6 py-4">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                ✓
              </div>
              <div>
                <div className="font-semibold text-green-900">Done!</div>
                {habit.lastCheckIn && (
                  <div className="text-sm text-green-700">
                    {new Date(habit.lastCheckIn.timestamp).toLocaleTimeString([], {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={handleCheckIn}
              disabled={isLoading}
              className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-xl">✓</span>
                  Check In
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
