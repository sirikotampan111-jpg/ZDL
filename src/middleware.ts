import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

/**
 * Two concerns in one middleware:
 *
 * 1. /admin/*  → delegated to NextAuth withAuth (login gate).
 * 2. Locale routing:
 *    - Indonesian = canonical bare URLs (/portfolio, /journal, ...)
 *    - English    = /en-prefixed URLs, rewritten to the same page with
 *      an `x-zdl-locale: en` request header (read by src/i18n/server.ts).
 *    - Visitors whose zdl-lang cookie (or browser Accept-Language, for the
 *      homepage) prefers English get redirected to the /en equivalent.
 */

const LANG_COOKIE = "zdl-lang";

function wantsEnglish(req: NextRequest): boolean {
  const cookie = req.cookies.get(LANG_COOKIE)?.value;
  if (cookie === "en") return true;
  if (cookie === "id") return false;
  // No explicit preference: sniff the browser language on the homepage only,
  // so crawlers and deep links always get the canonical Indonesian page.
  const al = req.headers.get("accept-language")?.toLowerCase() ?? "";
  return al.split(",")[0]?.trim().startsWith("en") ?? false;
}

function handleLocale(req: NextRequest): NextResponse {
  const { pathname, search } = req.nextUrl;

  // After a /en rewrite, Next re-runs middleware on the rewritten bare path.
  // The x-zdl-locale request header marks "already localized" — pass through
  // (this also prevents cookie-based redirect loops).
  if (req.headers.get("x-zdl-locale")) {
    return NextResponse.next();
  }

  // English-prefixed path → rewrite to the bare page with the locale header.
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const bare = pathname === "/en" ? "/" : pathname.slice(3);
    const url = req.nextUrl.clone();
    url.pathname = bare === "" ? "/" : bare;
    const headers = new Headers(req.headers);
    headers.set("x-zdl-locale", "en");
    return NextResponse.rewrite(url, { request: { headers } });
  }

  // Legacy /id prefix → canonical bare URL (SEO: one canonical form).
  if (pathname === "/id" || pathname.startsWith("/id/")) {
    const bare = pathname === "/id" ? "/" : pathname.slice(3);
    const url = req.nextUrl.clone();
    url.pathname = bare === "" ? "/" : bare;
    return NextResponse.redirect(url, 308);
  }

  // Bare path: redirect English-preferring visitors to /en (homepage +
  // any path, but only when the cookie says en — Accept-Language only
  // triggers on "/" to avoid surprising crawlers on deep links).
  const cookie = req.cookies.get(LANG_COOKIE)?.value;
  const alEn = req.headers.get("accept-language")?.toLowerCase().split(",")[0]?.trim().startsWith("en") ?? false;
  const shouldRedirect = cookie === "en" || (cookie === undefined && pathname === "/" && alEn);
  if (shouldRedirect) {
    const url = req.nextUrl.clone();
    url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
    url.search = search;
    return NextResponse.redirect(url, 307);
  }

  // Default: Indonesian (no header needed — server defaults to "id").
  return NextResponse.next();
}

export default function middleware(req: NextRequest, event: unknown) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin")) {
    return withAuth(req, event as never);
  }
  return handleLocale(req);
}

export const config = {
  matcher: [
    // Admin gate (everything except the login page)
    "/admin/((?!login).*)",
    // Locale routing — exclude APIs, Next internals and any file with an extension
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
