"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Newspaper } from "lucide-react";
import { JournalCard, type JournalCardData } from "@/components/site/journal-card";
import { cn } from "@/lib/utils";

export interface JournalCategoryChip {
  id: string;
  name: string;
  slug: string;
  count: number;
}

/**
 * Client-side category filter for the journal listing.
 * Filtering happens instantly in the browser, so the page itself
 * can be statically cached (ISR) instead of rendering per request.
 */
export function JournalFilterGrid({
  categories,
  journals,
}: {
  categories: JournalCategoryChip[];
  journals: JournalCardData[];
}) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = active
    ? journals.filter((j) => j.category?.slug === active)
    : journals;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2" role="navigation" aria-label="Filter kategori artikel">
        <button
          type="button"
          onClick={() => setActive(null)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            !active
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
          )}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActive(cat.slug)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              active === cat.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {cat.name}
            <span className="ml-1.5 text-xs opacity-70">{cat.count}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-border p-14 text-center">
          <Newspaper className="h-10 w-10 text-muted-foreground/50" />
          <p className="mt-4 font-medium">Belum ada artikel pada kategori ini.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Coba pilih kategori lain, atau kunjungi{" "}
            <Link href="/" className="text-primary hover:underline">
              halaman utama
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((j, i) => (
            <article key={j.id} className={i === 0 && !active ? "sm:col-span-2 lg:col-span-1" : ""}>
              <JournalCard item={j} />
            </article>
          ))}
        </div>
      )}

      <p className="mt-10 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        Artikel baru dipublikasikan secara berkala melalui ZDL CMS.
      </p>
    </>
  );
}
