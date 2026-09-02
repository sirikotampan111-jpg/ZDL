import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ExternalLink,
  Github,
  User,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { PortfolioCard } from "@/components/site/portfolio-card";
import { CtaSection } from "@/components/site/cta-section";
import { getPortfolioBySlug, getPublishedPortfolios } from "@/lib/queries";
import { parseJsonArray } from "@/lib/markdown";
import { waLink, site } from "@/lib/site";

export async function generateStaticParams() {
  const items = await getPublishedPortfolios();
  return items.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPortfolioBySlug(slug);
  if (!item) return {};

  const title = item.seoTitle || `${item.title} — Studi Kasus Project`;
  const description =
    item.seoDescription ||
    `${item.description.slice(0, 150)}…`;

  return {
    title,
    description,
    alternates: { canonical: `/portfolio/${item.slug}` },
    openGraph: {
      title,
      description,
      url: `${site.url}/portfolio/${item.slug}`,
      type: "article",
      images: item.thumbnail ? [{ url: item.thumbnail }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: item.thumbnail ? [item.thumbnail] : undefined,
    },
  };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getPortfolioBySlug(slug);
  if (!item) notFound();

  const techs = parseJsonArray(item.technologies);
  const all = await getPublishedPortfolios();
  const related = all
    .filter((p) => p.id !== item.id && p.category?.slug === item.category?.slug)
    .slice(0, 3);
  const fallbackRelated = all.filter((p) => p.id !== item.id).slice(0, 3);
  const relatedItems = related.length > 0 ? related : fallbackRelated;

  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: item.title,
    description: item.seoDescription || item.description,
    url: `${site.url}/portfolio/${item.slug}`,
    image: item.thumbnail ? `${site.url}${item.thumbnail}` : undefined,
    dateCreated: item.year ? String(item.year) : undefined,
    creator: { "@id": `${site.url}/#organization` },
    ...(item.category ? { genre: item.category.name } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
      />

      <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <Breadcrumb
          items={[
            { name: "Portfolio", href: "/portfolio" },
            ...(item.category
              ? [{ name: item.category.name, href: `/portfolio?kategori=${item.category.slug}` }]
              : []),
            { name: item.title },
          ]}
        />

        {/* Header */}
        <header className="mt-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {item.category && (
              <span className="rounded-full bg-accent px-3 py-1 font-medium text-accent-foreground">
                {item.category.name}
              </span>
            )}
            {item.year && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {item.year}
              </span>
            )}
            {item.client && (
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {item.client}
              </span>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {item.title}
          </h1>
        </header>

        {/* Thumbnail */}
        {item.thumbnail && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-muted">
            <Image
              src={item.thumbnail}
              alt={`Tampilan project ${item.title}`}
              fill
              priority
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover"
            />
          </div>
        )}

        {/* Body */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Tentang project</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
              {item.description.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Gallery */}
            {item.images.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-semibold tracking-tight">Galeri</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {item.images.map((img) => (
                    <div
                      key={img.id}
                      className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted"
                    >
                      <Image
                        src={img.url}
                        alt={img.alt || `Galeri project ${item.title}`}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="flex items-center gap-2 font-semibold">
                <Layers className="h-4 w-4 text-primary" />
                Teknologi
              </h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {techs.length > 0 ? (
                  techs.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {t}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
              </div>

              <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
                {item.client && (
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">Klien</dt>
                    <dd className="mt-0.5 font-medium">{item.client}</dd>
                  </div>
                )}
                {item.year && (
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">Tahun</dt>
                    <dd className="mt-0.5 font-medium">{item.year}</dd>
                  </div>
                )}
                {item.category && (
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">Kategori</dt>
                    <dd className="mt-0.5 font-medium">{item.category.name}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-6 space-y-2.5 border-t border-border pt-5">
                {item.projectUrl && (
                  <Button asChild className="w-full rounded-full bg-primary text-primary-foreground">
                    <a href={item.projectUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Lihat live project
                    </a>
                  </Button>
                )}
                {item.githubUrl && (
                  <Button asChild variant="outline" className="w-full rounded-full">
                    <a href={item.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      Source code
                    </a>
                  </Button>
                )}
                <Button asChild variant="outline" className="w-full rounded-full">
                  <a
                    href={waLink(`Halo ZDL, saya melihat project "${item.title}" di portfolio. Saya ingin membangun project serupa.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Bangun project serupa
                  </a>
                </Button>
              </div>
            </div>

            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke portfolio
            </Link>
          </aside>
        </div>

        {/* Related */}
        {relatedItems.length > 0 && (
          <section className="mt-16 border-t border-border pt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Project terkait</h2>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Semua portfolio
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedItems.map((p) => (
                <PortfolioCard key={p.id} item={p} />
              ))}
            </div>
          </section>
        )}
      </article>

      <CtaSection
        title="Tertarik membangun project seperti ini?"
        description="Ceritakan kebutuhan bisnis Anda — kami bantu dari perencanaan hingga deployment, dengan proses yang jelas di setiap tahapnya."
        secondaryLabel="Pelajari layanan kami"
        secondaryHref="/services"
      />
    </>
  );
}
