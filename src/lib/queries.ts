import { db } from "@/lib/db";

/** Shared data-access helpers for public pages (only published content). */

export const PORTFOLIO_SELECT = {
  id: true,
  title: true,
  slug: true,
  description: true,
  thumbnail: true,
  technologies: true,
  client: true,
  projectUrl: true,
  githubUrl: true,
  year: true,
  featured: true,
  categoryId: true,
  category: { select: { name: true, slug: true } },
  images: { orderBy: { sortOrder: "asc" as const } },
  createdAt: true,
  updatedAt: true,
} as const;

export const JOURNAL_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  featuredImage: true,
  categoryId: true,
  category: { select: { name: true, slug: true } },
  authorName: true,
  status: true,
  publishedAt: true,
  updatedAt: true,
  tags: { select: { tag: { select: { name: true, slug: true } } } },
  createdAt: true,
} as const;

export function getPublishedPortfolios(options?: { featuredOnly?: boolean; take?: number }) {
  return db.portfolio.findMany({
    where: {
      published: true,
      ...(options?.featuredOnly ? { featured: true } : {}),
    },
    select: PORTFOLIO_SELECT,
    orderBy: [{ featured: "desc" }, { year: "desc" }, { createdAt: "desc" }],
    ...(options?.take ? { take: options.take } : {}),
  });
}

export function getPortfolioBySlug(slug: string) {
  return db.portfolio.findFirst({
    where: { slug, published: true },
    select: PORTFOLIO_SELECT,
  });
}

export function getPortfolioCategories() {
  return db.portfolioCategory.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { portfolios: { where: { published: true } } } } },
  });
}

const publishedJournalWhere = {
  status: "PUBLISHED",
  OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
} as const;

export function getPublishedJournals(options?: { take?: number; categorySlug?: string }) {
  return db.journal.findMany({
    where: {
      ...publishedJournalWhere,
      ...(options?.categorySlug
        ? { category: { is: { slug: options.categorySlug } } }
        : {}),
    },
    select: JOURNAL_SELECT,
    orderBy: { publishedAt: "desc" },
    ...(options?.take ? { take: options.take } : {}),
  });
}

export function getJournalBySlug(slug: string) {
  return db.journal.findFirst({
    where: { slug, ...publishedJournalWhere },
    select: JOURNAL_SELECT,
  });
}

export function getJournalCategories() {
  return db.journalCategory.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { journals: { where: publishedJournalWhere as object } } } },
  });
}

/** Previous & next published articles ordered by publishedAt. */
export async function getJournalNeighbors(publishedAt: Date | null, currentId: string) {
  if (!publishedAt) return { prev: null, next: null };

  const [prev, next] = await Promise.all([
    db.journal.findFirst({
      where: {
        ...publishedJournalWhere,
        id: { not: currentId },
        publishedAt: { gt: publishedAt },
      },
      select: { title: true, slug: true },
      orderBy: { publishedAt: "asc" },
    }),
    db.journal.findFirst({
      where: {
        ...publishedJournalWhere,
        id: { not: currentId },
        publishedAt: { lt: publishedAt },
      },
      select: { title: true, slug: true },
      orderBy: { publishedAt: "desc" },
    }),
  ]);
  return { prev, next };
}

export function getRelatedJournals(categoryId: string | null, excludeId: string, take = 3) {
  return db.journal.findMany({
    where: {
      ...publishedJournalWhere,
      id: { not: excludeId },
      ...(categoryId ? { categoryId } : {}),
    },
    select: JOURNAL_SELECT,
    orderBy: { publishedAt: "desc" },
    take,
  });
}
