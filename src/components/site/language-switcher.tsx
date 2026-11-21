"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/client";
import { locales, type Locale } from "@/i18n/config";
import { dictionaries } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";

/**
 * Language switcher — toggles between the bare Indonesian URLs and the
 * /en-prefixed English ones. Preference persists in the zdl-lang cookie
 * (read by the middleware).
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const next: Locale = locale === "en" ? "id" : "en";
  const t = dictionaries[locale].lang;

  function switchLocale() {
    // Persist the preference before navigating so the middleware
    // keeps serving the chosen language on subsequent visits.
    document.cookie = `zdl-lang=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    const path = window.location.pathname.replace(/^\/en(?=\/|$)/, "") || "/";
    window.location.href = next === "en" ? (path === "/" ? "/en" : `/en${path}`) : path;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={switchLocale}
      aria-label={t.aria}
      title={locale === "en" ? t.toId : t.toEn}
      className={cn(
        "h-9 rounded-full px-2.5 font-mono text-xs font-semibold tracking-wider text-muted-foreground hover:text-foreground",
        className
      )}
    >
      <Globe className="mr-1 h-3.5 w-3.5" />
      {locale === "en" ? "ID" : "EN"}
    </Button>
  );
}
