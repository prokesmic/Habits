export default function ReferralDetailsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Referral Program</h1>
      </header>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">How it works</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>Share your unique link</li>
          <li>Friends sign up & create habit</li>
          <li>You both get $5 credit</li>
          <li>Invite 3 friends → unlock $10</li>
          <li>No limit on referrals!</li>
        </ol>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Your Stats</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs text-slate-500">Total invited</p>
            <p className="text-xl font-bold text-slate-900">5</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs text-slate-500">Signed up</p>
            <p className="text-xl font-bold text-slate-900">3</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs text-slate-500">Active</p>
            <p className="text-xl font-bold text-slate-900">2</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs text-slate-500">Credits earned</p>
            <p className="text-xl font-bold text-slate-900">$10</p>
          </div>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Recent Referrals</h2>
        <ul className="mt-3 space-y-3 text-sm text-slate-700">
          <li>
            • Emma (active) - $5 earned
            <div className="text-xs text-slate-500">Joined 2 days ago</div>
          </li>
          <li>
            • John (signed up) - pending
            <div className="text-xs text-slate-500">Joined 1 week ago</div>
          </li>
          <li>
            • Sarah (invited) - not joined
            <div className="text-xs text-slate-500">Link sent 2 weeks ago</div>
          </li>
        </ul>
      </section>
    </div>
  );
}


