/**
 * ZDL — Zheng Digital Lab
 * Central site configuration. Update contact details here once,
 * they propagate across the entire site (CTA, footer, JSON-LD).
 */
export const site = {
  name: "ZDL",
  fullName: "ZDL — Zheng Digital Lab",
  legalName: "Zheng Digital Lab",
  domain: "zdl.my.id",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://zdl.my.id",
  tagline: "Web & App Development • Digital Solutions",
  description:
    "ZDL (Zheng Digital Lab) adalah digital development studio yang membantu bisnis membangun website, aplikasi, sistem internal, automation, dan digital presence yang siap mendukung pertumbuhan bisnis.",
  whatsapp: {
    /** Nomor lokal untuk tampilan */
    display: "0899-7374-5596",
    /** Format internasional tanpa + dan tanpa 0 depan */
    intl: "6289973745596",
    defaultMessage:
      "Halo ZDL, saya ingin konsultasi mengenai pengembangan website/aplikasi untuk bisnis saya.",
  },
  email: "hello@zdl.my.id",
  location: {
    city: "Tangerang",
    region: "Banten",
    country: "Indonesia",
    serviceAreas: [
      "Tangerang",
      "Jakarta",
      "Jabodetabek",
      "Banten",
      "Jawa Barat",
      "Jawa Tengah",
      "Jawa Timur",
      "Seluruh Indonesia",
    ],
  },
  social: {
    instagram: "https://instagram.com/zdl.my.id",
    github: "https://github.com/sirikotampan111-jpg",
    linkedin: "",
    tiktok: "",
  },
} as const;

export function waLink(message?: string): string {
  const text = encodeURIComponent(message || site.whatsapp.defaultMessage);
  return `https://wa.me/${site.whatsapp.intl}?text=${text}`;
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
