"use client";

import { useState } from "react";
import { FlaskConical } from "lucide-react";
import { DemoCard, type DemoCardData } from "@/components/site/demo-card";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

/**
 * Client-side category filter for the demo showcase.
 * Categories are free-text labels on Demo entries — chips are derived
 * from the distinct values. Filtering is instant in the browser so the
 * /demo page itself can be statically cached (ISR).
 */
export function DemoFilterGrid({
  categories,
  demos,
}: {
  categories: { name: string; count: number }[];
  demos: DemoCardData[];
}) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = active
    ? demos.filter((d) => d.category === active)
    : demos;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2" role="navigation" aria-label="Filter kategori demo">
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
            key={cat.name}
            type="button"
            onClick={() => setActive(cat.name)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              active === cat.name
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
          <FlaskConical className="h-10 w-10 text-muted-foreground/50" />
          <p className="mt-4 font-medium">Belum ada demo pada kategori ini.</p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Demo baru terus ditambahkan. Mau melihat cara kerja sistem tertentu?
            Hubungi kami — kami siap menyiapkan sesi demo langsung untuk Anda.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d, i) => (
            <Reveal key={d.id} delay={Math.min(i, 8) * 0.05}>
              <DemoCard item={d} />
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}
