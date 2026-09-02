import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { Reveal } from "@/components/site/reveal";
import { CtaSection } from "@/components/site/cta-section";
import { serviceCategories } from "@/lib/services-data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Layanan — Jasa Web Development, Aplikasi, Sistem & Digital Growth",
  description:
    "Layanan ZDL: jasa pembuatan website, aplikasi mobile, SaaS, dashboard & sistem internal, otomasi Excel/Google Sheets, SEO, hingga domain & hosting. Melayani Tangerang, Jakarta, Jabodetabek, dan seluruh Indonesia.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Layanan ZDL — Web & App Development, Digital Solutions",
    description:
      "Enam lini layanan digital end-to-end: web development, application development, business system, productivity, digital growth, dan infrastructure.",
    url: `${site.url}/services`,
    type: "website",
  },
};

export default function ServicesPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Layanan ZDL — Zheng Digital Lab",
    itemListElement: serviceCategories.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `${site.url}/services/${c.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <section className="relative overflow-hidden border-b border-border/60">
        <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Breadcrumb items={[{ name: "Services" }]} />
            <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">
              Layanan yang saling <span className="text-gradient">terhubung</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Website, aplikasi, sistem internal, otomasi, dan digital growth —
              dikerjakan oleh satu tim yang memahami keseluruhan gambaran bisnis Anda.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-5 lg:grid-cols-2">
          {serviceCategories.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 0.05}>
              <Link
                href={`/services/${cat.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_12px_40px_-12px_rgba(139,92,246,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <cat.icon className="h-6 w-6" />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground/60">
                    0{i + 1}
                  </span>
                </div>
                <h2 className="mt-5 text-xl font-semibold tracking-tight group-hover:text-primary">
                  {cat.name}
                </h2>
                <p className="mt-1 text-sm font-medium text-primary/90">{cat.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {cat.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {cat.items.map((item) => (
                    <span
                      key={item.name}
                      className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-primary">
                  Detail layanan
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaSection
        title="Belum yakin mulai dari mana?"
        description="Itu normal. Banyak klien datang dengan masalah, bukan dengan spesifikasi. Ceritakan masalahnya — kami bantu terjemahkan menjadi solusi yang tepat dan bertahap."
        secondaryLabel="Lihat portfolio kami"
        secondaryHref="/portfolio"
      />
    </>
  );
}
