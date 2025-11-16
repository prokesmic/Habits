"use client";

type Step2SetReminderProps = {
  habit: { title: string; emoji: string } | null;
  onNext: (reminder?: { time: string | null }) => Promise<void>;
  loading?: boolean;
};

export function Step2SetReminder({ habit, onNext, loading }: Step2SetReminderProps) {
  const handleClick = async (time: string | null) => {
    await onNext({ time });
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-slate-900">
        Great! When should we remind you?
      </h1>
      <p className="mb-6 text-sm text-slate-600">
        {habit ? `${habit.emoji} ${habit.title}` : "Your habit"} deserves the right daily nudge.
      </p>
      <div className="space-y-3">
        <button
          type="button"
          disabled={loading}
          className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleClick("07:00")}
        >
          ☀️ Morning — 7:00 AM
        </button>
        <button
          type="button"
          disabled={loading}
          className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleClick("12:00")}
        >
          🌤️ Midday — 12:00 PM
        </button>
        <button
          type="button"
          disabled={loading}
          className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleClick("20:00")}
        >
          🌙 Evening — 8:00 PM
        </button>
        <button
          type="button"
          disabled={loading}
          className="w-full rounded-2xl border-2 border-dashed border-slate-300 px-4 py-3 text-left text-sm font-semibold text-slate-500 transition hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleClick(null)}
        >
          ⏰ I&apos;ll set my own reminder later
        </button>
      </div>
      {loading && (
        <p className="mt-4 text-center text-sm text-slate-500">Creating habit...</p>
      )}
    </div>
  );
}

