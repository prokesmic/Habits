"use client";

import { motion } from "framer-motion";
import { Users, Trophy, TrendingUp } from "lucide-react";

interface SquadMember {
  id: string;
  name: string;
  avatar: string;
  checkedInToday: boolean;
  currentStreak: number;
}

interface SquadGroupStreakProps {
  squadName: string;
  members: SquadMember[];
  groupStreakDays: number;
  bestGroupStreak: number;
  habitName: string;
  habitEmoji: string;
}

export function SquadGroupStreak({
  squadName,
  members,
  groupStreakDays,
  bestGroupStreak,
  habitName,
  habitEmoji,
}: SquadGroupStreakProps) {
  const checkedInCount = members.filter((m) => m.checkedInToday).length;
  const completionRate = Math.round((checkedInCount / members.length) * 100);
  const isGroupStreakActive = completionRate >= 80; // 80% threshold for group streak

  return (
    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-4 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500">
            <Users className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{squadName}</h3>
            <p className="text-xs text-slate-500">{habitName} {habitEmoji}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-lg font-bold text-indigo-600">
            <span>🔥</span>
            <span>{groupStreakDays}</span>
          </div>
          <p className="text-[10px] text-slate-500">Group streak</p>
        </div>
      </div>

      {/* Group streak progress */}
      <div className="mb-4 rounded-xl bg-white p-3">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-slate-600">Today's completion</span>
          <span
            className={`font-semibold ${
              isGroupStreakActive ? "text-emerald-600" : "text-amber-600"
            }`}
          >
            {checkedInCount}/{members.length} members ({completionRate}%)
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className={`h-full rounded-full ${
              isGroupStreakActive
                ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                : "bg-gradient-to-r from-amber-400 to-amber-500"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          {isGroupStreakActive ? (
            <span className="text-emerald-600">
              ✅ Group streak maintained! Everyone is doing great.
            </span>
          ) : (
            <span className="text-amber-600">
              ⚠️ Need {Math.ceil(members.length * 0.8) - checkedInCount} more
              check-ins to maintain group streak
            </span>
          )}
        </p>
      </div>

      {/* Members status */}
      <div className="mb-3">
        <p className="mb-2 text-xs font-semibold text-slate-700">
          Squad members
        </p>
        <div className="grid grid-cols-2 gap-2">
          {members.map((member) => (
            <div
              key={member.id}
              className={`flex items-center gap-2 rounded-lg p-2 ${
                member.checkedInToday ? "bg-emerald-50" : "bg-white"
              }`}
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="h-7 w-7 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-medium text-slate-900">
                  {member.name}
                </p>
                <p className="text-[10px] text-slate-500">
                  {member.checkedInToday ? (
                    <span className="text-emerald-600">✓ Done</span>
                  ) : (
                    <span className="text-amber-600">Pending</span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold text-amber-600">
                  🔥 {member.currentStreak}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-white p-2 text-center">
          <div className="flex items-center justify-center gap-1 text-sm font-bold text-indigo-600">
            <Trophy className="h-4 w-4" />
            <span>{bestGroupStreak}</span>
          </div>
          <p className="text-[10px] text-slate-500">Best group streak</p>
        </div>
        <div className="rounded-lg bg-white p-2 text-center">
          <div className="flex items-center justify-center gap-1 text-sm font-bold text-emerald-600">
            <TrendingUp className="h-4 w-4" />
            <span>{Math.round((groupStreakDays / bestGroupStreak) * 100)}%</span>
          </div>
          <p className="text-[10px] text-slate-500">Of best streak</p>
        </div>
      </div>

      {/* Motivation message */}
      {groupStreakDays > 0 && groupStreakDays % 7 === 0 && (
        <div className="mt-3 rounded-lg bg-gradient-to-r from-amber-100 to-indigo-100 p-2 text-center">
          <p className="text-xs font-semibold text-slate-800">
            🎉 {groupStreakDays} days as a team! Keep going!
          </p>
        </div>
      )}
    </div>
  );
}
