import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createFriendRequest, listFriendData } from "@/lib/store";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await listFriendData(session.user.id);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const username =
    typeof body.username === "string"
      ? body.username.toLowerCase().replace(/[^a-z0-9_]/g, "")
      : "";

  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  const result = await createFriendRequest(session.user.id, username);
  if ("error" in result && result.error) {
    const status =
      result.error === "User not found"
        ? 404
        : result.error === "Already friends" ||
            result.error === "Request already pending"
          ? 409
          : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json(result);
}
