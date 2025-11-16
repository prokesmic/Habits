import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Return mock metrics (client components already have graceful fallbacks)
  const url = new URL(request.url);
  const period = url.searchParams.get("period") ?? "30d";
  // Minimal shape for the UI; actual values generated client-side if needed
  const res = NextResponse.json(
    {
      overall: { totalCheckIns: 45, possibleCheckIns: 90, successRate: 50, averageStreakLength: 8 },
      trends: { successRateChange: 2.1, streakChange: 1.2, checkInsChange: 5 },
      dailyBreakdown: [],
      weekdayBreakdown: [],
      timePatterns: { hourlyDistribution: [], bestCheckInTime: "07:00-08:00", averageCheckInTime: "07:34" },
      habitBreakdown: [],
      period,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
  return res;
}


