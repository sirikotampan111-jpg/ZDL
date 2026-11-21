"use client";

import Link from "next/link";
import { ArrowLeft, FlaskConical, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { useLocale } from "@/i18n/client";

/**
 * Shared chrome for interactive demo pages (/demo/coba/*).
 * Wraps the demo UI with a simulation banner, back navigation and a
 * closing CTA — so every demo clearly reads as a safe, sandboxed
 * simulation built by ZDL.
 */
export function DemoShell({
  title,
  subtitle,
  backHref,
  backLabel,
  children,
}: {
  title: string;
  subtitle: string;
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const en = locale === "en";
  const waMsg = en
    ? `Hello ZDL, I just tried the "${title}" demo on zdl.my.id/demo. I'm interested in building a similar app for my business.`
    : `Halo ZDL, saya baru mencoba demo "${title}" di zdl.my.id/demo. Saya tertarik membangun aplikasi seperti itu untuk bisnis saya.`;
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Simulation banner */}
      <div className="border-b border-primary/20 bg-primary/5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-1.5 px-4 py-2.5 text-center text-xs font-medium text-foreground sm:px-6 sm:text-sm">
          <span className="inline-flex items-center gap-1.5">
            <FlaskConical className="h-4 w-4 text-primary" />
            <strong>{en ? "Demo Mode" : "Mode Demo"}</strong> —{" "}
            {en ? "simulated data, nothing is stored" : "data simulasi, tidak ada yang tersimpan"}
          </span>
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary/70" />
            {en ? "Safe to try — not a production system" : "Aman dicoba — bukan sistem produksi"}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>

        <div className="mt-4">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        </div>

        {children}

        {/* Closing CTA */}
        <section className="mt-14 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                {en ? "Want an app like this for your business?" : "Mau aplikasi seperti ini untuk bisnis Anda?"}
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {en
                  ? "That was just a lightweight browser simulation. The real version is built around your business workflow — with real data, reports, and WhatsApp integration."
                  : "Yang tadi hanya simulasi ringan di browser. Versi aslinya dibuat sesuai alur kerja bisnis Anda — dengan data nyata, laporan, dan integrasi WhatsApp."}
              </p>
            </div>
            <Button
              asChild
              className="shrink-0 rounded-full bg-primary font-medium text-primary-foreground"
            >
              <a
                href={`https://wa.me/${site.whatsapp.intl}?text=${encodeURIComponent(waMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                {en ? "Free Consultation" : "Konsultasi Gratis"}
              </a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
