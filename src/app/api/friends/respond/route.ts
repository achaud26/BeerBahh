import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { respondFriendRequest } from "@/lib/store";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const friendshipId = body.friendshipId as string | undefined;
  const action = body.action as "accept" | "decline" | undefined;

  if (!friendshipId || !action) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = await respondFriendRequest(
    friendshipId,
    session.user.id,
    action,
  );

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json(result);
}
