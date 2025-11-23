"use client";

import Link from "next/link";
import { Flame, Dumbbell, Book, Brain, Moon, Droplets, Heart, Zap } from "lucide-react";

type ChallengeTemplate = {
  id: string;
  name: string;
  description: string;
  duration_days: number;
  target_completions: number;
  icon: React.ReactNode;
  color: string;
  category: string;
};

export default function ChallengeTemplatesPage() {
  const templates: ChallengeTemplate[] = [
    {
      id: "morning-routine",
      name: "7-Day Morning Routine",
      description: "Start each day with intention. Complete your morning routine every day for a week.",
      duration_days: 7,
      target_completions: 7,
      icon: <Flame className="h-6 w-6" />,
      color: "from-orange-400 to-red-500",
      category: "Productivity",
    },
    {
      id: "fitness-kickstart",
      name: "30-Day Fitness Kickstart",
      description: "Get moving! Exercise at least 20 minutes a day for 30 days.",
      duration_days: 30,
      target_completions: 25,
      icon: <Dumbbell className="h-6 w-6" />,
      color: "from-emerald-400 to-teal-500",
      category: "Fitness",
    },
    {
      id: "reading-challenge",
      name: "21-Day Reading Challenge",
      description: "Read for at least 20 pages every day for 3 weeks.",
      duration_days: 21,
      target_completions: 18,
      icon: <Book className="h-6 w-6" />,
      color: "from-violet-400 to-purple-500",
      category: "Learning",
    },
    {
      id: "mindfulness-week",
      name: "Mindfulness Week",
      description: "Practice meditation or mindfulness for at least 10 minutes daily.",
      duration_days: 7,
      target_completions: 7,
      icon: <Brain className="h-6 w-6" />,
      color: "from-cyan-400 to-blue-500",
      category: "Wellness",
    },
    {
      id: "sleep-challenge",
      name: "14-Day Sleep Better",
      description: "Go to bed before 11 PM and get at least 7 hours of sleep.",
      duration_days: 14,
      target_completions: 12,
      icon: <Moon className="h-6 w-6" />,
      color: "from-indigo-400 to-purple-600",
      category: "Wellness",
    },
    {
      id: "hydration-challenge",
      name: "30-Day Hydration",
      description: "Drink at least 8 glasses of water every day for a month.",
      duration_days: 30,
      target_completions: 28,
      icon: <Droplets className="h-6 w-6" />,
      color: "from-sky-400 to-blue-500",
      category: "Health",
    },
    {
      id: "gratitude-challenge",
      name: "21-Day Gratitude",
      description: "Write down 3 things you're grateful for each day.",
      duration_days: 21,
      target_completions: 21,
      icon: <Heart className="h-6 w-6" />,
      color: "from-pink-400 to-rose-500",
      category: "Wellness",
    },
    {
      id: "no-phone-mornings",
      name: "7-Day No Phone Mornings",
      description: "Don't check your phone for the first hour after waking up.",
      duration_days: 7,
      target_completions: 7,
      icon: <Zap className="h-6 w-6" />,
      color: "from-amber-400 to-orange-500",
      category: "Digital Wellness",
    },
  ];

  const categories = [...new Set(templates.map((t) => t.category))];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Hero Header */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 p-6 text-white shadow-sm shadow-slate-900/10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <span>📋</span>
              <span>Templates</span>
            </span>
            <div>
              <h1 className="text-2xl font-semibold md:text-3xl">Challenge Templates</h1>
              <p className="mt-1 text-sm opacity-95">
                Quick-start challenges with proven formats
              </p>
            </div>
          </div>
          <Link
            href="/challenges/new"
            className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30"
          >
            Custom Challenge
          </Link>
        </div>
      </section>

      {/* Templates by Category */}
      {categories.map((category) => (
        <div key={category} className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{category}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {templates
              .filter((t) => t.category === category)
              .map((template) => (
                <Link
                  key={template.id}
                  href={`/challenges/new?template=${template.id}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
                  data-testid={`template-${template.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${template.color} text-white`}>
                      {template.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600">
                        {template.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">{template.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                          {template.duration_days} days
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                          {template.target_completions} target
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      ))}

      {/* Custom Challenge CTA */}
      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <h3 className="text-lg font-semibold text-slate-900">Don't see what you need?</h3>
        <p className="mt-2 text-sm text-slate-600">
          Create a completely custom challenge tailored to your goals
        </p>
        <Link
          href="/challenges/new"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          data-testid="create-custom-challenge"
        >
          Create Custom Challenge
        </Link>
      </div>
    </div>
  );
}
