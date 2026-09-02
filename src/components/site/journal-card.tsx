import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
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
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_12px_40px_-12px_rgba(139,92,246,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {item.featuredImage ? (
          <Image
            src={item.featuredImage}
            alt={`Ilustrasi artikel ${item.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-secondary text-muted-foreground">
            ZDL Journal
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {item.category && (
            <span className="rounded-full bg-accent px-2.5 py-1 font-medium text-accent-foreground">
              {item.category.name}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {item.readingMinutes} menit baca
          </span>
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
          <p className="mt-auto pt-4 text-xs text-muted-foreground">
            {formatDate(item.publishedAt)}
          </p>
        )}
      </div>
    </Link>
  );
}
