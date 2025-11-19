"use client";

import Link from "next/link";
import {
  Calendar,
  Users,
  Trophy,
  Flame,
  Plus,
  UserPlus,
  RefreshCw,
  Heart
} from "lucide-react";

type EmptyStateProps = {
  className?: string;
};

// No habits today
export function NoHabitsToday({ className = "" }: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-6 ${className}`}>
      <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-4">
        <Calendar className="w-8 h-8 text-orange-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No habits for today
      </h3>
      <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
        Start building better habits by adding your first one. Keep it simple—start with just one habit.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/habits/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Add your first habit
        </Link>
      </div>
    </div>
  );
}

// No squads joined
export function NoSquadsJoined({ className = "" }: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-6 ${className}`}>
      <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-indigo-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No squads yet
      </h3>
      <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
        Join a squad for 4.2x better success rates. Find like-minded people to keep you accountable.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/squads"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Users className="w-4 h-4" />
          Find a squad
        </Link>
        <Link
          href="/squads/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 transition-colors"
        >
          Create your own
        </Link>
      </div>
    </div>
  );
}

// No activity today
export function NoActivityToday({ className = "" }: EmptyStateProps) {
  return (
    <div className={`text-center py-8 px-6 ${className}`}>
      <div className="mx-auto w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
        <Heart className="w-6 h-6 text-gray-400" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">
        No activity yet today
      </h3>
      <p className="text-xs text-gray-500 mb-4 max-w-xs mx-auto">
        Be the first to check in! Your squad is waiting to cheer you on.
      </p>
      <Link
        href="/dashboard"
        className="text-sm font-semibold text-orange-600 hover:text-orange-700"
      >
        Check in now →
      </Link>
    </div>
  );
}

// Missed streak
export function MissedStreak({
  daysLost = 3,
  className = ""
}: EmptyStateProps & { daysLost?: number }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Flame className="w-6 h-6 text-amber-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            Streak paused
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {daysLost === 1
              ? "You missed yesterday. No worries—start fresh today!"
              : `You've been away for ${daysLost} days. Ready to get back on track?`
            }
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Restart today
            </Link>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              Use streak freeze
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// No challenges
export function NoChallenges({ className = "" }: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-6 ${className}`}>
      <div className="mx-auto w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-4">
        <Trophy className="w-8 h-8 text-purple-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No active challenges
      </h3>
      <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
        Challenges add excitement and stakes to your habits. Compete with friends or join public challenges.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/challenges/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
        >
          <Trophy className="w-4 h-4" />
          Start a challenge
        </Link>
        <Link
          href="/challenges"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 transition-colors"
        >
          Browse challenges
        </Link>
      </div>
    </div>
  );
}

// All habits completed
export function AllHabitsCompleted({ className = "" }: EmptyStateProps) {
  return (
    <div className={`text-center py-8 px-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 ${className}`}>
      <div className="mx-auto w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-3">
        <span className="text-2xl">🎉</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        All done for today!
      </h3>
      <p className="text-sm text-gray-600 mb-4 max-w-xs mx-auto">
        Amazing work! You've completed all your habits. See you tomorrow.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/squads"
          className="text-sm font-semibold text-green-600 hover:text-green-700"
        >
          Celebrate with your squad →
        </Link>
      </div>
    </div>
  );
}

// First time user welcome
export function WelcomeNewUser({ userName = "there", className = "" }: EmptyStateProps & { userName?: string }) {
  return (
    <div className={`rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 p-6 text-white ${className}`}>
      <h2 className="text-xl font-bold mb-2">
        Welcome, {userName}! 👋
      </h2>
      <p className="text-sm opacity-90 mb-6">
        Let's get you set up for success. Here's how to get started:
      </p>
      <div className="space-y-3">
        <Link
          href="/habits/new"
          className="flex items-center gap-3 p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">Create your first habit</div>
            <div className="text-xs opacity-80">Start with just one</div>
          </div>
        </Link>
        <Link
          href="/squads"
          className="flex items-center gap-3 p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">Join a squad</div>
            <div className="text-xs opacity-80">4.2x better success</div>
          </div>
        </Link>
        <Link
          href="/profile"
          className="flex items-center gap-3 p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <UserPlus className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">Invite a friend</div>
            <div className="text-xs opacity-80">Accountability buddy</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

// Generic empty state with customization
type GenericEmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  className?: string;
};

export function GenericEmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className = "",
}: GenericEmptyStateProps) {
  return (
    <div className={`text-center py-12 px-6 ${className}`}>
      <div className="mx-auto w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {primaryAction && (
            <Link
              href={primaryAction.href}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              {primaryAction.icon}
              {primaryAction.label}
            </Link>
          )}
          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 transition-colors"
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
