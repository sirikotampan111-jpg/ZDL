import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Gauge,
  Code2,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "@/components/site/hero-visual";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { PortfolioCard } from "@/components/site/portfolio-card";
import { JournalCard } from "@/components/site/journal-card";
import { CtaSection } from "@/components/site/cta-section";
import { serviceCategories } from "@/lib/services-data";
import { getPublishedJournals, getPublishedPortfolios } from "@/lib/queries";
import { readingTime } from "@/lib/markdown";
import { waLink } from "@/lib/site";

const techStack = [
  "Next.js", "React", "TypeScript", "Node.js", "Tailwind CSS",
  "PostgreSQL", "Prisma", "Framer Motion", "Vercel", "Google Apps Script",
];

const valueProps = [
  {
    icon: Code2,
    title: "Dibangun dengan teknologi modern",
    description:
      "Kami memakai stack yang sama dengan produk digital global — Next.js, TypeScript, dan database relasional — sehingga website dan aplikasi Anda mudah dikembangkan, bukan sekadar jadi lalu terbengkelai.",
  },
  {
    icon: Gauge,
    title: "Cepat di jaringan mobile Indonesia",
    description:
      "Setiap halaman dioptimasi untuk Core Web Vitals: gambar terkompresi, JavaScript minimal, dan server rendering. Pengunjung dari HP dengan koneksi 4G tetap mendapat pengalaman yang mulus.",
  },
  {
    icon: ShieldCheck,
    title: "Anda pemilik asetnya",
    description:
      "Domain, kode, dan data berada di bawah kendali Anda. Dokumentasi jelas dan CMS internal membuat tim Anda bisa mengelola konten tanpa tergantung pada developer.",
  },
  {
    icon: Layers,
    title: "Satu partner untuk kebutuhan digital",
    description:
      "Dari website, aplikasi, sistem internal, otomasi spreadsheet, hingga domain dan hosting — Anda tidak perlu mengoordinasikan banyak vendor yang tidak saling terhubung.",
  },
];

const processSteps = [
  { step: "01", name: "Understand", description: "Memahami bisnis, tujuan, dan masalah yang benar-benar perlu diselesaikan." },
  { step: "02", name: "Plan", description: "Menyusun ruang lingkup, struktur, dan prioritas yang jelas sebelum menulis kode." },
  { step: "03", name: "Design", description: "Merancang tampilan dan alur yang nyaman digunakan di perangkat apa pun." },
  { step: "04", name: "Develop", description: "Membangun dengan kode yang bersih, teruji, dan terdokumentasi." },
  { step: "05", name: "Test", description: "Memeriksa fungsi, kecepatan, dan kenyamanan penggunaan secara menyeluruh." },
  { step: "06", name: "Deploy", description: "Memasang ke server dengan konfigurasi aman dan monitoring." },
  { step: "07", name: "Improve", description: "Mengukur, memelihara, dan mengembangkan sesuai data penggunaan." },
];

export default async function HomePage() {
  const [featuredPortfolios, latestJournals] = await Promise.all([
    getPublishedPortfolios({ featuredOnly: true, take: 3 }),
    getPublishedJournals({ take: 3 }),
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
        <div className="bg-brand-gradient pointer-events-none absolute left-1/2 top-[-320px] h-[560px] w-[860px] -translate-x-1/2 rounded-full opacity-[0.13] blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:pb-28">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Web &amp; App Development • Digital Solutions
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">
                  ZDL — Build Digital Solutions That{" "}
                  <span className="text-gradient">Move Your Business Forward</span>.
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Websites, mobile applications, SaaS, dashboards, e-commerce, and
                  custom digital systems built for real business needs.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <a href={waLink()} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Konsultasi Project
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 text-base font-medium"
                  >
                    <Link href="/portfolio">
                      Lihat Portfolio
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Reveal>
              <Reveal delay={0.32}>
                <p className="mt-6 text-sm text-muted-foreground">
                  Melayani <span className="font-medium text-foreground">Tangerang, Jakarta, Jabodetabek, Banten</span>{" "}
                  dan seluruh Indonesia.
                </p>
              </Reveal>
            </div>

            <HeroVisual />
          </div>
        </div>

        {/* tech strip */}
        <div className="relative border-y border-border/60 bg-card/40">
          <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Teknologi yang kami gunakan
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {techStack.map((tech) => (
                <span key={tech} className="text-sm font-medium text-muted-foreground">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== SERVICES */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24" id="services">
        <SectionHeading
          eyebrow="Services"
          title="Solusi digital end-to-end untuk bisnis Anda"
          description="Enam lini layanan yang saling terhubung — dari membangun produk digital hingga memastikan bisnis Anda ditemukan oleh pelanggan."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCategories.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 0.06}>
              <Link
                href={`/services/${cat.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_12px_40px_-12px_rgba(139,92,246,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <cat.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{cat.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {cat.tagline}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {cat.items.slice(0, 4).map((item) => (
                    <li key={item.name} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
                      {item.name}
                    </li>
                  ))}
                  {cat.items.length > 4 && (
                    <li className="pl-3 text-xs text-muted-foreground/70">
                      +{cat.items.length - 4} lainnya
                    </li>
                  )}
                </ul>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-primary">
                  Pelajari lebih lanjut
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
            eyebrow="Why ZDL"
            title="Partner teknis yang berpikir seperti pemilik bisnis"
            description="Kami tidak hanya mengeksekusi brief — kami membantu Anda memutuskan apa yang layak dibangun dan apa yang tidak."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {valueProps.map((vp, i) => (
              <Reveal key={vp.title} delay={i * 0.06}>
                <div className="flex h-full gap-4 rounded-2xl border border-border bg-background p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <vp.icon className="h-5.5 w-5.5" />
                  </span>
                  <div>
                    <h3 className="font-semibold tracking-tight">{vp.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {vp.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================== PROCESS */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Our Approach"
          title="Proses yang jelas dari awal sampai terpasang"
          description="Tujuh tahap yang sama kami terapkan pada landing page sederhana maupun sistem internal yang kompleks — skalanya berbeda, disiplinnya sama."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((ps, i) => (
            <Reveal key={ps.step} delay={i * 0.05}>
              <div className="group h-full rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
                <span className="font-mono text-sm font-semibold text-primary">{ps.step}</span>
                <h3 className="mt-2 font-semibold tracking-tight">{ps.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {ps.description}
                </p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.35}>
            <div className="flex h-full flex-col items-start justify-center rounded-2xl border border-primary/30 bg-primary/5 p-5">
              <p className="font-semibold tracking-tight">Butuh partner yang prosesnya rapi?</p>
              <Button asChild size="sm" className="mt-3 rounded-full bg-primary text-primary-foreground">
                <a href={waLink()} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-1.5 h-4 w-4" />
                  Mulai konsultasi
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================== FEATURED PORTFOLIO */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <SectionHeading
            eyebrow="Featured Work"
            title="Project pilihan dari meja kerja kami"
            description="Contoh nyata bagaimana kami menerjemahkan kebutuhan bisnis menjadi produk digital yang bekerja. Data project di bawah ini dikelola melalui CMS ZDL."
          />
          {portfolioFallback ? (
            <p className="mt-12 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
              Portfolio akan segera ditampilkan — tambahkan project pertama Anda melalui CMS Admin.
            </p>
          ) : (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPortfolios.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.06}>
                  <PortfolioCard item={p} />
                </Reveal>
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="rounded-full px-8">
              <Link href="/portfolio">
                Lihat semua portfolio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ================================================== JOURNAL */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="ZDL Journal"
          title="Wawasan seputar teknologi & bisnis digital"
          description="Artikel praktis tentang web development, sistem bisnis, SEO, dan teknologi — ditulis dari pengalaman mengerjakan project nyata."
        />
        {journalCards.length === 0 ? (
          <p className="mt-12 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            Artikel pertama akan segera dipublikasikan — kelola melalui CMS Admin.
          </p>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {journalCards.map((j, i) => (
              <Reveal key={j.id} delay={i * 0.06}>
                <JournalCard item={j} />
              </Reveal>
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="rounded-full px-8">
            <Link href="/journal">
              Baca ZDL Journal
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ================================================== CTA */}
      <CtaSection />
    </>
  );
}
