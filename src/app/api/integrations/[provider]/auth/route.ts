import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { provider: string } }) {
  // Stub: redirect to provider auth (mock)
  const url = new URL("/(app)/integrations", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  return NextResponse.redirect(url);
}


