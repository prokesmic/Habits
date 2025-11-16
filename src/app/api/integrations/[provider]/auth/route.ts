import { NextResponse } from "next/server";

// Loosen handler signature to align with Next.js RouteHandlerConfig in production
export async function GET(request: Request, context: any) {
  const { provider } = await context.params;
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = new URL("/(app)/integrations", base);
  return NextResponse.redirect(url);
}


