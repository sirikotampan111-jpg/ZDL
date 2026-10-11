import { revalidatePath } from "next/cache";

/**
 * On-demand ISR revalidation for public pages.
 * Called from admin mutation APIs so CMS edits appear instantly
 * (public pages are ISR-cached with revalidate = 300).
 */
export function revalidatePublic(
  opts: { type: "portfolio" | "journal" | "any"; slugs?: (string | null | undefined)[] }
) {
  const paths = new Set<string>(["/", "/sitemap.xml"]);
  if (opts.type === "portfolio" || opts.type === "any") paths.add("/portfolio");
  if (opts.type === "journal" || opts.type === "any") paths.add("/journal");

  for (const slug of opts.slugs ?? []) {
    if (!slug) continue;
    if (opts.type === "portfolio") paths.add(`/portfolio/${slug}`);
    else if (opts.type === "journal") paths.add(`/journal/${slug}`);
  }

  for (const p of paths) {
    try {
      revalidatePath(p);
    } catch {
      // revalidation is best-effort; ISR fallback (300s) still applies
    }
  }
}
