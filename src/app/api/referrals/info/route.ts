import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code") ?? "abc123";
  const referrer = {
    code,
    name: "Sarah Johnson",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random",
    totalReferrals: 134,
    recentSignups: Array.from({ length: 5 }).map((_, i) => ({
      name: `New User ${i + 1}`,
      avatar: `https://ui-avatars.com/api/?name=New+User+${i + 1}&background=random`,
    })),
  };
  return NextResponse.json(referrer);
}


