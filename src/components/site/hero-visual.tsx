"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, GitBranch, Zap } from "lucide-react";

const codeLines = [
  { tokens: [{ t: "const", c: "text-[#c792ea]" }, { t: " project", c: "text-foreground" }, { t: " = ", c: "text-muted-foreground" }, { t: "await", c: "text-[#c792ea]" }, { t: " zdl", c: "text-[#82aaff]" }, { t: ".build({", c: "text-foreground" }] },
  { tokens: [{ t: "  platform", c: "text-[#f07178]" }, { t: ": ", c: "text-foreground" }, { t: "'website'", c: "text-[#c3e88d]" }, { t: ",", c: "text-foreground" }] },
  { tokens: [{ t: "  quality", c: "text-[#f07178]" }, { t: ": ", c: "text-foreground" }, { t: "'premium'", c: "text-[#c3e88d]" }, { t: ",", c: "text-foreground" }] },
  { tokens: [{ t: "  support", c: "text-[#f07178]" }, { t: ": ", c: "text-foreground" }, { t: "'ongoing'", c: "text-[#c3e88d]" }, { t: ",", c: "text-foreground" }] },
  { tokens: [{ t: "});", c: "text-foreground" }] },
  { tokens: [{ t: "", c: "" }] },
  { tokens: [{ t: "//", c: "text-muted-foreground" }, { t: " → deployed & ready to grow", c: "text-muted-foreground" }] },
];

export function HeroVisual() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none" aria-hidden="true">
      {/* glow */}
      <div className="bg-brand-gradient absolute -inset-6 rounded-[2rem] opacity-[0.14] blur-3xl" />

      {/* code window */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="card-glow relative rounded-2xl border border-border bg-card shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 rounded-md bg-secondary px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
            zdl.config.ts
          </span>
        </div>
        <div className="p-5 font-mono text-[13px] leading-7">
          {codeLines.map((line, i) => (
            <div key={i} className="flex">
              <span className="w-8 select-none text-right text-muted-foreground/50">{i + 1}</span>
              <span className="pl-4">
                {line.tokens.map((tok, j) => (
                  <span key={j} className={tok.c}>
                    {tok.t}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* floating cards */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="absolute -left-4 top-16 hidden rounded-xl border border-border bg-card/95 p-3.5 shadow-xl backdrop-blur sm:block lg:-left-10"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold">Deployment</p>
            <p className="text-[11px] text-muted-foreground">Live &amp; optimized</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="absolute -right-3 bottom-20 hidden rounded-xl border border-border bg-card/95 p-3.5 shadow-xl backdrop-blur sm:block lg:-right-8"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Zap className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold">Core Web Vitals</p>
            <p className="text-[11px] text-muted-foreground">Fast on mobile</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.75 }}
        className="absolute -bottom-6 left-10 hidden rounded-xl border border-border bg-card/95 p-3.5 shadow-xl backdrop-blur md:block"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-500">
            <GitBranch className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold">Version Control</p>
            <p className="text-[11px] text-muted-foreground">Clean &amp; documented</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
