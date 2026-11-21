import Link from "next/link";
import { ArrowRight, MessageCircle, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "@/components/site/hero-visual";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { PortfolioCard } from "@/components/site/portfolio-card";
import { DemoCard } from "@/components/site/demo-card";
import { CtaSection } from "@/components/site/cta-section";
import { getLocalizedServiceCategories } from "@/lib/services-data-en";
import { ZDL_CLIENTS } from "@/lib/clients";
import {
  getPublishedDemos,
  getPublishedJournals,
  getPublishedPortfolios,
} from "@/lib/queries";
import { readingTime } from "@/lib/markdown";
import { site } from "@/lib/site";
import { getI18n } from "@/i18n/server";
import { fmt, localePrefix } from "@/i18n/config";
import { pickDescription, pickTitle } from "@/i18n/content";

// Content is CMS-managed. The page reads the locale header, so it renders
// per request (still fast — DB queries are pooled and the page is light).
export const revalidate = 300;

export default async function HomePage() {
  const { locale, t } = await getI18n();
  const [allPortfolios, latestJournals, allDemos] = await Promise.all([
    getPublishedPortfolios(),
    getPublishedJournals({ take: 4 }),
    getPublishedDemos(),
  ]);

  // Counts are computed from the full lists so the numbers on the page
  // are always true — no hardcoded "7 demos" that drifts out of date.
  const featuredPortfolios = allPortfolios
    .filter((p) => p.featured)
    .slice(0, 4);
  const portfolioCount = allPortfolios.length;
  const latestDemos = allDemos.slice(0, 3);
  const demoCount = allDemos.length;

  const portfolioFallback = featuredPortfolios.length === 0;
  // Count industries the way the portfolio does — 8 grouped categories,
  // not the granular per-client tags (Transportasi & Logistik count as one).
  const INDUSTRY_GROUPS: Record<string, string> = {
    Kuliner: "Kuliner & F&B",
    Kecantikan: "Kecantikan & Lifestyle",
    Transportasi: "Transportasi & Logistik",
    Logistik: "Transportasi & Logistik",
    Edukasi: "Edukasi",
    Properti: "Properti",
    Interior: "Interior & Konstruksi",
    Olahraga: "Interior & Konstruksi",
    Organisasi: "Organisasi & Asosiasi",
    Industri: "Industri & Energi",
  };
  const industryCount = new Set(
    ZDL_CLIENTS.map((c) => INDUSTRY_GROUPS[c.industry] ?? c.industry)
  ).size;
  const journalCards = latestJournals.map((j) => ({
    ...j,
    readingMinutes: readingTime(j.content),
  }));

  const journalDateFmt = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      {/* ================================================== HERO */}
      <section className="relative overflow-hidden">
        <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="mono-label flex flex-wrap items-center gap-x-3 gap-y-1.5 text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    {t.home.statusNew}
                  </span>
                  <span aria-hidden="true" className="text-border">/</span>
                  <span>{t.home.location}</span>
                </p>
              </Reveal>

              <Reveal delay={0.08}>
                <h1 className="mt-7 text-[2.6rem] font-bold leading-[1.06] tracking-tight sm:text-6xl lg:text-[4rem]">
                  {t.home.h1Pre}{" "}
                  <span className="font-serif-accent font-normal text-primary">
                    {t.home.h1Accent}
                  </span>
                  .
                </h1>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {fmt(t.home.heroBody, { n: ZDL_CLIENTS.length })}
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <a
                      href={`https://wa.me/${site.whatsapp.intl}?text=${encodeURIComponent(t.wa.defaultMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      {t.home.ctaPrimary}
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 text-base font-medium"
                  >
                    <Link href={localePrefix(locale, "/demo")}>
                      {t.home.ctaDemo}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={0.32}>
                <p className="mono-label mt-8 text-muted-foreground">
                  {t.home.regions}
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <HeroVisual />
            </div>
          </div>
        </div>

        {/* client trust strip — real sites, marquee */}
        <div className="relative border-y border-border bg-card/40">
          <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
            <p className="mono-label text-center text-muted-foreground">
              {fmt(t.home.trusted, { n: ZDL_CLIENTS.length, m: industryCount })}
            </p>
          </div>
          <div className="relative mt-4 overflow-hidden pb-6 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="animate-marquee flex w-max">
              {[0, 1].map((half) => (
                <div
                  key={half}
                  aria-hidden={half === 1}
                  className="flex items-center gap-10 pr-10"
                >
                  {ZDL_CLIENTS.map((c) => (
                    <span key={c.domain} className="flex items-baseline gap-2 whitespace-nowrap">
                      <span className="text-sm font-medium text-foreground/85">{c.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">{c.domain}</span>
                      <span className="ml-3 h-1 w-1 rounded-full bg-primary/40" aria-hidden="true" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== SERVICES */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24" id="services">
        <SectionHeading
          index="01"
          eyebrow={t.home.svcEyebrow}
          title={t.home.svcTitle}
          description={t.home.svcDesc}
        />
        <div className="mt-12 border-y border-border">
          {getLocalizedServiceCategories(locale).map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 0.03}>
              <Link
                href={localePrefix(locale, `/services/${cat.slug}`)}
                className="group -mx-4 grid gap-2.5 border-b border-border px-4 py-7 transition-colors last:border-b-0 hover:bg-muted/40 sm:mx-0 sm:grid-cols-[3.5rem_1fr_auto] sm:items-center sm:gap-6 sm:px-4"
              >
                <span className="mono-label text-muted-foreground/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary">
                    {cat.name}
                  </h3>
                  <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {cat.tagline}
                  </p>
                  <p className="mt-2.5 font-mono text-xs text-muted-foreground/70">
                    {cat.items.slice(0, 5).map((it) => it.name).join(" · ")}
                    {cat.items.length > 5 ? " · …" : ""}
                  </p>
                </div>
                <span className="hidden h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-all group-hover:translate-x-1 group-hover:border-primary group-hover:text-primary sm:flex">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================================================== VALUE PROPS */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <SectionHeading
            index="02"
            eyebrow={t.home.whyEyebrow}
            title={t.home.whyTitle}
            description={t.home.whyDesc}
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {t.home.valueProps.map((vp, i) => (
              <Reveal key={vp.title} delay={i * 0.05}>
                <div className="h-full bg-background p-7 sm:p-9">
                  <span className="mono-label text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">
                    {vp.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {vp.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================== PROCESS */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <SectionHeading
          index="03"
          eyebrow={t.home.howEyebrow}
          title={t.home.howTitle}
          description={t.home.howDesc}
        />
        <div className="mt-12 grid gap-x-12 md:grid-cols-2">
          {t.home.processSteps.map((ps, i) => (
            <Reveal key={ps.name} delay={i * 0.04}>
              <div className="flex gap-6 border-t border-border py-6">
                <span className="font-mono text-sm font-semibold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-semibold tracking-tight">{ps.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {ps.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================================================== FEATURED PORTFOLIO */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <SectionHeading
            index="04"
            eyebrow={t.home.portEyebrow}
            title={t.home.portTitle}
            description={t.home.portDesc}
          />
          {portfolioFallback ? (
            <p className="mt-12 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
              {t.home.portfolioEmpty}
            </p>
          ) : (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPortfolios.map((p, i) => (
                <Reveal
                  key={p.id}
                  delay={i * 0.05}
                  className={i === 0 ? "sm:col-span-2 lg:col-span-2" : undefined}
                >
                  <PortfolioCard item={p} locale={locale} />
                </Reveal>
              ))}
            </div>
          )}
          <div className="mt-10 flex items-center justify-between gap-4">
            <p className="mono-label text-muted-foreground">
              {fmt(t.home.moreProjects, {
                n: Math.max(portfolioCount - featuredPortfolios.length, 0),
              })}
            </p>
            <Button asChild variant="outline" className="rounded-full px-7">
              <Link href={localePrefix(locale, "/portfolio")}>
                {t.home.viewAllPortfolio}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ================================================== DEMO SHOWCASE */}
      {latestDemos.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <SectionHeading
            index="05"
            eyebrow={t.home.demoEyebrow}
            title={t.home.demoTitle}
            description={t.home.demoDesc}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestDemos.map((d, i) => (
              <Reveal key={d.id} delay={i * 0.05}>
                <DemoCard item={d} locale={locale} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex items-center justify-between gap-4">
            <p className="mono-label text-muted-foreground">
              {fmt(t.home.demoCount, { n: demoCount })}
            </p>
            <Button asChild variant="outline" className="rounded-full px-7">
              <Link href={localePrefix(locale, "/demo")}>
                {t.home.exploreDemos}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* ================================================== JOURNAL */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <SectionHeading
            index="06"
            eyebrow={t.home.jrnEyebrow}
            title={t.home.jrnTitle}
            description={t.home.jrnDesc}
          />
          {journalCards.length === 0 ? (
            <p className="mt-12 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
              {t.home.journalEmpty}
            </p>
          ) : (
            <div className="mt-10 border-t border-border">
              {journalCards.map((j) => (
                <Link
                  key={j.id}
                  href={localePrefix(locale, `/journal/${j.slug}`)}
                  className="group -mx-4 grid gap-2 border-b border-border px-4 py-6 transition-colors hover:bg-muted/40 sm:mx-0 sm:grid-cols-[8rem_1fr_auto] sm:items-center sm:gap-8 sm:px-4"
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    {j.publishedAt ? journalDateFmt.format(j.publishedAt) : t.common.draft}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight group-hover:text-primary sm:text-xl">
                      {j.title}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                      {j.excerpt}
                    </p>
                  </div>
                  <span className="hidden items-center gap-3 font-mono text-xs text-muted-foreground sm:flex">
                    {j.readingMinutes} {t.common.menit}
                    <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-10 flex justify-end">
            <Button asChild variant="outline" className="rounded-full px-7">
              <Link href={localePrefix(locale, "/journal")}>
                {t.home.allArticles}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ================================================== CTA */}
      <CtaSection />
    </>
  );
}
