import type { Metadata } from "next";
import { DemoShell } from "@/components/site/demo-shell";
import { DemoKatalog } from "@/components/site/demo-katalog";

export const metadata: Metadata = {
  title: "Demo Katalog & Pesan WhatsApp — Coba Langsung di Browser",
  description:
    "Simulasi katalog online dengan pemesanan via WhatsApp buatan ZDL: pilih menu, susun keranjang, pilih ambil/diantar, dan pesanan tersusun otomatis menjadi pesan WhatsApp. Tanpa daftar, tanpa install.",
  alternates: { canonical: "/demo/coba/katalog" },
};

export default function DemoKatalogPage() {
  return (
    <DemoShell
      title="Demo Katalog & Pesan WhatsApp"
      subtitle="Inilah cara kerja katalog online ZDL: pelanggan menjelajah menu, menyusun pesanan, memilih ambil sendiri atau diantar, dan pesanan otomatis tersusun menjadi pesan WhatsApp yang rapi — persis seperti versi produksi yang dipakai brand kuliner dan retail klien ZDL."
      backHref="/demo/katalog-pesan-whatsapp"
      backLabel="Kembali ke halaman demo"
    >
      <DemoKatalog />
    </DemoShell>
  );
}
