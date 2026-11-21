import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { db } from "@/lib/db";

export const revalidate = 3600;

type Entry = {
  url: string;
  lastModified?: Date;
  changeFrequency: "weekly" | "monthly" | "daily";
  priority: number;
};

/** Attach id/en hreflang alternates to each entry. */
function withAlternates(entries: Entry[]): MetadataRoute.Sitemap {
  return entries.map((e) => ({
    ...e,
    alternates: {
      languages: {
        "id-ID": e.url,
        en: `${site.url}/en${e.url === site.url ? "" : e.url.replace(site.url, "")}`,
        "x-default": e.url,
      },
    },
  }));
}

function pathUrl(path: string): string {
  return `${site.url}${path === "/" ? "" : path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;

  // Static pages
  const staticRoutes: Entry[] = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: pathUrl("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: pathUrl("/demo"), changeFrequency: "weekly", priority: 0.9 },
    { url: pathUrl("/portfolio"), changeFrequency: "weekly", priority: 0.9 },
    { url: pathUrl("/journal"), changeFrequency: "daily", priority: 0.8 },
    { url: pathUrl("/about"), changeFrequency: "monthly", priority: 0.6 },
    { url: pathUrl("/contact"), changeFrequency: "monthly", priority: 0.7 },
    { url: pathUrl("/demo/coba/kasir"), changeFrequency: "monthly", priority: 0.7 },
    { url: pathUrl("/demo/coba/booking"), changeFrequency: "monthly", priority: 0.7 },
    { url: pathUrl("/demo/coba/payment"), changeFrequency: "monthly", priority: 0.7 },
    { url: pathUrl("/demo/coba/payroll"), changeFrequency: "monthly", priority: 0.7 },
    { url: pathUrl("/demo/coba/absensi"), changeFrequency: "monthly", priority: 0.7 },
    { url: pathUrl("/demo/coba/gudang"), changeFrequency: "monthly", priority: 0.7 },
    { url: pathUrl("/demo/coba/saas"), changeFrequency: "monthly", priority: 0.7 },
    { url: pathUrl("/demo/coba/katalog"), changeFrequency: "monthly", priority: 0.7 },
    { url: pathUrl("/demo/coba/psikologi"), changeFrequency: "monthly", priority: 0.7 },
  ];

  // Dynamic content — wrapped so a DB hiccup never breaks the sitemap
  let portfolioEntries: Entry[] = [];
  let journalEntries: Entry[] = [];
  let serviceEntries: Entry[] = [];
  let demoEntries: Entry[] = [];

  try {
    const [portfolios, journals, demos] = await Promise.all([
      db.portfolio.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
      db.journal.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      db.demo.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    portfolioEntries = portfolios.map((p) => ({
      url: pathUrl(`/portfolio/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    journalEntries = journals.map((j) => ({
      url: pathUrl(`/journal/${j.slug}`),
      lastModified: j.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    demoEntries = demos.map((d) => ({
      url: pathUrl(`/demo/${d.slug}`),
      lastModified: d.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const { serviceCategories } = await import("@/lib/services-data");
    serviceEntries = serviceCategories.map((c) => ({
      url: pathUrl(`/services/${c.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("[SITEMAP]", error);
  }

  return withAlternates([
    ...staticRoutes,
    ...serviceEntries,
    ...demoEntries,
    ...portfolioEntries,
    ...journalEntries,
  ]);
}
