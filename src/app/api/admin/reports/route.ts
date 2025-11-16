import { NextResponse } from "next/server";

const mockReports = [
  { id: "r1", reportedBy: "john", reportedUser: "sarah", contentType: "post", reason: "Inappropriate language", createdAt: new Date().toISOString() },
  { id: "r2", reportedBy: "mike", reportedUser: "emma", contentType: "comment", reason: "Spam", createdAt: new Date().toISOString() },
] as const;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status") ?? "pending";
  if (status !== "pending") {
    return NextResponse.json([], { headers: { "Cache-Control": "public, s-maxage=60" } });
  }
  return NextResponse.json(mockReports, { headers: { "Cache-Control": "public, s-maxage=60" } });
}


