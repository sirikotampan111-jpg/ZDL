"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun, MessageCircle } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { site, waLink } from "@/lib/site";
import { useDict, useLocale } from "@/i18n/client";
import { localePrefix } from "@/i18n/config";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/demo", key: "demo" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/journal", key: "journal" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

// Nav labels are proper nouns of the site map and read fine in both languages.
const navLabels: Record<(typeof navLinks)[number]["key"], Record<"id" | "en", string>> = {
  home: { id: "Home", en: "Home" },
  services: { id: "Services", en: "Services" },
  demo: { id: "Demo", en: "Demos" },
  portfolio: { id: "Portfolio", en: "Portfolio" },
  journal: { id: "Journal", en: "Journal" },
  about: { id: "About", en: "About" },
  contact: { id: "Contact", en: "Contact" },
};

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useDict();

  // CSS-first icon swap avoids hydration mismatch without setState-in-effect
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t.nav.theme}
      className="rounded-full"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      onPointerDown={() => {
        if (!mounted) setMounted(true);
      }}
    >
      <Sun className="hidden h-5 w-5 dark:block" />
      <Moon className="h-5 w-5 dark:hidden" />
    </Button>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const t = useDict();
  const locale = useLocale();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "glass border-b border-border/60 shadow-sm"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label={t.nav.ariaMain}
      >
        <Link href={localePrefix(locale, "/")} className="shrink-0" aria-label={t.nav.brandAria}>
          <Logo />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const href = localePrefix(locale, link.href);
            const bare = locale === "en" ? pathname.replace(/^\/en(?=\/|$)/, "") || "/" : pathname;
            const active = link.href === "/" ? bare === "/" : bare.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {navLabels[link.key][locale]}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button
            asChild
            className="hidden rounded-full bg-primary font-medium text-primary-foreground hover:bg-primary/90 sm:inline-flex"
          >
            <a href={waLink(t.wa.defaultMsg)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-1.5 h-4 w-4" />
              {t.nav.consult}
            </a>
          </Button>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label={t.nav.openMenu}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[340px]">
              <SheetHeader className="p-0">
                <SheetTitle className="sr-only">{t.nav.menuTitle}</SheetTitle>
              </SheetHeader>
              <div className="mt-2 flex h-full flex-col">
                <ul className="flex-1 space-y-1 py-4">
                  {navLinks.map((link) => {
                    const href = localePrefix(locale, link.href);
                    const bare = locale === "en" ? pathname.replace(/^\/en(?=\/|$)/, "") || "/" : pathname;
                    const active = link.href === "/" ? bare === "/" : bare.startsWith(link.href);
                    return (
                      <li key={link.href}>
                        <Link
                          href={href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center rounded-xl px-4 py-3 text-base font-medium transition-colors",
                            active
                              ? "bg-accent text-accent-foreground"
                              : "text-foreground hover:bg-muted"
                          )}
                        >
                          {navLabels[link.key][locale]}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="border-t border-border pt-4 pb-6">
                  <Button asChild className="w-full rounded-full bg-primary text-primary-foreground">
                    <a href={waLink(t.wa.defaultMsg)} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-1.5 h-4 w-4" />
                      {t.nav.consultProject}
                    </a>
                  </Button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    {site.whatsapp.display} • {site.domain}
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
