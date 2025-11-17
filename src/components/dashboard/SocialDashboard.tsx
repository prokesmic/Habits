'use client';

import { useState } from 'react';
import { ProgressCard } from './ProgressCard';
import { SocialHabitCard } from './SocialHabitCard';
import { SocialActivityCard } from './SocialActivityCard';
import { SquadSidebar } from './SquadSidebar';
import { toast, CheckInToast } from '@/components/ui/CustomToast';
import { NoHabitsEmptyState, NoActivityEmptyState } from '@/components/ui/EmptyState';

interface SocialDashboardProps {
  habits: {
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
  }[];
  activities: {
    id: string;
    type: 'checkin' | 'streak_milestone' | 'challenge_joined';
    user: {
      name: string;
      avatar?: string;
    };
    habit: {
      name: string;
      emoji: string;
    };
    proof?: {
      photoUrl?: string;
      note?: string;
    };
    metadata?: {
      days?: number;
    };
    reactions: {
      type: string;
      count: number;
      userReacted: boolean;
    }[];
    commentCount: number;
    timestamp: string;
  }[];
  weekProgress: {
    day: string;
    completed: number;
    total: number;
  }[];
  squadStats: {
    activeMembers: number;
    totalCheckInsToday: number;
    topPerformer?: {
      name: string;
      avatar?: string;
      checkIns: number;
    };
  };
  topStreaks: {
    id: string;
    name: string;
    emoji: string;
    currentStreak: number;
  }[];
  hasActiveStakes?: boolean;
  activeStakesAmount?: number;
  onCreateHabit?: () => void;
}

export const SocialDashboard = ({
  habits,
  activities,
  weekProgress,
  squadStats,
  topStreaks,
  hasActiveStakes,
  activeStakesAmount,
  onCreateHabit
}: SocialDashboardProps) => {
  const [localHabits, setLocalHabits] = useState(habits);

  const completedToday = localHabits.filter(h => h.checkedInToday).length;
  const totalToday = localHabits.length;

  const handleCheckIn = async (habitId: string) => {
    // Optimistic update
    setLocalHabits(prev =>
      prev.map(h =>
        h.id === habitId
          ? {
              ...h,
              checkedInToday: true,
              currentStreak: h.currentStreak + 1,
              lastCheckIn: {
                timestamp: new Date().toISOString(),
                note: '',
              }
            }
          : h
      )
    );

    const habit = localHabits.find(h => h.id === habitId);
    if (habit) {
      toast.custom(
        <CheckInToast
          habitName={habit.name}
          streak={habit.currentStreak + 1}
        />,
        4000
      );
    }

    // TODO: Call actual API
    try {
      // await checkInHabit(habitId);
    } catch (error) {
      // Revert on error
      setLocalHabits(prev =>
        prev.map(h =>
          h.id === habitId
            ? {
                ...h,
                checkedInToday: false,
                currentStreak: h.currentStreak - 1,
                lastCheckIn: habits.find(oh => oh.id === habitId)?.lastCheckIn
              }
            : h
        )
      );
      toast.error('Failed to check in', { description: 'Please try again' });
    }
  };

  const handleReact = async (activityId: string, emoji: string) => {
    // TODO: Call actual API
    try {
      // await reactToActivity(activityId, emoji);
    } catch (error) {
      toast.error('Failed to react');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
      <div className="space-y-6">
        <ProgressCard
          completedToday={completedToday}
          totalToday={totalToday}
          weekProgress={weekProgress}
        />

        <div>
          <h2 className="text-lg font-semibold mb-4">Today's Habits</h2>
          {localHabits.length > 0 ? (
            <div className="space-y-4">
              {localHabits.map(habit => (
                <SocialHabitCard
                  key={habit.id}
                  habit={habit}
                  onCheckIn={handleCheckIn}
                />
              ))}
            </div>
          ) : (
            <NoHabitsEmptyState onCreate={onCreateHabit || (() => {})} />
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Activity Feed</h2>
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map(activity => (
                <SocialActivityCard
                  key={activity.id}
                  activity={activity}
                  onReact={handleReact}
                />
              ))}
            </div>
          ) : (
            <NoActivityEmptyState />
          )}
        </div>
      </div>

      <aside className="hidden lg:block">
        <SquadSidebar
          squadStats={squadStats}
          topStreaks={topStreaks}
          hasActiveStakes={hasActiveStakes}
          activeStakesAmount={activeStakesAmount}
        />
      </aside>
    </div>
  );
};
