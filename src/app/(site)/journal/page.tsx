import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { CtaSection } from "@/components/site/cta-section";
import { JournalFilterGrid } from "@/components/site/journal-filter-grid";
import { getPublishedJournals, getJournalCategories } from "@/lib/queries";
import { readingTime } from "@/lib/markdown";
import { site } from "@/lib/site";
import { getI18n } from "@/i18n/server";
import { localePrefix } from "@/i18n/config";

// Content is CMS-managed. Category filtering is client-side (instant).
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: t.journal.metaTitle,
    description: t.journal.metaDesc,
    alternates: {
      canonical: "/journal",
      languages: { "id-ID": "/journal", en: "/en/journal", "x-default": "/journal" },
    },
    openGraph: {
      title: t.journal.ogTitle,
      description: t.journal.ogDesc,
      url: `${site.url}/journal`,
      type: "website",
    },
  };
}

export default async function JournalPage() {
  const { locale, t } = await getI18n();
  const [categories, journals] = await Promise.all([
    getJournalCategories(),
    getPublishedJournals(),
  ]);

  // Pass slim card data only (no markdown body) to the client component.
  const journalCards = journals.map((j) => ({
    id: j.id,
    title: j.title,
    slug: j.slug,
    excerpt: j.excerpt,
    featuredImage: j.featuredImage,
    publishedAt: j.publishedAt,
    category: j.category ? { name: j.category.name, slug: j.category.slug } : null,
    readingMinutes: readingTime(j.content),
  }));

  const categoryChips = categories
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      count: c._count.journals,
    }))
    .filter((c) => c.count > 0);

  return (
    <>
      <PageHero
        breadcrumb={[{ name: "Journal" }]}
        eyebrow={t.journal.heroEyebrow}
        title={
          <>
            {t.journal.heroTitlePre}{" "}
            <span className="font-serif-accent font-normal text-primary">
              {t.journal.heroTitleAccent}
            </span>
            {t.journal.heroTitlePost}
          </>
        }
        description={t.journal.heroDesc}
        meta={t.journal.meta}
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <JournalFilterGrid categories={categoryChips} journals={journalCards} locale={locale} />
      </section>

      <CtaSection
        title={t.journal.ctaTitle}
        description={t.journal.ctaDesc}
        secondaryLabel={t.journal.ctaSecondary}
        secondaryHref={localePrefix(locale, "/portfolio")}
      />
    </>
  );
}
