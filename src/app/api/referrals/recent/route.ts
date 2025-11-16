import { NextResponse } from "next/server";

export async function GET() {
  const recent = Array.from({ length: 8 }).map((_, i) => ({
    name: ["Adam", "Bella", "Chris", "Dana", "Evan", "Faye", "Gus", "Holly"][i],
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      ["Adam", "Bella", "Chris", "Dana", "Evan", "Faye", "Gus", "Holly"][i]
    )}&background=random`,
    joinedAt: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
  }));
  return NextResponse.json(recent);
}


