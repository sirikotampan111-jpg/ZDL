import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { Reveal } from "@/components/site/reveal";
import { CtaSection } from "@/components/site/cta-section";
import { serviceCategories, getServiceCategory } from "@/lib/services-data";
import { waLink, site } from "@/lib/site";

export function generateStaticParams() {
  return serviceCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const cat = getServiceCategory(slug);
  if (!cat) return {};

  const title = `${cat.name} — Jasa ${cat.shortName} Profesional`;
  return {
    title,
    description: cat.description.slice(0, 160),
    alternates: { canonical: `/services/${cat.slug}` },
    openGraph: {
      title,
      description: cat.description.slice(0, 160),
      url: `${site.url}/services/${cat.slug}`,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description: cat.description.slice(0, 160) },
  };
}

export default async function ServiceCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getServiceCategory(slug);
  if (!cat) notFound();

  const Icon = cat.icon;
  const others = serviceCategories.filter((c) => c.slug !== cat.slug);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Jasa ${cat.name}`,
    serviceType: cat.name,
    description: cat.description,
    provider: { "@id": `${site.url}/#organization` },
    areaServed: site.location.serviceAreas.map((a) => ({ "@type": "Place", name: a })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: cat.name,
      itemListElement: cat.items.map((item) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: item.name, description: item.description },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      <section className="relative overflow-hidden border-b border-border/60">
        <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <Breadcrumb items={[{ name: "Services", href: "/services" }, { name: cat.name }]} />
          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-7 w-7" />
              </span>
              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                {cat.name} — <span className="text-gradient">{cat.tagline}</span>
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {cat.description}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full bg-primary font-semibold text-primary-foreground">
                  <a href={waLink(`Halo ZDL, saya tertarik dengan layanan ${cat.name}. Bisa konsultasi dulu?`)} target="_blank" rel="noopener noreferrer">
                    Konsultasikan Project Anda
                  </a>
                </Button>
              </div>
            </div>
            <Reveal className="lg:w-96">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="flex items-center gap-2 font-semibold">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Cocok untuk
                </h2>
                <ul className="mt-4 space-y-3">
                  {cat.useCases.map((uc) => (
                    <li key={uc} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {uc}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Service items */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Lingkup layanan {cat.name}
        </h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {cat.items.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.05}>
              <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                <h3 className="text-lg font-semibold tracking-tight text-primary">{item.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Manfaat</p>
                  <ul className="mt-2 space-y-1.5">
                    {item.benefits.map((b) => (
                      <li key={b} className="flex gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Contoh penggunaan</p>
                  <ul className="mt-2 space-y-1.5">
                    {item.examples.map((e) => (
                      <li key={e} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={waLink(`Halo ZDL, saya ingin konsultasi mengenai ${item.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-primary hover:underline"
                >
                  Konsultasi {item.name}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Other services */}
      <section className="border-t border-border/60 bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-xl font-bold tracking-tight">Layanan lainnya</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/services/${o.slug}`}
                className="group rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/40"
              >
                <o.icon className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-semibold group-hover:text-primary">{o.name}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{o.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        title={`Butuh ${cat.name.toLowerCase()} untuk bisnis Anda?`}
        description="Ceritakan kebutuhan Anda lewat WhatsApp — kami bantu petakan solusi yang paling sesuai tanpa kewajiban apa pun."
        secondaryLabel="Kembali ke semua layanan"
        secondaryHref="/services"
      />
    </>
  );
}
