import Link from "next/link";

export default function MarketingPage() {
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
    <main className="flex min-h-screen flex-col gap-12 bg-gradient-to-b from-slate-50 to-white px-4 py-12 sm:gap-16 sm:px-6 sm:py-16">
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 text-center">
        <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
          Your friends put <span className="text-blue-600">$500</span> on you quitting coffee. Don&apos;t let them win.
        </h1>
        <p className="max-w-3xl text-base text-slate-600 sm:text-lg md:text-xl">
          Real money. Real friends. Real consequences. Join{" "}
          <span className="font-semibold text-slate-900">10,000+</span> people who&apos;ve built{" "}
          <span className="font-semibold text-slate-900">47,000</span> habits with cash on the line.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            className="min-h-[52px] rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30 sm:px-10 sm:py-4 sm:text-lg"
            href="/auth/sign-up"
          >
            Start a $10 challenge
          </Link>
          <Link
            className="min-h-[52px] rounded-full border-2 border-slate-300 bg-white px-6 py-4 text-base font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 sm:px-8 sm:py-4"
            href="/challenges"
          >
            Browse public challenges
          </Link>
          <Link
            className="min-h-[52px] text-base font-semibold text-slate-600 underline-offset-4 transition hover:text-slate-900 hover:underline sm:text-lg"
            href="#features"
          >
            How it works
          </Link>
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
    </main>
  );
}
