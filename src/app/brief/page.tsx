"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { SheepMark } from "@/components/SheepMark";

type BriefAnswers = Record<string, string>;

const SECTIONS: {
  id: string;
  title: string;
  blurb: string;
  questions: { id: string; label: string; placeholder: string }[];
}[] = [
  {
    id: "vision",
    title: "1. Vision & vibe",
    blurb: "What BeerBahh should feel like in your head.",
    questions: [
      {
        id: "north_star",
        label: "In one sentence, what is BeerBahh?",
        placeholder: "e.g. The nightlife radar that tells Clemson where the herd is tonight…",
      },
      {
        id: "mission_feel",
        label: "When someone opens the app Friday at 9pm, what should they feel?",
        placeholder: "Confident? Hyped? In on the joke? FOMO cured?",
      },
      {
        id: "anti_product",
        label: "What should BeerBahh NEVER feel like?",
        placeholder: "Corporate, try-hard startup, creepy, cluttered, etc.",
      },
      {
        id: "competitors",
        label: "Anything students use today instead (GroupMe, Instagram, word of mouth)? What sucks about that?",
        placeholder: "",
      },
    ],
  },
  {
    id: "users",
    title: "2. Who it's for",
    blurb: "Primary users, secondary users, who we ignore for now.",
    questions: [
      {
        id: "primary_user",
        label: "Who is the #1 user? (year, Greek/non-Greek, personality)",
        placeholder: "",
      },
      {
        id: "secondary_users",
        label: "Who else matters later? (alumni, visitors, bars, bouncers)",
        placeholder: "",
      },
      {
        id: "not_for",
        label: "Who is this NOT for in v1?",
        placeholder: "",
      },
      {
        id: "launch_crew",
        label: "Your first 50–100 users — where do they come from? (dorm, frat, friend group)",
        placeholder: "",
      },
    ],
  },
  {
    id: "features",
    title: "3. Features — must / maybe / never",
    blurb: "Be ruthless. This drives what we build next.",
    questions: [
      {
        id: "must_have",
        label: "MUST have at launch (list everything that would make it feel incomplete without)",
        placeholder: "Map, crowd levels, deals, chat…",
      },
      {
        id: "nice_to_have",
        label: "Nice-to-have soon after launch",
        placeholder: "Push alerts, bar profiles, photos…",
      },
      {
        id: "later",
        label: "Cool ideas for later / expansion towns",
        placeholder: "",
      },
      {
        id: "never",
        label: "Hard no / too risky / not our brand (e.g. cop alerts? dating?)",
        placeholder: "",
      },
      {
        id: "crowd_source",
        label: "How should crowd levels get updated? (users tap, chat votes, bar staff, you, auto?)",
        placeholder: "",
      },
      {
        id: "chat_rules",
        label: "Bar chat rules — anonymous? usernames? moderated? age gate?",
        placeholder: "",
      },
    ],
  },
  {
    id: "bars",
    title: "4. Bars & content",
    blurb: "The other side of the marketplace.",
    questions: [
      {
        id: "bar_list_complete",
        label: "Any more Clemson spots to add/remove? Correct names/nicknames?",
        placeholder: "",
      },
      {
        id: "bar_pitch",
        label: "Your real pitch to a bar owner in 2–3 sentences",
        placeholder: "",
      },
      {
        id: "bar_tools",
        label: "What should bars be able to edit themselves? (deals, cover, closed tonight, photos)",
        placeholder: "",
      },
      {
        id: "first_3_bars",
        label: "Which 3 bars will you lock first, and why?",
        placeholder: "",
      },
    ],
  },
  {
    id: "brand",
    title: "5. Brand & design",
    blurb: "So the product looks like it lives in your head.",
    questions: [
      {
        id: "logo_pick",
        label: "Logo direction: Cool Sheep / Sheep in Glass / Minimal Mascot / mix? Describe what you see.",
        placeholder: "",
      },
      {
        id: "colors",
        label: "Colors — keep green/yellow/black, or tweak? Any Clemson-orange vibes or hard avoid?",
        placeholder: "",
      },
      {
        id: "voice_examples",
        label: "3 example lines in BeerBahh voice (notifications, empty states, errors)",
        placeholder: 'e.g. "Esso just went packed. Move your feet."',
      },
      {
        id: "refs",
        label: "Apps/sites whose vibe you love (and why)",
        placeholder: "Duolingo, Venmo, Letterboxd, etc.",
      },
      {
        id: "hate_refs",
        label: "Apps/sites whose vibe you hate for this",
        placeholder: "",
      },
    ],
  },
  {
    id: "product_ux",
    title: "6. Product & screens",
    blurb: "How the app should actually work night-of.",
    questions: [
      {
        id: "home_screen",
        label: "What is the FIRST screen after open — map, list, or something else?",
        placeholder: "",
      },
      {
        id: "night_flow",
        label: "Walk me through a perfect Friday: open app → … → walk into a bar",
        placeholder: "",
      },
      {
        id: "accounts",
        label: "Accounts at launch? (none / email / Google / school email only / Instagram)",
        placeholder: "",
      },
      {
        id: "mobile_first",
        label: "Web app on phone first, or native iOS ASAP? Android matter?",
        placeholder: "",
      },
      {
        id: "notifications",
        label: "What push/SMS alerts would you actually want as a student?",
        placeholder: "",
      },
    ],
  },
  {
    id: "gtm",
    title: "7. Go-to-market & launch",
    blurb: "Clemson first — make the rollout real.",
    questions: [
      {
        id: "launch_date",
        label: "Ideal launch window (semester, football weekend, etc.)",
        placeholder: "",
      },
      {
        id: "hype",
        label: "Pre-launch hype plan — IG/TikTok/Snap ideas you already have",
        placeholder: "",
      },
      {
        id: "assets",
        label: "Your real assets: frats, bouncers, dorms, group chats — be specific",
        placeholder: "",
      },
      {
        id: "success_metric",
        label: "What number means launch worked? (DAU, bars signed, chats posted?)",
        placeholder: "",
      },
    ],
  },
  {
    id: "business",
    title: "8. Business & money",
    blurb: "Can stay fuzzy — just plant the flag.",
    questions: [
      {
        id: "free_until",
        label: "Free for how long? For students? For bars?",
        placeholder: "",
      },
      {
        id: "monetize_later",
        label: "How might you make money later? (promoted deals, boosts, events, merch)",
        placeholder: "",
      },
      {
        id: "budget",
        label: "Any real budget for domain, hosting, ads, design? Ballpark ok.",
        placeholder: "",
      },
    ],
  },
  {
    id: "team_ops",
    title: "9. Team & ops",
    blurb: "Who does what when it's live at midnight.",
    questions: [
      {
        id: "solo_vs_team",
        label: "Still solo for now, or co-founder / marketing help coming?",
        placeholder: "",
      },
      {
        id: "moderation",
        label: "Who moderates chat / bad intel on a Saturday night — you?",
        placeholder: "",
      },
      {
        id: "time_per_week",
        label: "Hours/week you can put into building + hustling bars",
        placeholder: "",
      },
    ],
  },
  {
    id: "wishlist",
    title: "10. Brain dump",
    blurb: "Anything else stuck in your head — random features, names, fears, jokes.",
    questions: [
      {
        id: "wild_ideas",
        label: "Wild ideas that might be genius (or dumb — write them anyway)",
        placeholder: "",
      },
      {
        id: "fears",
        label: "Biggest fear about launching this",
        placeholder: "",
      },
      {
        id: "perfect_night",
        label: "Describe the perfect BeerBahh night from a user's POV (short story)",
        placeholder: "",
      },
      {
        id: "anything_else",
        label: "Anything else I should know before the next build pass?",
        placeholder: "",
      },
    ],
  },
];

const STORAGE_KEY = "beerahh-product-brief";

export default function BriefPage() {
  const [answers, setAnswers] = useState<BriefAnswers>({});
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setAnswers(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers, loaded]);

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function buildExportText() {
    const lines: string[] = ["# BeerBahh product brief", ""];
    for (const section of SECTIONS) {
      lines.push(`## ${section.title}`, "");
      for (const q of section.questions) {
        lines.push(`### ${q.label}`);
        lines.push(answers[q.id]?.trim() || "_(no answer)_");
        lines.push("");
      }
    }
    return lines.join("\n");
  }

  async function copyAll(e?: FormEvent) {
    e?.preventDefault();
    const text = buildExportText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback: select-friendly alert
      window.prompt("Copy your answers:", text);
    }
  }

  function clearAll() {
    if (!confirm("Clear all saved answers on this device?")) return;
    setAnswers({});
    localStorage.removeItem(STORAGE_KEY);
  }

  const filled = Object.values(answers).filter((v) => v.trim()).length;
  const total = SECTIONS.reduce((n, s) => n + s.questions.length, 0);

  return (
    <div className="min-h-dvh bg-cream text-ink">
      <header className="sticky top-0 z-20 border-b-2 border-ink bg-foam/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <SheepMark size={32} />
            <span className="font-display text-lg font-black">
              Beer<span className="text-field">Bahh</span> brief
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs font-semibold text-muted sm:inline">
              {filled}/{total} answered
            </span>
            <button
              type="button"
              onClick={() => copyAll()}
              className="rounded-xl bg-field px-3 py-2 text-sm font-bold text-cream"
            >
              {copied ? "Copied ✓" : "Copy all answers"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-display text-3xl font-black sm:text-4xl">
          Dump everything in your head
        </h1>
        <p className="mt-3 text-muted">
          Fill this out whenever — answers auto-save in your browser. When
          you&apos;re done, hit <strong className="text-ink">Copy all answers</strong>{" "}
          and paste them back in chat so we can build BeerBahh exactly how you
          picture it.
        </p>

        <form className="mt-10 space-y-12" onSubmit={copyAll}>
          {SECTIONS.map((section) => (
            <section key={section.id} className="scroll-mt-24">
              <h2 className="font-display text-2xl font-bold text-ink">
                {section.title}
              </h2>
              <p className="mt-1 text-sm text-muted">{section.blurb}</p>
              <div className="mt-5 space-y-6">
                {section.questions.map((q) => (
                  <label key={q.id} className="block">
                    <span className="text-sm font-semibold text-ink">
                      {q.label}
                    </span>
                    <textarea
                      value={answers[q.id] ?? ""}
                      onChange={(e) => setAnswer(q.id, e.target.value)}
                      placeholder={q.placeholder}
                      rows={3}
                      className="mt-2 w-full resize-y rounded-2xl border border-white/15 bg-panel px-4 py-3 text-sm leading-relaxed outline-none placeholder:text-muted/70 focus:border-field"
                    />
                  </label>
                ))}
              </div>
            </section>
          ))}

          <div className="flex flex-wrap items-center gap-3 border-t-2 border-ink/10 pt-8 pb-16">
            <button
              type="submit"
              className="rounded-2xl bg-field px-6 py-3 font-display font-bold text-foam hover:bg-field-deep"
            >
              {copied ? "Copied — paste in chat" : "Copy all answers"}
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="rounded-2xl border-2 border-ink/20 px-4 py-3 text-sm font-semibold text-muted hover:border-ink hover:text-ink"
            >
              Clear form
            </button>
            <Link
              href="/radar"
              className="text-sm font-semibold text-field-deep underline-offset-2 hover:underline"
            >
              ← Back to radar
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
