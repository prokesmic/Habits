'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Flame, Users, Award, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { DesktopHabitCard } from './DesktopHabitCard';
import { CompactActivityCard } from './CompactActivityCard';
import { CollapsibleSection } from './CollapsibleSection';
import { NoHabitsEmptyState } from '@/components/ui/EmptyState';
import { toast, CheckInToast } from '@/components/ui/CustomToast';

interface Habit {
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
  squadMembers: {
    id: string;
    name: string;
    avatar: string;
    checkedInToday: boolean;
  }[];
  hasStake?: boolean;
  stakeAmount?: number;
}

interface Activity {
  id: string;
  user: { name: string };
  habit: { name: string; emoji: string };
  proof?: { photoUrl?: string };
  reactions: number;
  timestamp: string;
}

interface Achievement {
  id: string;
  name: string;
  emoji: string;
}

interface DesktopDashboardClientProps {
  user: {
    firstName: string;
    totalStreak: number;
  };
  habits: Habit[];
  activities: Activity[];
  hotStreaks: Habit[];
  achievements: Achievement[];
  stakes: { count: number; totalAmount: number } | null;
  squadActiveNow: number;
}

export const DesktopDashboardClient = ({
  user,
  habits: initialHabits,
  activities,
  hotStreaks,
  achievements,
  stakes,
  squadActiveNow
}: DesktopDashboardClientProps) => {
  const router = useRouter();
  const [habits, setHabits] = useState(initialHabits);

  const completedToday = habits.filter(h => h.checkedInToday).length;
  const totalToday = habits.length;
  const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const handleCheckIn = async (habitId: string) => {
    // Optimistic update
    setHabits(prev =>
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

    const habit = habits.find(h => h.id === habitId);
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
      setHabits(prev =>
        prev.map(h =>
          h.id === habitId
            ? {
                ...h,
                checkedInToday: false,
                currentStreak: h.currentStreak - 1,
              }
            : h
        )
      );
      toast.error('Failed to check in', { description: 'Please try again' });
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* LEFT COLUMN - 2/3 width - HABITS FIRST */}
      <div className="lg:col-span-2 space-y-6">
        {/* 1. TODAY'S PROGRESS CARD - HERO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 text-white rounded-2xl p-8 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Hey, {user.firstName}! 👋
              </h1>
              <p className="text-orange-100 text-lg">
                {format(new Date(), 'EEEE, MMMM d')}
              </p>
            </div>

            <div className="text-right">
              <div className="text-6xl font-bold">{completionRate}%</div>
              <div className="text-orange-100">Complete</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full h-4 overflow-hidden mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-white h-full rounded-full"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>{completedToday} of {totalToday} habits completed</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Flame className="w-4 h-4" />
                {user.totalStreak}d streak
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {squadActiveNow} friends active
              </span>
            </div>
          </div>
        </motion.div>

        {/* 2. TODAY'S HABITS LIST - MAIN FOCUS */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Today&apos;s Habits</h2>

          {habits.length === 0 ? (
            <NoHabitsEmptyState onCreate={() => router.push('/habits/new')} />
          ) : (
            <div className="space-y-3">
              {habits.map((habit) => (
                <DesktopHabitCard
                  key={habit.id}
                  habit={habit}
                  onCheckIn={handleCheckIn}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN - 1/3 width - SOCIAL SIDEBAR */}
      <div className="space-y-6">
        {/* Squad Activity Widget */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900">
              <Users className="w-5 h-5 text-blue-500" />
              Squad Today
            </h3>
            <button
              onClick={() => router.push('/feed')}
              className="text-sm text-orange-600 font-medium hover:underline"
            >
              View All
            </button>
          </div>

          {/* Compact Activity Feed */}
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {activities.slice(0, 5).map((activity) => (
              <CompactActivityCard key={activity.id} activity={activity} />
            ))}
          </div>

          {activities.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>No activity yet</p>
              <button
                onClick={() => router.push('/squads')}
                className="text-orange-600 font-medium mt-2"
              >
                Invite friends
              </button>
            </div>
          )}
        </div>

        {/* Hot Streaks */}
        {hotStreaks.length > 0 && (
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900">
              <Flame className="w-5 h-5 text-orange-500" />
              Hot Streaks
            </h3>
            <div className="space-y-3">
              {hotStreaks.slice(0, 5).map((streak) => (
                <div key={streak.id} className="flex items-center gap-3">
                  <span className="text-2xl">{streak.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">{streak.name}</div>
                    <div className="text-xs text-gray-600">{streak.currentStreak} days</div>
                  </div>
                  <span className="text-orange-500 text-xl">🔥</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-bold mb-4 text-gray-900">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => router.push('/squads')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50 transition-colors text-left"
            >
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-sm text-gray-900">Invite Friends</div>
                <div className="text-xs text-gray-600">Build your squad</div>
              </div>
            </button>
            <button
              onClick={() => router.push('/challenges')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50 transition-colors text-left"
            >
              <Award className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-medium text-sm text-gray-900">Join Challenge</div>
                <div className="text-xs text-gray-600">Compete & win</div>
              </div>
            </button>
            <button
              onClick={() => router.push('/analytics')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50 transition-colors text-left"
            >
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-medium text-sm text-gray-900">View Analytics</div>
                <div className="text-xs text-gray-600">Track your progress</div>
              </div>
            </button>
          </div>
        </div>

        {/* ACHIEVEMENTS - COLLAPSED BY DEFAULT */}
        {achievements.length > 0 && (
          <CollapsibleSection
            title={`Achievements (${achievements.length})`}
            icon={<Award className="w-5 h-5 text-yellow-500" />}
            defaultCollapsed={true}
          >
            <div className="grid grid-cols-3 gap-2">
              {achievements.slice(0, 9).map((achievement) => (
                <div key={achievement.id} className="text-center p-2">
                  <div className="text-3xl mb-1">{achievement.emoji}</div>
                  <div className="text-xs text-gray-700">{achievement.name}</div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* STAKES - COLLAPSED BY DEFAULT, ONLY IF USER HAS THEM */}
        {stakes && stakes.count > 0 && (
          <CollapsibleSection
            title={`Active Stakes (${stakes.count})`}
            icon={<span className="text-purple-500">💰</span>}
            defaultCollapsed={true}
          >
            <div className="text-center py-4">
              <div className="text-3xl font-bold mb-1">
                ${stakes.totalAmount}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                {stakes.count} active {stakes.count === 1 ? 'stake' : 'stakes'}
              </div>
              <button
                onClick={() => router.push('/wallet')}
                className="text-sm text-purple-600 font-medium hover:underline"
              >
                View Wallet →
              </button>
            </div>
          </CollapsibleSection>
        )}
      </div>
    </div>
  );
};
