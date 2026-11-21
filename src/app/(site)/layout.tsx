import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { WhatsappFloat } from "@/components/site/whatsapp-float";
import { LocaleProvider } from "@/i18n/client";
import { getLocale } from "@/i18n/server";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <LocaleProvider locale={locale}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <WhatsappFloat />
      </div>
    </LocaleProvider>
  );
}
