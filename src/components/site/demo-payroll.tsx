"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Banknote,
  CalendarDays,
  Coins,
  FileText,
  Printer,
  RotateCcw,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// ============================================================ DATA SIMULASI

const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

type Employee = {
  id: string;
  name: string;
  role: string;
  base: number; // gaji pokok
  allowance: number; // tunjangan tetap (transport + makan)
  hadir: number; // hari hadir bulan ini
  kerjasama: number; // hari kerja
};

const EMPLOYEES: Employee[] = [
  { id: "E01", name: "Rina Marlina", role: "Kasir", base: 3200000, allowance: 500000, hadir: 22, kerjasama: 22 },
  { id: "E02", name: "Bagas Prakoso", role: "Barista", base: 3000000, allowance: 500000, hadir: 21, kerjasama: 22 },
  { id: "E03", name: "Siti Aminah", role: "Dapur", base: 2900000, allowance: 450000, hadir: 22, kerjasama: 22 },
  { id: "E04", name: "Dedi Kurniawan", role: "Supervisor", base: 4200000, allowance: 700000, hadir: 20, kerjasama: 22 },
  { id: "E05", name: "Laras Ayu", role: "Admin Sosmed", base: 3400000, allowance: 500000, hadir: 22, kerjasama: 22 },
  { id: "E06", name: "Ilham Ramadhan", role: "Kurir", base: 2800000, allowance: 600000, hadir: 19, kerjasama: 22 },
];

const MONTHS = ["September 2026", "Oktober 2026", "November 2026"];

type Slip = {
  employee: Employee;
  potonganTelat: number;
  bpjs: number;
  pph21: number;
  gross: number;
  thp: number;
};

/**
 * Perhitungan disederhanakan untuk demo:
 * - Potongan ketidakhadiran: pokok/kerjasama × hari absen
 * - BPJS (bagian karyawan): 3% dari pokok
 * - PPh 21 (TER sederhana): 0,5% dari gross — angka riil memakai tarif TER per kategori
 */
function computeSlip(e: Employee): Slip {
  const gross = e.base + e.allowance;
  const potonganTelat = Math.round((e.base / e.kerjasama) * (e.kerjasama - e.hadir));
  const bpjs = Math.round(e.base * 0.03);
  const pph21 = Math.round(gross * 0.005);
  const thp = gross - potonganTelat - bpjs - pph21;
  return { employee: e, potonganTelat, bpjs, pph21, gross, thp };
}

// ============================================================ KOMPONEN

export function DemoPayroll() {
  const [month, setMonth] = useState(MONTHS[2]);
  const [slips, setSlips] = useState<Slip[] | null>(null);
  const [detail, setDetail] = useState<Slip | null>(null);
  const [processing, setProcessing] = useState(false);

  const totalThp = useMemo(
    () => (slips ? slips.reduce((s, x) => s + x.thp, 0) : 0),
    [slips]
  );
  const totalGross = useMemo(
    () => (slips ? slips.reduce((s, x) => s + x.gross, 0) : 0),
    [slips]
  );

  function processPayroll() {
    setProcessing(true);
    // simulasi proses backend: generate slip untuk semua karyawan
    setTimeout(() => {
      setSlips(EMPLOYEES.map(computeSlip));
      setProcessing(false);
    }, 1200);
  }

  function reset() {
    setSlips(null);
    setDetail(null);
  }

  return (
    <div className="mt-8">
      {/* Kontrol periode */}
      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarDays className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Periode penggajian</p>
            <p className="text-xs text-muted-foreground">
              PT Kopi Kita Sejahtera — 6 karyawan aktif
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {MONTHS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMonth(m); reset(); }}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                month === m
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {!slips ? (
        /* ---------------- Roaster sebelum diproses ---------------- */
        <>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Karyawan</th>
                  <th className="px-4 py-3 font-medium">Posisi</th>
                  <th className="px-4 py-3 font-medium text-right">Gaji Pokok</th>
                  <th className="px-4 py-3 font-medium text-right">Tunjangan</th>
                  <th className="px-4 py-3 font-medium text-right">Hadir</th>
                </tr>
              </thead>
              <tbody>
                {EMPLOYEES.map((e) => (
                  <tr key={e.id} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">{e.name}</p>
                      <p className="text-xs text-muted-foreground">{e.id}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{e.role}</td>
                    <td className="px-4 py-3 text-right">{rupiah(e.base)}</td>
                    <td className="px-4 py-3 text-right">{rupiah(e.allowance)}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-semibold",
                          e.hadir === e.kerjasama
                            ? "bg-primary/10 text-primary"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-500"
                        )}
                      >
                        {e.hadir}/{e.kerjasama}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col items-center gap-2">
            <Button
              type="button"
              onClick={processPayroll}
              disabled={processing}
              className="w-full max-w-sm rounded-full bg-primary font-semibold text-primary-foreground sm:w-auto"
            >
              {processing ? (
                <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Banknote className="mr-2 h-4 w-4" />
              )}
              {processing ? "Memproses…" : `Proses Payroll ${month}`}
            </Button>
            <p className="text-xs text-muted-foreground">
              Sistem menghitung potongan ketidakhadiran, BPJS, dan PPh 21 otomatis — lalu menerbitkan slip untuk setiap karyawan.
            </p>
          </div>
        </>
      ) : (
        /* ---------------- Hasil payroll ---------------- */
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Karyawan dibayar", value: `${slips.length} orang`, Icon: Users },
              { label: "Total bruto", value: rupiah(totalGross), Icon: Coins },
              { label: "Total take-home pay", value: rupiah(totalThp), Icon: BadgeCheck },
            ].map(({ label, value, Icon }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="mt-2 text-xs text-muted-foreground">{label}</p>
                <p className="text-lg font-bold">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Karyawan</th>
                  <th className="px-4 py-3 font-medium text-right">Bruto</th>
                  <th className="px-4 py-3 font-medium text-right">Potongan</th>
                  <th className="px-4 py-3 font-medium text-right">Take-Home</th>
                  <th className="px-4 py-3 font-medium text-center">Status</th>
                  <th className="px-4 py-3 font-medium text-center">Slip</th>
                </tr>
              </thead>
              <tbody>
                {slips.map((s) => {
                  const potongan = s.potonganTelat + s.bpjs + s.pph21;
                  return (
                    <tr key={s.employee.id} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-medium">{s.employee.name}</p>
                        <p className="text-xs text-muted-foreground">{s.employee.role}</p>
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{rupiah(s.gross)}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">-{rupiah(potongan)}</td>
                      <td className="px-4 py-3 text-right font-bold text-primary">{rupiah(s.thp)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          <BadgeCheck className="h-3 w-3" /> Lunas
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => setDetail(s)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Lihat
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col items-center gap-2">
            <Button
              type="button"
              onClick={reset}
              variant="outline"
              className="rounded-full"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Ulangi dengan periode lain
            </Button>
            <p className="text-xs text-muted-foreground">
              Di versi asli, semua slip otomatis dikirim ke WhatsApp masing-masing karyawan pada tanggal gajian.
            </p>
          </div>
        </>
      )}

      {/* Slip gaji */}
      <Dialog open={Boolean(detail)} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="inline-flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Slip Gaji — {month}
            </DialogTitle>
            <DialogDescription>
              Tampilan slip yang diterima karyawan. Angka potongan disederhanakan untuk demo.
            </DialogDescription>
          </DialogHeader>

          {detail && (
            <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm leading-relaxed">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold">{detail.employee.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {detail.employee.id} · {detail.employee.role}
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  LUNAS
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Pendapatan</p>
                <div className="flex justify-between"><span>Gaji pokok</span><span>{rupiah(detail.employee.base)}</span></div>
                <div className="flex justify-between"><span>Tunjangan tetap</span><span>{rupiah(detail.employee.allowance)}</span></div>
                <div className="flex justify-between font-semibold"><span>Bruto</span><span>{rupiah(detail.gross)}</span></div>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Potongan</p>
                <div className="flex justify-between">
                  <span>Absensi ({detail.employee.kerjasama - detail.employee.hadir} hari)</span>
                  <span>-{rupiah(detail.potonganTelat)}</span>
                </div>
                <div className="flex justify-between"><span>BPJS (3% pokok)</span><span>-{rupiah(detail.bpjs)}</span></div>
                <div className="flex justify-between"><span>PPh 21 TER</span><span>-{rupiah(detail.pph21)}</span></div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-base font-bold">
                <span>Take-Home Pay</span>
                <span className="text-primary">{rupiah(detail.thp)}</span>
              </div>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => window.print()}
            className="w-full rounded-full"
          >
            <Printer className="mr-2 h-4 w-4" />
            Cetak Slip
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
