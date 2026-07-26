import Link from "next/link";
import { SheepMark } from "@/components/SheepMark";
import { WaitlistForm } from "@/components/WaitlistForm";

export default function Home() {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-cream text-ink">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-[420px] w-[420px] rounded-full bg-field/20 blur-3xl" />
        <div className="absolute right-[-10%] top-[20%] h-[380px] w-[380px] rounded-full bg-highlight/15 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #f4f7f4 1px, transparent 0)",
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
        <div className="flex items-center gap-2">
          <Link
            href="/radar"
            className="rounded-full border border-field bg-field px-4 py-2 text-sm font-bold text-cream transition hover:-translate-y-0.5"
          >
            Open radar
          </Link>
          <Link
            href="/brief"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-muted transition hover:border-ink hover:text-ink"
          >
            Product brief
          </Link>
        </div>
      </header>

      <main>
        <section className="relative mx-auto grid min-h-[calc(100dvh-88px)] w-full max-w-6xl items-center gap-10 px-5 pb-16 pt-6 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-field/40 bg-foam px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-field">
              The WAZE of going out · Clemson
            </p>
            <h1 className="font-display text-[clamp(3rem,9vw,5.75rem)] font-black leading-[0.92] tracking-tight">
              Beer<span className="text-field">Bahh</span>
            </h1>
            <p className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
              Find Your Herd.
            </p>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
              Nightlife radar for college nights — know if going out is the
              right move, how every bar feels, and where the herd is actually
              headed.
            </p>
            <div className="mt-8">
              <WaitlistForm />
            </div>
            <p className="mt-3 text-sm text-muted">
              Free for students forever. Bars pay to market. Hyped or FOMO-cured
              — your call.
            </p>
          </div>

          <div className="relative">
            <div className="animate-float-soft absolute -right-2 -top-4 z-10 rounded-2xl border border-white/20 bg-highlight px-3 py-2 text-sm font-bold text-cream shadow-[4px_4px_0_#2fd65a] sm:right-6">
              Study Hall packed · 2m ago
            </div>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-panel shadow-[0_0_0_1px_rgba(47,214,90,0.25),0_20px_60px_rgba(0,0,0,0.45)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(47,214,90,0.25),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(232,255,106,0.12),transparent_40%)]" />
              <div className="relative flex flex-col items-center px-6 pb-10 pt-12 text-center">
                <SheepMark
                  size={140}
                  className="drop-shadow-[0_8px_24px_rgba(47,214,90,0.35)]"
                />
                <p className="mt-6 font-display text-3xl font-black text-ink">
                  Nightlife radar
                </p>
                <p className="mt-2 max-w-xs text-muted">
                  Live crowd. Livestream chat. Bars first — not the group chat
                  rumor mill.
                </p>
                <Link
                  href="/radar"
                  className="mt-8 inline-flex min-h-12 items-center justify-center rounded-2xl bg-field px-6 font-display text-base font-bold text-cream transition hover:-translate-y-0.5 hover:bg-field-deep"
                >
                  Open the Clemson radar →
                </Link>
              </div>
            </div>
            <div className="animate-float-soft absolute -bottom-3 left-2 rounded-2xl border border-white/20 bg-foam px-3 py-2 text-sm font-bold text-ink shadow-[4px_4px_0_#2fd65a] [animation-delay:1s] sm:left-8">
              $2 wells @ TD&apos;s
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-foam">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:grid-cols-3">
            {[
              {
                title: "Live crowd",
                body: "Dead → packed. AI reads the chat so levels stay real — not someone's lying story.",
              },
              {
                title: "Livestream chat",
                body: "YouTube-live energy per bar. Usernames on. Friends see more. AI mods the noise.",
              },
              {
                title: "Bar deals",
                body: "Bars post specials on their own profile. You see the move before the Uber.",
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
          <div className="rounded-[2rem] border border-field/40 bg-panel px-6 py-10 sm:px-10">
            <h2 className="font-display text-3xl font-black text-ink sm:text-4xl">
              Want more foot traffic any night — with just a message?
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-muted">
              Students free forever. Bars pay to market deals and fill slow
              nights. Lock TD&apos;s, Wien&apos;s, and Study first — then scale
              the herd.
            </p>
            <a
              href="mailto:hello@beerahh.com?subject=BeerBahh%20bar%20partner"
              className="mt-6 inline-flex min-h-12 items-center rounded-2xl bg-field px-6 font-display font-bold text-cream"
            >
              Pitch your bar
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-muted">
        BeerBahh · Find Your Herd · Built for Clemson first
      </footer>
    </div>
  );
}
