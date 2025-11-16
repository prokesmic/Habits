import { NextResponse } from "next/server";

export async function POST() {
  // Accept resolve actions; in mock mode just return ok
  return NextResponse.json({ ok: true });
}


