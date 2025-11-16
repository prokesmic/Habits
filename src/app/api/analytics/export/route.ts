import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "csv";
  const period = url.searchParams.get("period") ?? "30d";

  if (format === "json") {
    const data = JSON.stringify({ period, examples: [{ date: "2025-01-01", habit: "Meditation", completed: true }] }, null, 2);
    return new NextResponse(data, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="habit-tracker-${period}.json"`,
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  }
  if (format === "csv") {
    const csv = ["Date,Habit,Completed", "2025-01-01,Meditation,Yes", "2025-01-02,Gym,No"].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="habit-tracker-${period}.csv"`,
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  }
  if (format === "pdf") {
    const html = `<!doctype html><html><body><h1>Habit Tracker Report (${period})</h1><p>Success Rate: 72%</p></body></html>`;
    return new NextResponse(html, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="habit-tracker-${period}.pdf"`,
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  }
  return NextResponse.json({ error: "Invalid format" }, { status: 400 });
}


