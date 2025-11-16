import { NextResponse } from "next/server";
import { experimentService } from "@/lib/experiments";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const exp = await experimentService.getExperiment(params.id);
  if (!exp) return NextResponse.json([], { status: 404 });
  // Mock results
  const results = exp.variants.map((v, i) => ({
    variant: v.id,
    sampleSize: 500 + i * 100,
    metricValues: { [exp.metrics.primary]: 10 + i * 2 }, // percent
    confidence: 0.95,
    winner: i === 1,
  }));
  return NextResponse.json(results, { headers: { "Cache-Control": "public, s-maxage=60" } });
}


