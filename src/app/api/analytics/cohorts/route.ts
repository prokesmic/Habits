import { NextResponse } from "next/server";
import { calculateCohortAnalysis } from "@/lib/analytics/cohorts";

export async function GET() {
  const cohorts = await calculateCohortAnalysis();
  return NextResponse.json(cohorts, { headers: { "Cache-Control": "public, s-maxage=300" } });
}


