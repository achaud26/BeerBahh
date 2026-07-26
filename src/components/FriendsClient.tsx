"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SheepMark } from "@/components/SheepMark";

type UserLite = {
  id: string;
  username: string | null;
  name: string | null;
  image: string | null;
};

export function FriendsClient() {
  const { data: session, status } = useSession();
  const [friends, setFriends] = useState<UserLite[]>([]);
  const [incoming, setIncoming] = useState<{ id: string; user: UserLite }[]>(
    [],
  );
  const [outgoing, setOutgoing] = useState<{ id: string; user: UserLite }[]>(
    [],
  );
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserLite[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/friends");
    if (!res.ok) return;
    const data = await res.json();
    setFriends(data.friends ?? []);
    setIncoming(data.incoming ?? []);
    setOutgoing(data.outgoing ?? []);
  }, []);

  useEffect(() => {
    if (status === "authenticated") load();
  }, [status, load]);

  useEffect(() => {
    if (query.trim().length < 1) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      const res = await fetch(
        `/api/users/search?q=${encodeURIComponent(query.trim())}`,
      );
      if (!res.ok) return;
      const data = await res.json();
      setResults(data.users ?? []);
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  async function sendRequest(username: string) {
    setMessage(null);
    const res = await fetch("/api/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Couldn’t send request");
      return;
    }
    setMessage(
      data.autoAccepted
        ? `You’re now friends with @${username}`
        : `Request sent to @${username}`,
    );
    setQuery("");
    setResults([]);
    load();
  }

  async function respond(friendshipId: string, action: "accept" | "decline") {
    await fetch("/api/friends/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendshipId, action }),
    });
    load();
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
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-cream px-5">
        <p className="text-muted">Sign in to manage friends.</p>
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
          <span className="font-display font-black">Friends</span>
        </Link>
        <Link href="/profile" className="text-sm font-semibold text-field">
          @{session?.user?.username ?? "you"}
        </Link>
      </header>

      <main className="mx-auto max-w-lg space-y-8 px-4 py-8">
        <section>
          <h1 className="font-display text-2xl font-bold">Find your herd</h1>
          <p className="mt-1 text-sm text-muted">
            Profiles stay private until you’re friends.
          </p>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search username…"
            className="mt-4 w-full rounded-2xl border border-white/15 bg-panel px-4 py-3 outline-none focus:border-field"
          />
          {message ? (
            <p className="mt-2 text-sm text-field">{message}</p>
          ) : null}
          <ul className="mt-3 space-y-2">
            {results.map((u) => (
              <li
                key={u.id}
                className="flex items-center justify-between rounded-2xl bg-panel px-4 py-3"
              >
                <Link
                  href={`/u/${u.username}`}
                  className="font-semibold text-ink hover:text-field"
                >
                  @{u.username}
                </Link>
                <button
                  type="button"
                  onClick={() => u.username && sendRequest(u.username)}
                  className="rounded-xl bg-field px-3 py-1.5 text-sm font-bold text-cream"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        </section>

        {incoming.length > 0 ? (
          <section>
            <h2 className="font-display text-lg font-bold">Requests</h2>
            <ul className="mt-3 space-y-2">
              {incoming.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-2 rounded-2xl bg-panel px-4 py-3"
                >
                  <span className="font-semibold">@{r.user.username}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => respond(r.id, "accept")}
                      className="rounded-xl bg-field px-3 py-1.5 text-sm font-bold text-cream"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => respond(r.id, "decline")}
                      className="rounded-xl border border-white/15 px-3 py-1.5 text-sm"
                    >
                      Decline
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {outgoing.length > 0 ? (
          <section>
            <h2 className="font-display text-lg font-bold">Outgoing</h2>
            <ul className="mt-3 space-y-2">
              {outgoing.map((r) => (
                <li
                  key={r.id}
                  className="rounded-2xl bg-panel px-4 py-3 text-sm text-muted"
                >
                  Waiting on @{r.user.username}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section>
          <h2 className="font-display text-lg font-bold">
            Friends ({friends.length})
          </h2>
          {friends.length === 0 ? (
            <p className="mt-2 text-sm text-muted">
              No friends yet — search a username above.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {friends.map((f) => (
                <li key={f.id}>
                  <Link
                    href={`/u/${f.username}`}
                    className="block rounded-2xl bg-panel px-4 py-3 font-semibold hover:border-field"
                  >
                    @{f.username}
                    {f.name ? (
                      <span className="ml-2 font-normal text-muted">
                        {f.name}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <QuickAdd onAdd={sendRequest} />
      </main>
    </div>
  );
}

function QuickAdd({ onAdd }: { onAdd: (username: string) => void }) {
  const [value, setValue] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value.trim().toLowerCase());
    setValue("");
  }
  return (
    <form onSubmit={submit} className="flex gap-2 border-t border-white/10 pt-6">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Exact username"
        className="min-h-11 flex-1 rounded-xl border border-white/15 bg-panel px-3 text-sm outline-none focus:border-field"
      />
      <button
        type="submit"
        className="rounded-xl bg-panel px-4 text-sm font-bold text-field"
      >
        Add
      </button>
    </form>
  );
}
