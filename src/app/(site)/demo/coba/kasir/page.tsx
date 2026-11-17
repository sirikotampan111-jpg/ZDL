import type { Metadata } from "next";
import { DemoShell } from "@/components/site/demo-shell";
import { DemoKasir } from "@/components/site/demo-kasir";

export const metadata: Metadata = {
  title: "Demo Aplikasi Kasir — Coba Langsung di Browser",
  description:
    "Simulasi aplikasi kasir (Point of Sale) buatan ZDL: pilih menu, kelola pesanan, hitung kembalian, dan cetak struk. Semua di browser — tanpa daftar, tanpa install.",
  alternates: { canonical: "/demo/coba/kasir" },
};

export default function DemoKasirPage() {
  return (
    <DemoShell
      title="Demo Aplikasi Kasir"
      subtitle="Inilah cara kerja kasir digital ZDL: ketuk menu untuk menambah pesanan, atur jumlah, hitung pembayaran, dan terbitkan struk — persis seperti versi produksi, memakai data simulasi."
      backHref="/demo/aplikasi-kasir"
      backLabel="Kembali ke halaman demo"
    >
      <DemoKasir />
    </DemoShell>
  );
}
