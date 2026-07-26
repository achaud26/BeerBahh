import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { slugUsername, updateUser } from "@/lib/store";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const bio =
    typeof body.bio === "string" ? body.bio.trim().slice(0, 160) : undefined;
  let username: string | undefined;
  if (typeof body.username === "string") {
    const cleaned = slugUsername(body.username);
    if (cleaned.length < 2) {
      return NextResponse.json(
        { error: "Username must be at least 2 characters" },
        { status: 400 },
      );
    }
    username = cleaned;
  }

  const name =
    typeof body.name === "string" ? body.name.trim().slice(0, 48) : undefined;

  try {
    const updated = await updateUser(session.user.id, {
      ...(bio !== undefined ? { bio } : {}),
      ...(username ? { username } : {}),
      ...(name !== undefined ? { name } : {}),
    });
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({
      user: {
        id: updated.id,
        username: updated.username,
        name: updated.name,
        image: updated.image,
        bio: updated.bio,
      },
    });
  } catch (e) {
    if (e instanceof Error && e.message === "USERNAME_TAKEN") {
      return NextResponse.json({ error: "Username taken" }, { status: 409 });
    }
    throw e;
  }
}
