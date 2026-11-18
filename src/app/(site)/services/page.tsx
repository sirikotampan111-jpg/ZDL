import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
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

      <PageHero
        breadcrumb={[{ name: "Services" }]}
        eyebrow="Layanan"
        title={
          <>
            Satu tim,{" "}
            <span className="font-serif-accent font-normal text-primary">
              enam lini kerja
            </span>
          </>
        }
        description="Website, aplikasi, sistem internal, otomasi, dan digital growth — semua dikerjakan internal oleh tim yang sama, tanpa subkontraktor. Kalau ada yang perlu diubah, Anda tahu harus bicara dengan siapa."
        meta={["6 lini layanan", "Tanpa subkontraktor", "Tangerang — seluruh Indonesia"]}
      />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="border-y border-border">
          {serviceCategories.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 0.03}>
              <Link
                href={`/services/${cat.slug}`}
                className="group -mx-4 grid gap-4 border-b border-border px-4 py-8 transition-colors last:border-b-0 hover:bg-muted/40 sm:mx-0 sm:grid-cols-[4rem_1fr_auto] sm:gap-6 sm:px-4"
              >
                <span className="mono-label pt-1.5 text-muted-foreground/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight group-hover:text-primary">
                    {cat.name}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-primary/90">{cat.tagline}</p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {cat.description}
                  </p>
                  <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground/70">
                    {cat.items.map((it) => it.name).join(" · ")}
                  </p>
                </div>
                <span className="hidden h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-all group-hover:translate-x-1 group-hover:border-primary group-hover:text-primary sm:flex">
                  <ArrowRight className="h-4 w-4" />
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
