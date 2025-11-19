const mockLeaders = {
  global: [
    { name: "Sarah", emoji: "🧘", streak: 42 },
    { name: "John", emoji: "🏃", streak: 35 },
    { name: "Emma", emoji: "📚", streak: 30 },
  ],
  friends: [
    { name: "Mike", emoji: "💪", streak: 28 },
    { name: "Alex", emoji: "💻", streak: 22 },
  ],
  local: [
    { name: "You", emoji: "🔥", streak: 18 },
    { name: "Nina", emoji: "🌅", streak: 17 },
  ],
};

export default function LeaderboardsPage() {
  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 p-6 text-white shadow-sm shadow-slate-900/10">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <span>🏆</span>
            <span>Rankings</span>
          </span>
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">Leaderboards</h1>
            <p className="mt-1 text-sm md:text-base opacity-95">
              See who&apos;s on fire—globally, in your area, and among friends.
            </p>
          </div>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {Object.entries(mockLeaders).map(([title, list]) => (
          <div key={title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5">
            <h2 className="text-lg font-semibold capitalize text-slate-900">{title}</h2>
            <ul className="mt-3 space-y-2">
              {list.map((p, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{p.emoji}</span>
                    <span className="text-sm font-semibold text-slate-900">{p.name}</span>
                  </div>
                  <span className="text-sm text-slate-700">{p.streak} days</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}


