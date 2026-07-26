"use client";

import { FormEvent, useState } from "react";

export function WaitlistForm({ variant = "hero" }: { variant?: "hero" | "inline" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done">("idle");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // Local MVP — swap for Resend / Supabase later
    const existing = JSON.parse(localStorage.getItem("beerahh-waitlist") || "[]");
    existing.push({ email: email.trim(), at: new Date().toISOString() });
    localStorage.setItem("beerahh-waitlist", JSON.stringify(existing));
    setStatus("done");
    setEmail("");
  }

  if (status === "done") {
    return (
      <p
        className={
          variant === "hero"
            ? "rounded-2xl bg-field px-5 py-4 font-display text-lg font-bold text-cream"
            : "font-semibold text-field"
        }
      >
        You&apos;re in the herd. We&apos;ll hit you when Clemson goes live.
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={
        variant === "hero"
          ? "flex w-full max-w-md flex-col gap-3 sm:flex-row"
          : "flex w-full flex-col gap-2 sm:flex-row"
      }
    >
      <label className="sr-only" htmlFor={`waitlist-${variant}`}>
        Email
      </label>
      <input
        id={`waitlist-${variant}`}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tiger@clemson.edu"
        className="min-h-12 flex-1 rounded-2xl border border-white/15 bg-panel px-4 text-base text-ink outline-none placeholder:text-muted focus:border-field"
      />
      <button
        type="submit"
        className="min-h-12 rounded-2xl bg-field px-6 font-display text-base font-bold tracking-wide text-cream transition hover:-translate-y-0.5 hover:bg-field-deep"
      >
        Join the herd
      </button>
    </form>
  );
}
