import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ data: [{ id: "h1", name: "Meditation", emoji: "🧘", frequency: "daily", currentStreak: 7, longestStreak: 21, createdAt: new Date().toISOString() }], meta: { total: 1, page: 1, perPage: 50 } });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ data: { id: `h_${Math.random().toString(36).slice(2)}`, ...body, createdAt: new Date().toISOString() }, message: "Habit created successfully" }, { status: 201 });
}


