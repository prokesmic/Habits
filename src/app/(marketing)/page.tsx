export default function MarketingPage() {
  const heroStats = [
    { label: "Avg streak", value: "18 days" },
    { label: "Squad check-ins / week", value: "47" },
    { label: "Challenges active", value: "132" },
  ];

  const features = [
    {
      title: "Social at the core",
      description:
        "Reactions, comments, and activity feeds keep every habit public to your squad, so momentum never fades.",
    },
    {
      title: "1v1 and group challenges",
      description:
        "Spin up duels or public sprints with leaderboards, streak tracking, and celebratory share cards.",
    },
    {
      title: "Put money on it",
      description:
        "Run stakes using Stripe Connect: hold the pot, pay the winners, collect platform fees instantly.",
    },
    {
      title: "Built-in virality",
      description:
        "Referral rewards, shareable progress cards, and public challenges prime every user to invite friends.",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col gap-16 bg-gradient-to-b from-slate-50 to-white px-6 py-16">
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 text-center">
        <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
          Social habit tracker for squads
        </span>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Build habits with real accountability, real stakes, and real friends.
        </h1>
        <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
          Habit Tracker combines daily rituals with squads, reactions, 1v1 challenges, and cash
          stakes so you stick with it—and tell your friends. Ship in weeks, not months.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <a
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            href="/auth/sign-in"
          >
            Start building habits
          </a>
          <a
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            href="#features"
          >
            Explore features
          </a>
        </div>
        <div className="grid w-full max-w-3xl gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-3">
          {heroStats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{feature.title}</h2>
            <p className="mt-3 text-sm text-slate-600">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-slate-900">
            “Your week: 85% consistency + 47 squad check-ins 🔥”
          </h2>
          <p className="text-sm text-slate-600">
            Weekly recaps celebrate progress, nudge missed check-ins, and encourage sharing wins
            across squads.
          </p>
        </div>
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          AdSlot placeholder — feed_bottom. Swap in your network before launch.
        </div>
      </section>
    </main>
  );
}
