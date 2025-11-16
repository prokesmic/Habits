import Link from "next/link";
import { challengeTemplates } from "@/data/mockChallenges";

export function ChallengeTemplates() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Quick Start Templates</h2>
        <Link
          href="/challenges/templates"
          className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          Browse 100+ templates →
        </Link>
      </div>
      
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {challengeTemplates.map((template, idx) => (
          <Link
            key={idx}
            href={`/challenges/new?template=${encodeURIComponent(template.title)}`}
            className="group rounded-xl border-2 border-slate-200 bg-white p-4 text-center transition-all hover:border-blue-300 hover:shadow-md"
          >
            <div className="mb-2 text-2xl">{template.emoji}</div>
            <h3 className="mb-1 text-sm font-semibold text-slate-900 group-hover:text-blue-600">
              {template.title}
            </h3>
            <p className="text-xs font-semibold text-blue-600">${template.stake}</p>
            <p className="mt-1 text-xs text-slate-500">{template.duration} days</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

