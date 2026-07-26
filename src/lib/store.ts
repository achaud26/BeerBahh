import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export type StoreUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  username: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StoreFriendship = {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  updatedAt: string;
};

export type StoreAccount = {
  id: string;
  userId: string;
  provider: string;
  providerAccountId: string;
};

export type StoreChatMessage = {
  id: string;
  barId: string;
  userId: string;
  author: string;
  text: string;
  createdAt: string;
  system?: boolean;
};

type StoreData = {
  users: StoreUser[];
  friendships: StoreFriendship[];
  accounts: StoreAccount[];
  messages: StoreChatMessage[];
  crowdOverrides: Record<string, string>;
};

const STORE_PATH = path.join(process.cwd(), "data", "store.json");

const emptyStore = (): StoreData => ({
  users: [],
  friendships: [],
  accounts: [],
  messages: [],
  crowdOverrides: {},
});

let writeQueue: Promise<void> = Promise.resolve();

function normalizeStore(raw: Partial<StoreData>): StoreData {
  return {
    users: raw.users ?? [],
    friendships: raw.friendships ?? [],
    accounts: raw.accounts ?? [],
    messages: raw.messages ?? [],
    crowdOverrides: raw.crowdOverrides ?? {},
  };
}

async function readStore(): Promise<StoreData> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    return normalizeStore(JSON.parse(raw) as Partial<StoreData>);
  } catch {
    return emptyStore();
  }
}

async function writeStore(data: StoreData) {
  writeQueue = writeQueue.then(async () => {
    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
  });
  await writeQueue;
}

async function updateStore<T>(fn: (data: StoreData) => T | Promise<T>): Promise<T> {
  const data = await readStore();
  const result = await fn(data);
  await writeStore(data);
  return result;
}

export function slugUsername(raw: string) {
  const cleaned = raw
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 16);
  return cleaned || "tiger";
}

export async function uniqueUsername(base: string, exceptUserId?: string) {
  const data = await readStore();
  let username = slugUsername(base);
  let n = 0;
  while (
    data.users.some(
      (u) => u.username === username && u.id !== exceptUserId,
    )
  ) {
    n += 1;
    username = `${slugUsername(base).slice(0, 12)}${n}`;
  }
  return username;
}

export async function findUserById(id: string) {
  const data = await readStore();
  return data.users.find((u) => u.id === id) ?? null;
}

export async function findUserByEmail(email: string) {
  const data = await readStore();
  return data.users.find((u) => u.email === email) ?? null;
}

export async function findUserByUsername(username: string) {
  const data = await readStore();
  const key = username.toLowerCase();
  return data.users.find((u) => u.username === key) ?? null;
}

export async function searchUsers(q: string, excludeId: string, take = 12) {
  const data = await readStore();
  const query = q.toLowerCase();
  return data.users
    .filter(
      (u) =>
        u.id !== excludeId &&
        ((u.username && u.username.includes(query)) ||
          (u.name && u.name.toLowerCase().includes(query))),
    )
    .slice(0, take)
    .map((u) => ({
      id: u.id,
      username: u.username,
      name: u.name,
      image: u.image,
    }));
}

export async function upsertDevUser(usernameRaw: string) {
  const username = slugUsername(usernameRaw);
  return updateStore((data) => {
    let user = data.users.find((u) => u.username === username);
    if (!user) {
      const now = new Date().toISOString();
      user = {
        id: randomUUID(),
        username,
        name: username,
        email: `${username}@dev.beerahh.local`,
        image: null,
        bio: null,
        createdAt: now,
        updatedAt: now,
      };
      data.users.push(user);
    }
    return user;
  });
}

export async function upsertGoogleUser(input: {
  email: string;
  name?: string | null;
  image?: string | null;
  providerAccountId: string;
}) {
  return updateStore(async (data) => {
    const now = new Date().toISOString();
    let account = data.accounts.find(
      (a) =>
        a.provider === "google" &&
        a.providerAccountId === input.providerAccountId,
    );
    let user = account
      ? data.users.find((u) => u.id === account!.userId)
      : data.users.find((u) => u.email === input.email);

    if (!user) {
      const base = input.email.split("@")[0] || input.name || "tiger";
      let username = slugUsername(base);
      let n = 0;
      while (data.users.some((u) => u.username === username)) {
        n += 1;
        username = `${slugUsername(base).slice(0, 12)}${n}`;
      }
      user = {
        id: randomUUID(),
        email: input.email,
        name: input.name ?? null,
        image: input.image ?? null,
        username,
        bio: null,
        createdAt: now,
        updatedAt: now,
      };
      data.users.push(user);
    } else {
      user.name = input.name ?? user.name;
      user.image = input.image ?? user.image;
      user.email = input.email;
      user.updatedAt = now;
      if (!user.username) {
        const base = input.email.split("@")[0] || "tiger";
        let username = slugUsername(base);
        let n = 0;
        while (
          data.users.some((u) => u.username === username && u.id !== user!.id)
        ) {
          n += 1;
          username = `${slugUsername(base).slice(0, 12)}${n}`;
        }
        user.username = username;
      }
    }

    if (!account) {
      account = {
        id: randomUUID(),
        userId: user.id,
        provider: "google",
        providerAccountId: input.providerAccountId,
      };
      data.accounts.push(account);
    } else {
      account.userId = user.id;
    }

    return user;
  });
}

export async function updateUser(
  userId: string,
  patch: Partial<Pick<StoreUser, "name" | "username" | "bio">>,
) {
  return updateStore((data) => {
    const user = data.users.find((u) => u.id === userId);
    if (!user) return null;
    if (patch.name !== undefined) user.name = patch.name;
    if (patch.bio !== undefined) user.bio = patch.bio;
    if (patch.username !== undefined) {
      if (
        data.users.some(
          (u) => u.username === patch.username && u.id !== userId,
        )
      ) {
        throw new Error("USERNAME_TAKEN");
      }
      user.username = patch.username;
    }
    user.updatedAt = new Date().toISOString();
    return user;
  });
}

export async function friendshipBetween(userA: string, userB: string) {
  const data = await readStore();
  return (
    data.friendships.find(
      (f) =>
        (f.requesterId === userA && f.addresseeId === userB) ||
        (f.requesterId === userB && f.addresseeId === userA),
    ) ?? null
  );
}

export async function areFriends(userA: string, userB: string) {
  if (userA === userB) return true;
  const row = await friendshipBetween(userA, userB);
  return row?.status === "accepted";
}

export async function listFriendData(me: string) {
  const data = await readStore();
  const accepted = data.friendships.filter(
    (f) =>
      f.status === "accepted" &&
      (f.requesterId === me || f.addresseeId === me),
  );
  const incoming = data.friendships.filter(
    (f) => f.addresseeId === me && f.status === "pending",
  );
  const outgoing = data.friendships.filter(
    (f) => f.requesterId === me && f.status === "pending",
  );

  const userMap = Object.fromEntries(data.users.map((u) => [u.id, u]));
  const lite = (id: string) => {
    const u = userMap[id];
    return u
      ? {
          id: u.id,
          username: u.username,
          name: u.name,
          image: u.image,
        }
      : null;
  };

  return {
    friends: accepted
      .map((f) => lite(f.requesterId === me ? f.addresseeId : f.requesterId))
      .filter(Boolean),
    incoming: incoming
      .map((f) => ({ id: f.id, user: lite(f.requesterId) }))
      .filter((x) => x.user),
    outgoing: outgoing
      .map((f) => ({ id: f.id, user: lite(f.addresseeId) }))
      .filter((x) => x.user),
  };
}

export async function createFriendRequest(requesterId: string, username: string) {
  return updateStore((data) => {
    const target = data.users.find((u) => u.username === username.toLowerCase());
    if (!target) return { error: "User not found" as const };
    if (target.id === requesterId) return { error: "Can't friend yourself" as const };

    const existing = data.friendships.find(
      (f) =>
        (f.requesterId === requesterId && f.addresseeId === target.id) ||
        (f.requesterId === target.id && f.addresseeId === requesterId),
    );

    if (existing) {
      if (existing.status === "accepted") {
        return { error: "Already friends" as const };
      }
      if (
        existing.status === "pending" &&
        existing.addresseeId === requesterId
      ) {
        existing.status = "accepted";
        existing.updatedAt = new Date().toISOString();
        return { friendship: existing, autoAccepted: true };
      }
      return { error: "Request already pending" as const };
    }

    const now = new Date().toISOString();
    const friendship: StoreFriendship = {
      id: randomUUID(),
      requesterId,
      addresseeId: target.id,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
    data.friendships.push(friendship);
    return { friendship, autoAccepted: false };
  });
}

export async function respondFriendRequest(
  friendshipId: string,
  addresseeId: string,
  action: "accept" | "decline",
) {
  return updateStore((data) => {
    const row = data.friendships.find((f) => f.id === friendshipId);
    if (!row || row.addresseeId !== addresseeId) {
      return { error: "Not found" as const };
    }
    if (action === "decline") {
      data.friendships = data.friendships.filter((f) => f.id !== friendshipId);
      return { ok: true as const, status: "declined" as const };
    }
    row.status = "accepted";
    row.updatedAt = new Date().toISOString();
    return { friendship: row };
  });
}

export async function listBarChat(barId: string, limit = 80) {
  const data = await readStore();
  return data.messages
    .filter((m) => m.barId === barId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    .slice(-limit);
}

export async function postBarChat(input: {
  barId: string;
  userId: string;
  author: string;
  text: string;
  crowdHint?: string | null;
}) {
  return updateStore((data) => {
    const now = new Date().toISOString();
    // Rate limit: same user same bar within 2s
    const recent = [...data.messages]
      .reverse()
      .find((m) => m.barId === input.barId && m.userId === input.userId);
    if (
      recent &&
      Date.now() - new Date(recent.createdAt).getTime() < 2000
    ) {
      return { error: "Slow down — chat is live, not a spam cannon." as const };
    }

    const message: StoreChatMessage = {
      id: randomUUID(),
      barId: input.barId,
      userId: input.userId,
      author: input.author,
      text: input.text,
      createdAt: now,
    };
    data.messages.push(message);

    // Keep last 500 messages globally
    if (data.messages.length > 500) {
      data.messages = data.messages.slice(-500);
    }

    if (input.crowdHint) {
      data.crowdOverrides[input.barId] = input.crowdHint;
      data.messages.push({
        id: randomUUID(),
        barId: input.barId,
        userId: "system",
        author: "beerahh_mod",
        text: `Crowd update → ${input.crowdHint}`,
        createdAt: new Date().toISOString(),
        system: true,
      });
    }

    return { message, crowd: data.crowdOverrides[input.barId] ?? null };
  });
}

export async function getCrowdOverrides() {
  const data = await readStore();
  return data.crowdOverrides;
}

export async function ensureSeedChat(
  barId: string,
  seeds: { author: string; text: string; minutesAgo: number }[],
) {
  return updateStore((data) => {
    const existing = data.messages.some((m) => m.barId === barId);
    if (existing || seeds.length === 0) return false;
    const now = Date.now();
    for (const s of seeds) {
      data.messages.push({
        id: randomUUID(),
        barId,
        userId: "seed",
        author: s.author,
        text: s.text,
        createdAt: new Date(now - s.minutesAgo * 60_000).toISOString(),
      });
    }
    return true;
  });
}
