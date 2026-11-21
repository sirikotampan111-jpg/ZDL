/**
 * Generate branded cover (1200x800 PNG) for the "Tes Psikologi" demo
 * thumbnail. Reuses the visual language of generate-demo-cover.mjs.
 * Output: public/placeholders/demo-psikologi.png
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "placeholders");
fs.mkdirSync(OUT, { recursive: true });

const ACCENT = "#8B8CF8"; // violet-blue — assessment/psychology vibe
const BRAND = "Tes Psikologi Interaktif";
const CAT = "DEMO INTERAKTIF";
const SUB = "zdl.my.id/demo";

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

const fontSize = 64;
const lines = wrap(BRAND, 22);
const lineH = Math.round(fontSize * 1.18);
const startY = 330;
const titleSvg = lines
  .map(
    (l, i) =>
      `<text x="92" y="${startY + i * lineH}" font-family="DejaVu Sans" font-weight="bold" font-size="${fontSize}" fill="#F8FAFC">${esc(l)}</text>`
  )
  .join("\n    ");
const lastTextY = startY + (lines.length - 1) * lineH;
const chipW = Math.min(CAT.length * 13.2 + 44, 620);

// A subtle "radar chart" motif — five-axes spider, echoing the Big Five result.
const cx = 985;
const cy = 430;
const R = 150;
const pts = (r) =>
  Array.from({ length: 5 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0B0F1A"/>
      <stop offset="0.55" stop-color="#101624"/>
      <stop offset="1" stop-color="#0B1220"/>
    </linearGradient>
    <radialGradient id="glow1" cx="0.85" cy="0.12" r="0.55">
      <stop offset="0" stop-color="${ACCENT}" stop-opacity="0.30"/>
      <stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.08" cy="0.95" r="0.5">
      <stop offset="0" stop-color="${ACCENT}" stop-opacity="0.14"/>
      <stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.6" fill="${ACCENT}" fill-opacity="0.10"/>
    </pattern>
  </defs>

  <rect width="1200" height="800" fill="url(#bg)"/>
  <rect width="1200" height="800" fill="url(#dots)"/>
  <rect width="1200" height="800" fill="url(#glow1)"/>
  <rect width="1200" height="800" fill="url(#glow2)"/>

  <polygon points="${pts(R)}" fill="none" stroke="${ACCENT}" stroke-opacity="0.35" stroke-width="1.5"/>
  <polygon points="${pts(R * 0.66)}" fill="none" stroke="${ACCENT}" stroke-opacity="0.22" stroke-width="1.2"/>
  <polygon points="${pts(R * 0.33)}" fill="none" stroke="${ACCENT}" stroke-opacity="0.16" stroke-width="1"/>
  ${Array.from({ length: 5 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    return `<line x1="${cx}" y1="${cy}" x2="${(cx + R * Math.cos(a)).toFixed(1)}" y2="${(cy + R * Math.sin(a)).toFixed(1)}" stroke="${ACCENT}" stroke-opacity="0.18" stroke-width="1"/>`;
  }).join("\n  ")}
  <polygon points="${pts(R * 0.8)}" fill="${ACCENT}" fill-opacity="0.12"/>
  ${Array.from({ length: 5 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    return `<circle cx="${(cx + R * Math.cos(a)).toFixed(1)}" cy="${(cy + R * Math.sin(a)).toFixed(1)}" r="4" fill="${ACCENT}" fill-opacity="0.8"/>`;
  }).join("\n  ")}

  <rect x="90" y="128" width="${chipW}" height="52" rx="26" fill="none" stroke="${ACCENT}" stroke-opacity="0.55" stroke-width="1.6"/>
  <circle cx="122" cy="154" r="7" fill="${ACCENT}"/>
  <text x="146" y="162" font-family="DejaVu Sans" font-weight="bold" font-size="21" letter-spacing="3.5" fill="${ACCENT}">${esc(CAT)}</text>

  ${titleSvg}

  <rect x="92" y="${lastTextY + 44}" width="64" height="5" rx="2.5" fill="${ACCENT}"/>
  <text x="92" y="${lastTextY + 102}" font-family="DejaVu Sans Mono" font-size="30" fill="${ACCENT}">${esc(SUB)}</text>

  <rect x="0" y="768" width="1200" height="2" fill="${ACCENT}" fill-opacity="0.35"/>
  <text x="92" y="740" font-family="DejaVu Sans" font-size="20" letter-spacing="4" fill="#94A3B8">SISTEM YANG BISA DIBANGUN OLEH ZDL — ZHENG DIGITAL LAB</text>
  <text x="1108" y="740" text-anchor="end" font-family="DejaVu Sans Mono" font-size="22" fill="#64748B">ZDL</text>
</svg>`;

const outPath = path.join(OUT, "demo-psikologi.png");
await sharp(Buffer.from(svg)).png({ palette: true }).toFile(outPath);
console.log("OK:", outPath, fs.statSync(outPath).size, "bytes");
