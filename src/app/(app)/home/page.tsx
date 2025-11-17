'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Flame,
  Users,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Award,
  Star
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { MobileHabitCard } from '@/components/mobile/MobileHabitCard';
import { CompletedHabitCard } from '@/components/mobile/CompletedHabitCard';
import { MobileActivityCard } from '@/components/mobile/MobileActivityCard';
import { MobileLoadingSkeleton } from '@/components/mobile/MobileLoadingSkeleton';

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
  user: {
    name: string;
    avatar: string;
  };
  habit: {
    name: string;
    emoji: string;
  };
  proof?: {
    photoUrl?: string;
    note?: string;
  };
  reactions: number;
  timestamp: string;
}

interface Achievement {
  id: string;
  name: string;
  emoji: string;
}

interface HomeData {
  user: {
    name: string;
    firstName: string;
    avatar: string;
    totalStreak: number;
  };
  today: {
    date: Date;
    completed: number;
    total: number;
    habits: Habit[];
  };
  squad: {
    activeNow: number;
    recentActivity: Activity[];
    checkInsToday: number;
  };
  streaks: {
    habitId: string;
    habitName: string;
    emoji: string;
    days: number;
    isHot: boolean;
  }[];
  achievements?: Achievement[];
  stakes?: {
    active: number;
    amount: number;
  };
}

export default function MobileHomePage() {
  const router = useRouter();
  const [data, setData] = useState<HomeData | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStakes, setShowStakes] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [localHabits, setLocalHabits] = useState<Habit[]>([]);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const response = await fetch('/api/home/mobile');
      if (!response.ok) throw new Error('Failed to load');
      const result = await response.json();
      setData(result);
      setLocalHabits(result.today.habits);
    } catch (error) {
      console.error('Failed to load home data:', error);
    }
  };

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

    // TODO: Call actual check-in API
    try {
      // await fetch(`/api/habits/${habitId}/checkin`, { method: 'POST' });
    } catch (error) {
      // Revert on error
      setLocalHabits(prev =>
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
    }
  };

  if (!data) return <MobileLoadingSkeleton />;

  const completionRate = data.today.total > 0
    ? Math.round((localHabits.filter(h => h.checkedInToday).length / data.today.total) * 100)
    : 0;

  const greeting = getGreeting();
  const uncompleted = localHabits.filter(h => !h.checkedInToday);
  const completed = localHabits.filter(h => h.checkedInToday);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full ring-2 ring-orange-500 bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center text-white font-bold">
                {data.user.firstName[0]}
              </div>
              <div>
                <div className="text-sm text-gray-600">{greeting}</div>
                <div className="font-bold text-lg">{data.user.firstName}!</div>
              </div>
            </div>

            <button
              onClick={() => router.push('/habits/new')}
              className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center shadow-lg"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4 space-y-4">
        {/* 1. TODAY'S PROGRESS CARD - HERO ELEMENT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 text-white rounded-2xl p-6 shadow-xl"
        >
          {/* Date */}
          <div className="text-orange-100 text-sm mb-2">
            {format(new Date(), 'EEEE, MMMM d')}
          </div>

          {/* Main Stats */}
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-5xl font-bold mb-1">{completionRate}%</div>
              <div className="text-orange-100">
                {completed.length} of {data.today.total} completed
              </div>
            </div>

            {completionRate === 100 && data.today.total > 0 && (
              <div className="text-5xl animate-bounce">
                🎉
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full h-3 overflow-hidden mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-white h-full rounded-full"
            />
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4" />
              <span>{data.user.totalStreak}d streak</span>
            </div>

            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{data.squad.activeNow} friends active</span>
            </div>

            <div className="flex items-center gap-1">
              <span>{uncompleted.length} left</span>
            </div>
          </div>
        </motion.div>

        {/* 2. TODAY'S HABITS CHECKLIST */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">Today&apos;s Habits</h2>
            {completed.length > 0 && (
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className="text-sm text-gray-600 flex items-center gap-1"
              >
                {showCompleted ? 'Hide' : 'Show'} completed ({completed.length})
                <ChevronDown className={`w-4 h-4 transition-transform ${showCompleted ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>

          {/* Uncompleted Habits */}
          {uncompleted.length === 0 && completed.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center"
            >
              <div className="text-6xl mb-3">🎉</div>
              <div className="text-xl font-bold text-green-900 mb-2">
                Perfect Day!
              </div>
              <div className="text-green-700">
                All habits completed! You&apos;re crushing it! 💪
              </div>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {uncompleted.map((habit, index) => (
                <MobileHabitCard
                  key={habit.id}
                  habit={habit}
                  onCheckIn={handleCheckIn}
                  delay={index * 0.1}
                />
              ))}
            </div>
          )}

          {/* Completed Habits (Collapsible) */}
          <AnimatePresence>
            {showCompleted && completed.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 pt-2"
              >
                {completed.map((habit) => (
                  <CompletedHabitCard key={habit.id} habit={habit} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {uncompleted.length === 0 && completed.length === 0 && (
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <div className="text-5xl mb-3">🎯</div>
              <div className="font-semibold text-lg mb-2">No habits today</div>
              <div className="text-gray-600 mb-4">
                Create your first habit to get started!
              </div>
              <button
                onClick={() => router.push('/habits/new')}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl"
              >
                Create Habit
              </button>
            </div>
          )}
        </div>

        {/* 3. SQUAD ACTIVITY FEED */}
        {data.squad.recentActivity.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Squad Activity
              </h2>
              <button
                onClick={() => router.push('/feed')}
                className="text-sm text-orange-600 font-medium"
              >
                See All
              </button>
            </div>

            <div className="space-y-3">
              {data.squad.recentActivity.slice(0, 3).map((activity) => (
                <MobileActivityCard key={activity.id} activity={activity} />
              ))}
            </div>

            {data.squad.checkInsToday > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <div className="text-sm text-blue-900">
                  🔥 Your squad logged <span className="font-bold">{data.squad.checkInsToday}</span> check-ins today!
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. HOT STREAKS */}
        {data.streaks.filter(s => s.isHot).length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Hot Streaks
              </h2>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
              <div className="space-y-3">
                {data.streaks
                  .filter(s => s.isHot)
                  .sort((a, b) => b.days - a.days)
                  .slice(0, 5)
                  .map((streak) => (
                    <div key={streak.habitId} className="flex items-center gap-3">
                      <div className="text-3xl">{streak.emoji}</div>
                      <div className="flex-1">
                        <div className="font-medium">{streak.habitName}</div>
                        <div className="text-sm text-gray-600">
                          {streak.days} days strong
                        </div>
                      </div>
                      <div className="text-2xl">
                        {getStreakEmoji(streak.days)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. QUICK ACTIONS */}
        <div className="space-y-3">
          <h2 className="font-bold text-lg">Quick Actions</h2>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.push('/squads')}
              className="bg-white border-2 border-gray-200 rounded-xl p-4 text-left hover:border-orange-500 hover:bg-orange-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="font-semibold text-sm">Invite Friends</div>
              <div className="text-xs text-gray-600">Build your squad</div>
            </button>

            <button
              onClick={() => router.push('/challenges')}
              className="bg-white border-2 border-gray-200 rounded-xl p-4 text-left hover:border-orange-500 hover:bg-orange-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div className="font-semibold text-sm">Join Challenge</div>
              <div className="text-xs text-gray-600">Compete & win</div>
            </button>

            <button
              onClick={() => router.push('/discover')}
              className="bg-white border-2 border-gray-200 rounded-xl p-4 text-left hover:border-orange-500 hover:bg-orange-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <Star className="w-5 h-5 text-green-600" />
              </div>
              <div className="font-semibold text-sm">Discover Habits</div>
              <div className="text-xs text-gray-600">Popular habits</div>
            </button>

            <button
              onClick={() => router.push('/analytics')}
              className="bg-white border-2 border-gray-200 rounded-xl p-4 text-left hover:border-orange-500 hover:bg-orange-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div className="font-semibold text-sm">View Stats</div>
              <div className="text-xs text-gray-600">Your progress</div>
            </button>
          </div>
        </div>

        {/* 6. ACHIEVEMENTS (COLLAPSED BY DEFAULT) */}
        {data.achievements && data.achievements.length > 0 && (
          <div className="space-y-3">
            <button
              onClick={() => setShowAchievements(!showAchievements)}
              className="w-full flex items-center justify-between"
            >
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Achievements ({data.achievements.length})
              </h2>
              <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${showAchievements ? 'rotate-90' : ''}`} />
            </button>

            <AnimatePresence>
              {showAchievements && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-3 gap-3"
                >
                  {data.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="bg-white border rounded-xl p-3 text-center"
                    >
                      <div className="text-3xl mb-1">{achievement.emoji}</div>
                      <div className="text-xs font-medium">{achievement.name}</div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* 7. STAKES (ONLY IF USER HAS THEM, COLLAPSED) */}
        {data.stakes && data.stakes.active > 0 && (
          <div className="space-y-3">
            <button
              onClick={() => setShowStakes(!showStakes)}
              className="w-full flex items-center justify-between"
            >
              <h2 className="font-bold text-lg flex items-center gap-2">
                <span className="text-purple-500">💰</span>
                Active Stakes ({data.stakes.active})
              </h2>
              <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${showStakes ? 'rotate-90' : ''}`} />
            </button>

            <AnimatePresence>
              {showStakes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-purple-50 border border-purple-200 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-purple-900">Total at stake</div>
                    <div className="text-2xl font-bold text-purple-900">
                      ${data.stakes.amount}
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/wallet')}
                    className="w-full px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg text-sm"
                  >
                    View Wallet
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getStreakEmoji(days: number): string {
  if (days >= 365) return '👑';
  if (days >= 180) return '🏆';
  if (days >= 90) return '💎';
  if (days >= 30) return '⭐';
  if (days >= 7) return '🔥';
  return '✨';
}
