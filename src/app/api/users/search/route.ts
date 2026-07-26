import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { searchUsers } from "@/lib/store";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  if (q.length < 1) {
    return NextResponse.json({ users: [] });
  }

  const users = await searchUsers(q, session.user.id);
  return NextResponse.json({ users });
}
