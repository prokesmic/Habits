import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const workspace = {
    id: `ws_${Math.random().toString(36).slice(2)}`,
    name: body.name,
    slug: body.slug,
    plan: body.plan ?? "team",
    seats: body.seats ?? 5,
    usedSeats: 1,
    createdAt: new Date().toISOString(),
    ownerId: "current-user",
  };
  return NextResponse.json(workspace);
}


