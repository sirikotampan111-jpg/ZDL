import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { parseJsonArray } from "@/lib/markdown";

export interface PortfolioCardData {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  technologies: string;
  year: number | null;
  projectUrl?: string | null;
  category: { name: string; slug: string } | null;
}

export function PortfolioCard({ item }: { item: PortfolioCardData }) {
  const techs = parseJsonArray(item.technologies).slice(0, 4);
  const excerpt =
    item.description.length > 140
      ? `${item.description.slice(0, 140).trimEnd()}…`
      : item.description;
  const host = (() => {
    if (!item.projectUrl) return null;
    try {
      return new URL(item.projectUrl).hostname;
    } catch {
      return null;
    }
  })();

  return (
    <Link
      href={`/portfolio/${item.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-[0_4px_20px_-6px_rgba(16,16,24,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-muted">
        {item.thumbnail ? (
          <Image
            src={item.thumbnail}
            alt={`Thumbnail project ${item.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-secondary text-muted-foreground">
            ZDL Project
          </div>
        )}
        {item.category && (
          <span className="absolute left-3 top-3 rounded-md bg-background/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/80 backdrop-blur">
            {item.category.name}
          </span>
        )}
        <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-background text-foreground opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-semibold leading-snug tracking-tight group-hover:text-primary">
            {item.title}
          </h3>
          {item.year && (
            <span className="shrink-0 font-mono text-xs text-muted-foreground">{item.year}</span>
          )}
        </div>
        {host && (
          <p className="mt-1 font-mono text-[11px] text-muted-foreground/80">{host}</p>
        )}
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {excerpt}
        </p>
        {techs.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 pt-1">
            {techs.map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
