/**
 * ZDL i18n — locales, helpers.
 *
 * Strategy: Indonesian is served from the canonical bare URLs (/…),
 * English is served under the /en prefix. The middleware rewrites
 * /en/<path> to <path> with an x-zdl-locale header; server components
 * read the locale via getLocale() (src/i18n/server.ts) and client
 * components via useLocale() (src/i18n/client.tsx).
 */
export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "id";

/** Prefix a path with the locale segment (English only — Indonesian is bare). */
export function localePrefix(locale: Locale, path: string): string {
  if (locale === "id") return path;
  return path === "/" ? "/en" : `/en${path}`;
}

/** Tiny template helper: fmt("{n} projects", { n: 16 }) */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_m, key: string) => String(vars[key] ?? ""));
}
