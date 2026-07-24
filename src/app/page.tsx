import Link from "next/link";
import { SheepMark } from "@/components/SheepMark";
import { WaitlistForm } from "@/components/WaitlistForm";

export default function Home() {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-cream text-ink">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-[420px] w-[420px] rounded-full bg-field/25 blur-3xl" />
        <div className="absolute right-[-10%] top-[20%] h-[380px] w-[380px] rounded-full bg-highlight/40 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #0c120d 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2.5">
          <SheepMark size={42} />
          <span className="font-display text-2xl font-black tracking-tight">
            Beer<span className="text-field">Bahh</span>
          </span>
        </div>
        <Link
          href="/radar"
          className="rounded-full border-2 border-ink bg-foam px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-highlight"
        >
          Open radar
        </Link>
      </header>

      <main>
        <section className="relative mx-auto grid min-h-[calc(100dvh-88px)] w-full max-w-6xl items-center gap-10 px-5 pb-16 pt-6 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-foam/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-field-deep">
              Launching in Clemson
            </p>
            <h1 className="font-display text-[clamp(3rem,9vw,5.75rem)] font-black leading-[0.92] tracking-tight">
              Beer<span className="text-field">Bahh</span>
            </h1>
            <p className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
              Find Your Herd.
            </p>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
              Real-time bar intel for college nights — crowd levels, drink
              deals, and live chat so you stop guessing which spot is actually
              worth it.
            </p>
            <div className="mt-8">
              <WaitlistForm />
            </div>
            <p className="mt-3 text-sm text-muted">
              Free for students. Bars list free at launch. Every night is a
              great night.
            </p>
          </div>

          <div className="relative">
            <div className="animate-float-soft absolute -right-2 -top-4 z-10 rounded-2xl border-2 border-ink bg-highlight px-3 py-2 text-sm font-bold shadow-[4px_4px_0_#0c120d] sm:right-6">
              Esso is packed · 2m ago
            </div>
            <div className="relative overflow-hidden rounded-[2rem] border-[3px] border-ink bg-field shadow-[10px_10px_0_#0c120d]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,225,74,0.35),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(12,18,13,0.25),transparent_40%)]" />
              <div className="relative flex flex-col items-center px-6 pb-10 pt-12 text-center">
                <SheepMark size={140} className="drop-shadow-[0_8px_0_rgba(12,18,13,0.25)]" />
                <p className="mt-6 font-display text-3xl font-black text-foam">
                  Nightlife radar
                </p>
                <p className="mt-2 max-w-xs text-foam/85">
                  Map the herd. Skip the dead spots. Slide into the buzz.
                </p>
                <Link
                  href="/radar"
                  className="mt-8 inline-flex min-h-12 items-center justify-center rounded-2xl bg-ink px-6 font-display text-base font-bold text-highlight transition hover:-translate-y-0.5"
                >
                  Try the Clemson demo →
                </Link>
              </div>
            </div>
            <div className="animate-float-soft absolute -bottom-3 left-2 rounded-2xl border-2 border-ink bg-foam px-3 py-2 text-sm font-bold shadow-[4px_4px_0_#0c120d] [animation-delay:1s] sm:left-8">
              $3 domestics @ TTT
            </div>
          </div>
        </section>

        <section className="border-y-2 border-ink bg-foam">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:grid-cols-3">
            {[
              {
                title: "Live crowd",
                body: "Dead, chill, buzzing, or packed — updated by people actually there.",
              },
              {
                title: "Drink deals",
                body: "See tonight's specials before you commit to the cover.",
              },
              {
                title: "Bar chat",
                body: "Ask the herd: line length, vibe, whether it's worth the Uber.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h2 className="font-display text-xl font-bold text-ink">
                  {item.title}
                </h2>
                <p className="mt-2 text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="rounded-[2rem] border-[3px] border-ink bg-highlight px-6 py-10 shadow-[8px_8px_0_#0c120d] sm:px-10">
            <h2 className="font-display text-3xl font-black text-ink sm:text-4xl">
              Bars: more foot traffic on slow nights.
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-ink/80">
              Free to list at launch. We help fill seats when campus energy is
              mid — not another app asking for a monthly fee before you&apos;ve
              seen a single student walk in.
            </p>
            <a
              href="mailto:hello@beerahh.com?subject=BeerBahh%20bar%20partner"
              className="mt-6 inline-flex min-h-12 items-center rounded-2xl bg-ink px-6 font-display font-bold text-highlight"
            >
              Pitch your bar
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink/10 px-5 py-8 text-center text-sm text-muted">
        BeerBahh · Find Your Herd · Built for Clemson first
      </footer>
    </div>
  );
}
