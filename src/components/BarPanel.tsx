"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { alertCopy, Bar, crowdCopy, CrowdLevel } from "@/data/bars";

type LiveMessage = {
  id: string;
  author: string;
  text: string;
  minutesAgo: number;
  system?: boolean;
};

type BarPanelProps = {
  bar: Bar | null;
  crowdOverride?: CrowdLevel;
  onClose: () => void;
  onCrowdChange?: (barId: string, crowd: CrowdLevel) => void;
};

export function BarPanel({
  bar,
  crowdOverride,
  onClose,
  onCrowdChange,
}: BarPanelProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [liveCrowd, setLiveCrowd] = useState<CrowdLevel | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const loadChat = useCallback(async (barId: string) => {
    const res = await fetch(`/api/bars/${barId}/chat`);
    if (!res.ok) return;
    const data = await res.json();
    setMessages(data.messages ?? []);
    if (data.crowd) {
      setLiveCrowd(data.crowd);
      onCrowdChange?.(barId, data.crowd);
    }
  }, [onCrowdChange]);

  useEffect(() => {
    if (!bar) {
      setMessages([]);
      setLiveCrowd(null);
      return;
    }
    setDraft("");
    setError(null);
    loadChat(bar.id);
    const t = setInterval(() => loadChat(bar.id), 2500);
    return () => clearInterval(t);
  }, [bar?.id, loadChat]);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, bar?.id]);

  if (!bar) {
    return (
      <aside className="flex h-full flex-col justify-center border-t border-white/10 bg-foam p-6 lg:border-l lg:border-t-0">
        <p className="font-display text-2xl font-bold text-ink">
          Where&apos;s the herd going?
        </p>
        <p className="mt-2 max-w-xs text-muted">
          Tap a pin. Live crowd + livestream chat — bars first, not people.
        </p>
      </aside>
    );
  }

  const crowdLevel = liveCrowd ?? crowdOverride ?? bar.crowd;
  const crowd = crowdCopy[crowdLevel];
  const alert = bar.alert ? alertCopy[bar.alert] : null;

  async function send(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !bar || sending) return;
    setSending(true);
    setError(null);
    const res = await fetch(`/api/bars/${bar.id}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    setSending(false);
    if (!res.ok) {
      setError(data.error || "Couldn’t send");
      return;
    }
    setDraft("");
    setMessages(data.messages ?? []);
    if (data.crowd) {
      setLiveCrowd(data.crowd);
      onCrowdChange?.(bar.id, data.crowd);
    }
  }

  return (
    <aside className="flex h-full max-h-[55vh] flex-col border-t border-white/10 bg-foam lg:max-h-none lg:border-l lg:border-t-0">
      <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-alert/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-alert">
              <span className="size-1.5 rounded-full bg-alert animate-live-pulse" />
              Live
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Bar chat
            </p>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold leading-tight text-ink">
            {bar.name}
            {bar.nickname ? (
              <span className="text-field"> · {bar.nickname}</span>
            ) : null}
          </h2>
          <p className="mt-1 text-sm text-muted">{bar.address}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-white/15 px-3 py-1.5 text-sm font-semibold text-ink hover:bg-panel"
          aria-label="Close bar details"
        >
          Close
        </button>
      </div>

      <div className="space-y-3 border-b border-white/10 px-5 py-3">
        <div className="flex flex-wrap gap-2">
          <span
            className="rounded-full px-3 py-1 text-sm font-bold text-cream"
            style={{ background: crowd.color, color: "#0a0c0b" }}
          >
            {crowd.label} · {crowd.short}
          </span>
          {alert ? (
            <span className="rounded-full bg-alert px-3 py-1 text-sm font-bold text-foam">
              {alert.label}
            </span>
          ) : null}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl bg-panel px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              Drink deal
            </p>
            <p className="mt-0.5 text-sm font-semibold text-ink">{bar.deal}</p>
          </div>
          <div className="rounded-xl bg-panel px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              Cover
            </p>
            <p className="mt-0.5 text-sm font-semibold text-ink">{bar.cover}</p>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-muted">{bar.vibe}</p>
      </div>

      <div
        ref={scroller}
        className="min-h-0 flex-1 space-y-2 overflow-y-auto bg-cream/40 px-4 py-3"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`text-sm leading-snug ${m.system ? "text-muted italic" : ""}`}
          >
            <span
              className={`font-bold ${m.system ? "text-highlight" : "text-field"}`}
            >
              @{m.author}
            </span>{" "}
            <span className={m.system ? "text-muted" : "text-ink/90"}>
              {m.text}
            </span>{" "}
            <span className="text-[10px] text-muted">
              {m.minutesAgo === 0 ? "now" : `${m.minutesAgo}m`}
            </span>
          </div>
        ))}
        <p className="pt-1 text-[10px] text-muted">
          AI mod drops spam/dating and updates crowd when chat says packed,
          dead, etc.
        </p>
      </div>

      <form
        onSubmit={send}
        className="mt-auto flex flex-col gap-2 border-t border-white/10 p-3"
      >
        {error ? <p className="text-xs text-alert">{error}</p> : null}
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={
              session?.user
                ? "Chat live — how's the line?"
                : "Sign in to chat"
            }
            disabled={!session?.user || sending}
            className="min-h-11 flex-1 rounded-xl border border-white/15 bg-panel px-3 text-sm text-ink outline-none placeholder:text-muted focus:border-field disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!session?.user || sending}
            className="rounded-xl bg-field px-4 text-sm font-bold text-cream hover:bg-field-deep disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </aside>
  );
}
