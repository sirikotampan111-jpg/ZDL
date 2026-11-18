/**
 * Compress /public/placeholders/*.png in place (palette PNG) — used as
 * journal/demo thumbnails. Keeps filenames so no references change.
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "public", "placeholders");
let beforeTotal = 0;
let afterTotal = 0;

for (const f of fs.readdirSync(DIR).filter((f) => f.endsWith(".png"))) {
  const p = path.join(DIR, f);
  const before = fs.statSync(p).size;
  beforeTotal += before;
  const out = path.join(DIR, f.replace(/\.png$/, ".tmp.png"));
  await sharp(p).png({ palette: true, quality: 88, compressionLevel: 9 }).toFile(out);
  const after = fs.statSync(out).size;
  if (after < before) {
    fs.renameSync(out, p);
    afterTotal += after;
    console.log(`${f}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);
  } else {
    fs.unlinkSync(out);
    afterTotal += before;
    console.log(`${f}: kept (${(before / 1024).toFixed(0)}KB)`);
  }
}
console.log(`TOTAL: ${(beforeTotal / 1024 / 1024).toFixed(2)}MB -> ${(afterTotal / 1024 / 1024).toFixed(2)}MB`);
