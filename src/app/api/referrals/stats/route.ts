import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    code: "abc123",
    totalReferred: 12,
    totalEarned: 60,
  });
}


