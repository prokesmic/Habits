"use client";

type MoneyWidgetProps = {
  stakesActive?: number; // dollars
  winningsToDate?: number; // dollars
  potentialEarnings?: number; // dollars
  upcomingPayouts?: number; // dollars
};

export function MoneyWidget({
  stakesActive = 45,
  winningsToDate = 125,
  potentialEarnings = 80,
  upcomingPayouts = 25,
}: MoneyWidgetProps) {
  return (
    <section className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-lime-50 p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">💰 Stakes Active</p>
          <p className="text-3xl font-bold text-slate-900">${stakesActive}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">🏆 Winnings to date</p>
          <p className="text-3xl font-bold text-slate-900">${winningsToDate}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">🎯 Potential earnings</p>
          <p className="text-3xl font-bold text-slate-900">${potentialEarnings}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">📤 Upcoming payouts</p>
          <p className="text-3xl font-bold text-slate-900">${upcomingPayouts}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href="/money/transactions"
          className="rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
        >
          View transactions
        </a>
        <a
          href="/money/payouts"
          className="rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
        >
          Payout settings
        </a>
        <a
          href="/challenges"
          className="rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
        >
          Join challenges
        </a>
      </div>
    </section>
  );
}


