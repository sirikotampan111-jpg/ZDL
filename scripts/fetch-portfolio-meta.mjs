/**
 * Fetch live meta data (title, meta description, favicon) for the
 * 16 real portfolio sites, so the seed uses REAL content, not invented copy.
 * Output: JSON to stdout. Favicons saved to /tmp/favicons/<slug>.ico
 */
import fs from "node:fs";

const SITES = [
  "pawonbhoga.id",
  "kinsuroi.com",
  "sewamotorjakarta.co.id",
  "kirimikanhias.com",
  "bimbelstarlish.com",
  "liviarealestate.asia",
  "kementriansegosbebek.id",
  "kopikir.store",
  "genesisxproperty.com",
  "terradekor.com",
  "designhomeliving.org",
  "lianahomeinterior.com",
  "allin.web.id",
  "pawonbhoga.com",
  "lantaifutsalsurabaya.asia",
  "migasstell.com",
];

fs.mkdirSync("/tmp/favicons", { recursive: true });

function extract(html) {
  const title = (html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || "").trim();
  const desc =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)?.[1] ||
    html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
    "";
  const ogTitle =
    html.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i)?.[1] || "";
  return { title, desc: desc.trim(), ogTitle: ogTitle.trim() };
}

async function fetchSite(domain) {
  const result = { domain, status: null, title: "", desc: "", ogTitle: "", faviconBytes: 0, err: null };
  for (const url of [`https://${domain}`, `http://www.${domain}`, `https://www.${domain}`]) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 12000);
      const res = await fetch(url, { signal: ctrl.signal, redirect: "follow" });
      clearTimeout(t);
      result.status = res.status;
      const html = (await res.text()).slice(0, 200000);
      Object.assign(result, extract(html));
      // favicon
      try {
        const fctrl = new AbortController();
        const ft = setTimeout(() => fctrl.abort(), 8000);
        const fres = await fetch(`${url}/favicon.ico`, { signal: fctrl.signal, redirect: "follow" });
        clearTimeout(ft);
        if (fres.ok) {
          const buf = Buffer.from(await fres.arrayBuffer());
          if (buf.length > 100 && buf.length < 400000) {
            fs.writeFileSync(`/tmp/favicons/${domain}.ico`, buf);
            result.faviconBytes = buf.length;
          }
        }
      } catch { /* favicon optional */ }
      break;
    } catch (e) {
      result.err = e.name === "AbortError" ? "timeout" : e.message?.slice(0, 80);
      continue;
    }
  }
  return result;
}

const out = [];
const filter = process.argv[2];
const targets = filter ? SITES.filter((s) => filter.split(",").includes(s)) : SITES;
for (const s of targets) {
  out.push(await fetchSite(s));
  process.stdout.write(`  ${s} → ${out.at(-1).status || out.at(-1).err}\n`);
}
console.log("\n" + JSON.stringify(out, null, 2));
