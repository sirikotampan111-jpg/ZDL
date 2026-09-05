import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { site } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.fullName} | Jasa Web & App Development Profesional`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "jasa pembuatan website",
    "jasa pembuatan aplikasi",
    "web development",
    "mobile app development",
    "jasa website Tangerang",
    "jasa website Jakarta",
    "jasa pembuatan aplikasi Indonesia",
    "custom software development",
    "jasa pembuatan dashboard",
    "jasa pembuatan SaaS",
    "ZDL",
    "Zheng Digital Lab",
  ],
  authors: [{ name: site.legalName, url: site.url }],
  creator: site.legalName,
  publisher: site.legalName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: site.url,
    siteName: site.fullName,
    title: `${site.fullName} | Jasa Web & App Development Profesional`,
    description: site.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ZDL — Zheng Digital Lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.fullName} | Web & App Development`,
    description: site.description,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafc" },
    { media: "(prefers-color-scheme: dark)", color: "#08080d" },
  ],
  width: "device-width",
  initialScale: 1,
};

function JsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#organization`,
    name: site.fullName,
    alternateName: ["ZDL", site.legalName],
    url: site.url,
    logo: `${site.url}/icon.png`,
    image: `${site.url}/og-image.png`,
    description: site.description,
    email: site.email,
    telephone: `+${site.whatsapp.intl}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressRegion: site.location.region,
      addressCountry: "ID",
    },
    areaServed: site.location.serviceAreas.map((area) => ({
      "@type": "Place",
      name: area,
    })),
    priceRange: "$$",
    sameAs: Object.values(site.social).filter(Boolean),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.fullName,
    description: site.description,
    publisher: { "@id": `${site.url}/#organization` },
    inLanguage: "id-ID",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([organization, website]),
      }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
        <JsonLd />
      </body>
    </html>
  );
}
