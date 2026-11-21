import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { CtaSection } from "@/components/site/cta-section";
import { DemoFilterGrid } from "@/components/site/demo-filter-grid";
import { getPublishedDemos } from "@/lib/queries";
import { site } from "@/lib/site";
import { getI18n } from "@/i18n/server";
import { fmt, localePrefix } from "@/i18n/config";

// Content is CMS-managed. Category filtering is client-side (instant).
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: t.demo.metaTitle,
    description: t.demo.metaDesc,
    alternates: {
      canonical: "/demo",
      languages: { "id-ID": "/demo", en: "/en/demo", "x-default": "/demo" },
    },
    openGraph: {
      title: t.demo.ogTitle,
      description: t.demo.ogDesc,
      url: `${site.url}/demo`,
      type: "website",
    },
  };
}

export default async function DemoPage() {
  const { locale, t } = await getI18n();
  const demos = await getPublishedDemos();

  // Distinct free-text categories → filter chips (sorted alphabetically)
  const categoryMap = new Map<string, number>();
  for (const d of demos) {
    if (d.category) {
      categoryMap.set(d.category, (categoryMap.get(d.category) ?? 0) + 1);
    }
  }
  const categoryChips = [...categoryMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, count }));

  const demoCards = demos.map((d) => ({
    id: d.id,
    title: d.title,
    titleEn: d.titleEn,
    slug: d.slug,
    description: d.description,
    descriptionEn: d.descriptionEn,
    thumbnail: d.thumbnail,
    category: d.category,
    accessType: d.accessType,
    technologies: d.technologies,
  }));

  return (
    <>
      <PageHero
        breadcrumb={[{ name: locale === "en" ? "Demos" : "Demo" }]}
        eyebrow={t.demo.heroEyebrow}
        title={
          <>
            {t.demo.heroTitlePre}{" "}
            <span className="font-serif-accent font-normal text-primary">
              {t.demo.heroTitleAccent}
            </span>
          </>
        }
        description={t.demo.heroDesc}
        meta={[
          fmt(t.demo.metaCount, { n: demos.length }),
          t.demo.metaFree,
          t.demo.metaMobile,
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <DemoFilterGrid categories={categoryChips} demos={demoCards} locale={locale} />
      </section>

      <CtaSection
        title={t.demo.ctaTitle}
        description={t.demo.ctaDesc}
        secondaryLabel={t.demo.ctaSecondary}
        secondaryHref={localePrefix(locale, "/services")}
      />
    </>
  );
}
