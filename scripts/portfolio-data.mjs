/**
 * ZDL — REAL portfolio data (16 client websites, provided by the owner).
 * Covers are pre-generated branded PNGs (scripts/covers/cover-<slug>.png)
 * uploaded into the database (Media bytea) — no external storage.
 *
 * seedPortfolios(db):
 *   1. removes obsolete seeded sample portfolios
 *   2. ensures the industry categories exist
 *   3. uploads each cover into Media (idempotent by filename)
 *   4. creates portfolio entries whose slug does not exist yet
 *      (existing slugs are never overwritten → CMS edits stay safe)
 */
import fs from "node:fs";
import path from "node:path";

export const OLD_SEED_SLUGS = [
  "website-company-profile-modern",
  "toko-online-fashion",
  "dashboard-admin-laporan",
  "aplikasi-kasir-mobile",
  "sistem-booking-online",
  "otomasi-laporan-whatsapp",
];

export const PORTFOLIO_CATEGORIES = [
  { name: "Kuliner & F&B", slug: "kuliner-fnb", description: "Website restoran, catering, dan brand F&B." },
  { name: "Kecantikan & Lifestyle", slug: "kecantikan-lifestyle", description: "Website brand kecantikan, skincare, dan lifestyle." },
  { name: "Transportasi & Logistik", slug: "transportasi-logistik", description: "Website rental, ekspedisi, dan jasa transportasi." },
  { name: "Edukasi", slug: "edukasi", description: "Website lembaga pendidikan dan bimbingan belajar." },
  { name: "Properti", slug: "properti", description: "Website developer, perumahan, dan pemasaran properti." },
  { name: "Interior & Konstruksi", slug: "interior-konstruksi", description: "Website jasa interior, material bangunan, dan konstruksi." },
  { name: "Industri & Energi", slug: "industri-energi", description: "Website industri, fabrikasi, dan energi." },
  { name: "Organisasi & Asosiasi", slug: "organisasi-asosiasi", description: "Website organisasi, asosiasi, dan komunitas profesi." },
];

const ZDL = "Dikembangkan & dikelola oleh ZDL.";

export const REAL_PORTFOLIOS = [
  {
    slug: "pawonbhoga-id",
    title: "Pawon Bhoga Catering — pawonbhoga.id",
    categorySlug: "kuliner-fnb",
    domain: "pawonbhoga.id",
    featured: true,
    description: `Jasa catering Surabaya, Sidoarjo & Gresik: nasi kotak premium, tumpeng hias, catering harian rumah/kantor, dan pesanan acara dengan pengiriman cepat. ${ZDL}`,
  },
  {
    slug: "kinsuroi-com",
    title: "KINSUROI Skincare — kinsuroi.com",
    categorySlug: "kecantikan-lifestyle",
    domain: "kinsuroi.com",
    featured: false,
    description: `Situs resmi brand kecantikan KINSUROI — ritual perawatan sederhana & elegan: pembersih, serum, perawatan bibir, dan tubuh. ${ZDL}`,
  },
  {
    slug: "sewamotorjakarta-co-id",
    title: "Rajawali Motorcycle Rental — sewamotorjakarta.co.id",
    categorySlug: "transportasi-logistik",
    domain: "sewamotorjakarta.co.id",
    featured: true,
    description: `Jasa sewa motor harian, mingguan & bulanan untuk DKI Jakarta dan Tangerang. Armada Honda Beat, Vario, NMAX, PCX, hingga Aerox — terawat dan nyaman. ${ZDL}`,
  },
  {
    slug: "kirimikanhias-com",
    title: "Bettalover Express — kirimikanhias.com",
    categorySlug: "transportasi-logistik",
    domain: "kirimikanhias.com",
    featured: false,
    description: `Website layanan kirim ikan hias Bettalover Express. ${ZDL}`,
  },
  {
    slug: "bimbelstarlish-com",
    title: "Starlish Bimbel — bimbelstarlish.com",
    categorySlug: "edukasi",
    domain: "bimbelstarlish.com",
    featured: false,
    description: `Lembaga bimbingan belajar di Gading Serpong: program Calistung TK, bimbel SD, SMP & SMA dengan kelas kecil, guru berpengalaman, dan sistem belajar terstruktur. ${ZDL}`,
  },
  {
    slug: "liviarealestate-asia",
    title: "Livia Real Estate — liviarealestate.asia",
    categorySlug: "properti",
    domain: "liviarealestate.asia",
    featured: true,
    description: `Pemasaran hunian Springhill Yume Lagoon di Cisauk, Tangerang — perumahan modern 15 hektar, siap huni, bebas banjir, langsung dari sales resmi developer. ${ZDL}`,
  },
  {
    slug: "kementriansegosbebek-id",
    title: "Kementrian Sego's Bebek — kementriansegosbebek.id",
    categorySlug: "kuliner-fnb",
    domain: "kementriansegosbebek.id",
    featured: false,
    description: `Restoran bebek bumbu hitam premium di Sidoarjo — dine in, delivery, catering, hingga kemitraan franchise. ${ZDL}`,
  },
  {
    slug: "kopikir-store",
    title: "KOPIKIR Coffee & Culture — kopikir.store",
    categorySlug: "kuliner-fnb",
    domain: "kopikir.store",
    featured: false,
    description: `Situs resmi KOPIKIR — brand coffee & culture dengan pengalaman digital yang bersih dan modern. ${ZDL}`,
  },
  {
    slug: "genesisxproperty-com",
    title: "Park Serpong Legok by Lippo — genesisxproperty.com",
    categorySlug: "properti",
    domain: "genesisxproperty.com",
    featured: false,
    description: `Situs resmi Park Serpong Legok by Lippo — hunian modern dan strategis di Legok, Tangerang, dengan fasilitas lengkap dan akses mudah. ${ZDL}`,
  },
  {
    slug: "terradekor-com",
    title: "Terradekor Interior — terradekor.com",
    categorySlug: "interior-konstruksi",
    domain: "terradekor.com",
    featured: false,
    description: `Terradekor (PT Opulent Interior Indonesia) — solusi interior & konstruksi premium untuk hunian dan bisnis. ${ZDL}`,
  },
  {
    slug: "designhomeliving-org",
    title: "Desain Home Living — designhomeliving.org",
    categorySlug: "interior-konstruksi",
    domain: "designhomeliving.org",
    featured: false,
    description: `Solusi material & jasa interior-eksterior di Tangerang: pemasangan WPC, vinyl, SPC, decking, dan plafon PVC profesional. ${ZDL}`,
  },
  {
    slug: "lianahomeinterior-com",
    title: "Liana Home Interior — lianahomeinterior.com",
    categorySlug: "interior-konstruksi",
    domain: "lianahomeinterior.com",
    featured: false,
    description: `Jasa interior profesional di Bekasi — kitchen set, custom furniture, wall panel, vinyl lantai, renovasi, dan desain interior. ${ZDL}`,
  },
  {
    slug: "allin-web-id",
    title: "ALLIN — Asosiasi Industri Ketenagalistrikan — allin.web.id",
    categorySlug: "organisasi-asosiasi",
    domain: "allin.web.id",
    featured: false,
    description: `Situs resmi ALLIN — Asosiasi Lingkungan Industri Ketenagalistrikan Nasional, organisasi para pelaku industri ketenagalistrikan Indonesia. ${ZDL}`,
  },
  {
    slug: "pawonbhoga-com",
    title: "Pawon Bhoga Catering — pawonbhoga.com",
    categorySlug: "kuliner-fnb",
    domain: "pawonbhoga.com",
    featured: false,
    description: `Domain .com resmi Pawon Bhoga — jasa catering Surabaya, Sidoarjo & Gresik: nasi box, snackbox, tumpeng, dan prasmanan. ${ZDL}`,
  },
  {
    slug: "lantaifutsalsurabaya-asia",
    title: "H2 Sport Surabaya — lantaifutsalsurabaya.asia",
    categorySlug: "interior-konstruksi",
    domain: "lantaifutsalsurabaya.asia",
    featured: false,
    description: `H2 Sport Surabaya — supplier & pemasangan lantai olahraga: futsal, minisoccer, padel, dan basket. Konsultasi gratis via WhatsApp. ${ZDL}`,
  },
  {
    slug: "migasstell-com",
    title: "Migas Stell — migasstell.com",
    categorySlug: "industri-energi",
    domain: "migasstell.com",
    featured: true,
    description: `Fabrikasi tangki migas & industri: tangki BBM, avtur, solar, LPG, skid tank, pressure vessel, dan piping untuk sektor migas, LNG, petrokimia, dan manufaktur. ${ZDL}`,
  },
];

/**
 * English translations for the real portfolio entries (used on /en pages).
 * Applied on create AND enriched onto existing rows whose translations
 * are still empty — CMS-managed ID content is never overwritten.
 */
const EN = {
  "pawonbhoga-id": {
    description: `Catering service for Surabaya, Sidoarjo & Gresik: premium lunch boxes, ornamental tumpeng rice cones, daily home/office catering, and event orders with fast delivery. ${ZDL}`,
  },
  "kinsuroi-com": {
    description: `Official site of KINSUROI — a simple & elegant skincare ritual brand: cleansers, serums, lip care, and body care. ${ZDL}`,
  },
  "sewamotorjakarta-co-id": {
    description: `Daily, weekly & monthly motorcycle rental for DKI Jakarta and Tangerang. Honda Beat, Vario, NMAX, PCX up to Aerox — well-maintained and comfortable. ${ZDL}`,
  },
  "kirimikanhias-com": {
    description: `Website of Bettalover Express, an ornamental fish shipping service. ${ZDL}`,
  },
  "bimbelstarlish-com": {
    title: "Starlish Tutoring Centre — bimbelstarlish.com",
    description: `A tutoring institute in Gading Serpong: kindergarten Calistung prep, elementary, junior high & high school programs with small classes, experienced teachers, and a structured learning system. ${ZDL}`,
  },
  "liviarealestate-asia": {
    description: `Marketing site for Springhill Yume Lagoon residences in Cisauk, Tangerang — a modern 15-hectare, ready-to-live, flood-free housing estate, direct from the developer's official sales team. ${ZDL}`,
  },
  "kementriansegosbebek-id": {
    title: "Kementrian Sego's Bebek Restaurant — kementriansegosbebek.id",
    description: `Premium black-spice duck restaurant in Sidoarjo — dine in, delivery, catering, and franchise partnerships. ${ZDL}`,
  },
  "kopikir-store": {
    description: `Official site of KOPIKIR — a coffee & culture brand with a clean, modern digital experience. ${ZDL}`,
  },
  "genesisxproperty-com": {
    description: `Official site of Park Serpong Legok by Lippo — modern, strategic housing in Legok, Tangerang, with complete facilities and easy access. ${ZDL}`,
  },
  "terradekor-com": {
    description: `Terradekor (PT Opulent Interior Indonesia) — premium interior & construction solutions for homes and businesses. ${ZDL}`,
  },
  "designhomeliving-org": {
    description: `Material supply & interior–exterior installation services in Tangerang: professional WPC, vinyl, SPC, decking, and PVC ceiling installation. ${ZDL}`,
  },
  "lianahomeinterior-com": {
    description: `Professional interior services in Bekasi — kitchen sets, custom furniture, wall panels, vinyl flooring, renovation, and interior design. ${ZDL}`,
  },
  "allin-web-id": {
    title: "ALLIN — National Power Industry Association — allin.web.id",
    description: `Official site of ALLIN — the National Electricity Industry Environment Association, an organization of Indonesia's power industry players. ${ZDL}`,
  },
  "pawonbhoga-com": {
    description: `The official .com domain of Pawon Bhoga — catering service for Surabaya, Sidoarjo & Gresik: lunch boxes, snack boxes, tumpeng, and buffets. ${ZDL}`,
  },
  "lantaifutsalsurabaya-asia": {
    description: `H2 Sport Surabaya — sports flooring supplier & installer: futsal, mini soccer, padel, and basketball. Free consultation via WhatsApp. ${ZDL}`,
  },
  "migasstell-com": {
    description: `Oil & gas and industrial tank fabrication: fuel, avtur, diesel, and LPG tanks, skid tanks, pressure vessels, and piping for oil & gas, LNG, petrochemical, and manufacturing sectors. ${ZDL}`,
  },
};

export function enFields(p) {
  const en = EN[p.slug];
  if (!en) return {};
  return {
    titleEn: en.title ?? p.title,
    descriptionEn: en.description ?? null,
  };
}

/**
 * Fill empty English translations on rows that already exist in production
 * (created before i18n). Idempotent: only touches rows with titleEn = null.
 */
export async function enrichPortfolioTranslations(db) {
  let updated = 0;
  for (const p of REAL_PORTFOLIOS) {
    const existing = await db.portfolio.findUnique({ where: { slug: p.slug } });
    if (!existing || existing.titleEn) continue;
    await db.portfolio.update({ where: { slug: p.slug }, data: enFields(p) });
    updated++;
  }
  console.log(`[seed-content] Portfolio EN translations enriched: ${updated}`);
}

async function uploadCoverIfMissing(db, slug, alt) {
  const filename = `cover-${slug}.png`;
  const existing = await db.media.findFirst({ where: { filename } });
  if (existing && existing.url && existing.url !== "pending") return existing.url;

  const file = path.join(process.cwd(), "scripts", "covers", filename);
  if (!fs.existsSync(file)) {
    console.warn(`[seed-content] cover missing on disk: ${filename}`);
    return null;
  }
  const data = fs.readFileSync(file);
  const created = await db.media.create({
    data: {
      filename,
      url: "pending",
      mimeType: "image/png",
      size: data.length,
      alt,
      data,
    },
  });
  const url = `/api/media/${created.id}`;
  await db.media.update({ where: { id: created.id }, data: { url } });
  return url;
}

export async function seedPortfolios(db) {
  // 1) remove obsolete auto-seeded sample portfolios (not user-created)
  const removed = await db.portfolio.deleteMany({
    where: { slug: { in: OLD_SEED_SLUGS } },
  });
  if (removed.count > 0) console.log(`[seed-content] Removed ${removed.count} sample portfolio item(s)`);

  // 2) ensure industry categories
  for (const c of PORTFOLIO_CATEGORIES) {
    await db.portfolioCategory.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  // 3) create real portfolio entries (skip if slug exists — CMS edits are safe)
  let created = 0;
  for (const p of REAL_PORTFOLIOS) {
    const existing = await db.portfolio.findUnique({ where: { slug: p.slug } });
    if (existing) continue;

    const thumbnail = await uploadCoverIfMissing(db, p.slug, `Cover ${p.title}`);
    await db.portfolio.create({
      data: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        category: { connect: { slug: p.categorySlug } },
        thumbnail,
        projectUrl: `https://${p.domain}`,
        featured: p.featured,
        published: true,
        technologies: JSON.stringify([]),
        seoTitle: `${p.title} — Portofolio ZDL`,
        seoDescription: p.description.slice(0, 155),
        ...enFields(p),
      },
    });
    created++;
  }
  console.log(`[seed-content] Real portfolio ready: ${created} created (target ${REAL_PORTFOLIOS.length})`);
}
