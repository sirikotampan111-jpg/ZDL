import type { Metadata } from "next";
import { DemoShell } from "@/components/site/demo-shell";
import { DemoGudang } from "@/components/site/demo-gudang";

export const metadata: Metadata = {
  title: "Demo Simulasi Manajemen Stok Gudang — Coba Langsung di Browser",
  description:
    "Simulasi aplikasi stok gudang ZDL: catat barang masuk/keluar, lihat peringatan stok menipis, nilai persediaan, dan riwayat mutasi. Semua di browser tanpa install.",
  alternates: { canonical: "/demo/coba/gudang" },
};

export default function DemoGudangPage() {
  return (
    <DemoShell
      title="Demo Simulasi Manajemen Stok Gudang"
      subtitle="Kelola persediaan tanpa Excel yang tidak pernah update. Coba catat barang masuk atau keluar, perhatikan status Aman/Menipis/Habis berubah otomatis, peringatan restock muncul, dan semua mutasi tercatat di riwayat — persis seperti versi produksi, memakai data simulasi gudang kedai kopi."
      backHref="/demo/manajemen-stok-gudang"
      backLabel="Kembali ke halaman demo"
    >
      <DemoGudang />
    </DemoShell>
  );
}
