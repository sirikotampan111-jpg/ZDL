import type { Metadata } from "next";
import { DemoShell } from "@/components/site/demo-shell";
import { DemoBooking } from "@/components/site/demo-booking";

export const metadata: Metadata = {
  title: "Demo Sistem Booking Online — Coba Langsung di Browser",
  description:
    "Simulasi sistem booking online ZDL: pelanggan memilih layanan, jadwal, dan menerima konfirmasi. Cocok untuk barbershop, klinik, studio, dan bengkel. Tanpa daftar, tanpa install.",
  alternates: { canonical: "/demo/coba/booking" },
};

export default function DemoBookingPage() {
  return (
    <DemoShell
      title="Demo Sistem Booking Online"
      subtitle="Alur persis seperti yang dirasakan pelanggan bisnis Anda: pilih layanan, pilih jadwal yang tersedia, isi data diri, dan terima kode konfirmasi — memakai data simulasi barbershop."
      backHref="/demo/sistem-booking-online"
      backLabel="Kembali ke halaman demo"
    >
      <DemoBooking />
    </DemoShell>
  );
}
