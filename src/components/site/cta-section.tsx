import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { Reveal } from "@/components/site/reveal";
import { getI18n } from "@/i18n/server";
import { localePrefix } from "@/i18n/config";

/**
 * Shared CTA band. Defaults come from the active dictionary; callers can
 * override any part with explicit props (page-specific copy).
 */
export async function CtaSection({
  title,
  description,
  primaryLabel,
  secondaryLabel,
  secondaryHref,
}: {
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string | null;
  secondaryHref?: string | null;
}) {
  const { locale, t } = await getI18n();
  const heading = title ?? t.cta.defaultTitle;
  const body = description ?? t.cta.defaultDesc;
  const primary = primaryLabel ?? t.cta.primary;
  const secondary = secondaryLabel === undefined ? t.cta.secondary : secondaryLabel;
  const secondaryUrl = secondaryHref === undefined ? localePrefix(locale, "/portfolio") : secondaryHref;

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
          <div className="bg-noise">
            <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12 lg:p-14">
              <div className="max-w-2xl">
                <p className="mono-label flex items-center gap-3 text-muted-foreground">
                  <span className="text-primary">WA</span>
                  <span className="h-px w-10 bg-border" aria-hidden="true" />
                  <span>{site.whatsapp.display}</span>
                </p>
                <h2 className="mt-5 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                  {heading}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {body}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-primary px-8 font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <a
                    href={`https://wa.me/${site.whatsapp.intl}?text=${encodeURIComponent(t.wa.defaultMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    {primary}
                  </a>
                </Button>
                {secondaryHref !== null && secondary && (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 font-medium"
                  >
                    <Link href={secondaryUrl}>
                      {secondary}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
