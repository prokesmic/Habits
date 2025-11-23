"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, DollarSign, Target, Calendar, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type Habit = {
  id: string;
  title: string;
  emoji: string;
  target_days_per_week: number;
};

const STAKE_AMOUNTS = [5, 10, 25, 50, 100];

export default function NewStakePage() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState<number>(25);
  const [duration, setDuration] = useState<7 | 14 | 30>(7);

  useEffect(() => {
    async function loadHabits() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/sign-in");
        return;
      }

      const { data: habitsData } = await supabase
        .from("habits")
        .select("id, title, emoji, target_days_per_week")
        .eq("user_id", user.id)
        .eq("is_active", true);

      setHabits(habitsData || []);
      setLoading(false);
    }

    loadHabits();
  }, [router]);

  const potentialWin = stakeAmount * 1.5;
  const selectedHabitData = habits.find(h => h.id === selectedHabit);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedHabit) {
      setError("Please select a habit to stake on");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + duration);

      const { error: insertError } = await supabase
        .from("stakes")
        .insert({
          user_id: user.id,
          habit_id: selectedHabit,
          amount_cents: stakeAmount * 100,
          duration_days: duration,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          status: "active",
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      router.push("/stakes");
    } catch (err: any) {
      setError(err.message || "Failed to create stake");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="h-40 bg-slate-200 rounded-3xl" />
          <div className="h-60 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 lg:py-8">
      <div className="space-y-6">
        {/* Back Link */}
        <Link
          href="/stakes"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Stakes
        </Link>

        {/* Hero Header */}
        <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-5 md:p-6 text-white shadow-sm">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <DollarSign className="h-3 w-3" />
              <span>New Stake</span>
            </span>
            <h1 className="text-2xl font-semibold md:text-3xl">Put Money on Your Habit</h1>
            <p className="text-sm opacity-90">
              Stakes add real consequences to help you stay committed
            </p>
          </div>
        </section>

        {habits.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <Target className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">No habits to stake on</h3>
            <p className="mb-6 text-slate-500">
              Create a habit first, then come back to put money on it.
            </p>
            <Link
              href="/habits/new"
              className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
            >
              Create a Habit
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select Habit */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">1. Choose a Habit</h2>
              <div className="grid gap-3">
                {habits.map((habit) => (
                  <button
                    key={habit.id}
                    type="button"
                    onClick={() => setSelectedHabit(habit.id)}
                    className={cn(
                      "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
                      selectedHabit === habit.id
                        ? "border-amber-500 bg-amber-50"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                    data-testid={`stake-habit-${habit.id}`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                      {habit.emoji || "📌"}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{habit.title}</h3>
                      <p className="text-sm text-slate-500">{habit.target_days_per_week} days/week target</p>
                    </div>
                    {selectedHabit === habit.id && (
                      <CheckCircle2 className="h-6 w-6 text-amber-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Stake Amount */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">2. Set Your Stake</h2>
              <div className="flex flex-wrap gap-3">
                {STAKE_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setStakeAmount(amount)}
                    className={cn(
                      "rounded-xl border-2 px-5 py-3 text-lg font-bold transition-all",
                      stakeAmount === amount
                        ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                    )}
                    data-testid={`stake-amount-${amount}`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-rose-50 p-4">
                  <p className="text-xs text-slate-600 mb-1">You're risking</p>
                  <p className="text-2xl font-bold text-rose-600">${stakeAmount}</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-xs text-slate-600 mb-1">Potential win</p>
                  <p className="text-2xl font-bold text-emerald-600">${potentialWin}</p>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">3. Choose Duration</h2>
              <div className="flex gap-3">
                {([7, 14, 30] as const).map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDuration(days)}
                    className={cn(
                      "flex-1 rounded-xl border-2 px-4 py-3 transition-all",
                      duration === days
                        ? "border-amber-500 bg-amber-50"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                    data-testid={`stake-duration-${days}`}
                  >
                    <div className="text-xl font-bold text-slate-900">{days}</div>
                    <div className="text-xs text-slate-500">days</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            {selectedHabit && (
              <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5">
                <h3 className="font-semibold text-slate-900 mb-3">Stake Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Habit:</span>
                    <span className="font-medium">{selectedHabitData?.emoji} {selectedHabitData?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Stake amount:</span>
                    <span className="font-medium text-rose-600">${stakeAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Duration:</span>
                    <span className="font-medium">{duration} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Win requirement:</span>
                    <span className="font-medium">80%+ completion</span>
                  </div>
                  <div className="flex justify-between border-t border-amber-200 pt-2 mt-2">
                    <span className="font-semibold text-slate-900">Potential win:</span>
                    <span className="font-bold text-emerald-600">${potentialWin}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Warning */}
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Important</p>
                <p className="mt-1">Once you create a stake, you cannot cancel it. Make sure you're committed to completing your habit!</p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-4">
              <Link
                href="/stakes"
                className="flex-1 rounded-full border-2 border-slate-300 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={!selectedHabit || submitting}
                className="flex-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                data-testid="stake-submit-button"
              >
                {submitting ? "Creating..." : `Stake $${stakeAmount}`}
              </button>
            </div>
          </form>
        )}

        {/* How it works */}
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">How Stakes Work</h3>
          <div className="grid gap-3 md:grid-cols-3 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-[10px]">1</span>
              <span>Choose a habit and stake amount ($5-$100)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-[10px]">2</span>
              <span>Complete 80%+ of your habit to win 1.5x your stake</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-[10px]">3</span>
              <span>Miss your target and your stake goes to the community pool</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
