"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function MarketingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const features = [
    {
      icon: "📸",
      title: "Daily Check-Ins with Proof",
      description:
        "Take progress photos, add notes, or connect apps like Strava. Your squad sees your commitment.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: "👥",
      title: "Social at the Core",
      description:
        "Reactions, comments, and activity feeds keep every habit visible to your squad. Momentum never fades.",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: "🏆",
      title: "Challenges & Competitions",
      description:
        "Spin up 1v1 duels or group sprints with leaderboards, streak tracking, and shareable achievements.",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: "💰",
      title: "Optional Stakes",
      description:
        "For extra motivation: Add money to habits. Winners take the pot. (Completely optional)",
      color: "from-gray-500 to-gray-600",
      badge: "Optional",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-xl font-bold text-slate-900">
            Momentum
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/sign-in"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Headline */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
              Build habits that stick.
              <br />
              With friends who care.
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Track progress, stay accountable, and celebrate wins together.
              Join 10,000+ people building better habits through social support.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/auth/sign-up"
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Start Your First Habit
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-xl border-2 border-gray-200 hover:border-orange-500 transition-all"
              >
                See How It Works
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>10,000+ active users</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <span>47,000+ habits built</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span>4.9/5 rating</span>
              </div>
            </div>
          </div>

          {/* Preview Image/Demo */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto border border-gray-100">
              {/* Dashboard preview mockup */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center text-white font-bold">
                      JD
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Good morning, John!</div>
                      <div className="text-sm text-gray-500">3 habits to complete today</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full">
                    <span className="text-orange-500">🔥</span>
                    <span className="font-bold text-orange-600">15 day streak</span>
                  </div>
                </div>

                {/* Habits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  {[
                    { emoji: "🏃", name: "Morning Run", streak: 15, checked: true },
                    { emoji: "📚", name: "Read 30 mins", streak: 8, checked: false },
                    { emoji: "💧", name: "Drink 8 glasses", streak: 22, checked: false },
                  ].map((habit) => (
                    <div
                      key={habit.name}
                      className={`p-4 rounded-xl border-2 ${
                        habit.checked
                          ? "bg-green-50 border-green-200"
                          : "bg-white border-gray-100 hover:border-orange-300"
                      } transition-all`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{habit.emoji}</span>
                        {habit.checked && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            Done!
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-gray-900">{habit.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <span>🔥</span>
                        <span>{habit.streak} days</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Activity Feed Preview */}
                <div className="bg-white rounded-xl border border-gray-100 p-3">
                  <div className="text-sm font-semibold text-gray-600 mb-3">Squad Activity</div>
                  <div className="space-y-3">
                    {[
                      { user: "Sarah", action: "completed Morning Run", time: "2m ago", emoji: "💪" },
                      { user: "Mike", action: "hit 30-day streak!", time: "15m ago", emoji: "🔥" },
                      { user: "Emma", action: "joined your challenge", time: "1h ago", emoji: "🏆" },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold">
                          {activity.user[0]}
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold">{activity.user}</span>{" "}
                          <span className="text-gray-600">{activity.action}</span>{" "}
                          <span className="text-lg">{activity.emoji}</span>
                        </div>
                        <span className="text-gray-400 text-xs">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg font-semibold animate-bounce hidden md:block">
              30-day streak! 🔥
            </div>
            <div className="absolute -bottom-4 -right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg font-semibold hidden md:block">
              Sarah completed workout 💪
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Everything you need to build lasting habits
            </h2>
            <p className="text-xl text-gray-600">
              Designed around accountability, not gimmicks
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow"
              >
                {feature.badge && (
                  <span className="absolute top-4 right-4 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                    {feature.badge}
                  </span>
                )}

                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl mb-4`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">How It Works</h2>
            <p className="text-xl text-gray-600">
              Four simple steps to building life-changing habits
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                number: "1",
                title: "Create Your First Habit",
                description:
                  "Choose from popular habits or create your own. Set your frequency and commitment level.",
                icon: "🎯",
              },
              {
                number: "2",
                title: "Invite Your Squad",
                description:
                  "Add friends who'll keep you accountable. Or join public challenges to meet new people.",
                icon: "👥",
              },
              {
                number: "3",
                title: "Check In Daily",
                description:
                  "Tap to check in, add a photo for proof, and watch your streak grow. Miss a day? Your squad notices.",
                icon: "✅",
              },
              {
                number: "4",
                title: "Celebrate Progress",
                description:
                  "Earn badges, share milestones, and see your transformation over weeks and months.",
                icon: "🎉",
              },
            ].map((step, i) => (
              <div key={step.number} className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-lg h-full">
                  <div className="text-6xl mb-4 text-center">{step.icon}</div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-blue-500 text-white flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">{step.description}</p>
                </div>

                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <svg
                      className="w-8 h-8 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Real People. Real Results.
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands who&apos;ve transformed their lives
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "I lost 30 pounds in 6 months with my accountability squad. The daily check-ins and photo proof kept me honest.",
                author: "Sarah Johnson",
                age: 32,
                habit: "Daily workout",
                avatar: "SJ",
                streak: 180,
              },
              {
                quote:
                  "Finally learned Spanish with daily practice and friend pressure. My squad wouldn't let me quit!",
                author: "Mike Chen",
                age: 28,
                habit: "30 min language learning",
                avatar: "MC",
                streak: 90,
              },
              {
                quote:
                  "Quit smoking after 10 years. My squad believed in me when I didn't believe in myself.",
                author: "James Williams",
                age: 45,
                habit: "No cigarettes",
                avatar: "JW",
                streak: 365,
              },
            ].map((testimonial) => (
              <div
                key={testimonial.author}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 shadow-lg"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-lg text-gray-900">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600">Age {testimonial.age}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-3xl mb-2">⭐⭐⭐⭐⭐</div>
                  <p className="text-gray-700 leading-relaxed italic">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">{testimonial.habit}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">🔥</span>
                    <span className="font-bold text-xl">{testimonial.streak}</span>
                    <span className="text-gray-600">day streak</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
