import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Newspaper } from "lucide-react";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { JournalCard } from "@/components/site/journal-card";
import { CtaSection } from "@/components/site/cta-section";
import {
  getPublishedJournals,
  getJournalCategories,
} from "@/lib/queries";
import { readingTime } from "@/lib/markdown";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

// Content is CMS-managed — render per request so updates appear immediately.
export const dynamic = "force-dynamic";

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

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;
  const [categories, journals] = await Promise.all([
    getJournalCategories(),
    getPublishedJournals(),
  ]);

  const activeCategory = kategori ? categories.find((c) => c.slug === kategori) : undefined;
  const filtered = activeCategory
    ? journals.filter((j) => j.category?.slug === activeCategory.slug)
    : journals;

  const journalCards = filtered.map((j) => ({
    ...j,
    readingMinutes: readingTime(j.content),
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
        {/* Category chips */}
        <div className="flex flex-wrap items-center gap-2" role="navigation" aria-label="Filter kategori artikel">
          <Link
            href="/journal"
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
              href={`/journal?kategori=${cat.slug}`}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                activeCategory?.slug === cat.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {cat.name}
              <span className="ml-1.5 text-xs opacity-70">{cat._count.journals}</span>
            </Link>
          ))}
        </div>

        {journalCards.length === 0 ? (
          <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-border p-14 text-center">
            <Newspaper className="h-10 w-10 text-muted-foreground/50" />
            <p className="mt-4 font-medium">Belum ada artikel pada kategori ini.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Coba pilih kategori lain, atau kunjungi{" "}
              <Link href="/" className="text-primary hover:underline">
                halaman utama
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {journalCards.map((j, i) => (
              <article key={j.id} className={i === 0 && !activeCategory ? "sm:col-span-2 lg:col-span-1" : ""}>
                <JournalCard item={j} />
              </article>
            ))}
          </div>
        )}

        <p className="mt-10 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Artikel baru dipublikasikan secara berkala melalui ZDL CMS.
        </p>
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
