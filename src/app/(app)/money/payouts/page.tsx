export default function PayoutSettingsPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Payout settings</h1>
          <p className="text-sm text-slate-500">Connect your account to receive winnings</p>
        </div>
      </header>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Stripe Connect</h2>
        <p className="mt-2 text-sm text-slate-600">
          We use Stripe to securely process payouts. Connect your Stripe account to receive transfers.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            Connect with Stripe
          </button>
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
            Update account
          </button>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Payout history</h2>
        <div className="mt-3 text-sm text-slate-600">No payouts yet.</div>
      </section>
    </div>
  );
}


