import { NextResponse } from "next/server";

export async function POST(request: Request, context: any) {
  const { provider } = await context.params;
  // Mock disconnect for a provider
  return NextResponse.json({ ok: true, provider });
}


