import { NextResponse } from "next/server";
import { experimentService } from "@/lib/experiments";

export async function GET() {
  const list = await experimentService.listExperiments();
  return NextResponse.json(list, { headers: { "Cache-Control": "public, s-maxage=60" } });
}


