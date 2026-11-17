import type { Metadata } from "next";
import { DemoShell } from "@/components/site/demo-shell";
import { DemoAbsensi } from "@/components/site/demo-absensi";

export const metadata: Metadata = {
  title: "Demo Simulasi Absensi Karyawan — Coba Langsung di Browser",
  description:
    "Simulasi aplikasi absensi ZDL: check-in/check-out dengan jam live, status tepat waktu atau terlambat, istirahat, dan rekap bulanan siap dipakai payroll. Semua di browser.",
  alternates: { canonical: "/demo/coba/absensi" },
};

export default function DemoAbsensiPage() {
  return (
    <DemoShell
      title="Demo Simulasi Absensi Karyawan"
      subtitle="Inilah cara absensi digital menggantikan buku tanda tangan: karyawan check-in dari HP dengan validasi lokasi, status tepat waktu atau terlambat tercatat otomatis, dan rekap bulanan langsung siap dipakai saat payroll. Pilih salah satu karyawan lalu coba check-in sekarang."
      backHref="/demo/simulasi-absensi"
      backLabel="Kembali ke halaman demo"
    >
      <DemoAbsensi />
    </DemoShell>
  );
}
