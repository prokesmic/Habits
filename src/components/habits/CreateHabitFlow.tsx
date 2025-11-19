"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createHabit } from "@/server/actions/habits";
import { track, events } from "@/lib/analytics";
import { useRouter } from "next/navigation";
import {
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  Users,
  Zap
} from "lucide-react";

const habitSchema = z.object({
  title: z.string().min(1, "Habit name is required").max(100),
  emoji: z.string(),
  description: z.string().max(500).optional(),
  frequency: z.enum(["daily", "weekdays", "custom"]),
  target_days_per_week: z.number().min(1).max(7),
  is_public: z.boolean(),
  squad_id: z.string().uuid().optional(),
});

type HabitFormValues = z.infer<typeof habitSchema>;

type Squad = {
  id: string;
  name: string;
  emoji?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  userSquads?: Squad[];
};

const emojiOptions = ["✅", "🏃", "📚", "💪", "🧘", "💧", "🥗", "😴", "🎯", "💡", "🎨", "🎵"];

const frequencyOptions = [
  {
    value: "daily" as const,
    label: "Every day",
    description: "Build a daily habit",
    days: 7,
  },
  {
    value: "weekdays" as const,
    label: "Weekdays",
    description: "Mon - Fri",
    days: 5,
  },
  {
    value: "custom" as const,
    label: "Custom",
    description: "Set your own schedule",
    days: null,
  },
];

export function CreateHabitFlow({ isOpen, onClose, userSquads = [] }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      title: "",
      emoji: "✅",
      description: "",
      frequency: "daily",
      target_days_per_week: 7,
      is_public: true,
    },
  });

  const watchFrequency = form.watch("frequency");
  const watchTitle = form.watch("title");

  const handleNext = async () => {
    if (step === 1) {
      const isValid = await form.trigger(["title", "emoji"]);
      if (isValid) setStep(2);
    } else if (step === 2) {
      const isValid = await form.trigger(["frequency", "target_days_per_week"]);
      if (isValid) setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      await createHabit(values);
      track(events.habitCreated);
      onClose();
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Failed to create habit:", error);
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleFrequencySelect = (freq: "daily" | "weekdays" | "custom", days: number | null) => {
    form.setValue("frequency", freq);
    if (days) {
      form.setValue("target_days_per_week", days);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Create Habit</h2>
              <p className="text-sm text-gray-500">Step {step} of 3</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Basics */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Name your habit</h3>
                  <p className="text-sm text-gray-500">What do you want to build?</p>
                </div>
              </div>

              {/* Habit Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Habit name
                </label>
                <input
                  {...form.register("title")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                  placeholder="e.g., Morning meditation, Read 30 minutes"
                  autoFocus
                />
                {form.formState.errors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              {/* Emoji Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose an icon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => form.setValue("emoji", emoji)}
                      className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                        form.watch("emoji") === emoji
                          ? "bg-orange-100 ring-2 ring-orange-500"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  {...form.register("description")}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all resize-none"
                  placeholder="Add context for yourself or your squad"
                />
              </div>
            </div>
          )}

          {/* Step 2: Schedule */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Set your schedule</h3>
                  <p className="text-sm text-gray-500">How often will you do this?</p>
                </div>
              </div>

              {/* Frequency Options */}
              <div className="space-y-3">
                {frequencyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleFrequencySelect(option.value, option.days)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      watchFrequency === option.value
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.description}</div>
                  </button>
                ))}
              </div>

              {/* Custom days slider */}
              {watchFrequency === "custom" && (
                <div className="pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Target days per week: <span className="text-orange-600 font-bold">{form.watch("target_days_per_week")}</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={7}
                    {...form.register("target_days_per_week", { valueAsNumber: true })}
                    className="w-full accent-orange-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1 day</span>
                    <span>7 days</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Accountability */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Add accountability</h3>
                  <p className="text-sm text-gray-500">Connect with a squad for 4.2x better success</p>
                </div>
              </div>

              {/* Squad Selection */}
              <div className="space-y-3">
                {/* No squad option */}
                <button
                  type="button"
                  onClick={() => form.setValue("squad_id", undefined)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    !form.watch("squad_id")
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold text-gray-900">Just me for now</div>
                  <div className="text-sm text-gray-500">Start solo, add a squad later</div>
                </button>

                {/* User's squads */}
                {userSquads.map((squad) => (
                  <button
                    key={squad.id}
                    type="button"
                    onClick={() => form.setValue("squad_id", squad.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      form.watch("squad_id") === squad.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{squad.emoji || "👥"}</span>
                      <span className="font-semibold text-gray-900">{squad.name}</span>
                    </div>
                  </button>
                ))}

                {/* Find a squad CTA */}
                {userSquads.length === 0 && (
                  <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                    <p className="text-sm text-indigo-800 mb-3">
                      Join a squad for better accountability and support!
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        router.push("/squads");
                      }}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      Find a squad →
                    </button>
                  </div>
                )}
              </div>

              {/* Public toggle */}
              <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div>
                  <div className="font-medium text-gray-900">Make public</div>
                  <div className="text-sm text-gray-500">Others can discover this habit</div>
                </div>
                <input
                  type="checkbox"
                  {...form.register("is_public")}
                  className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={step === 1 && !watchTitle}
              className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                "Creating..."
              ) : (
                <>
                  Create Habit
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
