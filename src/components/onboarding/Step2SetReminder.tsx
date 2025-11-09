"use client";

type Step2SetReminderProps = {
  habit: { title: string; emoji: string } | null;
  onNext: (reminder: { time: string | null }) => void;
};

export function Step2SetReminder({ habit, onNext }: Step2SetReminderProps) {
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
          className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-blue-500"
          onClick={() => onNext({ time: "07:00" })}
        >
          ☀️ Morning — 7:00 AM
        </button>
        <button
          type="button"
          className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-blue-500"
          onClick={() => onNext({ time: "12:00" })}
        >
          🌤️ Midday — 12:00 PM
        </button>
        <button
          type="button"
          className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-blue-500"
          onClick={() => onNext({ time: "20:00" })}
        >
          🌙 Evening — 8:00 PM
        </button>
        <button
          type="button"
          className="w-full rounded-2xl border-2 border-dashed border-slate-300 px-4 py-3 text-left text-sm font-semibold text-slate-500 transition hover:border-blue-500"
          onClick={() => onNext({ time: null })}
        >
          ⏰ I&apos;ll set my own reminder later
        </button>
      </div>
    </div>
  );
}

