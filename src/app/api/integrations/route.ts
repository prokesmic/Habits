import { NextResponse } from "next/server";

export async function GET() {
  // Mock integrations list
  return NextResponse.json([
    {
      id: "int-1",
      provider: "google_calendar",
      name: "Google Calendar",
      status: "disconnected",
      syncSettings: { autoSync: true, syncFrequency: "daily" },
    },
    {
      id: "int-2",
      provider: "strava",
      name: "Strava",
      status: "disconnected",
      syncSettings: { autoSync: true, syncFrequency: "hourly" },
    },
  ]);
}


