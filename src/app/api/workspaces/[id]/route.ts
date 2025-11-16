import { NextResponse } from "next/server";

export async function GET(request: Request, context: any) {
  const { id } = await context.params;
  const ws = {
    id,
    name: "Acme Inc.",
    slug: "acme",
    description: "Wellness & performance",
    logo: "https://ui-avatars.com/api/?name=Acme&background=random",
    plan: "team",
    seats: 10,
    usedSeats: 6,
  };
  return NextResponse.json(ws);
}


