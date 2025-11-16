import { NextResponse } from "next/server";

// Loosen handler signature to align with Next.js RouteHandlerConfig in production
export async function GET(request: Request, context: any) {
  const { id } = await context.params;
  return NextResponse.json(
    {
      habitName: "Meditation",
      performance: {
        totalCheckIns: 22,
        possibleCheckIns: 30,
        successRate: 73.3,
        currentStreak: 6,
        longestStreak: 21,
        averageStreak: 8,
      },
      consistency: { perfectWeeks: 2, perfectMonths: 0, longestGap: 3, averageGap: 1.2 },
      timeline: [],
      predictions: { probabilityOfSuccess: 78, riskDays: ["Thursday", "Sunday"], recommendedActions: ["Set a 7am reminder"] },
      id,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}


