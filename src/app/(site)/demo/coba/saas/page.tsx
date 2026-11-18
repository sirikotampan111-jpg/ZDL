import type { Metadata } from "next";
import { DemoShell } from "@/components/site/demo-shell";
import { DemoSaas } from "@/components/site/demo-saas";

export const metadata: Metadata = {
  title: "Demo Dashboard Admin SaaS — Coba Langsung di Browser",
  description:
    "Simulasi dashboard admin SaaS buatan ZDL: KPI MRR dan churn, grafik pendapatan 12 bulan, daftar pelanggan multi-tenant, dan feed aktivitas. Semua di browser.",
  alternates: { canonical: "/demo/coba/saas" },
};

export default function DemoSaasPage() {
  return (
    <DemoShell
      title="Demo Dashboard Admin SaaS"
      subtitle="Jika Anda ingin menjual aplikasi sebagai langganan (SaaS), inilah wajah admin-nya: pantau MRR dan churn, lihat pendapatan 12 bulan, kelola pelanggan per paket, dan pantau aktivitas terbaru — semuanya dalam satu dashboard multi-tenant."
      backHref="/demo/dashboard-saas"
      backLabel="Kembali ke halaman demo"
    >
      <DemoSaas />
    </DemoShell>
  );
}
