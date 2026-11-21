import Link from "next/link";
import { Instagram, Github, Linkedin, MessageCircle, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { site } from "@/lib/site";
import { getI18n } from "@/i18n/server";
import { localePrefix } from "@/i18n/config";

const footerLinks = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/demo", key: "demo" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/journal", key: "journal" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

// Same labels as the navbar — proper nouns that work in both languages.
const footerLabels: Record<(typeof footerLinks)[number]["key"], Record<"id" | "en", string>> = {
  home: { id: "Home", en: "Home" },
  services: { id: "Services", en: "Services" },
  demo: { id: "Demo", en: "Demos" },
  portfolio: { id: "Portfolio", en: "Portfolio" },
  journal: { id: "Journal", en: "Journal" },
  about: { id: "About", en: "About" },
  contact: { id: "Contact", en: "Contact" },
};

const serviceLinks = [
  { href: "/services/web-development", label: "Web Development" },
  { href: "/services/application-development", label: "Application Development" },
  { href: "/services/business-system", label: "Business System" },
  { href: "/services/productivity", label: "Productivity" },
  { href: "/services/digital-growth", label: "Digital Growth" },
  { href: "/services/infrastructure", label: "Infrastructure" },
];

export async function Footer() {
  const { locale, t } = await getI18n();

  const socials = [
    { href: site.social.instagram, label: "Instagram", Icon: Instagram },
    { href: site.social.github, label: "GitHub", Icon: Github },
    { href: site.social.linkedin, label: "LinkedIn", Icon: Linkedin },
  ].filter((s) => s.href);

  return (
    <footer className="mt-auto border-t border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t.footer.blurb}
            </p>
            <div className="mt-5 flex flex-col gap-2 text-sm text-muted-foreground">
              <a
                href={`https://wa.me/${site.whatsapp.intl}?text=${encodeURIComponent(t.wa.defaultMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-primary"
              >
                <MessageCircle className="h-4 w-4 text-primary" />
                {site.whatsapp.display}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4 text-primary" />
                {site.email}
              </a>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {site.location.city}, {site.location.region} — {t.footer.location}
              </span>
            </div>
            {socials.length > 0 && (
              <div className="mt-5 flex gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <nav aria-label={t.footer.ariaNav}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {t.footer.navTitle}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localePrefix(locale, link.href)}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {footerLabels[link.key][locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.footer.ariaServices}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {t.footer.servicesTitle}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localePrefix(locale, link.href)}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.fullName}. {t.footer.rights}
          </p>
          <p>
            {t.footer.websiteBy}{" "}
            <Link href={localePrefix(locale, "/")} className="font-medium text-primary hover:underline">
              ZDL
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
