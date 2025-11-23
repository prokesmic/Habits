'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast, CheckInToast } from '@/components/ui/CustomToast';
import { StreakRiskBanner } from './StreakRiskBanner';
import { StreakFreezeCard } from './StreakFreezeCard';
import { StakesCard } from './StakesCard';
import { DailyRewardsCard } from './DailyRewardsCard';
import {
  NoHabitsToday,
  NoActivityToday,
  AllHabitsCompleted,
  WelcomeNewUser,
  MissedStreak
} from '@/components/ui/EmptyStates';
import { QuickActions, DashboardQuickActionsHero } from './QuickActions';
import { getIconByName } from '@/components/habits/IconPicker';

type HabitStatus = "due" | "done";

interface TransformedHabit {
  id: string;
  name: string;
  emoji: string;
  status: HabitStatus;
  streakDays: number;
  frequencyLabel: string;
  squadName?: string;
  extraLabel?: string;
}

interface SquadActivity {
  id: string;
  initials: string;
  name: string;
  action: string;
  habitName: string;
  icon: string;
  minutesAgoLabel: string;
  streakLabel?: string;
  avatarBg: string;
  photoUrl?: string;
}

// Original prop interfaces (from server component)
interface OriginalHabit {
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

interface OriginalActivity {
  id: string;
  user: { name: string };
  habit: { name: string; emoji: string };
  proof?: { photoUrl?: string };
  reactions: number;
  timestamp: string;
}

interface DesktopDashboardClientProps {
  user: {
    firstName: string;
    totalStreak: number;
  };
  habits: OriginalHabit[];
  activities: OriginalActivity[];
  hotStreaks: OriginalHabit[];
  achievements: { id: string; name: string; emoji: string }[];
  stakes: { count: number; totalAmount: number } | null;
  squadActiveNow: number;
  hasSquads?: boolean;
  hasChallenges?: boolean;
  isNewUser?: boolean;
  daysMissed?: number;
}

export const DesktopDashboardClient = ({
  user,
  habits: initialHabits,
  activities,
  stakes,
  squadActiveNow,
  hasSquads = false,
  hasChallenges = false,
  isNewUser = false,
  daysMissed = 0
}: DesktopDashboardClientProps) => {
  const router = useRouter();
  const [habits, setHabits] = useState(initialHabits);
  const [hasClaimedDailyReward, setHasClaimedDailyReward] = useState(false);
  const [streakFreezes, setStreakFreezes] = useState(2);

  // Mock data for new features
  const hoursUntilMidnight = 24 - new Date().getHours();
  const hasIncompleteHabits = habits.some(h => !h.checkedInToday);
  const highestStreak = Math.max(...habits.map(h => h.currentStreak), 0);

  const weeklyRewards = [
    { day: 1, reward: "🌟", claimed: true },
    { day: 2, reward: "💎", claimed: true },
    { day: 3, reward: "🔥", claimed: false },
    { day: 4, reward: "⚡", claimed: false },
    { day: 5, reward: "🎯", claimed: false },
    { day: 6, reward: "👑", claimed: false },
    { day: 7, reward: "🏆", claimed: false },
  ];

  const handleCheckIn = async (habitId: string) => {
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

    try {
      // TODO: Call actual API
    } catch {
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

  // Transform habits to new format
  const todaysHabits: TransformedHabit[] = habits.map(h => ({
    id: h.id,
    name: h.name,
    emoji: h.emoji,
    status: h.checkedInToday ? "done" : "due",
    streakDays: h.currentStreak,
    frequencyLabel: "5x / week",
    squadName: h.squadMembers.length > 0 ? "Squad" : undefined,
    extraLabel: h.hasStake ? `$${h.stakeAmount} stake` : undefined,
  }));

  // Transform activities to new format
  const squadActivities: SquadActivity[] = activities.map((activity, index) => {
    const avatarColors = ["bg-sky-500", "bg-violet-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500"];
    const timeDiff = Date.now() - new Date(activity.timestamp).getTime();
    const minutesAgo = Math.round(timeDiff / (1000 * 60));
    const hoursAgo = Math.round(timeDiff / (1000 * 60 * 60));

    let timeLabel = "";
    if (minutesAgo < 60) {
      timeLabel = `${minutesAgo} minutes ago`;
    } else if (hoursAgo < 24) {
      timeLabel = `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
    } else {
      timeLabel = "yesterday";
    }

    return {
      id: activity.id,
      initials: activity.user.name[0],
      name: activity.user.name,
      action: "completed",
      habitName: activity.habit.name,
      icon: activity.habit.emoji,
      minutesAgoLabel: timeLabel,
      streakLabel: `🔥 ${Math.floor(Math.random() * 10) + 3}-day streak`,
      avatarBg: avatarColors[index % avatarColors.length],
      photoUrl: activity.proof?.photoUrl,
    };
  });

  const habitsCompletedToday = todaysHabits.filter(h => h.status === "done").length;
  const totalHabitsToday = todaysHabits.length;
  const firstIncompleteHabit = todaysHabits.find(h => h.status === "due");

  return (
    <div className="text-slate-900">
      <div className="space-y-6">
        {/* STREAK RISK WARNING - Show if habits incomplete and time running out */}
        {hasIncompleteHabits && hoursUntilMidnight <= 12 && highestStreak > 0 && (
          <StreakRiskBanner
            hoursRemaining={hoursUntilMidnight}
            streakDays={highestStreak}
            hasStreakFreeze={streakFreezes > 0}
            onUseFreeze={() => setStreakFreezes(prev => Math.max(0, prev - 1))}
            onCheckIn={() => {
              if (firstIncompleteHabit) {
                handleCheckIn(firstIncompleteHabit.id);
              }
            }}
          />
        )}

        {/* HEADER CARD */}
        <section className="mb-6 rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 p-5 text-white shadow-sm shadow-slate-900/10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Greeting */}
            <div>
              <p className="text-sm font-medium opacity-90">
                {format(new Date(), 'EEEE, MMMM d')}
              </p>
              <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
                Hey, {user.firstName}! 👋
              </h1>
              <p className="mt-1 text-sm opacity-90">
                You&apos;re{" "}
                <span className="font-semibold">
                  {Math.max(totalHabitsToday - habitsCompletedToday, 0)} check-in
                  {totalHabitsToday - habitsCompletedToday === 1 ? "" : "s"}
                </span>{" "}
                away from 100% today.
              </p>
            </div>

            {/* Progress */}
            <div className="flex flex-1 flex-col gap-2 md:max-w-sm">
              <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide opacity-90">
                <span>Today</span>
                <span>
                  {habitsCompletedToday} / {totalHabitsToday} habits completed
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/20">
                <div
                  className="h-2 rounded-full bg-white transition-all"
                  style={{
                    width:
                      totalHabitsToday === 0
                        ? "0%"
                        : `${(habitsCompletedToday / totalHabitsToday) * 100}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1">
                  <span>🔥</span>
                  <span className="font-medium">{user.totalStreak}-day streak</span>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1">
                  <span>👥</span>
                  <span className="font-medium">{squadActiveNow} friends active now</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  if (firstIncompleteHabit) {
                    handleCheckIn(firstIncompleteHabit.id);
                  }
                }}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-amber-600 shadow-sm shadow-slate-900/10 transition hover:bg-amber-50"
              >
                {habitsCompletedToday < totalHabitsToday
                  ? `Check in for "${firstIncompleteHabit?.name ?? "your next habit"}"`
                  : "View today's habits"}
              </button>
            </div>
          </div>
        </section>

        {/* MAIN GRID */}
        <section className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* LEFT: TODAY'S HABITS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Today&apos;s Habits
              </h2>
              <p className="text-xs text-slate-500">
                {totalHabitsToday} active habit
                {totalHabitsToday === 1 ? "" : "s"}
              </p>
            </div>

            {/* Empty States */}
            {isNewUser && todaysHabits.length === 0 ? (
              <WelcomeNewUser userName={user.firstName} />
            ) : daysMissed > 1 && todaysHabits.length > 0 ? (
              <MissedStreak daysLost={daysMissed} className="mb-4" />
            ) : null}

            {/* All completed celebration */}
            {todaysHabits.length > 0 && habitsCompletedToday === totalHabitsToday && (
              <AllHabitsCompleted className="mb-4" />
            )}

            {todaysHabits.length === 0 && !isNewUser ? (
              <NoHabitsToday />
            ) : (
              todaysHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onCheckIn={() => handleCheckIn(habit.id)}
                />
              ))
            )}
          </div>

          {/* RIGHT: SQUAD + QUICK ACTIONS */}
          <div className="space-y-4">
            {/* Squad Today */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  Squad Today
                </h2>
                <Link
                  href="/squads"
                  className="text-xs font-medium text-amber-600 hover:text-amber-700"
                >
                  View all
                </Link>
              </div>
              <p className="mb-3 text-xs text-slate-500">
                See what your friends have checked in for today.
              </p>

              <div className="space-y-3 text-xs">
                {squadActivities.slice(0, 3).map((activity) => (
                  <SquadActivityItem key={activity.id} activity={activity} />
                ))}
              </div>

              {squadActivities.length === 0 && (
                <NoActivityToday />
              )}
            </div>

            {/* Quick Actions - Contextual based on user state */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5">
              <QuickActions
                hasSquads={hasSquads}
                hasChallenges={hasChallenges}
              />
            </div>

            {/* Stakes Card - Prominent monetization feature */}
            <StakesCard
              activeStakes={stakes?.count || 0}
              totalAtRisk={stakes?.totalAmount || 0}
              potentialWinnings={Math.round((stakes?.totalAmount || 0) * 1.5)}
              weeklyProgress={Math.round((habitsCompletedToday / Math.max(totalHabitsToday, 1)) * 100)}
              onAddStake={() => router.push('/stakes')}
            />

            {/* Daily Rewards */}
            <DailyRewardsCard
              currentDay={3}
              hasClaimedToday={hasClaimedDailyReward}
              weeklyRewards={weeklyRewards}
              onClaimReward={() => setHasClaimedDailyReward(true)}
            />

            {/* Streak Freeze Card */}
            <StreakFreezeCard
              freezesAvailable={streakFreezes}
              freezesUsedThisMonth={1}
              maxFreezes={5}
              onPurchaseFreeze={() => setStreakFreezes(prev => prev + 1)}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

/* ====== PRESENTATIONAL COMPONENTS ====== */

// Helper to check if a string is an emoji vs a Lucide icon name
function isEmoji(str: string): boolean {
  // Emojis are typically 1-4 characters with special Unicode ranges
  // Lucide icon names are PascalCase like "CheckSquare", "Dumbbell"
  if (!str || str.length === 0) return false;
  // If it starts with a capital letter and has no spaces, it's likely an icon name
  if (/^[A-Z][a-zA-Z0-9]*$/.test(str)) return false;
  return true;
}

// Component to render either emoji or Lucide icon
function HabitIcon({ emoji, className }: { emoji: string; className?: string }) {
  if (isEmoji(emoji)) {
    return <span className={className}>{emoji}</span>;
  }
  const Icon = getIconByName(emoji);
  return <Icon className={className || "h-5 w-5"} />;
}

function HabitCard({ habit, onCheckIn }: { habit: TransformedHabit; onCheckIn: () => void }) {
  const isDone = habit.status === "done";

  if (isDone) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-sm shadow-emerald-200/60">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500 text-lg text-white">
              <HabitIcon emoji={habit.emoji} className={isEmoji(habit.emoji) ? undefined : "h-5 w-5"} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Link href={`/habits/${habit.id}`} className="text-sm font-semibold text-emerald-950 hover:underline">
                  {habit.name}
                </Link>
                <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  Done today
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-emerald-700">
                <span className="inline-flex items-center gap-1">
                  🔥 <span>{habit.streakDays}-day streak</span>
                </span>
                {habit.extraLabel && (
                  <span className="inline-flex items-center gap-1">
                    {habit.emoji} <span>{habit.extraLabel}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <button className="shrink-0 rounded-full border border-emerald-400 bg-white/70 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-white">
            View check-in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-500 text-lg text-white">
            <HabitIcon emoji={habit.emoji} className={isEmoji(habit.emoji) ? undefined : "h-5 w-5"} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Link href={`/habits/${habit.id}`} className="text-sm font-semibold text-slate-900 hover:underline">
                {habit.name}
              </Link>
              <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                Due today
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                🔥 <span>{habit.streakDays}-day streak</span>
              </span>
              {habit.frequencyLabel && (
                <span className="inline-flex items-center gap-1">
                  📅 <span>{habit.frequencyLabel}</span>
                </span>
              )}
              {habit.squadName && (
                <span className="inline-flex items-center gap-1">
                  👥 <span>Squad: {habit.squadName}</span>
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={onCheckIn}
          className="shrink-0 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-500/40 transition hover:bg-emerald-600 hover:shadow-md hover:shadow-emerald-500/50"
        >
          Check in
        </button>
      </div>
    </div>
  );
}

function SquadActivityItem({ activity }: { activity: SquadActivity }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex flex-1 items-start gap-2">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold text-white ${activity.avatarBg}`}
        >
          {activity.initials}
        </div>
        <div>
          <p className="text-slate-800">
            <span className="font-semibold">{activity.name}</span>{" "}
            {activity.action}{" "}
            <span className="font-medium">{activity.habitName}</span>{" "}
            {activity.icon}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            {activity.minutesAgoLabel}
            {activity.streakLabel ? ` · ${activity.streakLabel}` : null}
          </p>
          <div className="mt-1 flex gap-1">
            <button className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] hover:bg-slate-200">
              👍
            </button>
            <button className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] hover:bg-slate-200">
              🔥
            </button>
            <button className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] hover:bg-slate-200">
              🙌
            </button>
          </div>
        </div>
      </div>
      {activity.photoUrl && (
        <img
          src={activity.photoUrl}
          alt={activity.habitName}
          className="h-10 w-10 rounded-lg object-cover"
        />
      )}
    </div>
  );
}
