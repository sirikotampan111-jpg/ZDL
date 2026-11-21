import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { CtaSection } from "@/components/site/cta-section";
import { site, waLink } from "@/lib/site";
import { getI18n } from "@/i18n/server";
import { fmt, localePrefix } from "@/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: t.about.metaTitle,
    description: t.about.metaDesc,
    alternates: {
      canonical: "/about",
      languages: { "id-ID": "/about", en: "/en/about", "x-default": "/about" },
    },
    openGraph: {
      title: t.about.ogTitle,
      description: t.about.ogDesc,
      url: `${site.url}/about`,
      type: "website",
    },
  };
}

export default async function AboutPage() {
  const { locale, t } = await getI18n();

  return (
    <>
      <PageHero
        breadcrumb={[{ name: locale === "en" ? "About" : "Tentang" }]}
        eyebrow={t.about.heroEyebrow}
        title={
          <>
            {t.about.heroTitlePre}{" "}
            <span className="font-serif-accent font-normal text-primary">
              {t.about.heroTitleAccent}
            </span>
          </>
        }
        description={t.about.heroDesc}
        meta={t.about.meta}
      />

      {/* Story */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight">{t.about.storyTitle}</h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>{t.about.story1}</p>
              <p>{t.about.story2}</p>
              <p>
                {fmt(t.about.story3, {
                  city: site.location.city,
                  region: site.location.region,
                  areas: site.location.serviceAreas.slice(0, 6).join(", "),
                })}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-7">
              <h3 className="font-semibold">{t.about.buildTitle}</h3>
              <ul className="mt-4 space-y-3.5">
                {t.about.buildItems.map((item) => (
                  <li key={item.name} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    <span className="text-sm leading-relaxed">
                      <strong className="font-semibold text-foreground">{item.name}</strong>
                      <span className="text-muted-foreground"> — {item.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6 w-full rounded-full bg-primary text-primary-foreground">
                <a href={waLink(t.wa.defaultMsg)} target="_blank" rel="noopener noreferrer">
                  {t.about.buildCta}
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Reveal className="max-w-2xl">
            <p className="mono-label flex items-center gap-3 text-muted-foreground">
              <span className="text-primary">{t.about.valuesEyebrow}</span>
              <span className="h-px w-10 bg-border" aria-hidden="true" />
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">{t.about.valuesTitle}</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {t.about.valuesDesc}
            </p>
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
            {t.about.values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.05}>
                <div className="h-full bg-background p-7">
                  <span className="mono-label text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">{v.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {v.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal className="max-w-2xl">
          <p className="mono-label flex items-center gap-3 text-muted-foreground">
            <span className="text-primary">{t.about.approachEyebrow}</span>
            <span className="h-px w-10 bg-border" aria-hidden="true" />
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">{t.about.approachTitle}</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {t.about.approachDesc}
          </p>
        </Reveal>
        <ol className="mt-10 border-t border-border">
          {t.about.approach.map((a, i) => (
            <Reveal key={a.name} delay={i * 0.03}>
              <li className="grid gap-2 border-b border-border py-6 sm:grid-cols-[3.5rem_9rem_1fr] sm:gap-6">
                <span className="font-mono text-sm font-semibold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold tracking-tight">{a.name}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {a.description}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Local SEO — service areas */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
                <MapPin className="h-3.5 w-3.5" />
                {t.about.areasBadge}
              </span>
              <h2 className="mt-5 text-3xl font-bold tracking-tight">
                {t.about.areasTitle}
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  {fmt(t.about.areas1, { city: site.location.city, region: site.location.region })}
                </p>
                <p>{t.about.areas2}</p>
              </div>
              <Link
                href={localePrefix(locale, "/contact")}
                className="mt-6 inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
              >
                {t.about.areasLink}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="grid gap-3 sm:grid-cols-2">
                {site.location.serviceAreas.map((area) => (
                  <div
                    key={area}
                    className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3.5"
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm font-medium">{area}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
