/**
 * Generate branded cover images (1200x800 PNG) for the 16 real portfolio
 * sites. Honest, premium covers — brand name + domain on a dark gradient
 * with a category accent color. Output: scripts/covers/<slug>.png
 * The seed script uploads these into Neon (Media bytea) at build time.
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "scripts", "covers");
fs.mkdirSync(OUT, { recursive: true });

const ACCENTS = {
  kuliner: "#F97316",
  kecantikan: "#EC4899",
  transportasi: "#38BDF8",
  edukasi: "#8B5CF6",
  properti: "#10B981",
  interior: "#FBBF24",
  industri: "#EF4444",
  organisasi: "#6366F1",
};

const SITES = [
  { slug: "pawonbhoga-id", brand: "Pawon Bhoga Catering", domain: "pawonbhoga.id", cat: "KULINER & F&B", accent: ACCENTS.kuliner },
  { slug: "kinsuroi-com", brand: "KINSUROI Skincare", domain: "kinsuroi.com", cat: "KECANTIKAN & LIFESTYLE", accent: ACCENTS.kecantikan },
  { slug: "sewamotorjakarta-co-id", brand: "Rajawali Motorcycle Rental", domain: "sewamotorjakarta.co.id", cat: "TRANSPORTASI & LOGISTIK", accent: ACCENTS.transportasi },
  { slug: "kirimikanhias-com", brand: "Bettalover Express", domain: "kirimikanhias.com", cat: "TRANSPORTASI & LOGISTIK", accent: ACCENTS.transportasi },
  { slug: "bimbelstarlish-com", brand: "Starlish Bimbel", domain: "bimbelstarlish.com", cat: "EDUKASI", accent: ACCENTS.edukasi },
  { slug: "liviarealestate-asia", brand: "Livia Real Estate", domain: "liviarealestate.asia", cat: "PROPERTI", accent: ACCENTS.properti },
  { slug: "kementriansegosbebek-id", brand: "Kementrian Sego's Bebek", domain: "kementriansegosbebek.id", cat: "KULINER & F&B", accent: ACCENTS.kuliner },
  { slug: "kopikir-store", brand: "KOPIKIR Coffee & Culture", domain: "kopikir.store", cat: "KULINER & F&B", accent: ACCENTS.kuliner },
  { slug: "genesisxproperty-com", brand: "Park Serpong Legok by Lippo", domain: "genesisxproperty.com", cat: "PROPERTI", accent: ACCENTS.properti },
  { slug: "terradekor-com", brand: "Terradekor Interior", domain: "terradekor.com", cat: "INTERIOR & KONSTRUKSI", accent: ACCENTS.interior },
  { slug: "designhomeliving-org", brand: "Desain Home Living", domain: "designhomeliving.org", cat: "INTERIOR & KONSTRUKSI", accent: ACCENTS.interior },
  { slug: "lianahomeinterior-com", brand: "Liana Home Interior", domain: "lianahomeinterior.com", cat: "INTERIOR & KONSTRUKSI", accent: ACCENTS.interior },
  { slug: "allin-web-id", brand: "ALLIN Ketenagalistrikan", domain: "allin.web.id", cat: "ORGANISASI & ASOSIASI", accent: ACCENTS.organisasi },
  { slug: "pawonbhoga-com", brand: "Pawon Bhoga Catering", domain: "pawonbhoga.com", cat: "KULINER & F&B", accent: ACCENTS.kuliner },
  { slug: "lantaifutsalsurabaya-asia", brand: "H2 Sport Surabaya", domain: "lantaifutsalsurabaya.asia", cat: "INTERIOR & KONSTRUKSI", accent: ACCENTS.interior },
  { slug: "migasstell-com", brand: "Migas Stell", domain: "migasstell.com", cat: "INDUSTRI & ENERGI", accent: ACCENTS.industri },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function wrap(text, maxChars) {
  const words = text.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

function coverSvg({ brand, domain, cat, accent }) {
  const fontSize = brand.length > 34 ? 54 : brand.length > 22 ? 62 : 72;
  const lines = wrap(brand, brand.length > 34 ? 24 : 22);
  const lineH = Math.round(fontSize * 1.18);
  const startY = 330;

  const titleSvg = lines
    .map(
      (l, i) =>
        `<text x="92" y="${startY + i * lineH}" font-family="DejaVu Sans" font-weight="bold" font-size="${fontSize}" fill="#F8FAFC">${esc(l)}</text>`
    )
    .join("\n    ");

  const chipW = Math.min(cat.length * 13.2 + 44, 620);
  const lastTextY = startY + (lines.length - 1) * lineH;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0B0F1A"/>
      <stop offset="0.55" stop-color="#101624"/>
      <stop offset="1" stop-color="#0B1220"/>
    </linearGradient>
    <radialGradient id="glow1" cx="0.85" cy="0.12" r="0.55">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.34"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.08" cy="0.95" r="0.5">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.16"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.6" fill="${accent}" fill-opacity="0.10"/>
    </pattern>
  </defs>

  <rect width="1200" height="800" fill="url(#bg)"/>
  <rect width="1200" height="800" fill="url(#dots)"/>
  <rect width="1200" height="800" fill="url(#glow1)"/>
  <rect width="1200" height="800" fill="url(#glow2)"/>
  <circle cx="1010" cy="240" r="170" fill="none" stroke="${accent}" stroke-opacity="0.25" stroke-width="1.5"/>
  <circle cx="1060" cy="180" r="230" fill="none" stroke="${accent}" stroke-opacity="0.12" stroke-width="1.5"/>

  <rect x="90" y="128" width="${chipW}" height="52" rx="26" fill="none" stroke="${accent}" stroke-opacity="0.55" stroke-width="1.6"/>
  <circle cx="122" cy="154" r="7" fill="${accent}"/>
  <text x="146" y="162" font-family="DejaVu Sans" font-weight="bold" font-size="21" letter-spacing="3.5" fill="${accent}">${esc(cat)}</text>

  ${titleSvg}

  <rect x="92" y="${lastTextY + 44}" width="64" height="5" rx="2.5" fill="${accent}"/>
  <text x="92" y="${lastTextY + 102}" font-family="DejaVu Sans Mono" font-size="30" fill="${accent}">${esc(domain)}</text>

  <rect x="0" y="768" width="1200" height="2" fill="${accent}" fill-opacity="0.35"/>
  <text x="92" y="740" font-family="DejaVu Sans" font-size="20" letter-spacing="4" fill="#94A3B8">DIKERJAKAN &amp; DIKELOLA OLEH ZDL — ZHENG DIGITAL LAB</text>
  <text x="1108" y="740" text-anchor="end" font-family="DejaVu Sans Mono" font-size="22" fill="#64748B">ZDL</text>
</svg>`;
}

for (const s of SITES) {
  const svg = coverSvg(s);
  const out = path.join(OUT, `cover-${s.slug}.png`);
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true, quality: 92 }).toFile(out);
  const size = fs.statSync(out).size;
  console.log(`${s.slug}.png  ${(size / 1024).toFixed(1)} KB`);
}
console.log("Done ✔");
