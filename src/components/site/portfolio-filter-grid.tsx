"use client";

import { useState } from "react";
import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { PortfolioCard, type PortfolioCardData } from "@/components/site/portfolio-card";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

export interface PortfolioCategoryChip {
  id: string;
  name: string;
  slug: string;
  count: number;
}

/**
 * Client-side category filter for the portfolio listing.
 * Filtering happens instantly in the browser, so the page itself
 * can be statically cached (ISR) instead of rendering per request.
 */
export function PortfolioFilterGrid({
  categories,
  portfolios,
}: {
  categories: PortfolioCategoryChip[];
  portfolios: PortfolioCardData[];
}) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = active
    ? portfolios.filter((p) => p.category?.slug === active)
    : portfolios;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2" role="navigation" aria-label="Filter kategori portfolio">
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
          <FolderOpen className="h-10 w-10 text-muted-foreground/50" />
          <p className="mt-4 font-medium">Belum ada project pada kategori ini.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Coba pilih kategori lain, atau{" "}
            <Link href="/contact" className="text-primary hover:underline">
              diskusikan project Anda
            </Link>{" "}
            untuk menjadi yang pertama.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i, 8) * 0.05}>
              <PortfolioCard item={p} />
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}
