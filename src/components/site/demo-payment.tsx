"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Check,
  Copy,
  CreditCard,
  Loader2,
  QrCode,
  Receipt,
  RefreshCcw,
  ShieldCheck,
  Smartphone,
  Store,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type OrderItem = { name: string; qty: number; price: number };

const ORDER_ITEMS: OrderItem[] = [
  { name: "Kopi Susu Gula Aren", qty: 2, price: 18000 },
  { name: "Croissant Butter", qty: 1, price: 22000 },
  { name: "Es Teh Manis", qty: 1, price: 5000 },
];

const ADMIN_FEE: Record<string, number> = {
  qris: 0,
  va: 4000,
  ewallet: 1500,
  card: 0,
};

type MethodKey = "qris" | "va" | "ewallet" | "card";

const METHODS: {
  key: MethodKey;
  name: string;
  detail: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "qris", name: "QRIS", detail: "Semua e-wallet & mobile banking", Icon: QrCode },
  { key: "va", name: "Virtual Account", detail: "BCA, BNI, Mandiri, BRI", Icon: Wallet },
  { key: "ewallet", name: "E-Wallet", detail: "GoPay, OVO, DANA, ShopeePay", Icon: Smartphone },
  { key: "card", name: "Kartu Kredit/Debit", detail: "Visa, Mastercard, JCB", Icon: CreditCard },
];

type Step = "invoice" | "pending" | "processing" | "success";

// ============================================================ QR PATTERN (palsu, deterministik)

function qrPattern(seed: string, size = 21): boolean[][] {
  const grid: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const rand = (i: number) => {
    let x = (h ^ Math.imul(i + 1, 2654435761)) >>> 0;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    x >>>= 0;
    return (x % 1000) / 1000;
  };
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++) grid[r][c] = rand(r * size + c) > 0.52;
  const finder = (r0: number, c0: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = r0 + r;
        const cc = c0 + c;
        if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
        const inFinder = r >= 0 && r <= 6 && c >= 0 && c <= 6;
        if (!inFinder) {
          grid[rr][cc] = false;
          continue;
        }
        const edge = r === 0 || r === 6 || c === 0 || c === 6;
        const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[rr][cc] = edge || core;
      }
    }
  };
  finder(0, 0);
  finder(0, size - 7);
  finder(size - 7, 0);
  return grid;
}

// ============================================================ KOMPONEN

export function DemoPayment() {
  const [step, setStep] = useState<Step>("invoice");
  const [method, setMethod] = useState<MethodKey>("qris");
  const [bank, setBank] = useState("BCA");
  const [ewallet, setEwallet] = useState("GoPay");
  const [cardNo, setCardNo] = useState("");
  const [otp, setOtp] = useState("");
  const [copied, setCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const [paidAt, setPaidAt] = useState<string>("");
  const [payId, setPayId] = useState<string>("");

  const subtotal = ORDER_ITEMS.reduce((s, i) => s + i.qty * i.price, 0);
  const fee = ADMIN_FEE[method];
  const total = subtotal + fee;
  const vaNumber = useMemo(
    () => `88${bank.slice(0, 2).toUpperCase()}${String(total).padStart(12, "0")}`.slice(0, 16),
    [bank, total]
  );
  const qr = useMemo(() => qrPattern(`ZDL-PAY-${total}-${method}`), [total, method]);

  // countdown saat menunggu pembayaran
  useEffect(() => {
    if (step !== "pending") return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [step]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  function reset() {
    setStep("invoice");
    setMethod("qris");
    setCardNo("");
    setOtp("");
    setCopied(false);
    setSecondsLeft(15 * 60);
    setPaidAt("");
    setPayId("");
  }

  function simulatePay() {
    setStep("processing");
    setTimeout(() => {
      const now = new Date();
      setPaidAt(
        new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "medium" }).format(now)
      );
      setPayId(`PAY-${Date.now().toString().slice(-10)}`);
      setStep("success");
    }, 1800);
  }

  function copyVa() {
    navigator.clipboard?.writeText(vaNumber).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const stepIndex =
    step === "invoice" ? 0 : step === "processing" ? 2 : step === "success" ? 3 : 1;
  const STEPS = ["Pilih Metode", "Bayar", "Selesai"];

  return (
    <div className="mt-8">
      {/* Stepper */}
      <ol className="mb-6 flex items-center justify-center gap-2 text-xs font-medium sm:text-sm">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold",
                i < stepIndex
                  ? "border-primary bg-primary text-primary-foreground"
                  : i === stepIndex
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground"
              )}
            >
              {i < stepIndex ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span className={cn(i === stepIndex ? "text-foreground" : "text-muted-foreground")}>
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="mx-1 h-px w-6 bg-border sm:w-10" />}
          </li>
        ))}
      </ol>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Invoice */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Store className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">Kopi Kita — Tangerang</p>
              <p className="text-xs text-muted-foreground">INV/2026/11/000482</p>
            </div>
          </div>
          <ul className="space-y-2 py-4 text-sm">
            {ORDER_ITEMS.map((i) => (
              <li key={i.name} className="flex justify-between gap-2">
                <span className="min-w-0 truncate text-muted-foreground">
                  {i.name} <span className="text-xs">×{i.qty}</span>
                </span>
                <span className="font-medium">{rupiah(i.qty * i.price)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-1.5 border-t border-border pt-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{rupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Biaya layanan</span>
              <span>{fee === 0 ? "Gratis" : rupiah(fee)}</span>
            </div>
            <div className="flex items-center justify-between pt-2 text-base font-bold">
              <span>Total</span>
              <span className="text-primary">{rupiah(total)}</span>
            </div>
          </div>
        </div>

        {/* Panel metode */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          {step === "invoice" && (
            <>
              <h3 className="font-semibold">Pilih metode pembayaran</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Empat kanal ini yang biasanya diaktifkan di integrasi payment gateway ZDL.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {METHODS.map(({ key, name, detail, Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMethod(key)}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-4 text-left transition-all hover:border-primary/50 hover:shadow-sm",
                      method === key
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-background"
                    )}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{name}</span>
                      <span className="block text-xs text-muted-foreground">{detail}</span>
                    </span>
                  </button>
                ))}
              </div>

              {method === "va" && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Pilih bank</p>
                  <div className="flex flex-wrap gap-2">
                    {["BCA", "BNI", "Mandiri", "BRI"].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBank(b)}
                        className={cn(
                          "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                          bank === b
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground hover:border-primary/40"
                        )}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {method === "ewallet" && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Pilih e-wallet</p>
                  <div className="flex flex-wrap gap-2">
                    {["GoPay", "OVO", "DANA", "ShopeePay"].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setEwallet(w)}
                        className={cn(
                          "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                          ewallet === w
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground hover:border-primary/40"
                        )}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {method === "card" && (
                <div className="mt-4 space-y-2">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Nomor kartu (gunakan angka apa saja — ini simulasi)
                  </p>
                  <Input
                    inputMode="numeric"
                    value={cardNo}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);
                      setCardNo(digits.replace(/(.{4})/g, "$1 ").trim());
                    }}
                    placeholder="4111 1111 1111 1111"
                    aria-label="Nomor kartu simulasi"
                  />
                </div>
              )}

              <Button
                type="button"
                onClick={() => setStep(method === "card" && cardNo.length < 19 ? "invoice" : "pending")}
                disabled={method === "card" && cardNo.replace(/\s/g, "").length < 16}
                className="mt-5 w-full rounded-full bg-primary font-semibold text-primary-foreground"
              >
                <QrCode className="mr-2 h-4 w-4" />
                Buat Tagihan {rupiah(total)}
              </Button>
              {method === "card" && cardNo.replace(/\s/g, "").length > 0 && cardNo.replace(/\s/g, "").length < 16 && (
                <p className="mt-2 text-center text-xs text-destructive">
                  Nomor kartu harus 16 digit.
                </p>
              )}
            </>
          )}

          {step === "pending" && (
            <div className="flex flex-col items-center py-4 text-center">
              <p className="text-sm font-semibold">
                {method === "qris" && "Scan QRIS dengan aplikasi apa saja"}
                {method === "va" && `Transfer ke Virtual Account ${bank}`}
                {method === "ewallet" && `Bayar dengan ${ewallet}`}
                {method === "card" && "Verifikasi 3D Secure"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Kadaluarsa dalam{" "}
                <span className="font-mono font-bold text-foreground">{mm}:{ss}</span> — hanya
                simulasi timer.
              </p>

              {method === "qris" && (
                <div className="mt-5 rounded-xl border-2 border-primary/30 bg-white p-3">
                  <svg width="180" height="180" viewBox="0 0 21 21" aria-label="QRIS simulasi">
                    {qr.flatMap((row, r) =>
                      row.map((on, c) =>
                        on ? (
                          <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#111" />
                        ) : null
                      )
                    )}
                  </svg>
                  <p className="mt-2 font-mono text-[10px] font-bold text-black">
                    NMID: ID1020060123456
                  </p>
                </div>
              )}

              {method === "va" && (
                <div className="mt-5 w-full max-w-xs">
                  <div className="flex items-center justify-between rounded-xl border border-border bg-muted px-4 py-3">
                    <div className="text-left">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        Virtual Account {bank}
                      </p>
                      <p className="font-mono text-lg font-bold tracking-wider">{vaNumber}</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={copyVa}
                      className="shrink-0"
                      aria-label="Salin nomor virtual account"
                    >
                      {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}

              {method === "ewallet" && (
                <div className="mt-5 flex h-[180px] w-[180px] items-center justify-center rounded-xl border-2 border-primary/30 bg-primary/5">
                  <span className="flex flex-col items-center gap-2">
                    <Smartphone className="h-8 w-8 text-primary" />
                    <span className="text-sm font-bold">{ewallet}</span>
                    <span className="text-xs text-muted-foreground">push notifikasi ke HP</span>
                  </span>
                </div>
              )}

              <div className="mt-6 w-full max-w-xs space-y-2">
                <Button
                  type="button"
                  onClick={simulatePay}
                  className="w-full rounded-full bg-primary font-semibold text-primary-foreground"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Simulasikan Sudah Bayar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep("invoice")}
                  className="w-full rounded-full text-muted-foreground"
                >
                  Ganti metode
                </Button>
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 font-semibold">Memproses pembayaran…</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Gateway memverifikasi transaksi ke bank / penyedia e-wallet.
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center py-4 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <BadgeCheck className="h-8 w-8 text-primary" />
              </span>
              <h3 className="mt-3 text-lg font-bold">Pembayaran Berhasil</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Di integrasi asli, webhook gateway memberi tahu server Anda dalam hitungan detik —
                lalu struk/receipt dikirim otomatis ke WhatsApp pelanggan.
              </p>
              <div className="mt-5 w-full max-w-sm rounded-xl border border-dashed border-border bg-muted/40 p-4 text-left font-mono text-xs leading-relaxed">
                <p className="text-center font-bold">ZDL PAY — STRUK PEMBAYARAN</p>
                <div className="my-2 border-t border-dashed border-border" />
                <div className="flex justify-between"><span>Payment ID</span><span>{payId}</span></div>
                <div className="flex justify-between"><span>Waktu</span><span>{paidAt}</span></div>
                <div className="flex justify-between">
                  <span>Metode</span>
                  <span>
                    {method === "qris" ? "QRIS" : method === "va" ? `VA ${bank}` : method === "ewallet" ? ewallet : "Kartu 3DS"}
                  </span>
                </div>
                <div className="my-2 border-t border-dashed border-border" />
                <div className="flex justify-between"><span>Subtotal</span><span>{rupiah(subtotal)}</span></div>
                <div className="flex justify-between"><span>Biaya layanan</span><span>{fee === 0 ? "Gratis" : rupiah(fee)}</span></div>
                <div className="mt-1 flex justify-between font-bold"><span>TOTAL</span><span>{rupiah(total)}</span></div>
                <div className="my-2 border-t border-dashed border-border" />
                <p className="text-center text-muted-foreground">Status: LUNAS — simulasi</p>
              </div>
              <Button
                type="button"
                onClick={reset}
                className="mt-5 rounded-full bg-primary font-semibold text-primary-foreground"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Coba Metode Lain
              </Button>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-1.5 border-t border-border pt-4 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary/70" />
            Tidak ada uang sungguhan — semua kanal di atas hanya disimulasikan di browser.
          </div>
        </div>
      </div>

      {/* Overlay 3DS OTP untuk pembayaran kartu */}
      {step === "pending" && method === "card" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6">
            <DialogHeader>
              <DialogTitle className="inline-flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Verifikasi 3D Secure
              </DialogTitle>
              <DialogDescription>
                Masukkan 6 digit OTP yang dikirim bank (angka apa saja — simulasi).
              </DialogDescription>
            </DialogHeader>
            <Input
              inputMode="numeric"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
              placeholder="••••••"
              className="mt-4 text-center font-mono text-xl tracking-[0.5em]"
              aria-label="OTP simulasi"
            />
            <Button
              type="button"
              disabled={otp.length < 6}
              onClick={simulatePay}
              className="mt-4 w-full rounded-full bg-primary font-semibold text-primary-foreground"
            >
              <Receipt className="mr-2 h-4 w-4" />
              Verifikasi &amp; Bayar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
