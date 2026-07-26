"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { SheepMark } from "@/components/SheepMark";

type LoginGateProps = {
  googleEnabled?: boolean;
  callbackUrl?: string;
};

export function LoginGate({
  googleEnabled = false,
  callbackUrl = "/radar",
}: LoginGateProps) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onDevLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("dev-login", {
      username,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (res?.error) {
      setError("Couldn’t sign in — try a different username.");
      return;
    }
    window.location.href = callbackUrl;
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-cream px-5 text-ink">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-1/4 size-[420px] -translate-x-1/2 rounded-full bg-field/20 blur-3xl" />
      </div>

      <SheepMark size={96} className="animate-herd-bounce" />
      <h1 className="mt-6 font-display text-4xl font-black tracking-tight">
        Beer<span className="text-field">Bahh</span>
      </h1>
      <p className="mt-2 max-w-sm text-center text-lg text-muted">
        The WAZE of going out. Sign in to find your herd.
      </p>

      {googleEnabled ? (
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          className="mt-10 flex min-h-12 w-full max-w-sm items-center justify-center gap-3 rounded-2xl border border-white/20 bg-foam px-5 font-semibold text-ink transition hover:border-field"
        >
          <GoogleGlyph />
          Continue with Google
        </button>
      ) : (
        <p className="mt-8 max-w-sm rounded-2xl border border-highlight/30 bg-panel px-4 py-3 text-center text-xs text-muted">
          Google OAuth not configured yet — use a username below to test
          profiles & friends. Add keys in{" "}
          <code className="text-field">.env</code> (see AUTH.md).
        </p>
      )}

      <form
        onSubmit={onDevLogin}
        className="mt-6 flex w-full max-w-sm flex-col gap-3"
      >
        <label className="text-xs font-semibold uppercase tracking-wider text-muted">
          {googleEnabled ? "Or quick username (dev)" : "Pick a username"}
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. tiger_ameya"
          required
          minLength={2}
          className="min-h-12 rounded-2xl border border-white/15 bg-panel px-4 text-ink outline-none placeholder:text-muted focus:border-field"
        />
        <button
          type="submit"
          disabled={loading}
          className="min-h-12 rounded-2xl bg-field font-display font-bold text-cream hover:bg-field-deep disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Continue"}
        </button>
        {error ? <p className="text-sm text-alert">{error}</p> : null}
      </form>

      <p className="mt-4 max-w-sm text-center text-xs text-muted">
        Profiles stay private unless you add friends. Open two browsers with
        different usernames to test the friend flow.
      </p>

      <Link
        href="/"
        className="mt-8 text-sm font-semibold text-field underline-offset-2 hover:underline"
      >
        ← Back to landing
      </Link>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16.1 19 12 24 12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l.1.1 6.2 5.2C39.2 37.3 44 32 44 24c0-1.3-.1-2.5-.4-3.5z"
      />
    </svg>
  );
}
