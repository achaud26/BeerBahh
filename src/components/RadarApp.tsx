"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { bars as seedBars, Bar, crowdCopy, CrowdLevel } from "@/data/bars";
import { BarPanel } from "@/components/BarPanel";
import { SheepMark } from "@/components/SheepMark";
import { LoginGate } from "@/components/LoginGate";

const RadarMap = dynamic(
  () => import("@/components/RadarMap").then((m) => m.RadarMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-[#1a221c] font-display text-xl font-bold text-field">
        Loading nightlife radar…
      </div>
    ),
  },
);

const legend: CrowdLevel[] = ["dead", "chill", "buzzing", "packed"];

const MOODS = [
  { id: "hyped", label: "Hyped — take me somewhere packed" },
  { id: "chill", label: "Chill night — lowkey works" },
  { id: "fomo", label: "Cure my FOMO" },
  { id: "deals", label: "Where are the deals?" },
] as const;

const PRIORITY_IDS = ["tds", "itsurwiener", "study-hall"];

export function RadarApp({ googleEnabled = false }: { googleEnabled?: boolean }) {
  const { data: session, status } = useSession();
  const [liveBars, setLiveBars] = useState<Bar[]>(seedBars);
  const [selectedId, setSelectedId] = useState<string | null>("tds");
  const [mood, setMood] = useState<string | null>(null);
  const [showMood, setShowMood] = useState(true);

  const refreshBars = useCallback(async () => {
    try {
      const res = await fetch("/api/bars");
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.bars)) {
        setLiveBars(
          data.bars.map((b: Bar) => {
            const seed = seedBars.find((s) => s.id === b.id);
            return { ...seed, ...b, chat: seed?.chat ?? [] } as Bar;
          }),
        );
      }
    } catch {
      /* keep seed */
    }
  }, []);

  useEffect(() => {
    refreshBars();
    const t = setInterval(refreshBars, 5000);
    return () => clearInterval(t);
  }, [refreshBars]);

  const orderedBars = useMemo(() => {
    const priority = PRIORITY_IDS.map((id) =>
      liveBars.find((b) => b.id === id),
    ).filter(Boolean) as Bar[];
    const rest = liveBars.filter((b) => !PRIORITY_IDS.includes(b.id));
    return [...priority, ...rest];
  }, [liveBars]);

  const selected = liveBars.find((b) => b.id === selectedId) ?? null;

  const onCrowdChange = useCallback((barId: string, crowd: CrowdLevel) => {
    setLiveBars((prev) =>
      prev.map((b) => (b.id === barId ? { ...b, crowd } : b)),
    );
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-cream font-display text-field">
        Loading…
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <LoginGate googleEnabled={googleEnabled} callbackUrl="/radar" />;
  }

  const username = session?.user?.username ?? "you";

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <header className="z-20 border-b border-white/10 bg-foam">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <SheepMark size={36} className="animate-herd-bounce" />
            <div>
              <p className="font-display text-lg font-black leading-none tracking-tight text-ink">
                Beer<span className="text-field">Bahh</span>
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                Clemson radar
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              {legend.map((level) => (
                <span
                  key={level}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-xs font-semibold text-ink"
                >
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: crowdCopy[level].color }}
                  />
                  {crowdCopy[level].label}
                </span>
              ))}
            </div>
            <Link
              href="/friends"
              className="rounded-full bg-panel px-3 py-1.5 text-xs font-semibold text-field"
            >
              Friends
            </Link>
            <Link
              href="/profile"
              className="rounded-full bg-panel px-3 py-1.5 text-xs font-semibold text-muted hover:text-ink"
            >
              @{username}
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-xs font-semibold text-muted hover:text-ink"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="border-t border-white/10 px-4 py-3">
          <p className="font-display text-xl font-bold text-ink sm:text-2xl">
            Where&apos;s the herd going?
          </p>
          {showMood ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMood(m.id);
                    setShowMood(false);
                    if (m.id === "hyped" || m.id === "fomo")
                      setSelectedId("study-hall");
                    if (m.id === "chill") setSelectedId("nicks");
                    if (m.id === "deals") setSelectedId("tds");
                  }}
                  className="rounded-full border border-white/15 bg-panel px-3 py-1.5 text-xs font-semibold text-ink hover:border-field hover:text-field"
                >
                  {m.label}
                </button>
              ))}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowMood(true)}
              className="mt-1 text-xs font-semibold text-field"
            >
              Mood: {MOODS.find((m) => m.id === mood)?.label ?? "set"} · change
            </button>
          )}
        </div>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[1.4fr_1fr]">
        <section className="relative min-h-[38vh] lg:min-h-0">
          <RadarMap
            bars={liveBars}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex gap-2 overflow-x-auto sm:hidden">
            {legend.map((level) => (
              <span
                key={level}
                className="pointer-events-none inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-foam/95 px-2.5 py-1 text-xs font-semibold text-ink"
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: crowdCopy[level].color }}
                />
                {crowdCopy[level].label}
              </span>
            ))}
          </div>
        </section>

        <BarPanel
          bar={selected}
          onClose={() => setSelectedId(null)}
          onCrowdChange={onCrowdChange}
        />
      </div>

      <nav className="flex gap-2 overflow-x-auto border-t border-white/10 bg-foam px-3 py-2">
        {orderedBars.map((bar) => {
          const active = bar.id === selectedId;
          const priority = PRIORITY_IDS.includes(bar.id);
          return (
            <button
              key={bar.id}
              type="button"
              onClick={() => setSelectedId(bar.id)}
              className={`shrink-0 rounded-full px-3 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-field text-cream"
                  : priority
                    ? "border border-field/40 bg-panel text-field"
                    : "bg-panel text-ink hover:border-field"
              }`}
            >
              {bar.nickname ?? bar.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
