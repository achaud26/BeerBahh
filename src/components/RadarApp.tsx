"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { bars, crowdCopy, CrowdLevel } from "@/data/bars";
import { BarPanel } from "@/components/BarPanel";
import { SheepMark } from "@/components/SheepMark";

const RadarMap = dynamic(
  () => import("@/components/RadarMap").then((m) => m.RadarMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-[#d7e8d4] font-display text-xl font-bold text-field-deep">
        Loading nightlife radar…
      </div>
    ),
  },
);

const legend: CrowdLevel[] = ["dead", "chill", "buzzing", "packed"];

export function RadarApp() {
  const [selectedId, setSelectedId] = useState<string | null>("esso");
  const selected = bars.find((b) => b.id === selectedId) ?? null;

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <header className="z-20 flex items-center justify-between gap-3 border-b-2 border-ink bg-foam px-4 py-3">
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
        <div className="hidden items-center gap-2 sm:flex">
          {legend.map((level) => (
            <span
              key={level}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-2.5 py-1 text-xs font-semibold text-ink"
            >
              <span
                className="size-2.5 rounded-full border border-ink/40"
                style={{ background: crowdCopy[level].color }}
              />
              {crowdCopy[level].label}
            </span>
          ))}
        </div>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[1.4fr_1fr]">
        <section className="relative min-h-[42vh] lg:min-h-0">
          <RadarMap
            bars={bars}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex gap-2 overflow-x-auto sm:hidden">
            {legend.map((level) => (
              <span
                key={level}
                className="pointer-events-none inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink/15 bg-foam/95 px-2.5 py-1 text-xs font-semibold text-ink shadow-sm"
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

        <BarPanel bar={selected} onClose={() => setSelectedId(null)} />
      </div>

      <nav className="flex gap-2 overflow-x-auto border-t border-ink/10 bg-foam px-3 py-2 lg:hidden">
        {bars.map((bar) => {
          const active = bar.id === selectedId;
          return (
            <button
              key={bar.id}
              type="button"
              onClick={() => setSelectedId(bar.id)}
              className={`shrink-0 rounded-full px-3 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-ink text-highlight"
                  : "bg-cream text-ink hover:bg-highlight/60"
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
