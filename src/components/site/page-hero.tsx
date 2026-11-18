import { Fragment } from "react";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { Reveal } from "@/components/site/reveal";

interface PageHeroProps {
  breadcrumb: { name: string; href?: string }[];
  /** Short mono keyword, e.g. "Portofolio klien" */
  eyebrow: string;
  /** Heading — wrap the key phrase in a serif-accent span yourself */
  title: React.ReactNode;
  description?: string;
  /** Bottom meta row of short mono facts, e.g. ["16 project live", "8 industri"] */
  meta?: string[];
}

/**
 * Shared editorial page hero — left-aligned, mono eyebrow, display heading
 * with a serif-accent phrase, hairline meta row. Replaces the old centered
 * hero with gradient text on all listing pages so the whole site speaks
 * in one voice (same voice as the home page).
 */
export function PageHero({ breadcrumb, eyebrow, title, description, meta }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14">
        <Breadcrumb items={breadcrumb} />
        <div className="mt-9 max-w-3xl">
          <Reveal>
            <p className="mono-label flex items-center gap-3 text-muted-foreground">
              <span className="text-primary">{eyebrow}</span>
              <span className="h-px w-10 bg-border" aria-hidden="true" />
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]">
              {title}
            </h1>
          </Reveal>
          {description && (
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {description}
              </p>
            </Reveal>
          )}
        </div>
        {meta && meta.length > 0 && (
          <Reveal delay={0.18}>
            <p className="mono-label mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-muted-foreground">
              {meta.map((m, i) => (
                <Fragment key={m}>
                  {i > 0 && (
                    <span aria-hidden="true" className="text-border">
                      /
                    </span>
                  )}
                  <span>{m}</span>
                </Fragment>
              ))}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
