import type { Metadata } from "next";
import { DemoShell } from "@/components/site/demo-shell";
import { DemoPayroll } from "@/components/site/demo-payroll";

export const metadata: Metadata = {
  title: "Demo Simulasi Payroll — Coba Langsung di Browser",
  description:
    "Simulasi aplikasi payroll ZDL: proses gaji 6 karyawan sekaligus, potongan absensi, BPJS, dan PPh 21 dihitung otomatis, slip gaji siap terbit. Semua di browser.",
  alternates: { canonical: "/demo/coba/payroll" },
};

export default function DemoPayrollPage() {
  return (
    <DemoShell
      title="Demo Simulasi Payroll"
      subtitle="Gajian tidak perlu lagi dihitung manual di Excel. Tekan Proses Payroll dan lihat bagaimana sistem menghitung bruto, potongan absensi, BPJS, dan PPh 21 untuk semua karyawan sekaligus — lalu menerbitkan slip gaji siap kirim. Angka potongan disederhanakan untuk demo."
      backHref="/demo/simulasi-payroll"
      backLabel="Kembali ke halaman demo"
    >
      <DemoPayroll />
    </DemoShell>
  );
}
