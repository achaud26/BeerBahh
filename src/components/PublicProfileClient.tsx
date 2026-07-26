"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SheepMark } from "@/components/SheepMark";

type ProfilePayload = {
  private: boolean;
  isSelf?: boolean;
  user: {
    id: string;
    username: string;
    name?: string | null;
    image?: string | null;
    bio?: string | null;
  };
  friendship: {
    id: string;
    status: string;
    direction: "incoming" | "outgoing";
  } | null;
};

export function PublicProfileClient({ username }: { username: string }) {
  const { status } = useSession();
  const [data, setData] = useState<ProfilePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch(`/api/profile/${username}`);
    if (!res.ok) {
      setError("User not found");
      return;
    }
    setData(await res.json());
  }

  useEffect(() => {
    load();
  }, [username]);

  async function addFriend() {
    setBusy(true);
    await fetch("/api/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    await load();
    setBusy(false);
  }

  async function respond(action: "accept" | "decline") {
    if (!data?.friendship?.id) return;
    setBusy(true);
    await fetch("/api/friends/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendshipId: data.friendship.id, action }),
    });
    await load();
    setBusy(false);
  }

  return (
    <div className="min-h-dvh bg-cream text-ink">
      <header className="flex items-center justify-between border-b border-white/10 bg-foam px-4 py-3">
        <Link href="/radar" className="flex items-center gap-2">
          <SheepMark size={32} />
          <span className="font-display font-black">Profile</span>
        </Link>
        <Link href="/friends" className="text-sm font-semibold text-field">
          Friends
        </Link>
      </header>

      <main className="mx-auto max-w-lg px-4 py-10">
        {error ? <p className="text-alert">{error}</p> : null}
        {!data && !error ? (
          <p className="text-muted">Loading…</p>
        ) : data ? (
          <>
            <h1 className="font-display text-3xl font-black">
              @{data.user.username}
            </h1>

            {data.private ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-panel p-5">
                <p className="font-semibold text-ink">Private profile</p>
                <p className="mt-2 text-sm text-muted">
                  Add them as a friend to see the full profile — BeerBahh stays
                  about the bars, not broadcasting everyone.
                </p>
                {status === "authenticated" && !data.isSelf ? (
                  <div className="mt-4">
                    {!data.friendship ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={addFriend}
                        className="rounded-xl bg-field px-4 py-2 text-sm font-bold text-cream"
                      >
                        Add friend
                      </button>
                    ) : data.friendship.status === "pending" &&
                      data.friendship.direction === "outgoing" ? (
                      <p className="text-sm text-muted">Request pending…</p>
                    ) : data.friendship.status === "pending" &&
                      data.friendship.direction === "incoming" ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => respond("accept")}
                          className="rounded-xl bg-field px-4 py-2 text-sm font-bold text-cream"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => respond("decline")}
                          className="rounded-xl border border-white/15 px-4 py-2 text-sm"
                        >
                          Decline
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : status === "unauthenticated" ? (
                  <Link
                    href="/login"
                    className="mt-4 inline-block text-sm font-bold text-field"
                  >
                    Log in to add friend →
                  </Link>
                ) : null}
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {data.user.name ? (
                  <p className="text-lg font-semibold">{data.user.name}</p>
                ) : null}
                <p className="text-muted">
                  {data.user.bio || "No bio yet."}
                </p>
                {data.isSelf ? (
                  <Link
                    href="/profile"
                    className="inline-block text-sm font-bold text-field"
                  >
                    Edit profile →
                  </Link>
                ) : (
                  <p className="text-xs font-semibold uppercase tracking-wider text-field">
                    Friends · full profile unlocked
                  </p>
                )}
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}
