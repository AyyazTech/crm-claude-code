import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

// Next 16 renamed Middleware to Proxy; it now runs on the Node.js runtime, so
// the node:crypto-based session verification works here.

const PUBLIC_PATHS = ["/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const session = verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  // Gate every non-public route behind a valid session.
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // Keep logged-in users out of the login page.
  if (session && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Run on all routes except API, Next internals, and static files (with a dot).
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
