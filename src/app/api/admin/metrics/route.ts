import { NextResponse } from "next/server";

export async function GET() {
  // TODO: enforce admin auth when backend is wired
  const metrics = {
    users: { total: 1247, activeToday: 523, newToday: 21 },
    money: { totalStaked: 12345, activeStakes: 76, platformRevenue: 2450 },
    engagement: {
      dau: 523,
      mau: 3012,
      dauMauRatio: 523 / 3012,
      retention: { day1: 42.5, day7: 23.1, day30: 12.4 },
    },
  };
  return NextResponse.json(metrics, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}


