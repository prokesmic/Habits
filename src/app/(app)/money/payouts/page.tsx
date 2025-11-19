export default function PayoutSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 p-6 text-white shadow-sm shadow-slate-900/10">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <span>💳</span>
            <span>Payouts</span>
          </span>
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">Payout Settings</h1>
            <p className="mt-1 text-sm opacity-95">Connect your account to receive winnings</p>
          </div>
        </div>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
        <h2 className="text-lg font-semibold text-slate-900">Stripe Connect</h2>
        <p className="mt-2 text-sm text-slate-600">
          We use Stripe to securely process payouts. Connect your Stripe account to receive transfers.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/40 transition hover:bg-indigo-700">
            Connect with Stripe
          </button>
          <button className="rounded-full border-2 border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
            Update account
          </button>
        </div>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
        <h2 className="text-lg font-semibold text-slate-900">Payout history</h2>
        <div className="mt-3 text-sm text-slate-600">No payouts yet.</div>
      </section>
    </div>
  );
}


