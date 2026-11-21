import type { Metadata } from "next";
import {
  MessageCircle,
  Mail,
  Clock,
  MapPin,
  Instagram,
  Github,
  Linkedin,
} from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/site/contact-form";
import { site } from "@/lib/site";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: t.contact.metaTitle,
    description: t.contact.metaDesc,
    alternates: {
      canonical: "/contact",
      languages: { "id-ID": "/contact", en: "/en/contact", "x-default": "/contact" },
    },
    openGraph: {
      title: t.contact.ogTitle,
      description: t.contact.ogDesc,
      url: `${site.url}/contact`,
      type: "website",
    },
  };
}

export default async function ContactPage() {
  const { t } = await getI18n();

  const socials = [
    { href: site.social.instagram, label: "Instagram", Icon: Instagram },
    { href: site.social.github, label: "GitHub", Icon: Github },
    { href: site.social.linkedin, label: "LinkedIn", Icon: Linkedin },
  ].filter((s) => s.href);

  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact ZDL — Zheng Digital Lab",
    url: `${site.url}/contact`,
    mainEntity: {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: `+${site.whatsapp.intl}`,
        email: site.email,
        availableLanguage: ["Indonesian", "English"],
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />

      <PageHero
        breadcrumb={[{ name: "Contact" }]}
        eyebrow={t.contact.heroEyebrow}
        title={
          <>
            {t.contact.heroTitlePre}{" "}
            <span className="font-serif-accent font-normal text-primary">
              {t.contact.heroTitleAccent}
            </span>
          </>
        }
        description={t.contact.heroDesc}
        meta={t.contact.meta}
      />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-semibold tracking-tight">{t.contact.formTitle}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {t.contact.requiredNote}
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          {/* Info */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold">{t.contact.direct}</h3>
              <div className="mt-4 space-y-4">
                <a
                  href={`https://wa.me/${site.whatsapp.intl}?text=${encodeURIComponent(t.wa.defaultMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium group-hover:text-primary">
                      WhatsApp
                    </span>
                    <span className="block text-sm text-muted-foreground">
                      {site.whatsapp.display}
                    </span>
                  </span>
                </a>
                <a href={`mailto:${site.email}`} className="group flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium group-hover:text-primary">
                      {t.contact.emailLabel}
                    </span>
                    <span className="block text-sm text-muted-foreground">{site.email}</span>
                  </span>
                </a>
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{t.contact.locationLabel}</span>
                    <span className="block text-sm text-muted-foreground">
                      {site.location.city}, {site.location.region}, Indonesia
                    </span>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                    <Clock className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{t.contact.hoursLabel}</span>
                    <span className="block text-sm text-muted-foreground">
                      {t.contact.hours}
                    </span>
                  </span>
                </div>
              </div>

              {socials.length > 0 && (
                <div className="mt-6 border-t border-border pt-5">
                  <p className="text-sm font-medium">{t.contact.social}</p>
                  <div className="mt-3 flex gap-2">
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
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
              <h3 className="font-semibold">{t.contact.beforeTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t.contact.beforeDesc}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
