"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { completeOnboarding as completeOnboardingAction } from "@/server/actions/onboarding";

type PrimaryGoal = "health" | "discipline" | "money" | "community";

type FirstHabit = {
  name: string;
  emoji: string;
  frequency: "daily" | "weekly" | "custom";
};

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [primaryGoal, setPrimaryGoal] = useState<PrimaryGoal | undefined>();
  const [firstHabit, setFirstHabit] = useState<FirstHabit | undefined>();
  const [stake, setStake] = useState<{ added: boolean; amount?: number }>({ added: false });
  const [squad, setSquad] = useState<{ joined: boolean; squadId?: string }>({ joined: false });
  const [notifications, setNotifications] = useState<{ enabled: boolean; time?: string }>({
    enabled: false,
  });
  const [isCompleting, setIsCompleting] = useState(false);
  const totalSteps = 6;
  const router = useRouter();

  const nextStep = () => setCurrentStep((s) => Math.min(totalSteps, s + 1));
  const prevStep = () => setCurrentStep((s) => Math.max(1, s - 1));
  const skipStep = () => nextStep();

  const handleSkipOnboarding = async () => {
    setIsCompleting(true);
    try {
      await completeOnboardingAction();
      router.push("/dashboard");
      router.refresh();
    } catch {
      // Still redirect
      router.push("/dashboard");
    }
  };

  const completeOnboarding = async () => {
    setIsCompleting(true);
    try {
      if (notifications.enabled) {
        try {
          await Notification.requestPermission();
        } catch {
          // ignore
        }
      }

      // Mark onboarding as complete in database
      await completeOnboardingAction();

      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1200);
    } catch {
      // proceed regardless
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-[70vh]">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm text-gray-600">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <motion.div
            className="h-full bg-violet-600"
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
          className="rounded-2xl bg-white p-8 shadow-xl"
        >
          {currentStep === 1 && (
            <div className="space-y-6 text-center">
              <div className="text-5xl">✨</div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome to Habit Tracker</h2>
              <p className="text-gray-700">Build habits that stick with real accountability</p>
              <div className="space-y-3">
                <button
                  onClick={nextStep}
                  className="w-full rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white"
                >
                  Get Started
                </button>
                <button
                  onClick={handleSkipOnboarding}
                  disabled={isCompleting}
                  className="block w-full text-sm text-gray-800 underline disabled:opacity-50"
                >
                  {isCompleting ? "Loading..." : "Skip setup for now"}
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <GoalSelectionStep
              onSelect={(g) => {
                setPrimaryGoal(g);
                nextStep();
              }}
            />
          )}

          {currentStep === 3 && (
            <FirstHabitStep
              goal={primaryGoal}
              onComplete={(habit) => {
                setFirstHabit(habit as FirstHabit);
                nextStep();
              }}
            />
          )}

          {currentStep === 4 && (
            <StakeStep
              habitName={firstHabit?.name ?? "your habit"}
              onComplete={(added, amount) => {
                setStake({ added, amount });
                nextStep();
              }}
              onSkip={skipStep}
            />
          )}

          {currentStep === 5 && (
            <SquadStep
              onComplete={(squadId) => {
                setSquad({ joined: true, squadId });
                nextStep();
              }}
              onSkip={skipStep}
            />
          )}

          {currentStep === 6 && (
            <NotificationStep
              onComplete={(enabled, time) => {
                setNotifications({ enabled, time });
                void completeOnboarding();
              }}
              onSkip={() => {
                setNotifications({ enabled: false });
                void completeOnboarding();
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {currentStep > 1 && (
        <button onClick={prevStep} className="mt-4 text-sm text-gray-600 hover:text-gray-900">
          ← Back
        </button>
      )}
    </div>
  );
}

function GoalSelectionStep({ onSelect }: { onSelect: (g: PrimaryGoal) => void }) {
  const goals: { id: PrimaryGoal; emoji: string; title: string; description: string; color: string }[] =
    [
      { id: "health", emoji: "💪", title: "Get Healthier", description: "Exercise, nutrition, sleep", color: "from-green-400 to-green-600" },
      { id: "discipline", emoji: "🧠", title: "Build Discipline", description: "Meditation, reading, learning", color: "from-blue-400 to-blue-600" },
      { id: "money", emoji: "💰", title: "Make Money", description: "Win challenges, stay accountable", color: "from-yellow-400 to-yellow-600" },
      { id: "community", emoji: "👥", title: "Find Community", description: "Join squads, compete with friends", color: "from-purple-400 to-purple-600" },
    ];
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">What brings you here?</h2>
        <p className="text-gray-700">Choose your primary goal</p>
      </div>
      <div className="space-y-3">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => onSelect(goal.id)}
            className="group w-full rounded-xl border-2 border-gray-200 p-4 text-left transition-all hover:border-violet-500 hover:bg-violet-50"
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${goal.color} text-2xl`}>{goal.emoji}</div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900">{goal.title}</div>
                <div className="text-sm text-gray-700">{goal.description}</div>
              </div>
              <div className="text-gray-400 group-hover:text-violet-600">→</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function FirstHabitStep({
  goal,
  onComplete,
}: {
  goal?: PrimaryGoal;
  onComplete: (habit: { name: string; emoji: string; frequency: string }) => void;
}) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const suggestions = {
    health: ["Morning Workout", "Healthy Meal", "10k Steps", "Drink Water"],
    discipline: ["Morning Meditation", "Read 30min", "Journal", "Learn Something"],
    money: ["Daily Investment", "Side Hustle Work", "Save $10", "Budget Review"],
    community: ["Message Friend", "Help Someone", "Squad Check-in", "Share Progress"],
  } as const;
  const habitSuggestions = goal ? suggestions[goal] : [];
  const emojis = ["🧘", "💪", "📚", "🏃", "🎯", "⚡", "🥗", "💤", "💻", "🎨", "🎵", "🚴"];
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Create your first habit</h2>
        <p className="text-gray-700">This is what you'll track daily</p>
      </div>
      {habitSuggestions.length > 0 && (
        <div>
          <div className="mb-2 text-sm font-medium text-gray-900">Quick picks:</div>
          <div className="flex flex-wrap gap-2">
            {habitSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => setName(s)}
                className="rounded-full bg-violet-100 px-3 py-1 text-sm text-violet-700 hover:bg-violet-200"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-900">Habit name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Morning Meditation"
          className="w-full rounded-lg border px-4 py-3 text-lg text-gray-900"
          autoFocus
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-900">Choose an icon</label>
        <div className="grid grid-cols-6 gap-2">
          {emojis.map((e) => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              className={`rounded-lg border-2 p-3 text-2xl ${emoji === e ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-900">How often?</label>
        <div className="space-y-2">
          {(["daily", "weekly"] as const).map((freq) => (
            <button
              key={freq}
              onClick={() => setFrequency(freq)}
              className={`w-full rounded-lg border-2 p-3 text-left ${frequency === freq ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    frequency === freq ? "border-violet-500 bg-violet-500" : "border-gray-300"
                  }`}
                >
                  {frequency === freq && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
                <span className="capitalize text-gray-900">{freq}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => onComplete({ name, emoji, frequency })}
        disabled={!name}
        className="w-full rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  );
}

function StakeStep({
  habitName,
  onComplete,
  onSkip,
}: {
  habitName: string;
  onComplete: (added: boolean, amount?: number) => void;
  onSkip: () => void;
}) {
  const [amount, setAmount] = useState<number | undefined>(10);
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Put money on it? (Optional)</h2>
        <p className="text-gray-700">You're 4x more likely to succeed when money is on the line.</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[5, 10, 25].map((v) => (
          <button
            key={v}
            onClick={() => setAmount(v)}
            className={`rounded-lg border px-3 py-2 text-sm text-gray-900 ${amount === v ? "border-violet-500 bg-violet-50" : "border-gray-200"}`}
          >
            ${v}
          </button>
        ))}
        <button onClick={() => setAmount(undefined)} className="rounded-lg border px-3 py-2 text-sm text-gray-900">
          Skip
        </button>
      </div>
      <ul className="text-sm text-gray-700">
        <li>• Your card charged upfront</li>
        <li>• Complete 30 days = keep it all</li>
        <li>• Miss your goal = you lose it</li>
      </ul>
      <div className="flex gap-2">
        <button
          onClick={() => onComplete(amount !== undefined, amount)}
          className="flex-1 rounded-lg bg-violet-600 px-4 py-3 font-semibold text-white"
        >
          {amount ? `Add $${amount} stake` : "Continue"}
        </button>
        <button onClick={onSkip} className="flex-1 rounded-lg border-2 border-gray-300 py-3 font-semibold hover:bg-gray-50">
          Skip for now
        </button>
      </div>
    </div>
  );
}

function SquadStep({ onComplete, onSkip }: { onComplete: (squadId: string) => void; onSkip: () => void }) {
  const popular = [
    { id: "runners", name: "Morning Runners", meta: "147 members • Very active" },
    { id: "5am", name: "5AM Meditation Club", meta: "89 members • Active" },
  ];
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Find your accountability crew</h2>
        <p className="text-gray-700">Users in squads are 23% more likely to succeed!</p>
      </div>
      <div className="space-y-3">
        {popular.map((s) => (
          <div key={s.id} className="rounded-xl border p-4">
            <div className="mb-1 font-semibold text-gray-900">{s.name}</div>
            <div className="mb-3 text-sm text-gray-700">{s.meta}</div>
            <button onClick={() => onComplete(s.id)} className="rounded-lg border px-3 py-2 text-sm text-gray-900">
              Join
            </button>
          </div>
        ))}
      </div>
      <button onClick={onSkip} className="w-full rounded-lg border-2 border-gray-300 py-3 font-semibold text-gray-900 hover:bg-gray-50">
        Skip for now
      </button>
    </div>
  );
}

function NotificationStep({
  onComplete,
  onSkip,
}: {
  onComplete: (enabled: boolean, time?: string) => void;
  onSkip: () => void;
}) {
  const [time, setTime] = useState("07:00");
  const handleEnable = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        onComplete(true, time);
        return;
      }
    } catch {
      // ignore
    }
    onComplete(false);
  };
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mb-4 text-4xl">📱</div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Never miss a day</h2>
        <p className="text-gray-700">Daily reminders help you stay on track</p>
      </div>
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        💡 Users with reminders enabled are <strong>2.5x more likely</strong> to maintain streaks
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-900">Reminder time</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-lg border px-4 py-3 text-lg text-gray-900" />
      </div>
      <button onClick={handleEnable} className="w-full rounded-lg bg-violet-600 py-3 font-semibold text-white">
        Enable notifications
      </button>
      <button onClick={onSkip} className="w-full rounded-lg border-2 border-gray-300 py-3 font-semibold text-gray-900 hover:bg-gray-50">
        Skip for now
      </button>
    </div>
  );
}


