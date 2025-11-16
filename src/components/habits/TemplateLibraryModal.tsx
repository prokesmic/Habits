"use client";

import { useMemo, useState } from "react";
import { habitTemplates } from "@/data/habitTemplates";
import type { TemplateCategory } from "@/types/template";
import { useRouter } from "next/navigation";

export function TemplateLibraryModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return habitTemplates
      .filter((t) => selectedCategory === "all" || t.category === selectedCategory)
      .filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [selectedCategory, searchQuery]);

  function handleAdd(template: (typeof habitTemplates)[number]) {
    const url = `/habits/new?name=${encodeURIComponent(template.name)}&emoji=${encodeURIComponent(
      template.emoji,
    )}&frequency=${template.defaultFrequency}&target=${template.defaultTarget}&stake=${template.suggestedStake}`;
    router.push(url);
    setOpen(false);
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
      >
        Browse 200+ templates →
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[85vh] w-full max-w-3xl overflow-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Habit Templates</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              >
                Close
              </button>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              {(["all", "health", "mind", "work", "social", "habits"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as any)}
                  className={`rounded-full border-2 px-3 py-1 text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="ml-auto w-full max-w-xs rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((t) => (
                <div key={t.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">
                      <span className="mr-1">{t.emoji}</span>
                      {t.name}
                    </h3>
                    <span className="text-xs text-slate-500">
                      {t.defaultFrequency} • {t.defaultTarget}x/week
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{t.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-green-700">Popular: ${t.suggestedStake} stake</span>
                    <button
                      type="button"
                      onClick={() => handleAdd(t)}
                      className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                    >
                      Add habit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center text-sm text-slate-500">More templates coming soon…</div>
          </div>
        </div>
      )}
    </div>
  );
}


