import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ id: params.id, name: "Meditation", emoji: "🧘", frequency: "daily", currentStreak: 7, longestStreak: 21, createdAt: new Date().toISOString() });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  return NextResponse.json({ id: params.id, ...body });
}

export async function DELETE() {
  return NextResponse.json({ deleted: true });
}


