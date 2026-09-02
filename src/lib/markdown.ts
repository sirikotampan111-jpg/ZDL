import GithubSlugger from "github-slugger";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Extract headings (h2/h3) from markdown content for Table of Contents.
 * IDs are generated with github-slugger to match rehype-slug output exactly.
 */
export function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];

  // Strip fenced code blocks so `# comments` inside code are not picked up
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, "");

  const lines = withoutCode.split("\n");
  let inFence = false;
  for (const line of lines) {
    const fenceMatch = line.trimStart().startsWith("```");
    if (fenceMatch) inFence = !inFence;
    if (inFence) continue;

    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (m) {
      const level = m[1].length;
      const text = m[2].replace(/[*_`~\[\]]/g, "").trim();
      const id = slugger.slug(text);
      items.push({ id, text, level });
    }
  }
  return items;
}

/** Reading time in minutes (Indonesian ~200 wpm baseline). */
export function readingTime(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#*_`>\-\[\]()!]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Safely parse a JSON string stored in a text column (technologies, etc.). */
export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter((v): v is string => typeof v === "string");
    return [];
  } catch {
    return [];
  }
}

/** Generate a URL-safe slug from a title. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
