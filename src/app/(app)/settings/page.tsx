export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">
          Configure notifications, connected accounts, and privacy preferences.
        </p>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
          <p className="mt-2 text-sm text-slate-600">
            Daily reminders, streak alerts, and squad summaries via email.
          </p>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300" />
              Daily habit reminders
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300" />
              Squad check-in digest
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
              Weekly recap email
            </label>
          </div>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Connected accounts</h2>
          <p className="mt-2 text-sm text-slate-600">
            Link Google or Apple to streamline sign-in and payouts.
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
            <button className="rounded-full border border-slate-200 px-4 py-2 text-left font-semibold transition hover:border-slate-300 hover:text-slate-900">
              Connect Google
            </button>
            <button className="rounded-full border border-slate-200 px-4 py-2 text-left font-semibold transition hover:border-slate-300 hover:text-slate-900">
              Connect Stripe (stakes payouts)
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}

