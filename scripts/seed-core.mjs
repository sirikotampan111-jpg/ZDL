/**
 * ZDL — Core seed (production-safe, idempotent)
 * Runs automatically during Vercel build (see vercel.json).
 *
 * Creates ONLY what the site needs to boot:
 *   1. Admin account        (from ADMIN_EMAIL / ADMIN_PASSWORD env, or defaults)
 *   2. Portfolio categories (10)
 *   3. Journal categories   (10)
 *
 * Safe to run repeatedly — everything is an upsert on unique keys.
 * Sample content is NOT created here; add real content via CMS
 * or run the full `prisma/seed.ts` locally.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const portfolioCategories = [
  { name: "Website", slug: "website", description: "Landing page, company profile, e-commerce, dan custom website." },
  { name: "Web App", slug: "web-app", description: "Aplikasi web custom untuk kebutuhan bisnis." },
  { name: "Mobile App", slug: "mobile-app", description: "Aplikasi mobile Android & iOS." },
  { name: "E-Commerce", slug: "e-commerce", description: "Toko online dan platform jual-beli." },
  { name: "SaaS", slug: "saas", description: "Software as a Service untuk berbagai industri." },
  { name: "Dashboard", slug: "dashboard", description: "Admin dashboard, monitoring, dan reporting." },
  { name: "CMS", slug: "cms", description: "Content management system custom." },
  { name: "Game", slug: "game", description: "Game interaktif dan gamifikasi." },
  { name: "Automation", slug: "automation", description: "Otomasi proses bisnis dan workflow." },
  { name: "Other", slug: "other", description: "Project digital lainnya." },
];

const journalCategories = [
  { name: "Web Development", slug: "web-development" },
  { name: "Mobile Development", slug: "mobile-development" },
  { name: "AI", slug: "ai" },
  { name: "Programming", slug: "programming" },
  { name: "SEO", slug: "seo" },
  { name: "Digital Marketing", slug: "digital-marketing" },
  { name: "Business", slug: "business" },
  { name: "Technology", slug: "technology" },
  { name: "Tutorial", slug: "tutorial" },
  { name: "Case Study", slug: "case-study" },
];

const email = process.env.ADMIN_EMAIL || "admin@zdl.my.id";
const password = process.env.ADMIN_PASSWORD || "ZdlAdmin2026!";

try {
  const passwordHash = await bcrypt.hash(password, 12);
  await db.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "ZDL Admin", passwordHash, role: "ADMIN" },
  });
  console.log(`[seed-core] Admin ready: ${email}`);

  for (const c of portfolioCategories) {
    await db.portfolioCategory.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }
  for (const c of journalCategories) {
    await db.journalCategory.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }
  console.log(
    `[seed-core] Categories ready: ${portfolioCategories.length} portfolio + ${journalCategories.length} journal`
  );
  console.log("[seed-core] Done ✔");
} catch (err) {
  console.error("[seed-core] FAILED:", err?.message || err);
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
