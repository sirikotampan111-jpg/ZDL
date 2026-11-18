import Link from "next/link";
import { ArrowRight, MessageCircle, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "@/components/site/hero-visual";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { PortfolioCard } from "@/components/site/portfolio-card";
import { DemoCard } from "@/components/site/demo-card";
import { CtaSection } from "@/components/site/cta-section";
import { serviceCategories } from "@/lib/services-data";
import { ZDL_CLIENTS } from "@/lib/clients";
import {
  getPublishedDemos,
  getPublishedJournals,
  getPublishedPortfolios,
} from "@/lib/queries";
import { readingTime } from "@/lib/markdown";
import { waLink } from "@/lib/site";

// Content is CMS-managed — cached via ISR and revalidated on-demand
// when content changes through the admin API (see src/app/api/admin/*).
export const revalidate = 300;

const valueProps = [
  {
    title: "Bicara dengan yang mengerjakan",
    description:
      "Tidak ada lapisan account manager. Yang Anda ajak meeting adalah orang yang menulis kodenya — jadi keputusan teknis cepat dan tidak ada yang hilang di terjemahan.",
  },
  {
    title: "Dibangun untuk dikembangkan, bukan dilepas",
    description:
      "Stack modern (Next.js, TypeScript, PostgreSQL) dengan dokumentasi rapi. Website Anda bukan file yang dititipkan — ini aset yang bisa Anda pindahkan, kembangkan, atau audit kapan saja.",
  },
  {
    title: "Cepat di jaringan HP Indonesia",
    description:
      "Mayoritas pengunjung Anda buka dari ponsel dengan sinyal 4G. Setiap halaman kami optimasi untuk itu: gambar terkompresi, JavaScript hemat, server rendering.",
  },
  {
    title: "Satu penanggung jawab sampai beres",
    description:
      "Website, domain, hosting, email bisnis, otomasi spreadsheet — satu tempat. Tidak perlu mengoordinasikan lima vendor yang saling menunjuk kalau ada masalah.",
  },
];

const processSteps = [
  { step: "01", name: "Dengar", description: "Ceritakan masalahnya — kami pelajari bisnis dan tujuan Anda dulu, belum bicara teknis." },
  { step: "02", name: "Rancang", description: "Ruang lingkup, struktur, dan prioritas disepakati tertulis sebelum kode pertama." },
  { step: "03", name: "Bangun", description: "Pengerjaan dengan progres yang bisa Anda lihat — bukan kotak hitam selama berbulan-bulan." },
  { step: "04", name: "Uji", description: "Diperiksa di HP nyata dan jaringan nyata: kecepatan, alur, dan sudut-sudut yang jarang dicek." },
  { step: "05", name: "Tayang", description: "Dipasang dengan konfigurasi aman, domain dan SSL beres, siap dikunjungi." },
  { step: "06", name: "Rawat", description: "Setelah live kami tidak menghilang — pemeliharaan, perbaikan, dan pengembangan lanjutan." },
];

const journalDateFmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function HomePage() {
  const [featuredPortfolios, latestJournals, latestDemos] = await Promise.all([
    getPublishedPortfolios({ featuredOnly: true, take: 4 }),
    getPublishedJournals({ take: 4 }),
    getPublishedDemos({ take: 3 }),
  ]);

  const portfolioFallback = featuredPortfolios.length === 0;
  const journalCards = latestJournals.map((j) => ({
    ...j,
    readingMinutes: readingTime(j.content),
  }));

  return (
    <>
      {/* ================================================== HERO */}
      <section className="relative overflow-hidden">
        <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="mono-label flex flex-wrap items-center gap-x-3 gap-y-1.5 text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    Terima project baru
                  </span>
                  <span aria-hidden="true" className="text-border">/</span>
                  <span>Tangerang, Indonesia</span>
                </p>
              </Reveal>

              <Reveal delay={0.08}>
                <h1 className="mt-7 text-[2.6rem] font-bold leading-[1.06] tracking-tight sm:text-6xl lg:text-[4rem]">
                  Website &amp; sistem bisnis yang{" "}
                  <span className="font-serif-accent font-normal text-primary">
                    dikerjakan sampai beres
                  </span>
                  .
                </h1>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  ZDL membangun dan merawat website, aplikasi, dan sistem internal
                  untuk 16 brand — dari catering Surabaya sampai fabrikasi tangki
                  migas. Dikerjakan langsung oleh orang yang bisa Anda ajak bicara.
                </p>
              </Reveal>

              <Reveal delay={0.24}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <a href={waLink()} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Diskusikan project
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 text-base font-medium"
                  >
                    <Link href="/demo">
                      Coba demo interaktif
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={0.32}>
                <p className="mono-label mt-8 text-muted-foreground">
                  Tangerang · Jakarta · Jabodetabek — seluruh Indonesia
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <HeroVisual />
            </div>
          </div>
        </div>

        {/* client trust strip — real sites, marquee */}
        <div className="relative border-y border-border bg-card/40">
          <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
            <p className="mono-label text-center text-muted-foreground">
              Dipercaya 16 brand di 8 industri
            </p>
          </div>
          <div className="relative mt-4 overflow-hidden pb-6 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="animate-marquee flex w-max">
              {[0, 1].map((half) => (
                <div
                  key={half}
                  aria-hidden={half === 1}
                  className="flex items-center gap-10 pr-10"
                >
                  {ZDL_CLIENTS.map((c) => (
                    <span key={c.domain} className="flex items-baseline gap-2 whitespace-nowrap">
                      <span className="text-sm font-medium text-foreground/85">{c.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">{c.domain}</span>
                      <span className="ml-3 h-1 w-1 rounded-full bg-primary/40" aria-hidden="true" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== SERVICES */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24" id="services">
        <SectionHeading
          index="01"
          eyebrow="Layanan"
          title="Enam lini layanan, satu penanggung jawab"
          description="Semua dikerjakan internal — tidak dilepas ke pihak ketiga. Kalau ada yang perlu diubah, Anda tahu harus bicara dengan siapa."
        />
        <div className="mt-12 border-y border-border">
          {serviceCategories.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 0.03}>
              <Link
                href={`/services/${cat.slug}`}
                className="group -mx-4 grid gap-2.5 border-b border-border px-4 py-7 transition-colors last:border-b-0 hover:bg-muted/40 sm:mx-0 sm:grid-cols-[3.5rem_1fr_auto] sm:items-center sm:gap-6 sm:px-4"
              >
                <span className="mono-label text-muted-foreground/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary">
                    {cat.name}
                  </h3>
                  <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {cat.tagline}
                  </p>
                  <p className="mt-2.5 font-mono text-xs text-muted-foreground/70">
                    {cat.items.slice(0, 5).map((it) => it.name).join(" · ")}
                    {cat.items.length > 5 ? " · …" : ""}
                  </p>
                </div>
                <span className="hidden h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-all group-hover:translate-x-1 group-hover:border-primary group-hover:text-primary sm:flex">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================================================== VALUE PROPS */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <SectionHeading
            index="02"
            eyebrow="Kenapa ZDL"
            title="Prinsip kerja yang kami pegang"
            description="Bukan slogan — ini cara kami bekerja setiap hari pada project klien."
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {valueProps.map((vp, i) => (
              <Reveal key={vp.title} delay={i * 0.05}>
                <div className="h-full bg-background p-7 sm:p-9">
                  <span className="mono-label text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">
                    {vp.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {vp.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================== PROCESS */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <SectionHeading
          index="03"
          eyebrow="Cara kerja"
          title="Enam tahap, tanpa kejutan"
          description="Dari cerita awal sampai website terawat — setiap tahap Anda tahu sedang di mana. Skala project berbeda, disiplinnya sama."
        />
        <div className="mt-12 grid gap-x-12 md:grid-cols-2">
          {processSteps.map((ps, i) => (
            <Reveal key={ps.step} delay={i * 0.04}>
              <div className="flex gap-6 border-t border-border py-6">
                <span className="font-mono text-sm font-semibold text-primary">{ps.step}</span>
                <div>
                  <h3 className="font-semibold tracking-tight">{ps.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {ps.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================================================== FEATURED PORTFOLIO */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <SectionHeading
            index="04"
            eyebrow="Portofolio"
            title="Project yang berjalan, bukan mockup"
            description="Semua website di bawah live dan kami kelola. Buka situsnya langsung dari halaman detail project."
          />
          {portfolioFallback ? (
            <p className="mt-12 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
              Portfolio akan segera ditampilkan — tambahkan project pertama Anda melalui CMS Admin.
            </p>
          ) : (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPortfolios.map((p, i) => (
                <Reveal
                  key={p.id}
                  delay={i * 0.05}
                  className={i === 0 ? "sm:col-span-2 lg:col-span-2" : undefined}
                >
                  <PortfolioCard item={p} />
                </Reveal>
              ))}
            </div>
          )}
          <div className="mt-10 flex items-center justify-between gap-4">
            <p className="mono-label text-muted-foreground">+ 12 project lainnya</p>
            <Button asChild variant="outline" className="rounded-full px-7">
              <Link href="/portfolio">
                Lihat semua portfolio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ================================================== DEMO SHOWCASE */}
      {latestDemos.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <SectionHeading
            index="05"
            eyebrow="Demo interaktif"
            title="Coba dulu, baru percaya"
            description="Simulasi aplikasi yang benar-benar bisa diklik — kasir, payroll, stok gudang, dan lainnya. Langsung di browser, tanpa daftar dan tanpa instal."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestDemos.map((d, i) => (
              <Reveal key={d.id} delay={i * 0.05}>
                <DemoCard item={d} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex items-center justify-between gap-4">
            <p className="mono-label text-muted-foreground">7 simulasi tersedia</p>
            <Button asChild variant="outline" className="rounded-full px-7">
              <Link href="/demo">
                Jelajahi semua demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* ================================================== JOURNAL */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <SectionHeading
            index="06"
            eyebrow="ZDL Journal"
            title="Catatan dari lapangan"
            description="Yang kami pelajari dari mengerjakan website bisnis nyata — ditulis ringkas dan bisa langsung dipraktikkan."
          />
          {journalCards.length === 0 ? (
            <p className="mt-12 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
              Artikel pertama akan segera dipublikasikan — kelola melalui CMS Admin.
            </p>
          ) : (
            <div className="mt-10 border-t border-border">
              {journalCards.map((j) => (
                <Link
                  key={j.id}
                  href={`/journal/${j.slug}`}
                  className="group -mx-4 grid gap-2 border-b border-border px-4 py-6 transition-colors hover:bg-muted/40 sm:mx-0 sm:grid-cols-[8rem_1fr_auto] sm:items-center sm:gap-8 sm:px-4"
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    {j.publishedAt ? journalDateFmt.format(j.publishedAt) : "Draft"}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight group-hover:text-primary sm:text-xl">
                      {j.title}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                      {j.excerpt}
                    </p>
                  </div>
                  <span className="hidden items-center gap-3 font-mono text-xs text-muted-foreground sm:flex">
                    {j.readingMinutes} mnt
                    <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-10 flex justify-end">
            <Button asChild variant="outline" className="rounded-full px-7">
              <Link href="/journal">
                Semua artikel
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ================================================== CTA */}
      <CtaSection />
    </>
  );
}
