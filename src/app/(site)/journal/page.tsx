import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
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
        eyebrow="ZDL Journal"
        title={
          <>
            Catatan dari{" "}
            <span className="font-serif-accent font-normal text-primary">lapangan</span>
            , bukan teori
          </>
        }
        description="Pengalaman membangun dan merawat website untuk 16 brand nyata — ditulis ringkas, tanpa jargon berlebihan, dan bisa langsung dipraktikkan untuk bisnis Anda."
        meta={["Ditulis dari project nyata", "Bisa dipraktikkan"]}
      />

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
