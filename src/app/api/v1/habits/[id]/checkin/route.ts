import { NextResponse } from "next/server";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ ok: true, habitId: params.id, checkInId: `c_${Math.random().toString(36).slice(2)}` }, { status: 201 });
}


