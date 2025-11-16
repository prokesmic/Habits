"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Challenge } from "@/data/mockChallenges";
import { Clock, Users, DollarSign, Eye, Trophy, Flame } from "lucide-react";

type TimeRemaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calculateTimeRemaining(targetDate: Date): TimeRemaining {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

function formatTimeRemaining(remaining: TimeRemaining, startsSoon: boolean): string {
  if (remaining.days > 0) {
    return `${remaining.days}d ${remaining.hours}h`;
  } else if (remaining.hours > 0) {
    return `${remaining.hours}h ${remaining.minutes}m`;
  } else if (remaining.minutes > 0) {
    return `${remaining.minutes}m ${remaining.seconds}s`;
  }
  return startsSoon ? "Starting now!" : "Ended";
}

type ActiveChallengeCardProps = {
  challenge: Challenge;
};

export function ActiveChallengeCard({ challenge }: ActiveChallengeCardProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(challenge.startsAt)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(challenge.startsAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [challenge.startsAt]);

  const startsSoon = timeRemaining.days === 0 && timeRemaining.hours < 24;
  const spotsRemaining = challenge.maxParticipants - challenge.currentParticipants;
  const isFillingUp = spotsRemaining <= challenge.maxParticipants * 0.2;
  const fillPercentage = (challenge.currentParticipants / challenge.maxParticipants) * 100;

  const typeColors = {
    "1v1": "from-orange-400 to-red-500",
    squad: "from-blue-400 to-indigo-500",
    public: "from-purple-400 to-pink-500",
  };

  const typeLabels = {
    "1v1": "1v1 Duel",
    squad: "Squad Sprint",
    public: "Public Showdown",
  };

  return (
    <article className="group overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-lg">
      {/* Header with type indicator */}
      <div className={`bg-gradient-to-r ${typeColors[challenge.type]} px-5 py-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {startsSoon && (
              <div className="flex items-center gap-1.5 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                <Flame className="h-3 w-3" />
                ENDING SOON
              </div>
            )}
            <span className="text-lg font-semibold text-white">
              {challenge.emoji} {challenge.title}
            </span>
          </div>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {typeLabels[challenge.type]}
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* Countdown Timer */}
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
          <Clock className="h-5 w-5 text-orange-600" />
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
              {startsSoon ? "Starts in" : "Starts in"}
            </p>
            <p className="font-mono text-lg font-bold text-orange-900">
              {formatTimeRemaining(timeRemaining, startsSoon)}
            </p>
          </div>
        </div>

        {/* Participants Progress */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-500" />
              <span className="font-semibold text-slate-900">
                {challenge.currentParticipants}/{challenge.maxParticipants} spots filled
              </span>
            </div>
            {isFillingUp && (
              <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                Almost full!
              </span>
            )}
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full transition-all ${
                isFillingUp ? "bg-red-500" : "bg-blue-500"
              }`}
              style={{ width: `${Math.min(fillPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Stakes and Pool */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs font-semibold text-green-700">Entry stake</p>
                <p className="text-lg font-bold text-green-900">${challenge.stake}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-purple-200 bg-purple-50 px-3 py-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-xs font-semibold text-purple-700">Prize pool</p>
                <p className="text-lg font-bold text-purple-900">
                  ${(challenge.totalPool / 1000).toFixed(1)}K
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payout Structure */}
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="text-xs font-semibold text-slate-700">Payout:</p>
          <p className="text-sm text-slate-900">{challenge.payoutStructure}</p>
        </div>

        {/* Habit and Duration */}
        <div className="mb-4 flex items-center gap-4 text-xs text-slate-600">
          <span className="font-semibold text-slate-700">Habit: {challenge.habit}</span>
          <span>•</span>
          <span>{challenge.duration} days</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/challenges/${challenge.id}/join`}
            className="flex-1 rounded-full bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            {...(spotsRemaining === 0 ? { "aria-disabled": true, onClick: (e) => e.preventDefault() } : {})}
          >
            {spotsRemaining === 0 ? "Full" : "Join now"}
          </Link>
          <Link
            href={`/challenges/${challenge.id}`}
            className="flex items-center justify-center rounded-full border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

