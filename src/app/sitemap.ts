import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/portfolio`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/journal`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.7 },
  ];

  // Dynamic content — wrapped so a DB hiccup never breaks the sitemap
  let portfolioEntries: MetadataRoute.Sitemap = [];
  let journalEntries: MetadataRoute.Sitemap = [];
  let serviceEntries: MetadataRoute.Sitemap = [];

  try {
    const [portfolios, journals] = await Promise.all([
      db.portfolio.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
      db.journal.findMany({
        where: { status: "PUBLISHED" },
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

    const { serviceCategories } = await import("@/lib/services-data");
    serviceEntries = serviceCategories.map((c) => ({
      url: `${base}/services/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("[SITEMAP]", error);
  }

  return [...staticRoutes, ...serviceEntries, ...portfolioEntries, ...journalEntries];
}
