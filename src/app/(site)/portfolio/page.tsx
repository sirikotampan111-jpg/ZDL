import type { Metadata } from "next";
import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { PortfolioCard } from "@/components/site/portfolio-card";
import { Reveal } from "@/components/site/reveal";
import { CtaSection } from "@/components/site/cta-section";
import { getPublishedPortfolios, getPortfolioCategories } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

// Content is CMS-managed — render per request so updates appear immediately.
export const dynamic = "force-dynamic";

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

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;
  const [categories, portfolios] = await Promise.all([
    getPortfolioCategories(),
    getPublishedPortfolios(),
  ]);

  const activeCategory = kategori
    ? categories.find((c) => c.slug === kategori)
    : undefined;

  const filtered = activeCategory
    ? portfolios.filter((p) => p.category?.slug === activeCategory.slug)
    : portfolios;

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
        {/* Category filter */}
        <div className="flex flex-wrap items-center gap-2" role="navigation" aria-label="Filter kategori portfolio">
          <Link
            href="/portfolio"
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              !activeCategory
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            Semua
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/portfolio?kategori=${cat.slug}`}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                activeCategory?.slug === cat.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {cat.name}
              <span className="ml-1.5 text-xs opacity-70">
                {cat._count.portfolios}
              </span>
            </Link>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-border p-14 text-center">
            <FolderOpen className="h-10 w-10 text-muted-foreground/50" />
            <p className="mt-4 font-medium">Belum ada project pada kategori ini.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Coba pilih kategori lain, atau{" "}
              <Link href="/contact" className="text-primary hover:underline">
                diskusikan project Anda
              </Link>{" "}
              untuk menjadi yang pertama.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <Reveal key={p.id} delay={Math.min(i, 8) * 0.05}>
                <PortfolioCard item={p} />
              </Reveal>
            ))}
          </div>
        )}
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
