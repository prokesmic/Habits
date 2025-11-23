import { NextResponse } from "next/server";

function getPerformanceData(period: string) {
  return {
    overall: { totalCheckIns: 45, possibleCheckIns: 90, successRate: 50, averageStreakLength: 8 },
    trends: { successRateChange: 2.1, streakChange: 1.2, checkInsChange: 5 },
    dailyBreakdown: [],
    weekdayBreakdown: [],
    timePatterns: { hourlyDistribution: [], bestCheckInTime: "07:00-08:00", averageCheckInTime: "07:34" },
    habitBreakdown: [],
    period,
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const period = url.searchParams.get("period") ?? "30d";

  return NextResponse.json(getPerformanceData(period), {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const period = body?.period ?? "30d";
    return NextResponse.json(getPerformanceData(period));
  } catch {
    return NextResponse.json(getPerformanceData("30d"));
  }
}
