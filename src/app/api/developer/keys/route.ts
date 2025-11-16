import { NextResponse } from "next/server";

export async function POST() {
  const key = `live_${Math.random().toString(36).slice(2)}.${Math.random().toString(36).slice(2)}`;
  const record = { id: `k_${Math.random().toString(36).slice(2)}`, name: "My App", createdAt: new Date().toISOString() };
  return NextResponse.json({ key, record }, { status: 201 });
}


