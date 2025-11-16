import { NextResponse } from "next/server";

export async function GET(request: Request, context: any) {
  const { id } = await context.params;
  const analytics = {
    workspaceId: id,
    engagement: {
      activeUsers: 42,
      totalUsers: 68,
      participationRate: 61.7,
      averageCheckInsPerUser: 5.2,
      totalCheckIns: 1520,
    },
    dailyEngagement: Array.from({ length: 14 }).map((_, i) => ({
      date: new Date(Date.now() - (13 - i) * 86400000).toISOString().slice(0, 10),
      activeUsers: Math.round(30 + Math.random() * 20),
      checkIns: Math.round(80 + Math.random() * 40),
    })),
    topPerformers: Array.from({ length: 5 }).map((_, i) => ({
      userId: `u${i + 1}`,
      userName: ["Sarah", "John", "Emma", "Mike", "Lisa"][i],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(["Sarah","John","Emma","Mike","Lisa"][i])}&background=random`,
      metric: 30 - i * 3,
    })),
    habitAdoption: [
      { habitName: "Meditation", userCount: 28, completionRate: 78 },
      { habitName: "Gym", userCount: 22, completionRate: 65 },
      { habitName: "Reading", userCount: 18, completionRate: 72 },
    ],
    trends: { weekOverWeek: 4.2, monthOverMonth: 11.3, engagement: "increasing" },
    benchmarks: { industryAverage: 54, yourWorkspace: 62, percentile: 84 },
  };
  return NextResponse.json(analytics, { headers: { "Cache-Control": "public, s-maxage=60" } });
}


