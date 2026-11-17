import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, FlaskConical, Lock, MessageCircle, MousePointerClick, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { DemoCard } from "@/components/site/demo-card";
import { CtaSection } from "@/components/site/cta-section";
import { getDemoBySlug, getPublishedDemos } from "@/lib/queries";
import { parseJsonArray } from "@/lib/markdown";
import { waLink, site } from "@/lib/site";

// Content is CMS-managed — cached via ISR and revalidated on-demand
// when demo entries change through the admin API (see src/app/api/admin/demo).
export const revalidate = 300;

export async function generateStaticParams() {
  const items = await getPublishedDemos();
  return items.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const item = await getDemoBySlug(slug);
  if (!item) return {};

  const title = item.seoTitle || `${item.title} — Demo Interaktif ZDL`;
  const description = item.seoDescription || `${item.description.slice(0, 150)}…`;

  return {
    title,
    description,
    alternates: { canonical: `/demo/${item.slug}` },
    openGraph: {
      title,
      description,
      url: `${site.url}/demo/${item.slug}`,
      type: "website",
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

export default async function DemoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getDemoBySlug(slug);
  if (!item) notFound();

  const techs = parseJsonArray(item.technologies);
  const all = await getPublishedDemos();
  const related = all
    .filter((d) => d.id !== item.id && d.category && d.category === item.category)
    .slice(0, 3);
  const fallbackRelated = all.filter((d) => d.id !== item.id).slice(0, 3);
  const relatedItems = related.length > 0 ? related : fallbackRelated;

  const isRequest = item.accessType === "REQUEST";
  const isInternal = item.demoUrl.startsWith("/");

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: item.title,
    description: item.seoDescription || item.description,
    url: `${site.url}/demo/${item.slug}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    ...(item.thumbnail ? { image: `${site.url}${item.thumbnail}` } : {}),
    offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
    author: { "@id": `${site.url}/#organization` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />

      <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <Breadcrumb
          items={[
            { name: "Demo", href: "/demo" },
            ...(item.category ? [{ name: item.category, href: `/demo` }] : []),
            { name: item.title },
          ]}
        />

        {/* Header */}
        <header className="mt-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {item.category && (
              <span className="rounded-full bg-accent px-3 py-1 font-medium text-accent-foreground">
                {item.category}
              </span>
            )}
            {isRequest ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                <Lock className="h-3.5 w-3.5" />
                Akses via WhatsApp
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <MousePointerClick className="h-3.5 w-3.5" />
                Bisa dicoba langsung
              </span>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {item.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {item.description.split("\n\n")[0]}
          </p>
        </header>

        {/* Thumbnail */}
        {item.thumbnail && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-muted">
            <Image
              src={item.thumbnail}
              alt={`Tampilan demo ${item.title}`}
              fill
              priority
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover"
            />
          </div>
        )}

        {/* Primary CTA */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {isRequest ? (
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary text-primary-foreground"
            >
              <a
                href={waLink(`Halo ZDL, saya ingin minta akses demo "${item.title}". Terima kasih.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Minta akses demo via WhatsApp
              </a>
            </Button>
          ) : isInternal ? (
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary text-primary-foreground"
            >
              <Link href={item.demoUrl}>
                <MousePointerClick className="mr-2 h-5 w-5" />
                Coba demo sekarang
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary text-primary-foreground"
            >
              <a href={item.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" />
                Buka demo sekarang
              </a>
            </Button>
          )}
          <p className="text-sm text-muted-foreground">
            {isRequest
              ? "Demo ini butuh kredensial — kredensial dibagikan lewat WhatsApp."
              : "Demo berjalan di browser, tidak perlu daftar atau install."}
          </p>
        </div>

        {/* Body */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Tentang demo ini</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
              {item.description.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {item.notes && (
              <div className="mt-10">
                <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                  <FlaskConical className="h-5 w-5 text-primary" />
                  Yang bisa Anda coba
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
                  {item.notes.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-8 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              Catatan: semua data pada demo ini adalah <strong className="text-foreground">data simulasi</strong> —
              tidak ada informasi asli yang disimpan. Versi produksi dibuat khusus
              sesuai kebutuhan bisnis Anda.
            </p>
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
                {item.category && (
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">Kategori</dt>
                    <dd className="mt-0.5 font-medium">{item.category}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Tipe akses</dt>
                  <dd className="mt-0.5 font-medium">
                    {isRequest ? "Via WhatsApp (kredensial)" : "Publik — langsung dicoba"}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 space-y-2.5 border-t border-border pt-5">
                <Button asChild variant="outline" className="w-full rounded-full">
                  <a
                    href={waLink(`Halo ZDL, saya melihat demo "${item.title}". Saya ingin membangun sistem serupa untuk bisnis saya.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Bangun versi asli untuk saya
                  </a>
                </Button>
              </div>
            </div>

            <Link
              href="/demo"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke galeri demo
            </Link>
          </aside>
        </div>

        {/* Related */}
        {relatedItems.length > 0 && (
          <section className="mt-16 border-t border-border pt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Demo lainnya</h2>
              <Link
                href="/demo"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Semua demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedItems.map((d) => (
                <DemoCard key={d.id} item={d} />
              ))}
            </div>
          </section>
        )}
      </article>

      <CtaSection
        title="Dari simulasi ke sistem nyata"
        description="Yang Anda coba di sini hanya permukaannya. Versi produksinya mencakup data bisnis Anda, laporan, keamanan, dan integrasi — dibangun sesuai alur kerja Anda."
        secondaryLabel="Pelajari layanan kami"
        secondaryHref="/services"
      />
    </>
  );
}
