import type { Metadata } from "next";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { CtaSection } from "@/components/site/cta-section";
import { PortfolioFilterGrid } from "@/components/site/portfolio-filter-grid";
import { getPublishedPortfolios, getPortfolioCategories } from "@/lib/queries";
import { site } from "@/lib/site";

// Content is CMS-managed — cached via ISR and revalidated on-demand
// when content changes through the admin API (see src/app/api/admin/*).
// Category filtering is client-side (instant) so this page stays cached.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Portfolio — Project Web, Aplikasi & Sistem yang Pernah Kami Bangun",
  description:
    "Jelajahi portfolio ZDL: website company profile, aplikasi web, e-commerce, SaaS, dashboard, CMS, hingga otomasi. Lihat studi kasus dan teknologi yang kami gunakan.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Portfolio ZDL — Zheng Digital Lab",
    description:
      "Koleksi project web development, aplikasi, dashboard, dan automation yang pernah kami kerjakan untuk kebutuhan bisnis nyata.",
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
    category: p.category ? { name: p.category.name, slug: p.category.slug } : null,
  }));

  const categoryChips = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    count: c._count.portfolios,
  }));

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Breadcrumb items={[{ name: "Portfolio" }]} />
            <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">
              Karya yang <span className="text-gradient">bicara sendiri</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Setiap project di bawah ini lahir dari masalah bisnis nyata —
              jelajahi berdasarkan kategori untuk melihat bagaimana kami bekerja.
            </p>
          </div>
        </div>
      </section>

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
