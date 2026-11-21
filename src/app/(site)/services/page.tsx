import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { CtaSection } from "@/components/site/cta-section";
import { getLocalizedServiceCategories } from "@/lib/services-data-en";
import { site } from "@/lib/site";
import { getI18n } from "@/i18n/server";
import { localePrefix } from "@/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: t.servicesIndex.metaTitle,
    description: t.servicesIndex.metaDesc,
    alternates: {
      canonical: "/services",
      languages: { "id-ID": "/services", en: "/en/services", "x-default": "/services" },
    },
    openGraph: {
      title: t.servicesIndex.ogTitle,
      description: t.servicesIndex.ogDesc,
      url: `${site.url}/services`,
      type: "website",
    },
  };
}

export default async function ServicesPage() {
  const { locale, t } = await getI18n();
  const categories = getLocalizedServiceCategories(locale);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${site.fullName} — ${t.servicesIndex.heroEyebrow}`,
    itemListElement: categories.map((c, i) => ({
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
        eyebrow={t.servicesIndex.heroEyebrow}
        title={
          <>
            {t.servicesIndex.heroTitlePre}{" "}
            <span className="font-serif-accent font-normal text-primary">
              {t.servicesIndex.heroTitleAccent}
            </span>
          </>
        }
        description={t.servicesIndex.heroDesc}
        meta={t.servicesIndex.meta}
      />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="border-y border-border">
          {categories.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 0.03}>
              <Link
                href={localePrefix(locale, `/services/${cat.slug}`)}
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
        title={t.servicesIndex.ctaTitle}
        description={t.servicesIndex.ctaDesc}
        secondaryLabel={t.servicesIndex.ctaSecondary}
        secondaryHref={localePrefix(locale, "/portfolio")}
      />
    </>
  );
}
