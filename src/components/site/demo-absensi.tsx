"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  Coffee,
  LogIn,
  LogOut,
  MapPin,
  Timer,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================================ DATA SIMULASI

type Employee = { id: string; name: string; role: string; shift: string };

const EMPLOYEES: Employee[] = [
  { id: "E01", name: "Rina Marlina", role: "Kasir", shift: "07:00 – 16:00" },
  { id: "E02", name: "Bagas Prakoso", role: "Barista", shift: "07:00 – 16:00" },
  { id: "E03", name: "Siti Aminah", role: "Dapur", shift: "06:30 – 15:30" },
  { id: "E04", name: "Dedi Kurniawan", role: "Supervisor", shift: "08:00 – 17:00" },
  { id: "E05", name: "Laras Ayu", role: "Admin Sosmed", shift: "09:00 – 18:00" },
];

const timeFmt = (d: Date) =>
  d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

const dateFmt = (d: Date) =>
  d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

/** Rekap bulanan simulasi per karyawan: H hadir, T telat, I izin, A alpha */
const REKAP: Record<string, ("H" | "T" | "I" | "A")[]> = {
  E01: ["H", "H", "H", "H", "H", "T", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
  E02: ["H", "H", "T", "H", "H", "H", "H", "H", "I", "H", "H", "H", "H", "H", "H", "H", "H", "T", "H", "H"],
  E03: ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "A", "H", "H", "H", "H", "H", "H"],
  E04: ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "I", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
  E05: ["H", "T", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
};

const STATUS_STYLE: Record<"H" | "T" | "I" | "A", string> = {
  H: "bg-primary/10 text-primary",
  T: "bg-amber-500/10 text-amber-600 dark:text-amber-500",
  I: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  A: "bg-destructive/10 text-destructive",
};

const CUTOFF = 8 * 60; // batas tepat waktu 08:00

// ============================================================ KOMPONEN

export function DemoAbsensi() {
  const [now, setNow] = useState(() => new Date());
  const [mounted, setMounted] = useState(false);
  const [empId, setEmpId] = useState("E01");
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [breakStart, setBreakStart] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [late, setLate] = useState(false);

  useEffect(() => {
    // jam live dijalankan hanya setelah mount — SSR dan hydration memakai
    // placeholder yang sama, sehingga tidak ada hydration mismatch (#418)
    setMounted(true);
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const emp = EMPLOYEES.find((e) => e.id === empId)!;
  const rekap = REKAP[empId];

  const minutes = now.getHours() * 60 + now.getMinutes();
  const isLate = minutes > CUTOFF;

  function doCheckIn() {
    const d = new Date();
    setCheckIn(d);
    setLate(d.getHours() * 60 + d.getMinutes() > CUTOFF);
  }

  const workedMinutes =
    checkIn && checkOut ? (checkOut.getHours() * 60 + checkOut.getMinutes()) - (checkIn.getHours() * 60 + checkIn.getMinutes()) : null;

  const hadirCount = rekap.filter((s) => s === "H").length;
  const telatCount = rekap.filter((s) => s === "T").length;
  const izinCount = rekap.filter((s) => s === "I").length;
  const alphaCount = rekap.filter((s) => s === "A").length;

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Kiri: clock-in */}
      <div className="space-y-4">
        {/* Pilih karyawan */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Simulasikan sebagai
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {EMPLOYEES.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => { setEmpId(e.id); setCheckIn(null); setBreakStart(null); setCheckOut(null); }}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  empId === e.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40"
                )}
              >
                {e.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Kartu absen hari ini */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-3xl font-bold tabular-nums sm:text-4xl">
                {mounted ? timeFmt(now) : "—:—:—"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {mounted ? dateFmt(now) : "memuat…"}
              </p>
            </div>
            <div className="flex flex-col gap-1.5 sm:items-end">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <MapPin className="h-3 w-3" /> Kantor Tangerang · radius OK
              </span>
              <span className="inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> Shift {emp.shift} · masuk telat setelah 08:00
              </span>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-muted p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserRound className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">{emp.name}</p>
                <p className="text-xs text-muted-foreground">{emp.role}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-background px-2 py-3">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Masuk</p>
                <p className="mt-0.5 text-sm font-bold tabular-nums">
                  {checkIn ? timeFmt(checkIn).slice(0, 5) : "—"}
                </p>
                {checkIn && (
                  <p className={cn("text-[10px] font-semibold", late ? "text-amber-600 dark:text-amber-500" : "text-primary")}>
                    {late ? "Terlambat" : "Tepat waktu"}
                  </p>
                )}
              </div>
              <div className="rounded-lg bg-background px-2 py-3">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Istirahat</p>
                <p className="mt-0.5 text-sm font-bold tabular-nums">
                  {breakStart ? timeFmt(breakStart).slice(0, 5) : "—"}
                </p>
                {breakStart && !checkOut && (
                  <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">sedang istirahat</p>
                )}
              </div>
              <div className="rounded-lg bg-background px-2 py-3">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Keluar</p>
                <p className="mt-0.5 text-sm font-bold tabular-nums">
                  {checkOut ? timeFmt(checkOut).slice(0, 5) : "—"}
                </p>
                {workedMinutes !== null && (
                  <p className="text-[10px] font-semibold text-primary">
                    {Math.floor(workedMinutes / 60)}j {workedMinutes % 60}m kerja
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {!checkIn && (
                <Button
                  type="button"
                  onClick={doCheckIn}
                  className="flex-1 rounded-full bg-primary font-semibold text-primary-foreground"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Check-In Sekarang
                </Button>
              )}
              {checkIn && !breakStart && !checkOut && (
                <Button
                  type="button"
                  onClick={() => setBreakStart(new Date())}
                  variant="outline"
                  className="flex-1 rounded-full"
                >
                  <Coffee className="mr-2 h-4 w-4" />
                  Mulai Istirahat
                </Button>
              )}
              {breakStart && !checkOut && (
                <Button
                  type="button"
                  onClick={() => setBreakStart(null)}
                  variant="outline"
                  className="flex-1 rounded-full"
                >
                  <Coffee className="mr-2 h-4 w-4" />
                  Selesai Istirahat
                </Button>
              )}
              {checkIn && !checkOut && breakStart === null && (
                <Button
                  type="button"
                  onClick={() => setCheckOut(new Date())}
                  variant="outline"
                  className="flex-1 rounded-full"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Check-Out
                </Button>
              )}
              {checkOut && (
                <Button
                  type="button"
                  onClick={() => { setCheckIn(null); setBreakStart(null); setCheckOut(null); }}
                  className="flex-1 rounded-full bg-primary font-semibold text-primary-foreground"
                >
                  <Timer className="mr-2 h-4 w-4" />
                  Simulasi Hari Baru
                </Button>
              )}
            </div>
            {checkIn && !checkOut && (
              <button
                type="button"
                onClick={() => setCheckOut(new Date())}
                className="mt-2 w-full text-center text-xs text-muted-foreground hover:text-foreground"
              >
                selesai kerja? lakukan check-out
              </button>
            )}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Di versi asli, titik lokasi diambil dari GPS karyawan dan dibandingkan dengan radius
            kantor, foto selfie bisa diwajibkan, dan hasil absen langsung masuk ke rekap payroll.
          </p>
        </div>

        {/* Rekap tim hari ini */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <p className="text-sm font-semibold">Kehadiran tim hari ini (simulasi)</p>
          <ul className="mt-3 space-y-2">
            {[
              { name: "Siti Aminah", status: "sudah check-in 06:31", ok: true },
              { name: "Bagas Prakoso", status: "sudah check-in 07:02", ok: true },
              { name: "Laras Ayu", status: "belum check-in (shift 09:00)", ok: null },
              { name: "Ilham Ramadhan", status: "check-in 08:24 — terlambat", ok: false },
            ].map((t) => (
              <li key={t.name} className="flex items-center justify-between gap-2 rounded-lg bg-muted/60 px-3 py-2 text-sm">
                <span className="font-medium">{t.name}</span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    t.ok === true ? "text-primary" : t.ok === false ? "text-amber-600 dark:text-amber-500" : "text-muted-foreground"
                  )}
                >
                  {t.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Kanan: rekap bulanan */}
      <div className="rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-20 lg:self-start">
        <div className="flex items-center justify-between">
          <p className="inline-flex items-center gap-2 text-sm font-semibold">
            <CalendarDays className="h-4 w-4 text-primary" />
            Rekap Bulan Ini
          </p>
          <span className="text-xs text-muted-foreground">20 hari kerja</span>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-1.5">
          {rekap.map((s, i) => (
            <div
              key={i}
              className={cn(
                "flex h-9 items-center justify-center rounded-lg text-sm font-bold",
                STATUS_STYLE[s]
              )}
              title={`Hari ${i + 1}: ${s === "H" ? "Hadir" : s === "T" ? "Telat" : s === "I" ? "Izin" : "Alpha"}`}
            >
              {s}
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-primary/40" /> Hadir</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-amber-500/40" /> Telat</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-blue-500/40" /> Izin</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-destructive/40" /> Alpha</span>
        </div>

        <dl className="mt-5 space-y-2.5 border-t border-border pt-4 text-sm">
          {[
            ["Hari hadir", `${hadirCount} hari`],
            ["Datang telat", `${telatCount} kali`],
            ["Izin", `${izinCount} hari`],
            ["Tanpa keterangan", `${alphaCount} hari`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
          <div className="flex justify-between border-t border-border pt-2.5">
            <dt className="text-muted-foreground">Estimasi terkena potongan</dt>
            <dd className={cn("font-bold", telatCount > 0 ? "text-amber-600 dark:text-amber-500" : "text-primary")}>
              {telatCount > 0 ? `${telatCount} × Rp15.000` : "Rp0"}
            </dd>
          </div>
        </dl>

        <p className="mt-4 rounded-lg bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
          Rekap ini yang langsung ditarik oleh modul payroll — jadi penggajian tidak perlu dihitung
          ulang manual di Excel.
        </p>
      </div>
    </div>
  );
}
