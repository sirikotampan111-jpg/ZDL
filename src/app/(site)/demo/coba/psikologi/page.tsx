import type { Metadata } from "next";
import { DemoShell } from "@/components/site/demo-shell";
import { DemoPsikologi } from "@/components/site/demo-psikologi";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n();
  const en = locale === "en";
  return {
    title: en
      ? "Psychology Test Demo — Try It Live in the Browser"
      : "Demo Tes Psikologi — Coba Langsung di Browser",
    description: en
      ? "Interactive psychology test simulation by ZDL: Big Five personality assessment and a work burnout check. Self-scored, private, and fully in-browser — no sign-up, no install. A preview of the assessment systems we can build for HR teams, clinics, and institutions."
      : "Simulasi tes psikologi interaktif buatan ZDL: Tes Kepribadian Big Five dan Cek Burnout Kerja. Dinilai otomatis, privat, sepenuhnya di browser — tanpa daftar, tanpa install. Cuplikan sistem assessment yang bisa kami bangun untuk HR, klinik, dan lembaga.",
    alternates: {
      canonical: "/demo/coba/psikologi",
      languages: {
        "id-ID": "/demo/coba/psikologi",
        en: "/en/demo/coba/psikologi",
        "x-default": "/demo/coba/psikologi",
      },
    },
  };
}

export default async function DemoPsikologiPage() {
  const { locale } = await getI18n();
  const en = locale === "en";

  return (
    <DemoShell
      title={en ? "Psychology Test Demo" : "Demo Tes Psikologi"}
      subtitle={
        en
          ? "Two working self-assessment instruments — a Big Five personality test and a work burnout check — scored instantly with a visual profile. The production version can be customized for HR recruitment, employee well-being programs, schools, and clinics."
          : "Dua instrumen self-assessment yang benar-benar berfungsi — Tes Kepribadian Big Five dan Cek Burnout Kerja — dinilai otomatis dengan profil visual. Versi produksinya bisa dikustomisasi untuk rekrutmen HR, program kesejahteraan karyawan, sekolah, dan klinik."
      }
      backHref={en ? "/en/demo" : "/demo"}
      backLabel={en ? "Back to the demo gallery" : "Kembali ke galeri demo"}
    >
      <DemoPsikologi />
    </DemoShell>
  );
}
