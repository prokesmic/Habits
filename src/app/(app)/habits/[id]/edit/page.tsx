"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { IconPicker } from "@/components/habits/IconPicker";
import { getHabit, updateHabit } from "@/server/actions/habits";

type Habit = {
  id: string;
  title: string;
  emoji: string | null;
  description: string | null;
  frequency: string;
  target_days_per_week: number;
  is_public: boolean;
};

export default function EditHabitPage() {
  const router = useRouter();
  const params = useParams();
  const habitId = params.id as string;

  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("Target");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [targetDays, setTargetDays] = useState(7);
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    async function loadHabit() {
      try {
        const data = await getHabit(habitId);
        setHabit(data);
        setTitle(data.title);
        setIcon(data.emoji || "Target");
        setDescription(data.description || "");
        setFrequency(data.frequency);
        setTargetDays(data.target_days_per_week);
        setIsPublic(data.is_public);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load habit");
      } finally {
        setLoading(false);
      }
    }
    loadHabit();
  }, [habitId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await updateHabit(habitId, {
        title,
        icon,
        description,
        frequency,
        target_days_per_week: targetDays,
        is_public: isPublic,
      });
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update habit");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="h-40 bg-slate-200 rounded-3xl" />
          <div className="h-60 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error && !habit) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-700">{error}</p>
          <Link href="/dashboard" className="mt-4 inline-block text-amber-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      {/* Back Link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Hero Header */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 p-6 text-white shadow-sm shadow-slate-900/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
              <span>Edit Habit</span>
            </div>
            <h1 className="text-2xl font-bold">Edit "{habit?.title}"</h1>
            <p className="mt-1 text-sm opacity-90">
              Update your habit details and icon
            </p>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5">
        {/* Habit name */}
        <label className="block text-sm font-semibold text-slate-700">
          Habit name
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            placeholder="Morning meditation, 10 push-ups, Read 20 pages..."
            required
          />
        </label>

        {/* Icon Picker */}
        <div className="text-sm font-semibold text-slate-700">
          <span className="flex items-center gap-2">
            Icon
            <span className="text-xs font-normal text-amber-600">
              Choose a new icon for your habit
            </span>
          </span>
          <IconPicker
            value={icon}
            onChange={setIcon}
            habitName={title}
          />
        </div>

        {/* Description */}
        <label className="block text-sm font-semibold text-slate-700">
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            placeholder="Add context for your squad"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Frequency */}
          <label className="text-sm font-semibold text-slate-700">
            Frequency
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="daily">Daily</option>
              <option value="weekdays">Weekdays</option>
              <option value="custom">Custom</option>
            </select>
          </label>

          {/* Target days */}
          <label className="text-sm font-semibold text-slate-700">
            Target days per week
            <input
              type="number"
              min={1}
              max={7}
              value={targetDays}
              onChange={(e) => setTargetDays(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </label>
        </div>

        {/* Public toggle */}
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
          />
          Make this habit public (recommended for discovery)
        </label>

        {/* Error message */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 pt-2">
          <Link
            href="/dashboard"
            className="flex-1 rounded-full border-2 border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || !title}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-amber-500/30 transition hover:shadow-lg hover:shadow-amber-500/40 active:scale-95 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
