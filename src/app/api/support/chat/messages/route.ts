import { NextResponse } from "next/server";

const store: { id: string; from: "user" | "support"; content: string }[] = [
  { id: "m1", from: "support", content: "Hi! How can we help you today?" },
];

export async function GET() {
  return NextResponse.json(store);
}

export async function POST(request: Request) {
  const body = await request.json();
  store.push({ id: String(Date.now()), from: "user", content: body.content ?? "" });
  // Naive auto-reply
  if (String(body.content || "").toLowerCase().includes("refund")) {
    store.push({ id: String(Date.now() + 1), from: "support", content: "I can help with refunds. Could you share your order id?" });
  }
  return NextResponse.json({ ok: true });
}


