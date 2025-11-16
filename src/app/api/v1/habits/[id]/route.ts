import { NextResponse } from "next/server";

export async function GET(request: Request, context: any) {
  const { id } = await context.params;
  return NextResponse.json({ id, name: "Meditation", emoji: "🧘", frequency: "daily", currentStreak: 7, longestStreak: 21, createdAt: new Date().toISOString() });
}

export async function PATCH(request: Request, context: any) {
  const { id } = await context.params;
  const body = await request.json();
  return NextResponse.json({ id, ...body });
}

export async function DELETE() {
  return NextResponse.json({ deleted: true });
}


