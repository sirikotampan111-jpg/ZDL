import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Target,
  HeartHandshake,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { Reveal } from "@/components/site/reveal";
import { CtaSection } from "@/components/site/cta-section";
import { LogoMark } from "@/components/site/logo";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tentang ZDL — Digital Development Studio dari Tangerang",
  description:
    "ZDL (Zheng Digital Lab) adalah digital development studio yang membantu bisnis membangun website, aplikasi, sistem internal, automation, dan digital presence. Berbasis di Tangerang, melayani seluruh Indonesia.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Tentang ZDL — Zheng Digital Lab",
    description:
      "Digital development studio yang membantu bisnis membangun website, aplikasi, sistem internal, dan automation dengan proses yang jelas.",
    url: `${site.url}/about`,
    type: "website",
  },
};

const approach = [
  {
    step: "1",
    name: "Understand",
    description:
      "Kami mulai dengan mendengar — memahami model bisnis, hambatan operasional, dan hasil yang Anda harapkan. Tanpa pemahaman yang benar, teknologi apa pun hanya akan menjadi biaya baru.",
  },
  {
    step: "2",
    name: "Plan",
    description:
      "Kebutuhan diterjemahkan menjadi ruang lingkup, prioritas, dan rencana kerja yang jelas. Anda tahu apa yang akan dibangun, kapan, dan dengan urutan mana — sebelum satu baris kode pun ditulis.",
  },
  {
    step: "3",
    name: "Design",
    description:
      "Tampilan dan alur dirancang untuk pengguna Anda, bukan untuk pameran fitur. Mobile-first, bersih, dan konsisten dengan brand Anda.",
  },
  {
    step: "4",
    name: "Develop",
    description:
      "Kode ditulis dengan standar yang bisa dirawat: terstruktur, teruji, dan terdokumentasi. Kami memakai teknologi modern yang populer agar pengembangan lanjutan tidak bergantung pada satu orang.",
  },
  {
    step: "5",
    name: "Test",
    description:
      "Setiap fitur diperiksa: fungsionalitas lintas perangkat, kecepatan loading di jaringan mobile, dan skenario penggunaan nyata — bukan sekadar 'jalan di laptop kami'.",
  },
  {
    step: "6",
    name: "Deploy",
    description:
      "Peluncuran dilakukan rapi: domain, hosting, SSL, dan monitoring disiapkan. Sistem Anda online dengan konfigurasi yang aman sejak hari pertama.",
  },
  {
    step: "7",
    name: "Improve",
    description:
      "Digital product bukan proyek sekali jadi. Kami mengukur pemakaian, memelihara sistem, dan membantu Anda mengembangkan fitur berikutnya berdasarkan data.",
  },
];

const values = [
  {
    icon: Target,
    title: "Solusi, bukan sekadar produk",
    description:
      "Kami terbiasa menolak fitur yang tidak perlu. Yang penting sistemnya menyelesaikan masalah, bukan terlihat canggih di demo.",
  },
  {
    icon: HeartHandshake,
    title: "Transparan sejak awal",
    description:
      "Ruang lingkup, progress, dan kendala dikomunikasikan apa adanya. Tidak ada biaya siluman, tidak ada janji yang tidak bisa kami penuhi.",
  },
  {
    icon: Lightbulb,
    title: "Edukasi sebagai bagian dari kerja",
    description:
      "Kami menjelaskan keputusan teknis dengan bahasa yang bisa dipahami, sehingga Anda bisa mengambil keputusan bisnis yang lebih baik.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <Breadcrumb items={[{ name: "About" }]} />
          <div className="mx-auto max-w-3xl text-center">
            <LogoMark className="mx-auto h-16 w-16" />
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Tentang <span className="text-gradient">ZDL</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              ZDL (Zheng Digital Lab) adalah digital development studio yang
              membantu bisnis membangun fondasi digitalnya — website, aplikasi,
              sistem internal, automation, dan digital presence — dengan proses
              yang jelas dan hasil yang bisa dipertanggungjawabkan.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight">Berawal dari masalah yang familier</h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Banyak bisnis di Indonesia sudah sadar pentingnya digital, tapi
                terjebak di antara dua pilihan yang sama-sama tidak ideal: tools
                instant yang tidak sesuai proses bisnis, atau vendor besar dengan
                biaya yang belum masuk akal untuk tahap perkembangan mereka.
              </p>
              <p>
                ZDL lahir untuk mengisi ruang itu — studio pengembangan yang
                bekerja dengan standar engineering yang baik, tapi dekat dengan
                realita bisnis menengah: anggaran yang harus efisien, sistem yang
                harus cepat jadi, dan hasil yang harus terukur.
              </p>
              <p>
                Kami bekerja dari {site.location.city}, {site.location.region}{" "}
                dan melayani klien di {site.location.serviceAreas.slice(0, 6).join(", ")} —
                sebagian besar proses bisa berjalan daring, dengan pertemuan tatap
                muka untuk area Jabodetabek dan sekitarnya.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-7">
              <h3 className="font-semibold">Apa yang kami bangun</h3>
              <ul className="mt-4 space-y-3.5">
                {[
                  { name: "Website", detail: "landing page, company profile, e-commerce, custom website" },
                  { name: "Aplikasi", detail: "mobile app, SaaS, CRM, management system" },
                  { name: "Sistem Internal", detail: "admin dashboard, CMS, dashboard monitoring, database system" },
                  { name: "Automation", detail: "Excel/Google Sheets automation, reporting system, integrasi" },
                  { name: "Digital Presence", detail: "SEO, iklan digital, domain, hosting, email profesional" },
                ].map((item) => (
                  <li key={item.name} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    <span className="text-sm leading-relaxed">
                      <strong className="font-semibold text-foreground">{item.name}</strong>
                      <span className="text-muted-foreground"> — {item.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6 w-full rounded-full bg-primary text-primary-foreground">
                <a href={waLink()} target="_blank" rel="noopener noreferrer">
                  Diskusikan kebutuhan Anda
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Prinsip kerja kami</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Tiga prinsip yang memandu setiap keputusan — dari cara kami
              merancang sistem sampai cara kami berkomunikasi dengan Anda.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-border bg-background p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <v.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold tracking-tight">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {v.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Our Approach</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Tujuh tahap yang kami lalui di setiap project — skalanya
            menyesuaikan kompleksitas, disiplinnya tidak pernah berubah.
          </p>
        </div>
        <ol className="mt-12 space-y-4">
          {approach.map((a, i) => (
            <Reveal key={a.step} delay={i * 0.04}>
              <li className="flex gap-5 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-mono font-bold text-primary">
                  {a.step}
                </span>
                <div>
                  <h3 className="font-semibold tracking-tight">{a.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {a.description}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Local SEO — service areas */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
                <MapPin className="h-3.5 w-3.5" />
                Area Layanan
              </span>
              <h2 className="mt-5 text-3xl font-bold tracking-tight">
                Berbasis di Tangerang, melayani seluruh Indonesia
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  Basis kami di {site.location.city} menempatkan kami strategis
                  untuk melayani wilayah {site.location.region} dan Jakarta —
                  area dengan dinamika bisnis tertinggi di Indonesia. Untuk area
                  Jabodetabek, pertemuan tatap mudah dapat dijadwalkan sesuai
                  tahapan project.
                </p>
                <p>
                  Di luar Jawa, seluruh proses berjalan mulus secara daring:
                  discovery call via WhatsApp/Google Meet, dokumentasi
                  requirement tertulis, demo progres berkala, dan serah terima
                  lengkap dengan panduan penggunaan. Jarak bukan penghalang
                  kualitas kerja.
                </p>
              </div>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
              >
                Diskusikan project di area Anda
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="grid gap-3 sm:grid-cols-2">
                {site.location.serviceAreas.map((area) => (
                  <div
                    key={area}
                    className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3.5"
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm font-medium">{area}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
