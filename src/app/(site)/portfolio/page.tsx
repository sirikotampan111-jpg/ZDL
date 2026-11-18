import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { CtaSection } from "@/components/site/cta-section";
import { PortfolioFilterGrid } from "@/components/site/portfolio-filter-grid";
import { getPublishedPortfolios, getPortfolioCategories } from "@/lib/queries";
import { site } from "@/lib/site";

// Content is CMS-managed — cached via ISR and revalidated on-demand
// when content changes through the admin API (see src/app/api/admin/*).
// Category filtering is client-side (instant) so this page stays cached.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Portfolio — Website Klien ZDL Lintas Industri",
  description:
    "Portofolio website klien ZDL lintas industri: kuliner & F&B, properti, interior & konstruksi, edukasi, transportasi & logistik, industri & energi, hingga organisasi.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Portfolio ZDL — Zheng Digital Lab",
    description:
      "Koleksi website klien yang pernah ZDL kerjakan & kelola — dari catering, restoran, dan brand skincare hingga developer properti, supplier lantai olahraga, dan fabrikasi tangki migas.",
    url: `${site.url}/portfolio`,
    type: "website",
  },
};

export default async function PortfolioPage() {
  const [categories, portfolios] = await Promise.all([
    getPortfolioCategories(),
    getPublishedPortfolios(),
  ]);

  // Pass slim card data only to the client component.
  const portfolioCards = portfolios.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
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
        eyebrow="Portofolio klien"
        title={
          <>
            Website yang{" "}
            <span className="font-serif-accent font-normal text-primary">
              berjalan hari ini
            </span>
            — bukan mockup
          </>
        }
        description={`${portfolioCards.length} website klien yang live dan kami kelola sekarang — dari catering di Surabaya sampai fabrikasi tangki migas. Filter berdasarkan industri, atau buka langsung situsnya dari halaman detail project.`}
        meta={[
          `${portfolioCards.length} project live`,
          `${categoryChips.length} industri`,
          "Dikerjakan internal",
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <PortfolioFilterGrid categories={categoryChips} portfolios={portfolioCards} />
      </section>

      <CtaSection
        title="Project Anda bisa jadi yang berikutnya"
        description="Setiap project dimulai dari percakapan singkat. Ceritakan kebutuhan Anda dan lihat bagaimana kami akan mengeksekusinya."
        secondaryLabel="Lihat layanan kami"
        secondaryHref="/services"
      />
    </>
  );
}
