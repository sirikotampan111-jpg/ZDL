import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/site";

export interface JournalCardData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: Date | null;
  category: { name: string; slug: string } | null;
  readingMinutes: number;
}

export function JournalCard({ item }: { item: JournalCardData }) {
  return (
    <Link
      href={`/journal/${item.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-[0_4px_20px_-6px_rgba(16,16,24,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {item.featuredImage ? (
          <Image
            src={item.featuredImage}
            alt={`Ilustrasi artikel ${item.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-secondary text-muted-foreground">
            ZDL Journal
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
          {item.category && (
            <>
              <span className="uppercase tracking-[0.14em] text-primary">
                {item.category.name}
              </span>
              <span aria-hidden="true" className="text-border">/</span>
            </>
          )}
          <span>{item.readingMinutes} mnt baca</span>
        </div>
        <h3 className="mt-3 font-semibold leading-snug tracking-tight group-hover:text-primary">
          {item.title}
        </h3>
        {item.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {item.excerpt}
          </p>
        )}
        {item.publishedAt && (
          <p className="mt-auto pt-4 font-mono text-[11px] text-muted-foreground/80">
            {formatDate(item.publishedAt)}
          </p>
        )}
      </div>
    </Link>
  );
}
