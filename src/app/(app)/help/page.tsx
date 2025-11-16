"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type HelpArticle = {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
};

export default function HelpCenter() {
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

  const categories = [
    { id: "getting-started", name: "Getting Started", icon: "🚀" },
    { id: "habits", name: "Habits & Streaks", icon: "🔥" },
    { id: "money", name: "Money & Stakes", icon: "💰" },
    { id: "squads", name: "Squads & Challenges", icon: "👥" },
    { id: "troubleshooting", name: "Troubleshooting", icon: "🔧" },
  ];

  const popular = [
    { title: "How to create your first habit", slug: "create-first-habit" },
    { title: "Understanding streaks and freezes", slug: "streaks-freezes" },
    { title: "How stakes work", slug: "how-stakes-work" },
    { title: "Joining and creating squads", slug: "squads-guide" },
    { title: "Getting your money back", slug: "payouts" },
  ];

  useEffect(() => {
    const load = async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (selectedCategory) params.set("category", selectedCategory);
      const res = await fetch(`/api/help/articles?${params}`);
      setArticles(await res.json());
    };
    void load();
  }, [searchQuery, selectedCategory]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">How can we help?</h1>
        <div className="mx-auto max-w-2xl">
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-300 px-6 py-4 text-lg focus:border-violet-500 focus:outline-none"
          />
        </div>
      </div>
      {!searchQuery && (
        <>
          <div className="mb-12 grid gap-4 md:grid-cols-5">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`rounded-xl p-6 text-center transition-shadow hover:shadow-lg ${selectedCategory === c.id ? "bg-violet-600 text-white" : "bg-white border"}`}
              >
                <div className="mb-2 text-3xl">{c.icon}</div>
                <div className="text-sm font-medium">{c.name}</div>
              </button>
            ))}
          </div>
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold">Popular Articles</h2>
            <div className="space-y-3">
              {popular.map((a) => (
                <Link key={a.slug} href={`/help/${a.slug}`} className="block rounded-lg border bg-white p-4 transition-all hover:border-violet-500 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{a.title}</span>
                    <span className="text-violet-600">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
      {(searchQuery || selectedCategory) && (
        <div>
          <h2 className="mb-6 text-2xl font-bold">{searchQuery ? "Search Results" : `${categories.find((c) => c.id === selectedCategory)?.name} Articles`}</h2>
          <div className="space-y-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
            {articles.length === 0 && (
              <div className="py-12 text-center">
                <div className="mb-4 text-4xl">🔍</div>
                <h3 className="mb-2 text-xl font-semibold">No articles found</h3>
                <p className="mb-6 text-gray-600">Try different keywords or browse categories above</p>
                <button onClick={() => router.push("/support/contact")} className="rounded-lg bg-violet-600 px-6 py-3 text-white">
                  Contact Support
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="mt-12 rounded-xl border border-violet-200 bg-violet-50 p-6 text-center">
        <h3 className="mb-2 font-semibold">Can't find what you're looking for?</h3>
        <p className="mb-4 text-gray-600">Our support team is here to help</p>
        <button onClick={() => router.push("/support/contact")} className="rounded-lg bg-violet-600 px-6 py-3 text-white">
          Contact Support
        </button>
      </div>
    </div>
  );
}

function ArticleCard({ article }: { article: HelpArticle }) {
  const [wasHelpful, setWasHelpful] = useState<boolean | null>(null);
  const handleFeedback = async (helpful: boolean) => {
    await fetch(`/api/help/articles/${article.id}/feedback`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ helpful }) });
    setWasHelpful(helpful);
  };
  return (
    <div className="rounded-lg border bg-white p-6">
      <Link href={`/help/${article.slug}`} className="group mb-4 block">
        <h3 className="mb-2 text-lg font-semibold group-hover:text-violet-600">{article.title}</h3>
        <p className="line-clamp-2 text-sm text-gray-600">{article.content.substring(0, 150)}...</p>
      </Link>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex gap-2">
          {article.tags.slice(0, 3).map((t) => (
            <span key={t} className="rounded bg-gray-100 px-2 py-1">
              {t}
            </span>
          ))}
        </div>
        {wasHelpful === null ? (
          <div className="flex items-center gap-4">
            <span>Was this helpful?</span>
            <button onClick={() => void handleFeedback(true)} className="hover:text-green-600">
              👍
            </button>
            <button onClick={() => void handleFeedback(false)} className="hover:text-red-600">
              👎
            </button>
          </div>
        ) : (
          <span className="text-green-600">Thanks for your feedback!</span>
        )}
      </div>
    </div>
  );
}


