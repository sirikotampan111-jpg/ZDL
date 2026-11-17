import type { Metadata } from "next";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { CtaSection } from "@/components/site/cta-section";
import { DemoFilterGrid } from "@/components/site/demo-filter-grid";
import { getPublishedDemos } from "@/lib/queries";
import { site } from "@/lib/site";

// Content is CMS-managed — cached via ISR and revalidated on-demand
// when demo entries change through the admin API (see src/app/api/admin/demo).
// Category filtering is client-side (instant) so this page stays cached.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Demo — Coba Langsung Sistem yang Kami Bangun",
  description:
    "Wadah demo interaktif ZDL: coba langsung simulasi aplikasi kasir, sistem booking, dashboard, dan sistem lain yang bisa kami bangun untuk bisnis Anda — tanpa perlu daftar atau install apa pun.",
  alternates: { canonical: "/demo" },
  openGraph: {
    title: "Demo ZDL — Zheng Digital Lab",
    description:
      "Coba langsung simulasi aplikasi yang bisa kami bangun: kasir, booking, dashboard, dan lainnya. Semua berjalan di browser, tanpa install.",
    url: `${site.url}/demo`,
    type: "website",
  },
};

export default async function DemoPage() {
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
    slug: d.slug,
    description: d.description,
    thumbnail: d.thumbnail,
    category: d.category,
    accessType: d.accessType,
    technologies: d.technologies,
  }));

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Breadcrumb items={[{ name: "Demo" }]} />
            <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">
              Jangan cuma baca — <span className="text-gradient">coba langsung</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Wadah khusus demo ZDL. Setiap demo adalah simulasi berfungsi penuh
              dari sistem yang bisa kami bangun untuk bisnis Anda — jalan di
              browser, tanpa daftar, tanpa install.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <DemoFilterGrid categories={categoryChips} demos={demoCards} />
      </section>

      <CtaSection
        title="Mau sistem seperti ini untuk bisnis Anda?"
        description="Demo di halaman ini adalah simulasi ringan. Versi aslinya dibuat sesuai kebutuhan bisnis Anda — lengkap dengan data, laporan, dan integrasi yang Anda mau."
        secondaryLabel="Lihat layanan kami"
        secondaryHref="/services"
      />
    </>
  );
}
