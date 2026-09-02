import type { Metadata } from "next";
import {
  MessageCircle,
  Mail,
  Clock,
  MapPin,
  Instagram,
  Github,
  Linkedin,
} from "lucide-react";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { ContactForm } from "@/components/site/contact-form";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact — Konsultasikan Project Web & Aplikasi Anda",
  description:
    "Hubungi ZDL untuk konsultasi pembuatan website, aplikasi, dashboard, dan sistem digital. WhatsApp, email, atau form konsultasi — respon cepat 1×24 jam kerja.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact ZDL — Zheng Digital Lab",
    description:
      "Konsultasikan project digital Anda: website, aplikasi, sistem internal, automation. Respon dalam 1×24 jam kerja.",
    url: `${site.url}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  const socials = [
    { href: site.social.instagram, label: "Instagram", Icon: Instagram },
    { href: site.social.github, label: "GitHub", Icon: Github },
    { href: site.social.linkedin, label: "LinkedIn", Icon: Linkedin },
  ].filter((s) => s.href);

  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact ZDL — Zheng Digital Lab",
    url: `${site.url}/contact`,
    mainEntity: {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: `+${site.whatsapp.intl}`,
        email: site.email,
        availableLanguage: ["Indonesian", "English"],
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />

      <section className="relative overflow-hidden border-b border-border/60">
        <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Breadcrumb items={[{ name: "Contact" }]} />
            <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">
              Mari <span className="text-gradient">diskusikan project Anda</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Isi form di bawah atau langsung chat via WhatsApp — kami membalas
              setiap permintaan dalam 1×24 jam kerja.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-semibold tracking-tight">Form konsultasi project</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Semua field bertanda <span className="text-destructive">*</span> wajib diisi.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          {/* Info */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold">Kontak langsung</h3>
              <div className="mt-4 space-y-4">
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium group-hover:text-primary">
                      WhatsApp
                    </span>
                    <span className="block text-sm text-muted-foreground">
                      {site.whatsapp.display}
                    </span>
                  </span>
                </a>
                <a href={`mailto:${site.email}`} className="group flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium group-hover:text-primary">Email</span>
                    <span className="block text-sm text-muted-foreground">{site.email}</span>
                  </span>
                </a>
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">Lokasi</span>
                    <span className="block text-sm text-muted-foreground">
                      {site.location.city}, {site.location.region}, Indonesia
                    </span>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                    <Clock className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">Jam respon</span>
                    <span className="block text-sm text-muted-foreground">
                      Senin–Sabtu, 09.00–18.00 WIB
                    </span>
                  </span>
                </div>
              </div>

              {socials.length > 0 && (
                <div className="mt-6 border-t border-border pt-5">
                  <p className="text-sm font-medium">Social media</p>
                  <div className="mt-3 flex gap-2">
                    {socials.map(({ href, label, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
              <h3 className="font-semibold">Sebelum menghubungi</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Tidak perlu menyiapkan dokumen teknis. Cukup ceritakan: bisnis
                Anda menjalankan apa, proses apa yang ingin diperbaiki, dan
                hasil seperti apa yang Anda bayangkan. Kami akan memandu
                sisanya lewat pertanyaan yang tepat.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
