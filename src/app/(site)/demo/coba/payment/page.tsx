import type { Metadata } from "next";
import { DemoShell } from "@/components/site/demo-shell";
import { DemoPayment } from "@/components/site/demo-payment";

export const metadata: Metadata = {
  title: "Demo Simulasi Payment Gateway — Coba Langsung di Browser",
  description:
    "Simulasi payment gateway buatan ZDL: QRIS, Virtual Account, e-wallet, dan kartu dengan 3DS OTP. Alur tagihan sampai struk lunas, semua di browser tanpa daftar.",
  alternates: { canonical: "/demo/coba/payment" },
};

export default function DemoPaymentPage() {
  return (
    <DemoShell
      title="Demo Simulasi Payment Gateway"
      subtitle="Beginilah alur pembayaran digital yang dibangun ZDL: pelanggan terima tagihan, pilih kanal (QRIS, Virtual Account, e-wallet, atau kartu), bayar, dan status lunas masuk otomatis ke sistem Anda. Semua kanal disimulasikan — tidak ada uang sungguhan."
      backHref="/demo/simulasi-payment-gateway"
      backLabel="Kembali ke halaman demo"
    >
      <DemoPayment />
    </DemoShell>
  );
}
