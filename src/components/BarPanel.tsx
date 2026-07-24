"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  alertCopy,
  Bar,
  ChatMessage,
  crowdCopy,
} from "@/data/bars";

type BarPanelProps = {
  bar: Bar | null;
  onClose: () => void;
};

export function BarPanel({ bar, onClose }: BarPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(bar?.chat ?? []);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setMessages(bar?.chat ?? []);
    setDraft("");
  }, [bar?.id]);

  if (!bar) {
    return (
      <aside className="flex h-full flex-col justify-center border-t border-ink/10 bg-foam p-6 lg:border-l lg:border-t-0">
        <p className="font-display text-2xl font-bold text-ink">Tap a pin</p>
        <p className="mt-2 max-w-xs text-muted">
          Live crowd, deals, and bar chat — find your herd before you Uber.
        </p>
      </aside>
    );
  }

  const crowd = crowdCopy[bar.crowd];
  const alert = bar.alert ? alertCopy[bar.alert] : null;

  function send(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      {
        id: `local-${Date.now()}`,
        author: "you",
        text,
        minutesAgo: 0,
      },
      ...prev,
    ]);
    setDraft("");
  }

  return (
    <aside className="flex h-full max-h-[55vh] flex-col border-t border-ink/10 bg-foam lg:max-h-none lg:border-l lg:border-t-0">
      <div className="flex items-start justify-between gap-3 border-b border-ink/10 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Live from Clemson
          </p>
          <h2 className="font-display text-2xl font-bold leading-tight text-ink">
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
          className="rounded-xl border border-ink/15 px-3 py-1.5 text-sm font-semibold text-ink hover:bg-cream"
          aria-label="Close bar details"
        >
          Close
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto px-5 py-4">
        <div className="flex flex-wrap gap-2">
          <span
            className="rounded-full px-3 py-1 text-sm font-bold text-ink"
            style={{ background: crowd.color }}
          >
            {crowd.label} · {crowd.short}
          </span>
          {alert ? (
            <span className="rounded-full bg-alert px-3 py-1 text-sm font-bold text-foam">
              {alert.label}
            </span>
          ) : null}
        </div>

        {alert ? (
          <p className="rounded-2xl bg-alert/10 px-4 py-3 text-sm font-medium text-ink">
            {alert.detail}
          </p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-cream px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Drink deal
            </p>
            <p className="mt-1 font-semibold text-ink">{bar.deal}</p>
          </div>
          <div className="rounded-2xl bg-cream px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Cover
            </p>
            <p className="mt-1 font-semibold text-ink">{bar.cover}</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-ink/80">{bar.vibe}</p>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-ink">
              Bar chat
            </h3>
            <span className="text-xs font-semibold uppercase tracking-wider text-field">
              Live
            </span>
          </div>
          <ul className="max-h-44 space-y-2 overflow-y-auto pr-1">
            {messages.map((m) => (
              <li
                key={m.id}
                className="rounded-2xl border border-ink/8 bg-cream px-3 py-2"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-bold text-field-deep">
                    @{m.author}
                  </span>
                  <span className="text-xs text-muted">
                    {m.minutesAgo === 0 ? "just now" : `${m.minutesAgo}m`}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-ink">{m.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <form
        onSubmit={send}
        className="mt-auto flex gap-2 border-t border-ink/10 p-4"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="How packed is it?"
          className="min-h-11 flex-1 rounded-xl border border-ink/15 bg-cream px-3 text-sm outline-none focus:border-field"
        />
        <button
          type="submit"
          className="rounded-xl bg-field px-4 text-sm font-bold text-foam hover:bg-field-deep"
        >
          Send
        </button>
      </form>
    </aside>
  );
}
