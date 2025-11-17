"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckInButton } from "./CheckInButton";

interface CheckInProof {
  type: "simple" | "photo" | "note" | "integration";
  photoUrl?: string;
  note?: string;
}

interface HabitWithLog {
  id: string;
  title: string;
  emoji: string;
  description?: string;
  frequency: string;
  requires_proof: boolean;
  has_stake: boolean;
  stake_amount?: number;
  current_streak: number;
  longest_streak: number;
  squad_member_count?: number;
  last_check_in?: string;
  last_check_in_time?: string;
}

interface Props {
  habits: HabitWithLog[];
  userName: string;
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

export function HabitsDashboard({ habits: initialHabits, userName }: Props) {
  const [habits, setHabits] = useState(initialHabits);
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const todayHabits = habits.filter((h) => h.frequency === "daily" || h.frequency === "weekdays");
  const completed = todayHabits.filter((h) => h.last_check_in === today);

  const handleCheckIn = async (habitId: string, proof?: CheckInProof) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habitId,
          proof,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        // Update local state
        setHabits((prev) =>
          prev.map((h) =>
            h.id === habitId
              ? {
                  ...h,
                  last_check_in: today,
                  last_check_in_time: new Date().toISOString(),
                  current_streak: h.current_streak + 1,
                  longest_streak: Math.max(h.longest_streak, h.current_streak + 1),
                }
              : h,
          ),
        );
      }
    } catch (error) {
      console.error("Check-in failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">
          Good {getTimeOfDay()}, {userName}!
        </h1>
        <p className="text-lg opacity-90">
          {completed.length} of {todayHabits.length} habits completed today
        </p>

        {/* Progress Bar */}
        {todayHabits.length > 0 && (
          <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${(completed.length / todayHabits.length) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Today's Habits */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Today&apos;s Habits</h2>

        {todayHabits.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No habits yet!</h3>
            <p className="text-gray-600 mb-6">Create your first habit to get started</p>
            <Link
              href="/habits/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Create First Habit
            </Link>
          </div>
        ) : (
          <>
            {todayHabits.map((habit) => {
              const isCompleted = habit.last_check_in === today;

              return (
                <div
                  key={habit.id}
                  className={`bg-white border-2 rounded-xl p-6 transition-all ${
                    isCompleted
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{habit.emoji}</div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{habit.title}</h3>
                          {habit.description && (
                            <p className="text-gray-600 text-sm">{habit.description}</p>
                          )}
                        </div>

                        {habit.has_stake && habit.stake_amount && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                            ${habit.stake_amount} stake
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span>🔥</span>
                          <span className="font-semibold">{habit.current_streak}</span>
                          <span className="text-gray-600">day streak</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <span>🏆</span>
                          <span className="font-semibold">{habit.longest_streak}</span>
                          <span className="text-gray-600">best</span>
                        </div>

                        {habit.squad_member_count && habit.squad_member_count > 0 && (
                          <div className="flex items-center gap-1">
                            <span>👥</span>
                            <span className="font-semibold">{habit.squad_member_count}</span>
                            <span className="text-gray-600">squad</span>
                          </div>
                        )}
                      </div>

                      {isCompleted ? (
                        <div className="bg-green-100 border border-green-500 rounded-lg p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                            ✓
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-green-900">Completed!</div>
                            <div className="text-sm text-green-700">
                              Checked in at{" "}
                              {habit.last_check_in_time
                                ? new Date(habit.last_check_in_time).toLocaleTimeString()
                                : "today"}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <CheckInButton
                          habitId={habit.id}
                          habitName={habit.title}
                          onCheckIn={(proof) => handleCheckIn(habit.id, proof)}
                          requiresProof={habit.requires_proof || habit.has_stake}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center">
        <Link
          href="/habits/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-orange-500 transition-all"
        >
          + Add New Habit
        </Link>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="font-medium">Saving check-in...</span>
          </div>
        </div>
      )}
    </div>
  );
}
