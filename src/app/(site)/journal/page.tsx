import type { Metadata } from "next";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { CtaSection } from "@/components/site/cta-section";
import { JournalFilterGrid } from "@/components/site/journal-filter-grid";
import { getPublishedJournals, getJournalCategories } from "@/lib/queries";
import { readingTime } from "@/lib/markdown";
import { site } from "@/lib/site";

// Content is CMS-managed — cached via ISR and revalidated on-demand
// when content changes through the admin API (see src/app/api/admin/*).
// Category filtering is client-side (instant) so this page stays cached.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "ZDL Journal — Artikel Teknologi, Web Development & Bisnis Digital",
  description:
    "Baca artikel ZDL Journal: panduan web development, tutorial, SEO, studi kasus, dan wawasan bisnis digital dari pengalaman mengerjakan project nyata.",
  alternates: { canonical: "/journal" },
  openGraph: {
    title: "ZDL Journal — Wawasan Teknologi & Bisnis Digital",
    description:
      "Artikel praktis tentang web development, aplikasi, SEO, dan sistem bisnis — ditulis dari pengalaman project nyata.",
    url: `${site.url}/journal`,
    type: "website",
  },
};

export default async function JournalPage() {
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

  const categoryChips = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    count: c._count.journals,
  }));

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Breadcrumb items={[{ name: "Journal" }]} />
            <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">
              ZDL <span className="text-gradient">Journal</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Artikel praktis tentang web development, sistem bisnis, SEO, dan
              teknologi — ditulis dari pengalaman mengerjakan project nyata.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <JournalFilterGrid categories={categoryChips} journals={journalCards} />
      </section>

      <CtaSection
        title="Suka membacanya? Tunggu sampai bekerja sama."
        description="Knowledge kami tidak berhenti di artikel — diskusikan kebutuhan bisnis Anda dan rasakan perbedaan partner teknis yang paham konteks."
        secondaryLabel="Lihat portfolio"
        secondaryHref="/portfolio"
      />
    </>
  );
}
