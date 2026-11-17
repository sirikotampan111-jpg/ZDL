import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { db } from "@/lib/db";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/demo`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/portfolio`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/journal`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/demo/coba/kasir`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/demo/coba/booking`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/demo/coba/payment`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/demo/coba/payroll`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/demo/coba/absensi`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/demo/coba/gudang`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/demo/coba/saas`, changeFrequency: "monthly", priority: 0.7 },
  ];

  // Dynamic content — wrapped so a DB hiccup never breaks the sitemap
  let portfolioEntries: MetadataRoute.Sitemap = [];
  let journalEntries: MetadataRoute.Sitemap = [];
  let serviceEntries: MetadataRoute.Sitemap = [];
  let demoEntries: MetadataRoute.Sitemap = [];

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
      url: `${base}/portfolio/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    journalEntries = journals.map((j) => ({
      url: `${base}/journal/${j.slug}`,
      lastModified: j.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    demoEntries = demos.map((d) => ({
      url: `${base}/demo/${d.slug}`,
      lastModified: d.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const { serviceCategories } = await import("@/lib/services-data");
    serviceEntries = serviceCategories.map((c) => ({
      url: `${base}/services/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("[SITEMAP]", error);
  }

  return [...staticRoutes, ...serviceEntries, ...demoEntries, ...portfolioEntries, ...journalEntries];
}
