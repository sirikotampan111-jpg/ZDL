import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { waLink } from "@/lib/site";
import { Reveal } from "@/components/site/reveal";

export function CtaSection({
  title = "Punya ide project yang ingin diwujudkan?",
  description = "Ceritakan kebutuhan bisnis Anda — tim ZDL akan membantu merancang solusi digital yang tepat, dari website, aplikasi, hingga sistem internal dan automation.",
  primaryLabel = "Konsultasikan Project Anda",
  secondaryLabel = "Lihat Portfolio",
  secondaryHref = "/portfolio",
}: {
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  secondaryHref?: string | null;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <Reveal>
        <div className="card-glow relative overflow-hidden rounded-3xl bg-card p-8 text-center sm:p-14">
          <div
            aria-hidden="true"
            className="bg-brand-gradient pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="bg-brand-gradient pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full opacity-20 blur-3xl"
          />
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="w-full rounded-full bg-primary px-8 font-semibold text-primary-foreground hover:bg-primary/90 sm:w-auto"
            >
              <a href={waLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                {primaryLabel}
              </a>
            </Button>
            {secondaryHref && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full rounded-full px-8 font-medium sm:w-auto"
              >
                <Link href={secondaryHref}>
                  {secondaryLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
