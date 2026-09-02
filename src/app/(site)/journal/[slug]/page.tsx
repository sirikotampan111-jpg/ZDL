import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock, RefreshCcw, Tag, User } from "lucide-react";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { MarkdownContent } from "@/components/site/markdown-content";
import { TableOfContents } from "@/components/site/table-of-contents";
import { ShareButtons } from "@/components/site/share-buttons";
import { JournalCard } from "@/components/site/journal-card";
import { CtaSection } from "@/components/site/cta-section";
import {
  getJournalBySlug,
  getJournalNeighbors,
  getRelatedJournals,
  getPublishedJournals,
} from "@/lib/queries";
import { extractToc, readingTime } from "@/lib/markdown";
import { formatDate, site } from "@/lib/site";

export async function generateStaticParams() {
  const items = await getPublishedJournals();
  return items.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const article = await getJournalBySlug(slug);
  if (!article) return {};

  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt || article.title;
  const ogImage = article.ogImage || article.featuredImage || undefined;
  const canonical = article.canonicalUrl || `/journal/${article.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: `${site.url}/journal/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.authorName || site.legalName],
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getJournalBySlug(slug);
  if (!article) notFound();

  const [toc, neighbors, related] = await Promise.all([
    Promise.resolve(extractToc(article.content)),
    getJournalNeighbors(article.publishedAt, article.id),
    getRelatedJournals(article.categoryId, article.id, 3),
  ]);

  const minutes = readingTime(article.content);
  const relatedCards = related
    .filter((r) => r.id !== article.id)
    .slice(0, 3)
    .map((r) => ({ ...r, readingMinutes: readingTime(r.content) }));

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seoDescription || article.excerpt || undefined,
    image: article.featuredImage ? `${site.url}${article.featuredImage}` : `${site.url}/og-image.png`,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: article.authorName || site.legalName,
      url: site.url,
    },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${site.url}/journal/${article.slug}`,
    },
    inLanguage: "id-ID",
    ...(article.tags.length > 0
      ? { keywords: article.tags.map((t) => t.tag.name).join(", ") }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <Breadcrumb
          items={[
            { name: "Journal", href: "/journal" },
            ...(article.category
              ? [{ name: article.category.name, href: `/journal?kategori=${article.category.slug}` }]
              : []),
            { name: article.title },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_280px]">
          {/* Main article */}
          <div className="min-w-0">
            <header>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {article.category && (
                  <Link
                    href={`/journal?kategori=${article.category.slug}`}
                    className="rounded-full bg-accent px-3 py-1 font-medium text-accent-foreground hover:underline"
                  >
                    {article.category.name}
                  </Link>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {minutes} menit baca
                </span>
                {article.publishedAt && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDate(article.publishedAt)}
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>
              )}

              <div className="mt-6 flex items-center justify-between gap-4 border-y border-border py-4">
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </span>
                  {article.authorName || "Tim ZDL"}
                </span>
                <ShareButtons
                  url={`${site.url}/journal/${article.slug}`}
                  title={article.title}
                />
              </div>
            </header>

            {article.featuredImage && (
              <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-muted">
                <Image
                  src={article.featuredImage}
                  alt={`Ilustrasi artikel: ${article.title}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover"
                />
              </div>
            )}

            {/* TOC (mobile) */}
            {toc.length >= 3 && (
              <div className="mt-8 lg:hidden">
                <TableOfContents items={toc} />
              </div>
            )}

            <div className="mt-8">
              <MarkdownContent content={article.content} />
            </div>

            {/* Tags + updated */}
            <footer className="mt-12 space-y-4 border-t border-border pt-6">
              {article.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {article.tags.map(({ tag }) => (
                    <span
                      key={tag.slug}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
              <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <RefreshCcw className="h-3.5 w-3.5" />
                Terakhir diperbarui {formatDate(article.updatedAt)}
              </p>
            </footer>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <TableOfContents items={toc} />
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
                <p className="font-semibold leading-snug">
                  Butuh partner untuk membangun sistem digital bisnis Anda?
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Konsultasi gratis via WhatsApp — tanpa kewajiban.
                </p>
                <Link
                  href="/contact"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  Hubungi ZDL
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Prev / Next */}
        {(neighbors.prev || neighbors.next) && (
          <nav
            aria-label="Artikel sebelumnya dan berikutnya"
            className="mt-14 grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
          >
            {neighbors.prev ? (
              <Link
                href={`/journal/${neighbors.prev.slug}`}
                className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Artikel sebelumnya
                </span>
                <p className="mt-2 font-semibold leading-snug group-hover:text-primary">
                  {neighbors.prev.title}
                </p>
              </Link>
            ) : (
              <span />
            )}
            {neighbors.next && (
              <Link
                href={`/journal/${neighbors.next.slug}`}
                className="group rounded-2xl border border-border bg-card p-5 text-right transition-colors hover:border-primary/40"
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  Artikel berikutnya
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
                <p className="mt-2 font-semibold leading-snug group-hover:text-primary">
                  {neighbors.next.title}
                </p>
              </Link>
            )}
          </nav>
        )}

        {/* Related */}
        {relatedCards.length > 0 && (
          <section className="mt-14 border-t border-border pt-10">
            <h2 className="text-2xl font-bold tracking-tight">Artikel terkait</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCards.map((r) => (
                <JournalCard key={r.id} item={r} />
              ))}
            </div>
          </section>
        )}
      </article>

      <CtaSection
        secondaryLabel={null}
        title="Punya pertanyaan seputar topik ini?"
        description="Diskusi singkat via WhatsApp bisa menjawab banyak hal — ceritakan konteks bisnis Anda dan kami bantu arahkan."
      />
    </>
  );
}
