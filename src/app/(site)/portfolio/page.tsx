import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { CtaSection } from "@/components/site/cta-section";
import { PortfolioFilterGrid } from "@/components/site/portfolio-filter-grid";
import { getPublishedPortfolios, getPortfolioCategories } from "@/lib/queries";
import { site } from "@/lib/site";
import { getI18n } from "@/i18n/server";
import { fmt, localePrefix } from "@/i18n/config";

// Content is CMS-managed. Category filtering is client-side (instant).
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: t.portfolio.metaTitle,
    description: t.portfolio.metaDesc,
    alternates: {
      canonical: "/portfolio",
      languages: { "id-ID": "/portfolio", en: "/en/portfolio", "x-default": "/portfolio" },
    },
    openGraph: {
      title: t.portfolio.ogTitle,
      description: t.portfolio.ogDesc,
      url: `${site.url}/portfolio`,
      type: "website",
    },
  };
}

export default async function PortfolioPage() {
  const { locale, t } = await getI18n();
  const [categories, portfolios] = await Promise.all([
    getPortfolioCategories(),
    getPublishedPortfolios(),
  ]);

  // Pass slim card data only to the client component.
  const portfolioCards = portfolios.map((p) => ({
    id: p.id,
    title: p.title,
    titleEn: p.titleEn,
    slug: p.slug,
    description: p.description,
    descriptionEn: p.descriptionEn,
    thumbnail: p.thumbnail,
    technologies: p.technologies,
    year: p.year,
    projectUrl: p.projectUrl,
    category: p.category ? { name: p.category.name, slug: p.category.slug } : null,
  }));

  const categoryChips = categories
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      count: c._count.portfolios,
    }))
    .filter((c) => c.count > 0);

  return (
    <>
      <PageHero
        breadcrumb={[{ name: "Portfolio" }]}
        eyebrow={t.portfolio.heroEyebrow}
        title={
          <>
            {t.portfolio.heroTitlePre}{" "}
            <span className="font-serif-accent font-normal text-primary">
              {t.portfolio.heroTitleAccent}
            </span>
            {t.portfolio.heroTitlePost}
          </>
        }
        description={fmt(t.portfolio.heroDesc, { n: portfolioCards.length })}
        meta={[
          fmt(t.portfolio.metaLive, { n: portfolioCards.length }),
          fmt(t.portfolio.metaIndustries, { n: categoryChips.length }),
          t.portfolio.metaInhouse,
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <PortfolioFilterGrid
          categories={categoryChips}
          portfolios={portfolioCards}
          locale={locale}
        />
      </section>

      <CtaSection
        title={t.portfolio.ctaTitle}
        description={t.portfolio.ctaDesc}
        secondaryLabel={t.portfolio.ctaSecondary}
        secondaryHref={localePrefix(locale, "/services")}
      />
    </>
  );
}
