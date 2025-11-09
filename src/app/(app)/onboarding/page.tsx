"use client";

import { useEffect, useState } from "react";
import { Step1PickHabit } from "@/components/onboarding/Step1PickHabit";
import { Step2SetReminder } from "@/components/onboarding/Step2SetReminder";
import { Step3InviteFriend } from "@/components/onboarding/Step3InviteFriend";
import { createHabit } from "@/server/actions/habits";
import { track, events } from "@/lib/analytics";
import confetti from "canvas-confetti";

type HabitDraft = {
  title: string;
  emoji: string;
};

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [habit, setHabit] = useState<HabitDraft | null>(null);

  useEffect(() => {
    track(events.onboardingStarted);
  }, []);

  const handleHabitSelection = (selected: HabitDraft) => {
    setHabit(selected);
    setStep(2);
  };

  const handleReminder = async () => {
    if (!habit) return;

    await createHabit({
      title: habit.title,
      emoji: habit.emoji,
      frequency: "daily",
      target_days_per_week: 7,
      is_public: true,
    });

    track(events.firstHabitCreated, { habit_type: habit.title });
    setStep(3);
  };

  const completeOnboarding = () => {
    track(events.onboardingCompleted);
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    window.location.assign("/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        {step === 1 ? (
          <Step1PickHabit onNext={handleHabitSelection} />
        ) : step === 2 ? (
          <Step2SetReminder habit={habit} onNext={handleReminder} />
        ) : (
          <Step3InviteFriend
            onSkip={completeOnboarding}
            onComplete={completeOnboarding}
          />
        )}
      </div>
    </main>
  );
}

