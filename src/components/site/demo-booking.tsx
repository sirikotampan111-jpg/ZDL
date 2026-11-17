"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Scissors,
  Sparkles,
  Palette,
  Brush,
  UserRound,
  Phone,
  StickyNote,
  ArrowRight,
  RotateCcw,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ============================================================ DATA SIMULASI

type Service = {
  id: string;
  name: string;
  duration: number; // menit
  price: number;
  desc: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const SERVICES: Service[] = [
  { id: "s1", name: "Potong Rambut", duration: 30, price: 35000, desc: "Model sesuai permintaan, selesai rapi", Icon: Scissors },
  { id: "s2", name: "Cukur Jenggot + Rapi", duration: 20, price: 20000, desc: "Rapi alis & jenggot, hasil natural", Icon: Brush },
  { id: "s3", name: "Hair Wash + Blow Dry", duration: 25, price: 30000, desc: "Pijat kepala ringan + styling", Icon: Sparkles },
  { id: "s4", name: "Hair Coloring", duration: 90, price: 250000, desc: "Pewarnaan amonia rendah, konsultasi warna", Icon: Palette },
];

const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const STEPS = ["Layanan", "Jadwal", "Data Diri", "Konfirmasi"];

const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** Deterministic pseudo-random from a string — so "slot terisi" stays
 *  consistent for the same date+hour across re-renders. */
function hashSeed(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function slotTaken(dateISO: string, hour: number) {
  return hashSeed(`${dateISO}#${hour}`) % 3 === 0;
}

function formatDateID(dateISO: string) {
  if (!dateISO) return "";
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateISO}T00:00:00`));
}

// ============================================================ KOMPONEN

export function DemoBooking() {
  const [step, setStep] = useState(0);
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState(todayISO());
  const [hour, setHour] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState<null | { code: string }>(null);

  const nowHour = new Date().getHours();
  const isToday = date === todayISO();

  const slots = useMemo(
    () =>
      HOURS.map((h) => ({
        hour: h,
        taken: slotTaken(date, h),
        past: isToday && h <= nowHour,
      })),
    [date, isToday, nowHour]
  );

  const phoneValid = /^[0-9+\-\s()]{6,20}$/.test(phone.trim());
  const canNext =
    (step === 0 && Boolean(service)) ||
    (step === 1 && Boolean(hour)) ||
    (step === 2 && name.trim().length >= 2 && phoneValid);

  const bookedHourLabel = (h: number) => `${String(h).padStart(2, "0")}.00`;

  function confirm() {
    const seed = hashSeed(`${date}|${hour}|${name}|${phone}`);
    const suffix = String(seed % 10000).padStart(4, "0");
    const prefix = date.slice(5).replace("-", "");
    setDone({ code: `ZB-${prefix}-${suffix}` });
  }

  const resetAll = () => {
    setStep(0);
    setService(null);
    setDate(todayISO());
    setHour(null);
    setName("");
    setPhone("");
    setNote("");
    setDone(null);
  };

  // ---------------------------------------------------------- SUCCESS
  if (done && service) {
    return (
      <div className="mt-8">
        <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </span>
          <h2 className="mt-4 text-xl font-bold tracking-tight">Booking Terkonfirmasi</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pada sistem asli, pelanggan langsung menerima notifikasi WhatsApp
            berisi detail booking di bawah ini.
          </p>

          <dl className="mt-6 space-y-3 rounded-xl bg-muted/50 p-4 text-left text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Kode booking</dt>
              <dd className="font-mono font-bold text-primary">{done.code}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Layanan</dt>
              <dd className="text-right font-medium">{service.name}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Tanggal</dt>
              <dd className="text-right font-medium">{formatDateID(date)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Jam</dt>
              <dd className="font-medium">{bookedHourLabel(hour!)} WIB</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Nama</dt>
              <dd className="font-medium">{name}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">WhatsApp</dt>
              <dd className="font-medium">{phone}</dd>
            </div>
            {note.trim() && (
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Catatan</dt>
                <dd className="text-right font-medium">{note}</dd>
              </div>
            )}
          </dl>

          <Button
            type="button"
            onClick={resetAll}
            variant="outline"
            className="mt-6 rounded-full"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Buat Booking Lagi
          </Button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------- FORM
  return (
    <div className="mt-8">
      {/* Progress */}
      <ol className="flex items-center gap-2 overflow-x-auto pb-1" aria-label="Langkah booking">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                i < step
                  ? "border-primary bg-primary text-primary-foreground"
                  : i === step
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground"
              )}
            >
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </span>
            <span
              className={cn(
                "text-sm font-medium",
                i === step ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <span className="mx-1 hidden h-px w-6 bg-border sm:block" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
        {/* STEP 0 — layanan */}
        {step === 0 && (
          <div>
            <h2 className="inline-flex items-center gap-2 font-semibold">
              <Store className="h-5 w-5 text-primary" />
              Pilih layanan
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setService(s)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/50 hover:shadow-sm",
                    service?.id === s.id && "border-primary bg-primary/5 ring-1 ring-primary"
                  )}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <s.Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{s.name}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{s.desc}</span>
                    <span className="mt-1.5 flex items-center gap-3 text-xs font-medium">
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {s.duration} menit
                      </span>
                      <span className="text-primary">{rupiah(s.price)}</span>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1 — jadwal */}
        {step === 1 && (
          <div>
            <h2 className="inline-flex items-center gap-2 font-semibold">
              <CalendarDays className="h-5 w-5 text-primary" />
              Pilih tanggal & jam
            </h2>
            <div className="mt-4 max-w-xs">
              <Label htmlFor="demo-booking-date">Tanggal kunjungan</Label>
              <Input
                id="demo-booking-date"
                type="date"
                min={todayISO()}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setHour(null);
                }}
                className="mt-1.5"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">{formatDateID(date)}</p>
            </div>

            <p className="mt-6 text-sm font-medium">Jam tersedia</p>
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {slots.map(({ hour: h, taken, past }) => (
                <button
                  key={h}
                  type="button"
                  disabled={taken || past}
                  onClick={() => setHour(h)}
                  className={cn(
                    "rounded-lg border px-2 py-2 text-sm font-medium transition-colors",
                    hour === h
                      ? "border-primary bg-primary text-primary-foreground"
                      : taken || past
                        ? "cursor-not-allowed border-border bg-muted text-muted-foreground/50 line-through"
                        : "border-border bg-background hover:border-primary/50"
                  )}
                  title={taken ? "Slot sudah terisi (simulasi)" : past ? "Jam sudah lewat" : undefined}
                >
                  {bookedHourLabel(h)}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Slot bergaris = sudah terisi (simulasi kapasitas di sistem asli).
            </p>
          </div>
        )}

        {/* STEP 2 — data diri */}
        {step === 2 && (
          <div>
            <h2 className="inline-flex items-center gap-2 font-semibold">
              <UserRound className="h-5 w-5 text-primary" />
              Data diri
            </h2>
            <div className="mt-4 grid max-w-lg gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="demo-booking-name">Nama lengkap *</Label>
                <Input
                  id="demo-booking-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Rina Wulandari"
                  maxLength={100}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="demo-booking-phone">Nomor WhatsApp *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="demo-booking-phone"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812xxxxxxx"
                    className="pl-9"
                    maxLength={20}
                  />
                </div>
                {phone && !phoneValid && (
                  <p className="text-xs text-destructive">Nomor WhatsApp tidak valid.</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="demo-booking-note">Catatan (opsional)</Label>
                <Textarea
                  id="demo-booking-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Contoh: ingin model undercut"
                  rows={3}
                  maxLength={500}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — ringkasan */}
        {step === 3 && service && (
          <div>
            <h2 className="inline-flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Periksa & konfirmasi
            </h2>
            <dl className="mt-4 max-w-lg space-y-3 rounded-xl bg-muted/50 p-4 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Layanan</dt>
                <dd className="text-right font-medium">{service.name}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Tanggal</dt>
                <dd className="text-right font-medium">{formatDateID(date)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Jam</dt>
                <dd className="font-medium">{bookedHourLabel(hour!)} WIB</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Nama</dt>
                <dd className="font-medium">{name}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">WhatsApp</dt>
                <dd className="font-medium">{phone}</dd>
              </div>
              {note.trim() && (
                <div className="flex justify-between gap-3">
                  <dt className="inline-flex items-center gap-1 text-muted-foreground">
                    <StickyNote className="h-3.5 w-3.5" />
                    Catatan
                  </dt>
                  <dd className="text-right font-medium">{note}</dd>
                </div>
              )}
              <div className="flex justify-between gap-3 border-t border-border pt-3 font-bold">
                <dt>Estimasi biaya</dt>
                <dd className="text-primary">{rupiah(service.price)}</dd>
              </div>
            </dl>
          </div>
        )}

        {/* Nav buttons */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Kembali
          </Button>
          {step < 3 ? (
            <Button
              type="button"
              onClick={() => canNext && setStep((s) => s + 1)}
              disabled={!canNext}
              className="rounded-full bg-primary font-semibold text-primary-foreground"
            >
              Lanjut
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={confirm}
              className="rounded-full bg-primary font-semibold text-primary-foreground"
            >
              <CalendarPlus className="mr-2 h-4 w-4" />
              Konfirmasi Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
