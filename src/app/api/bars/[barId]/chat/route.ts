import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { bars } from "@/data/bars";
import { moderateChatText, minutesAgo } from "@/lib/chat-mod";
import {
  ensureSeedChat,
  getCrowdOverrides,
  listBarChat,
  postBarChat,
} from "@/lib/store";

export async function GET(
  _request: Request,
  context: { params: Promise<{ barId: string }> },
) {
  const { barId } = await context.params;
  const bar = bars.find((b) => b.id === barId);
  if (!bar) {
    return NextResponse.json({ error: "Bar not found" }, { status: 404 });
  }

  await ensureSeedChat(
    barId,
    bar.chat.map((c) => ({
      author: c.author,
      text: c.text,
      minutesAgo: c.minutesAgo,
    })),
  );

  const messages = await listBarChat(barId);
  const overrides = await getCrowdOverrides();
  const crowd = overrides[barId] ?? bar.crowd;

  return NextResponse.json({
    crowd,
    messages: messages.map((m) => ({
      id: m.id,
      author: m.author,
      text: m.text,
      minutesAgo: minutesAgo(m.createdAt),
      system: Boolean(m.system),
      createdAt: m.createdAt,
    })),
  });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ barId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { barId } = await context.params;
  const bar = bars.find((b) => b.id === barId);
  if (!bar) {
    return NextResponse.json({ error: "Bar not found" }, { status: 404 });
  }

  const body = await request.json();
  const text = typeof body.text === "string" ? body.text : "";
  const mod = moderateChatText(text);
  if (!mod.ok) {
    return NextResponse.json({ error: mod.reason }, { status: 400 });
  }

  const author = session.user.username || session.user.name || "tiger";
  const result = await postBarChat({
    barId,
    userId: session.user.id,
    author,
    text: text.trim().replace(/\s+/g, " "),
    crowdHint: mod.crowdHint,
  });

  if ("error" in result && result.error) {
    return NextResponse.json({ error: result.error }, { status: 429 });
  }

  const messages = await listBarChat(barId);
  return NextResponse.json({
    crowd: result.crowd ?? bar.crowd,
    message: result.message,
    messages: messages.map((m) => ({
      id: m.id,
      author: m.author,
      text: m.text,
      minutesAgo: minutesAgo(m.createdAt),
      system: Boolean(m.system),
      createdAt: m.createdAt,
    })),
  });
}
