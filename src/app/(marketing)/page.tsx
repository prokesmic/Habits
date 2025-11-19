"use client";

import React from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-500 text-white font-semibold">
              H
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Habitio
            </span>
          </div>

          {/* Auth actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth/sign-in"
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="hidden rounded-full border border-amber-500/80 px-4 py-1.5 text-sm font-semibold text-amber-600 hover:bg-amber-50/80 md:inline-flex"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <main>
        <section className="bg-gradient-to-b from-amber-50/80 via-white to-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-10 md:flex-row md:items-center md:gap-16 md:px-6 md:pt-16">
            {/* Hero text */}
            <div className="max-w-xl space-y-6">
              <p className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                Social accountability, not gimmicks
              </p>

              <div className="space-y-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                  <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 bg-clip-text text-transparent">
                    Build habits that stick.
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">
                    With friends who care.
                  </span>
                </h1>
                <p className="text-base text-slate-600 sm:text-lg">
                  Track progress, stay accountable, and celebrate wins together.
                  Join <span className="font-semibold">10,000+ people</span>{" "}
                  building better habits through social support.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-amber-500/40 transition hover:bg-amber-600 hover:shadow-md hover:shadow-amber-500/50"
                >
                  Start Your First Habit
                </Link>
                <button
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  See How It Works
                </button>
              </div>

              {/* Metrics */}
              <div className="mt-3 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
                <MetricCard
                  label="People building habits"
                  value="10,000+"
                  icon="👥"
                />
                <MetricCard
                  label="Habits completed"
                  value="47,000+"
                  icon="✅"
                />
                <MetricCard label="Average rating" value="4.9 / 5" icon="⭐" />
              </div>
            </div>

            {/* Product preview */}
            <div className="relative mx-auto w-full max-w-md py-6">
              {/* Streak pill */}
              <div className="absolute left-2 top-0 z-20 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/40">
                30-day streak 🔥
              </div>

              {/* Main card */}
              <div className="relative rounded-3xl bg-white p-4 shadow-xl shadow-slate-900/5 ring-1 ring-slate-100">
                <div className="rounded-2xl bg-slate-50 p-4">
                  {/* Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Good morning, John!
                      </p>
                      <p className="text-xs text-slate-500">
                        2 habits to complete today
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      🔥 15-day streak
                    </span>
                  </div>

                  {/* Habits */}
                  <div className="mb-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs text-emerald-700">🏃‍♂️</span>
                        <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                          Done
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-emerald-900">
                        Morning Run
                      </p>
                      <p className="mt-1 text-[11px] text-emerald-700">
                        🔥 15-day streak
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-3">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs">📚</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          Due today
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">
                        Read 30 mins
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        🔥 8 days
                      </p>
                    </div>
                  </div>

                  {/* Squad activity */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Squad activity
                    </p>
                    <ActivityRow
                      initials="S"
                      name="Sarah"
                      action="completed Morning Run 💪"
                      time="2m ago"
                      color="bg-sky-500"
                    />
                    <ActivityRow
                      initials="M"
                      name="Mike"
                      action="hit 30-day streak! 🔥"
                      time="15m ago"
                      color="bg-violet-500"
                    />
                  </div>
                </div>
              </div>

              {/* Toast */}
              <div className="absolute bottom-6 right-3 z-20 -translate-y-1/2 rounded-full bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/40">
                Sarah just checked in. Your turn?
              </div>

              {/* Caption */}
              <p className="mt-2 text-center text-xs text-slate-500">
                Product preview · Your daily accountability dashboard
              </p>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="border-t border-slate-100 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Everything you need to build lasting habits
              </h2>
              <p className="mt-2 text-sm text-slate-500 md:text-base">
                Designed around accountability and social support – not
                gamification tricks.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2">
              <FeatureCard
                title="Daily Check-Ins with Proof"
                description="Take quick photo or note check-ins so your squad sees the real work behind the streak – not just a checkbox."
                icon="📸"
              />
              <FeatureCard
                title="Social at the Core"
                description="Reactions, comments, and a lightweight feed make every habit a shared story, not a solo grind."
                icon="👥"
              />
              <FeatureCard
                title="Challenges & Group Goals"
                description="Create private or public challenges, track progress together, and celebrate milestones as a team."
                icon="🏆"
              />
              <FeatureCard
                title="Stakes & Rewards"
                description="Add small stakes for an extra push – like $5 for missed check-ins that go to the winners. Completely optional and fully in your control."
                icon="💰"
                badge="Optional"
              />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="bg-slate-50/70">
          <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                How it works
              </h2>
              <p className="mt-2 text-sm text-slate-500 md:text-base">
                Four simple steps. Set up your first habit in under 2 minutes.
              </p>
            </div>

            {/* Step progress bar */}
            <div className="mx-auto mt-8 flex max-w-2xl items-center gap-2 text-xs text-slate-500">
              <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500" />
              <span>Step 1–4</span>
            </div>

            <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-4 md:gap-6">
              <StepCard
                step={1}
                title="Create a Habit"
                description="Pick from popular templates or create your own. Set how often you want to show up."
                icon="🎯"
              />
              <StepCard
                step={2}
                title="Invite Your Squad"
                description="Add friends who'll keep you accountable – or join a public challenge to meet new people."
                icon="👥"
              />
              <StepCard
                step={3}
                title="Check In Daily"
                description="Tap to check in, add a photo for proof, and watch your streak grow one day at a time."
                icon="✅"
              />
              <StepCard
                step={4}
                title="Celebrate Wins"
                description="Earn badges, hit streak milestones, and share progress with the people who cheer you on."
                icon="🎉"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ---- SMALL COMPONENTS ---- */

type MetricProps = {
  label: string;
  value: string;
  icon: string;
};

function MetricCard({ label, value, icon }: MetricProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/70 px-3 py-2 shadow-sm shadow-slate-900/5">
      <span className="text-base">{icon}</span>
      <div>
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

type ActivityProps = {
  initials: string;
  name: string;
  action: string;
  time: string;
  color: string;
};

function ActivityRow({
  initials,
  name,
  action,
  time,
  color,
}: ActivityProps) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold text-white ${color}`}
        >
          {initials}
        </div>
        <span className="text-slate-700">
          <span className="font-semibold">{name}</span> {action}
        </span>
      </div>
      <span className="text-[11px] text-slate-600">{time}</span>
    </div>
  );
}

type FeatureProps = {
  title: string;
  description: string;
  icon: string;
  badge?: string;
};

function FeatureCard({ title, description, icon, badge }: FeatureProps) {
  return (
    <div className="group relative h-full rounded-3xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-900/10">
      {badge && (
        <span className="absolute right-4 top-4 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          {badge}
        </span>
      )}
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-500 text-lg">
        <span className="text-white">{icon}</span>
      </div>
      <h3 className="mb-1 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}

type StepProps = {
  step: number;
  title: string;
  description: string;
  icon: string;
};

function StepCard({ step, title, description, icon }: StepProps) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-5 text-center shadow-sm shadow-slate-900/5">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-500 text-xl text-white">
        {icon}
      </div>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        Step {step}
      </div>
      <h3 className="mb-1 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-600">{description}</p>
    </div>
  );
}
