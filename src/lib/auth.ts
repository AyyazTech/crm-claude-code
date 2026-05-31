import { cache } from "react";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  signSession,
  verifySession,
} from "@/lib/session";

/** Set the signed session cookie for a user. */
export async function createSession(userId: string) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const token = signSession({ userId, exp });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * The current logged-in user (or null). Memoized per request via React cache so
 * repeated calls in a render pass hit the DB once.
 */
export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const payload = verifySession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!payload) return null;

  return prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, username: true },
  });
});
