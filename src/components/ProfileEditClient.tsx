"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SheepMark } from "@/components/SheepMark";

export function ProfileEditClient() {
  const { data: session, status, update } = useSession();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) return;
    setName(session.user.name ?? "");
    setUsername(session.user.username ?? "");
    // load bio
    if (session.user.username) {
      fetch(`/api/profile/${session.user.username}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.user?.bio) setBio(d.user.bio);
        })
        .catch(() => undefined);
    }
  }, [session?.user]);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, bio }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Couldn’t save");
      return;
    }
    await update({
      username: data.user.username,
      name: data.user.name,
    });
    setSaved(true);
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-cream text-field">
        Loading…
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-cream">
        <Link href="/login" className="font-bold text-field">
          Log in →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-cream text-ink">
      <header className="flex items-center justify-between border-b border-white/10 bg-foam px-4 py-3">
        <Link href="/radar" className="flex items-center gap-2">
          <SheepMark size={32} />
          <span className="font-display font-black">Your profile</span>
        </Link>
        <Link href="/friends" className="text-sm font-semibold text-field">
          Friends
        </Link>
      </header>

      <main className="mx-auto max-w-lg px-4 py-8">
        <p className="text-sm text-muted">
          Private by default — only friends see your full profile.
        </p>
        <form onSubmit={onSave} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Display name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/15 bg-panel px-4 py-3 outline-none focus:border-field"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Username
            </span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/15 bg-panel px-4 py-3 outline-none focus:border-field"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Bio
            </span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={160}
              placeholder="Where’s the herd finding you?"
              className="mt-1 w-full rounded-2xl border border-white/15 bg-panel px-4 py-3 outline-none focus:border-field"
            />
          </label>
          {error ? <p className="text-sm text-alert">{error}</p> : null}
          {saved ? <p className="text-sm text-field">Saved.</p> : null}
          <button
            type="submit"
            className="min-h-12 w-full rounded-2xl bg-field font-display font-bold text-cream"
          >
            Save profile
          </button>
        </form>
        {username ? (
          <Link
            href={`/u/${username}`}
            className="mt-6 inline-block text-sm font-semibold text-field"
          >
            View public URL →
          </Link>
        ) : null}
      </main>
    </div>
  );
}
