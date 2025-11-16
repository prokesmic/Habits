import { achievements } from "@/data/achievements";
import { formatDistanceToNow } from "date-fns";

export default function WeeklyRecapPage() {
  const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const consistency = 85;
  const checkins = 12;
  const squadInteractions = 47;
  const winnings = 25;

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Your Weekly Recap</h1>
        <p className="mt-2 text-sm text-slate-600">Great progress! Here are your highlights.</p>
      </header>
      <section className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Consistency</p>
          <p className="text-3xl font-bold text-slate-900">{consistency}%</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Check-ins</p>
          <p className="text-3xl font-bold text-slate-900">{checkins}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Squad activity</p>
          <p className="text-3xl font-bold text-slate-900">{squadInteractions}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Winnings</p>
          <p className="text-3xl font-bold text-slate-900">${winnings}</p>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Week at a glance</h2>
        <div className="mt-3 grid grid-cols-7 gap-2">
          {week.map((d, i) => (
            <div key={i} className="text-center">
              <div className={`mx-auto h-3 w-10 rounded-full ${i % 2 === 0 ? "bg-green-500" : "bg-slate-200"}`} />
              <p className="mt-1 text-xs text-slate-500">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Achievements</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {achievements.map((a) => (
            <li key={a.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
              <span className="text-2xl">{a.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                <p className="text-xs text-slate-600">{a.description}</p>
              </div>
              {a.earnedAt ? (
                <span className="text-xs text-slate-500">
                  {formatDistanceToNow(new Date(a.earnedAt), { addSuffix: true })}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}


