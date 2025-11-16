import { NextResponse } from "next/server";

export async function GET() {
  const members = Array.from({ length: 6 }).map((_, i) => ({
    id: `u${i + 1}`,
    name: ["Sarah", "John", "Emma", "Mike", "Lisa", "Chris"][i],
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(["Sarah", "John", "Emma", "Mike", "Lisa", "Chris"][i])}&background=random`,
    role: i === 0 ? "owner" : i === 1 ? "admin" : "member",
  }));
  return NextResponse.json(members);
}


