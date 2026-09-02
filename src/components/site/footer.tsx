import Link from "next/link";
import { Instagram, Github, Linkedin, MessageCircle, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { site, waLink } from "@/lib/site";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const serviceLinks = [
  { href: "/services/web-development", label: "Web Development" },
  { href: "/services/application-development", label: "Application Development" },
  { href: "/services/business-system", label: "Business System" },
  { href: "/services/productivity", label: "Productivity" },
  { href: "/services/digital-growth", label: "Digital Growth" },
  { href: "/services/infrastructure", label: "Infrastructure" },
];

export function Footer() {
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
              Web &amp; App Development. Digital solutions for modern business —
              website, aplikasi, sistem internal, dan automation untuk bisnis di
              Tangerang, Jakarta, Jabodetabek, dan seluruh Indonesia.
            </p>
            <div className="mt-5 flex flex-col gap-2 text-sm text-muted-foreground">
              <a
                href={waLink()}
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
                {site.location.city}, {site.location.region} — melayani seluruh Indonesia
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
          <nav aria-label="Tautan footer">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Navigasi
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Layanan">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Layanan
            </h3>
            <ul className="mt-4 space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
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
            © {new Date().getFullYear()} {site.fullName}. Seluruh hak cipta dilindungi.
          </p>
          <p>
            Website by{" "}
            <Link href="/" className="font-medium text-primary hover:underline">
              ZDL
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
