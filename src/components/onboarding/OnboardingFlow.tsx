"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { completeOnboarding as completeOnboardingAction } from "@/server/actions/onboarding";

type HabitTemplate = {
  name: string;
  emoji: string;
  category: string;
};

const popularTemplates: HabitTemplate[] = [
  { name: "Morning Workout", emoji: "💪", category: "health" },
  { name: "Drink 8 Glasses Water", emoji: "💧", category: "health" },
  { name: "Meditation", emoji: "🧘", category: "mindfulness" },
  { name: "Read 30 Minutes", emoji: "📚", category: "learning" },
  { name: "10K Steps", emoji: "🚶", category: "fitness" },
  { name: "Journal Writing", emoji: "📝", category: "mindfulness" },
  { name: "No Social Media", emoji: "📵", category: "productivity" },
  { name: "Learn New Skill", emoji: "🎯", category: "growth" },
];

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedHabit, setSelectedHabit] = useState<HabitTemplate | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const totalSteps = 3;
  const router = useRouter();

  const handleSkipOnboarding = async () => {
    setIsCompleting(true);
    try {
      await completeOnboardingAction();
      router.push("/dashboard");
      router.refresh();
    } catch {
      router.push("/dashboard");
    }
  };

  const handleFirstCheckIn = async () => {
    if (!selectedHabit) return;

    setHasCheckedIn(true);

    // Celebrate immediately!
    confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });

    // Move to success step after brief celebration
    setTimeout(() => {
      setCurrentStep(3);
    }, 1500);
  };

  const completeOnboarding = async () => {
    setIsCompleting(true);
    try {
      await completeOnboardingAction();

      // Final celebration
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1200);
    } catch {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-[70vh]">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm text-slate-600">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-900/5"
        >
          {/* STEP 1: Quick Habit Selection (One-Tap) */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-500">
                  <span className="text-3xl">✨</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Pick your first habit</h2>
                <p className="mt-2 text-slate-600">
                  One tap to start. You can add more later.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {popularTemplates.map((habit) => (
                  <button
                    key={habit.name}
                    onClick={() => {
                      setSelectedHabit(habit);
                      setCurrentStep(2);
                    }}
                    className="flex items-center gap-3 rounded-2xl border-2 border-slate-200 p-4 text-left transition-all hover:border-amber-400 hover:bg-amber-50/50 active:scale-95"
                  >
                    <span className="text-2xl">{habit.emoji}</span>
                    <span className="text-sm font-semibold text-slate-900">{habit.name}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleSkipOnboarding}
                disabled={isCompleting}
                className="block w-full text-sm text-slate-500 hover:text-slate-700"
              >
                {isCompleting ? "Loading..." : "Skip setup for now"}
              </button>
            </div>
          )}

          {/* STEP 2: First Check-In (Immediate Success) */}
          {currentStep === 2 && selectedHabit && (
            <div className="space-y-6 text-center">
              {!hasCheckedIn ? (
                <>
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-500 to-indigo-500 text-4xl">
                    {selectedHabit.emoji}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedHabit.name}</h2>
                    <p className="mt-2 text-slate-600">
                      Let's do your first check-in right now!
                    </p>
                  </div>

                  <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">💡</span>
                      <span>
                        Users who check in on Day 1 are <strong>3x more likely</strong> to build the habit!
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleFirstCheckIn}
                    className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 active:scale-95"
                  >
                    Complete First Check-In ✓
                  </button>

                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-sm text-slate-500 hover:text-slate-700"
                  >
                    ← Choose different habit
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
                    <span className="text-5xl">🎉</span>
                  </div>
                  <h2 className="text-2xl font-bold text-emerald-900">Amazing!</h2>
                  <p className="text-lg text-emerald-700">You just started your streak!</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Success + Optional Enhancements */}
          {currentStep === 3 && selectedHabit && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-amber-100 to-indigo-100">
                  <span className="text-4xl">🔥</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">1-Day Streak Started!</h2>
                <p className="mt-2 text-slate-600">
                  You're on your way to building <strong>{selectedHabit.name}</strong>
                </p>
              </div>

              <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Current Streak</span>
                  <span className="font-bold text-amber-600">🔥 1 day</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Next Milestone</span>
                  <span className="font-medium text-slate-900">7-day streak</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Habit Strength</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-slate-200">
                      <div className="h-2 w-1 rounded-full bg-amber-500" />
                    </div>
                    <span className="text-xs text-slate-500">1/66 days</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={completeOnboarding}
                  disabled={isCompleting}
                  className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-500 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-500/40 active:scale-95 disabled:opacity-50"
                >
                  {isCompleting ? "Setting up..." : "Go to Dashboard →"}
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      // Will prompt for stakes after they see dashboard
                      completeOnboarding();
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-3 text-sm text-slate-600 transition-colors hover:border-amber-400 hover:bg-amber-50"
                  >
                    <span>💰</span>
                    <span>Add Stakes Later</span>
                  </button>
                  <button
                    onClick={() => {
                      // Will prompt for squad after they see dashboard
                      completeOnboarding();
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-3 text-sm text-slate-600 transition-colors hover:border-indigo-400 hover:bg-indigo-50"
                  >
                    <span>👥</span>
                    <span>Join Squad Later</span>
                  </button>
                </div>
              </div>

              <p className="text-center text-xs text-slate-500">
                You can enable notifications and add stakes from the dashboard
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {currentStep > 1 && currentStep < 3 && !hasCheckedIn && (
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          className="mt-4 text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back
        </button>
      )}
    </div>
  );
}
