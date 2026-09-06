/**
 * ZDL — Reproduce admin dashboard queries against production Neon DB.
 * Mirrors src/app/admin/(dashboard)/page.tsx Promise.all block.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

try {
  const t0 = Date.now();
  const results = await Promise.all([
    db.portfolio.count(),
    db.journal.count(),
    db.journal.count({ where: { status: "PUBLISHED" } }),
    db.journal.count({ where: { status: "DRAFT" } }),
    db.portfolioCategory.count(),
    db.journalCategory.count(),
    db.contactMessage.count({ where: { isRead: false } }),
    db.portfolio.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
    db.journal.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
    db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  console.log("ALL QUERIES OK in", Date.now() - t0, "ms");
  console.log("counts:", results.slice(0, 7).join(", "));
  console.log("recentPortfolios:", results[7].length, "| recentJournals:", results[8].length, "| recentMessages:", results[9].length);
} catch (err) {
  console.error("QUERY FAILED:", err?.message);
  console.error(err?.stack?.split("\n").slice(0, 6).join("\n"));
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
