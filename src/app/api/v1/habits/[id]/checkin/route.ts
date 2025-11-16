import { NextResponse } from "next/server";

export async function POST(request: Request, context: any) {
  const { id } = await context.params;
  return NextResponse.json({ ok: true, habitId: id, checkInId: `c_${Math.random().toString(36).slice(2)}` }, { status: 201 });
}


