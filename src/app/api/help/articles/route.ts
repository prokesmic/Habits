import { NextResponse } from "next/server";

const articles = [
  {
    id: "a1",
    title: "How to create your first habit",
    slug: "create-first-habit",
    content: "Step-by-step to create your first habit...",
    category: "getting-started",
    tags: ["habits", "onboarding"],
    views: 234,
    helpful: 42,
    notHelpful: 3,
    lastUpdated: new Date().toISOString(),
    author: "Team",
  },
  {
    id: "a2",
    title: "Understanding streaks and freezes",
    slug: "streaks-freezes",
    content: "All about streaks, freezes, and recoveries...",
    category: "habits",
    tags: ["streaks", "freezes"],
    views: 189,
    helpful: 55,
    notHelpful: 4,
    lastUpdated: new Date().toISOString(),
    author: "Team",
  },
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.toLowerCase();
  const category = url.searchParams.get("category");
  let result = articles;
  if (q) {
    result = result.filter((a) => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q));
  }
  if (category) {
    result = result.filter((a) => a.category === category);
  }
  return NextResponse.json(result);
}


