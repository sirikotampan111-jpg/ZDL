import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Brute-force protection on the credentials flow.
 * Two independent buckets: per-account (targeted) and per-IP (spray).
 * Both must allow the attempt, otherwise authorize() returns null.
 */
const LOGIN_ACCOUNT = { limit: 5, windowMs: 10 * 60 * 1000 };
const LOGIN_IP = { limit: 30, windowMs: 10 * 60 * 1000 };

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24 hours
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "ZDL Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const ip =
          req?.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
        const acct = rateLimit(`login:acct:${email.toLowerCase()}`, LOGIN_ACCOUNT);
        const perIp = rateLimit(`login:ip:${ip}`, LOGIN_IP);
        if (!acct.ok || !perIp.ok) return null;

        const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
        if (!user) return null;
        const valid = await compare(password, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name || "ZDL Admin" };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
