import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  areFriends,
  findUserByUsername,
  friendshipBetween,
} from "@/lib/store";

export async function GET(
  _request: Request,
  context: { params: Promise<{ username: string }> },
) {
  const { username } = await context.params;
  const session = await auth();
  const profile = await findUserByUsername(username);

  if (!profile || !profile.username) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isSelf = session?.user?.id === profile.id;
  const friends = session?.user?.id
    ? await areFriends(session.user.id, profile.id)
    : false;
  const link = session?.user?.id
    ? await friendshipBetween(session.user.id, profile.id)
    : null;

  if (!isSelf && !friends) {
    return NextResponse.json({
      private: true,
      user: {
        id: profile.id,
        username: profile.username,
      },
      friendship: link
        ? {
            id: link.id,
            status: link.status,
            direction:
              link.requesterId === session?.user?.id ? "outgoing" : "incoming",
          }
        : null,
    });
  }

  return NextResponse.json({
    private: false,
    user: {
      id: profile.id,
      username: profile.username,
      name: profile.name,
      image: profile.image,
      bio: profile.bio,
      createdAt: profile.createdAt,
    },
    friendship: link
      ? {
          id: link.id,
          status: link.status,
          direction:
            link.requesterId === session?.user?.id ? "outgoing" : "incoming",
        }
      : null,
    isSelf,
  });
}
