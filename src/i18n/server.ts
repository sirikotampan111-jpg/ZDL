import { headers } from "next/headers";
import { defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";

/**
 * Server-side locale reader. The middleware sets `x-zdl-locale: en`
 * when serving a /en/* rewrite; everything else is Indonesian.
 */
export async function getLocale(): Promise<Locale> {
  const h = await headers();
  return h.get("x-zdl-locale") === "en" ? "en" : defaultLocale;
}

/** Convenience: locale + dictionary in one call for server components. */
export async function getI18n(): Promise<{ locale: Locale; t: Dictionary }> {
  const locale = await getLocale();
  return { locale, t: getDictionary(locale) };
}
