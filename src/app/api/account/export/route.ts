import { NextResponse } from "next/server";

export async function GET() {
  const data = {
    user: { email: "user@example.com", name: "User", createdAt: new Date().toISOString() },
    habits: [{ name: "Meditation", emoji: "🧘", createdAt: new Date().toISOString() }],
    checkIns: [{ date: new Date().toISOString().slice(0, 10), habitId: "h1", completed: true }],
    transactions: [{ amount: 10, type: "stake", timestamp: new Date().toISOString() }],
  };
  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: { "Content-Type": "application/json", "Content-Disposition": `attachment; filename="account-export.json"` },
  });
}


