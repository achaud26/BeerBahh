import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { googleConfigured } from "@/lib/auth-flags";
import {
  findUserById,
  slugUsername,
  upsertDevUser,
  upsertGoogleUser,
} from "@/lib/store";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    ...(googleConfigured
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
          }),
        ]
      : []),
    Credentials({
      id: "dev-login",
      name: "Dev login",
      credentials: {
        username: { label: "Username", type: "text" },
      },
      async authorize(credentials) {
        const raw = credentials?.username?.toString().trim() ?? "";
        if (raw.length < 2) return null;
        const user = await upsertDevUser(slugUsername(raw));
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const email = user.email || profile?.email;
        if (!email || !account.providerAccountId) return false;
        const stored = await upsertGoogleUser({
          email,
          name: user.name ?? profile?.name ?? null,
          image: user.image ?? null,
          providerAccountId: account.providerAccountId,
        });
        user.id = stored.id;
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user?.id) {
        token.sub = user.id;
      }

      // After Google sign-in, resolve our store user id via email
      if (account?.provider === "google" && user?.email) {
        const stored = await upsertGoogleUser({
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
          providerAccountId: account.providerAccountId,
        });
        token.sub = stored.id;
        token.username = stored.username ?? undefined;
        token.name = stored.name ?? undefined;
        token.picture = stored.image ?? undefined;
      }

      if (token.sub && !token.username) {
        const dbUser = await findUserById(token.sub);
        if (dbUser) {
          token.username = dbUser.username ?? undefined;
          token.name = dbUser.name ?? token.name;
          token.picture = dbUser.image ?? token.picture;
        }
      }

      if (trigger === "update" && session) {
        if (typeof session.username === "string") {
          token.username = session.username;
        }
        if (typeof session.name === "string") {
          token.name = session.name;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.username = (token.username as string | undefined) ?? null;
        if (token.name) session.user.name = token.name as string;
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    },
  },
  trustHost: true,
});
