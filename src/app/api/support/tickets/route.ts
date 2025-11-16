import { NextResponse } from "next/server";

export async function POST() {
  // In mock mode, return a ticket id
  return NextResponse.json({ id: `T-${Math.floor(Math.random() * 100000)}` });
}


