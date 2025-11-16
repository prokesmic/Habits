import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    period: "monthly",
    entries: Array.from({ length: 15 }).map((_, i) => ({
      userId: `u${i + 1}`,
      userName: ["Sarah", "John", "Emma", "Mike", "Lisa"][i % 5] + " " + (i + 1),
      avatar: `https://ui-avatars.com/api/?name=User+${i + 1}&background=random`,
      referralCount: 30 - i,
      activeReferrals: 25 - i,
      totalEarned: (30 - i) * 5,
      rank: i + 1,
    })),
    userRank: 7,
    prizes: [
      { rank: 1, reward: 200, description: "Top Referrer" },
      { rank: 2, reward: 100, description: "Second Place" },
      { rank: 3, reward: 50, description: "Third Place" },
    ],
  });
}


