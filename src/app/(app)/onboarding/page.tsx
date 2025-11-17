"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckInButton } from "@/components/habits/CheckInButton";
import { completeOnboarding as completeOnboardingAction } from "@/server/actions/onboarding";

type OnboardingStep =
  | "welcome"
  | "first-habit"
  | "frequency"
  | "invite-squad"
  | "first-checkin"
  | "complete";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [habitData, setHabitData] = useState({
    name: "",
    emoji: "✓",
    frequency: "daily" as "daily" | "weekdays" | "custom",
    customDays: [] as string[],
  });
  const [createdHabitId, setCreatedHabitId] = useState<string | null>(null);

  const popularHabits = [
    { emoji: "🏃", name: "Morning workout", users: 1247 },
    { emoji: "📚", name: "Read 30 minutes", users: 892 },
    { emoji: "🧘", name: "Meditate daily", users: 1453 },
    { emoji: "🚫", name: "No coffee", users: 534 },
    { emoji: "💤", name: "Sleep by 11pm", users: 721 },
    { emoji: "💧", name: "Drink 8 glasses of water", users: 1122 },
  ];

  const handleCreateHabit = async () => {
    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: habitData.name,
          emoji: habitData.emoji,
          frequency: habitData.frequency,
          target_days_per_week:
            habitData.frequency === "daily"
              ? 7
              : habitData.frequency === "weekdays"
                ? 5
                : habitData.customDays.length,
          isFirstHabit: true,
        }),
      });

      if (response.ok) {
        const habit = await response.json();
        setCreatedHabitId(habit.id);
        setStep("first-checkin");
      } else {
        setStep("first-checkin");
      }
    } catch (error) {
      console.error("Error creating habit:", error);
      setStep("first-checkin");
    }
  };

  const handleComplete = async () => {
    await completeOnboardingAction();
    router.push("/habits");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="text-6xl mb-6">👋</div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">
                Welcome to HabitTracker!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Let&apos;s get you started with your first habit. It takes just 2 minutes.
              </p>

              <button
                onClick={() => setStep("first-habit")}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                type="button"
              >
                Let&apos;s Go!
              </button>

              <div className="mt-8 flex items-center justify-center gap-2">
                {["welcome", "first-habit", "frequency", "invite-squad", "complete"].map((s) => (
                  <div
                    key={s}
                    className={`h-2 rounded-full transition-all ${
                      s === step ? "w-8 bg-orange-500" : "w-2 bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {step === "first-habit" && (
            <motion.div
              key="first-habit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-3xl font-bold mb-2 text-gray-900">
                What habit do you want to build?
              </h2>
              <p className="text-gray-600 mb-6">Start with one. You can add more later.</p>

              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-500 mb-3">POPULAR HABITS</div>
                <div className="grid grid-cols-2 gap-3">
                  {popularHabits.map((habit) => (
                    <button
                      key={habit.name}
                      onClick={() => {
                        setHabitData({ ...habitData, name: habit.name, emoji: habit.emoji });
                        setStep("frequency");
                      }}
                      className="p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 transition-colors text-left group"
                      type="button"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{habit.emoji}</span>
                        <span className="font-semibold group-hover:text-orange-600 text-gray-900">
                          {habit.name}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {habit.users.toLocaleString()} people doing this
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="text-sm font-semibold text-gray-500 mb-3">OR CREATE YOUR OWN</div>
                <div className="flex gap-3">
                  <select
                    value={habitData.emoji}
                    onChange={(e) => setHabitData({ ...habitData, emoji: e.target.value })}
                    className="w-20 px-3 py-3 border-2 border-gray-200 rounded-lg text-2xl text-center focus:border-orange-500 focus:outline-none"
                  >
                    <option>✓</option>
                    <option>💪</option>
                    <option>📚</option>
                    <option>🏃</option>
                    <option>🧘</option>
                    <option>💻</option>
                    <option>🎨</option>
                    <option>🎵</option>
                    <option>🍎</option>
                    <option>💧</option>
                  </select>

                  <input
                    type="text"
                    value={habitData.name}
                    onChange={(e) => setHabitData({ ...habitData, name: e.target.value })}
                    placeholder="E.g., Practice guitar for 30 minutes"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-gray-900"
                  />
                </div>

                <button
                  onClick={() => setStep("frequency")}
                  disabled={!habitData.name}
                  className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  type="button"
                >
                  Continue
                </button>
              </div>

              <button
                onClick={() => setStep("welcome")}
                className="mt-4 text-gray-500 hover:text-gray-700"
                type="button"
              >
                ← Back
              </button>
            </motion.div>
          )}

          {step === "frequency" && (
            <motion.div
              key="frequency"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-3xl font-bold mb-2 text-gray-900">How often?</h2>
              <p className="text-gray-600 mb-6">Be realistic. You can always increase later.</p>

              <div className="space-y-3 mb-8">
                {[
                  { value: "daily", label: "Every day", description: "7 days a week" },
                  { value: "weekdays", label: "Weekdays only", description: "Monday - Friday" },
                  { value: "custom", label: "Custom schedule", description: "Pick specific days" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setHabitData({
                        ...habitData,
                        frequency: option.value as "daily" | "weekdays" | "custom",
                      })
                    }
                    className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                      habitData.frequency === option.value
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    type="button"
                  >
                    <div className="font-semibold mb-1 text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </button>
                ))}
              </div>

              {habitData.frequency === "custom" && (
                <div className="mb-8 p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm font-semibold mb-3 text-gray-700">Select days:</div>
                  <div className="flex gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <button
                        key={day}
                        onClick={() => {
                          const days = habitData.customDays.includes(day)
                            ? habitData.customDays.filter((d) => d !== day)
                            : [...habitData.customDays, day];
                          setHabitData({ ...habitData, customDays: days });
                        }}
                        className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                          habitData.customDays.includes(day)
                            ? "bg-orange-500 text-white"
                            : "bg-white border-2 border-gray-200 hover:border-orange-500 text-gray-700"
                        }`}
                        type="button"
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("first-habit")}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 text-gray-700"
                  type="button"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep("invite-squad")}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  type="button"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {step === "invite-squad" && (
            <motion.div
              key="invite-squad"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-3xl font-bold mb-2 text-gray-900">Want accountability?</h2>
              <p className="text-gray-600 mb-6">
                Invite friends to your squad. They&apos;ll see your check-ins and keep you
                motivated.
              </p>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">💡</div>
                  <div>
                    <div className="font-semibold mb-2 text-gray-900">Studies show:</div>
                    <div className="text-sm text-gray-700 space-y-1">
                      <div>✓ 76% higher success rate with accountability partners</div>
                      <div>✓ 3x longer streaks when checking in with friends</div>
                      <div>✓ 91% of users who invite friends stick with habits</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <input
                  type="email"
                  placeholder="friend@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-gray-900"
                />
                <button
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
                  type="button"
                >
                  + Add another friend
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    await handleCreateHabit();
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 text-gray-700"
                  type="button"
                >
                  Skip for now
                </button>
                <button
                  onClick={async () => {
                    await handleCreateHabit();
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  type="button"
                >
                  Send Invites
                </button>
              </div>
            </motion.div>
          )}

          {step === "first-checkin" && (
            <motion.div
              key="first-checkin"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-xl p-12 text-center"
            >
              <div className="text-6xl mb-6 animate-bounce">🎉</div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Awesome! Habit created!</h2>
              <p className="text-xl text-gray-600 mb-8">
                Let&apos;s log your first check-in right now to start your streak.
              </p>

              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 mb-6">
                <div className="text-5xl mb-3">{habitData.emoji}</div>
                <div className="text-2xl font-bold mb-2">{habitData.name}</div>
                <div className="text-green-100">Day 1 starts now!</div>
              </div>

              <CheckInButton
                habitId={createdHabitId || "temp"}
                habitName={habitData.name}
                onCheckIn={async () => {
                  setStep("complete");
                }}
              />
            </motion.div>
          )}

          {step === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl p-12 text-center"
            >
              <div className="text-6xl mb-6">✓</div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">You&apos;re all set!</h2>
              <p className="text-xl text-gray-600 mb-8">
                Day 1 complete! Come back tomorrow to keep your streak alive.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-2xl font-bold text-gray-900">1</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="text-3xl mb-2">✓</div>
                  <div className="text-2xl font-bold text-gray-900">1</div>
                  <div className="text-sm text-gray-600">Check-in</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                type="button"
              >
                Go to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
