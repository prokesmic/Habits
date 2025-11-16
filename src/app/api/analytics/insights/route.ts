import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    [
      {
        id: "weekend-strength",
        type: "pattern",
        category: "performance",
        title: "Weekend Warrior",
        description: "You're 12% more likely to check in on weekends. Consider starting new habits on Saturdays!",
        icon: "📅",
        priority: "medium",
        actionable: true,
        action: { label: "Start new habit", url: "/habits/new" },
      },
    ],
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}


