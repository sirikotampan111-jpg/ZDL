"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Lock, CheckCheck } from "lucide-react";
import { useLocale } from "@/i18n/client";

/**
 * Hero composition built from REAL work: the actual cover of a live client
 * site in a browser frame, a second client card overlapping it, and a stat
 * chip. No fake dashboards, no fake chat — everything shown is real.
 */
export function HeroVisual() {
  const reduce = useReducedMotion();
  const en = useLocale() === "en";
  const statAlt = en ? "16 active clients · 8 industries" : "16 klien aktif · 8 industri";

  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none" aria-hidden="true">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="relative rounded-xl border border-border bg-card shadow-2xl"
      >
        {/* browser chrome */}
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/25" />
          <span className="ml-2 flex flex-1 items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1">
            <Lock className="h-3 w-3 text-emerald-500" />
            <span className="font-mono text-[11px] text-muted-foreground">migasstell.com</span>
          </span>
        </div>
        {/* real client site cover */}
        <div className="relative aspect-[3/2] overflow-hidden rounded-b-xl">
          <Image
            src="/brand/showcase-migasstell.png"
            alt={en ? "Migas Stell website — a live ZDL client project" : "Website Migas Stell — project klien ZDL yang sedang berjalan"}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 520px"
            className="object-cover"
          />
        </div>
        <div className="absolute bottom-3 left-3 rounded-md border border-border bg-background/85 px-2.5 py-1 backdrop-blur">
          <span className="mono-label text-muted-foreground">
            {en ? "Live — client project" : "Live — project klien"}
          </span>
        </div>
      </motion.div>

      {/* second real client, overlapping */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.4 }}
        className="absolute -bottom-10 -right-2 hidden w-44 overflow-hidden rounded-lg border border-border bg-card shadow-xl sm:block lg:-right-8 lg:w-52"
      >
        <div className="relative aspect-[3/2]">
          <Image
            src="/brand/showcase-livia.png"
            alt={en ? "Livia Real Estate website — a ZDL client project" : "Website Livia Real Estate — project klien ZDL"}
            fill
            sizes="220px"
            className="object-cover"
          />
        </div>
        <div className="border-t border-border px-3 py-2">
          <span className="font-mono text-[10px] text-muted-foreground">liviarealestate.asia</span>
        </div>
      </motion.div>

      {/* stat chip */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="absolute -left-3 top-8 hidden rounded-lg border border-border bg-card/95 px-4 py-3 shadow-xl backdrop-blur sm:block lg:-left-10"
      >
        <p className="font-display text-2xl font-bold leading-none">16</p>
        <p className="mono-label mt-1.5 text-muted-foreground">{statAlt}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-emerald-500">
          <CheckCheck className="h-3 w-3" />
          {en ? "All live & managed" : "Semua live & dikelola"}
        </span>
      </motion.div>
    </div>
  );
}
