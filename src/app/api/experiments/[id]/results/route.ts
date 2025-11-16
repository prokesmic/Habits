import { NextResponse } from "next/server";
import { experimentService } from "@/lib/experiments";

// Loosen handler signature to align with Next.js RouteHandlerConfig in production
export async function GET(request: Request, context: any) {
  const { id } = await context.params;
  const exp = await experimentService.getExperiment(id);
  if (!exp) return NextResponse.json([], { status: 404 });
  const results = exp.variants.map((v, i) => ({
    variant: v.id,
    sampleSize: 500 + i * 100,
    metricValues: { [exp.metrics.primary]: 10 + i * 2 },
    confidence: 0.95,
    winner: i === 1,
  }));
  return NextResponse.json(results, { headers: { "Cache-Control": "public, s-maxage=60" } });
}


