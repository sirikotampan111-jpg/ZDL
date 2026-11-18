"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Activity,
  CreditCard,
  Search,
  UserPlus,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// ============================================================ DATA SIMULASI

const rupiahJt = (juta: number) => `Rp${juta.toLocaleString("id-ID")}jt`;

const REVENUE = [
  { m: "Des", v: 62 }, { m: "Jan", v: 68 }, { m: "Feb", v: 71 },
  { m: "Mar", v: 76 }, { m: "Apr", v: 82 }, { m: "Mei", v: 85 },
  { m: "Jun", v: 91 }, { m: "Jul", v: 96 }, { m: "Ags", v: 104 },
  { m: "Sep", v: 112 }, { m: "Okt", v: 118 }, { m: "Nov", v: 128 },
];

const KPIS = [
  { label: "MRR (pendapatan bulanan)", value: "Rp128jt", delta: "+12,4%", up: true, spark: [62, 68, 71, 76, 82, 85, 91, 96, 104, 112, 118, 128], Icon: CreditCard },
  { label: "Pengguna aktif", value: "8.412", delta: "+3,1%", up: true, spark: [6.9, 7.1, 7.2, 7.5, 7.6, 7.8, 7.9, 8.0, 8.1, 8.2, 8.3, 8.4], Icon: Users },
  { label: "Churn rate", value: "2,1%", delta: "-0,4pp", up: true, spark: [3.1, 3.0, 2.9, 2.9, 2.8, 2.7, 2.6, 2.6, 2.4, 2.3, 2.2, 2.1], Icon: Activity },
  { label: "Trial baru (30 hari)", value: "326", delta: "+18,0%", up: true, spark: [212, 228, 241, 236, 252, 260, 274, 281, 289, 301, 314, 326], Icon: UserPlus },
];

const PLANS = [
  { name: "Starter — Rp99rb/bln", count: 5120, pct: 61, cls: "bg-muted-foreground/40" },
  { name: "Pro — Rp299rb/bln", count: 2640, pct: 31, cls: "bg-primary" },
  { name: "Business — Rp799rb/bln", count: 652, pct: 8, cls: "bg-primary/50" },
];

type Customer = {
  name: string; company: string; plan: "Starter" | "Pro" | "Business";
  mrr: number; since: string; status: "Aktif" | "Trial" | "Menunggak";
};

const CUSTOMERS: Customer[] = [
  { name: "Andini Putri", company: "Laundry Kilat 24", plan: "Pro", mrr: 299, since: "Mar 2025", status: "Aktif" },
  { name: "Rangga Saputra", company: "Barbershop R-Style", plan: "Starter", mrr: 99, since: "Jun 2025", status: "Aktif" },
  { name: "Melinda Wijaya", company: "Klinik Gigi Melinda", plan: "Business", mrr: 799, since: "Jan 2025", status: "Aktif" },
  { name: "Fajar Nugroho", company: "Bengkel FJR Motor", plan: "Starter", mrr: 99, since: "Ags 2026", status: "Trial" },
  { name: "Sarah Amelia", company: "Toko Roti Manis", plan: "Pro", mrr: 299, since: "Nov 2025", status: "Aktif" },
  { name: "Hendra Gunawan", company: "Gudang Sepatu HoS", plan: "Business", mrr: 799, since: "Feb 2026", status: "Menunggak" },
  { name: "Putri Lestari", company: "Studio Foto PL", plan: "Pro", mrr: 299, since: "Mei 2026", status: "Aktif" },
  { name: "Bayu Kertanegara", company: "Warung Nelongso Group", plan: "Starter", mrr: 99, since: "Sep 2026", status: "Trial" },
];

const STATUS_CLS: Record<Customer["status"], string> = {
  Aktif: "bg-primary/10 text-primary",
  Trial: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Menunggak: "bg-destructive/10 text-destructive",
};

const ACTIVITIES = [
  { time: "09:42", text: "Klinik Gigi Melinda upgrade ke paket Business", tag: "Upgrade" },
  { time: "08:17", text: "Pembayaran Gudang Sepatu HoS jatuh tempo — reminder terkirim via WhatsApp", tag: "Billing" },
  { time: "07:55", text: "3 trial baru mendaftar dari landing page kasir", tag: "Trial" },
  { time: "Kemarin", text: "Warung Nelongso Group memulai trial Starter", tag: "Trial" },
  { time: "Kemarin", text: "Laundry Kilat 24 menambah 5 pengguna tim", tag: "Akun" },
  { time: "2 hari lalu", text: "Toko Roti Manis memperpanjang langganan Pro — 12 bulan", tag: "Billing" },
];

function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 28 - ((v - min) / Math.max(max - min, 0.0001)) * 24 - 2;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 28" className="h-7 w-full" preserveAspectRatio="none" aria-hidden>
      <polyline
        points={pts}
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={up ? "stroke-primary" : "stroke-destructive"}
      />
    </svg>
  );
}

const maxRevenue = Math.max(...REVENUE.map((r) => r.v));

// ============================================================ KOMPONEN

export function DemoSaas() {
  const [query, setQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<"Semua" | Customer["plan"]>("Semua");

  const filtered = useMemo(
    () =>
      CUSTOMERS.filter(
        (c) =>
          (planFilter === "Semua" || c.plan === planFilter) &&
          (c.name.toLowerCase().includes(query.trim().toLowerCase()) ||
            c.company.toLowerCase().includes(query.trim().toLowerCase()))
      ),
    [query, planFilter]
  );

  return (
    <div className="mt-8">
      <Tabs defaultValue="ringkasan">
        <TabsList className="h-auto flex-wrap justify-start rounded-full bg-muted p-1">
          <TabsTrigger value="ringkasan" className="rounded-full">Ringkasan</TabsTrigger>
          <TabsTrigger value="pelanggan" className="rounded-full">Pelanggan</TabsTrigger>
          <TabsTrigger value="aktivitas" className="rounded-full">Aktivitas</TabsTrigger>
        </TabsList>

        {/* ---------------- Ringkasan ---------------- */}
        <TabsContent value="ringkasan" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {KPIS.map(({ label, value, delta, up, spark, Icon }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
                      up ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                    )}
                  >
                    {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {delta}
                  </span>
                </div>
                <p className="mt-3 text-lg font-bold tracking-tight">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
                <div className="mt-2">
                  <Sparkline data={spark} up={up} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            {/* Grafik pendapatan */}
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Pendapatan 12 bulan terakhir</h3>
                <span className="text-xs text-muted-foreground">MRR · simulasi</span>
              </div>
              <div className="mt-4 flex h-40 items-end gap-1.5 sm:gap-2">
                {REVENUE.map((r, i) => (
                  <div key={r.m} className="group flex flex-1 flex-col items-center gap-1.5">
                    <div
                      className={cn(
                        "w-full rounded-t-md transition-all group-hover:opacity-80",
                        i === REVENUE.length - 1 ? "bg-primary" : "bg-primary/30"
                      )}
                      style={{ height: `${(r.v / maxRevenue) * 100}%` }}
                      title={`${r.m}: ${rupiahJt(r.v)}`}
                    />
                    <span className="text-[10px] text-muted-foreground">{r.m}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 rounded-lg bg-muted/60 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                Tumbuh konsisten dari Rp62jt → Rp128jt dalam 12 bulan. Di dashboard asli, grafik
                ini dihitung dari tagihan langganan nyata per tenant.
              </p>
            </div>

            {/* Distribusi paket */}
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <h3 className="text-sm font-semibold">Distribusi paket</h3>
              <div className="mt-4 space-y-4">
                {PLANS.map((p) => (
                  <div key={p.name}>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{p.name}</span>
                      <span className="text-muted-foreground">{p.count.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                      <div className={cn("h-full rounded-full", p.cls)} style={{ width: `${p.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Konversi trial → berbayar</span><span className="font-bold">38%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Retensi 12 bulan</span><span className="font-bold">84%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">ARPU</span><span className="font-bold">Rp245rb</span></div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ---------------- Pelanggan ---------------- */}
        <TabsContent value="pelanggan" className="mt-4">
          <div className="rounded-2xl border border-border bg-card">
            <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari pelanggan / perusahaan…"
                  className="pl-9"
                  aria-label="Cari pelanggan"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {(["Semua", "Starter", "Pro", "Business"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlanFilter(p)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                      planFilter === p
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Pelanggan</th>
                    <th className="px-4 py-3 font-medium">Paket</th>
                    <th className="px-4 py-3 font-medium text-right">MRR</th>
                    <th className="px-4 py-3 font-medium">Sejak</th>
                    <th className="px-4 py-3 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.company} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-medium">{c.company}</p>
                        <p className="text-xs text-muted-foreground">{c.name}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{c.plan}</td>
                      <td className="px-4 py-3 text-right font-medium">{rupiahJt(c.mrr / 1000)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.since}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_CLS[c.status])}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                        Tidak ada pelanggan yang cocok.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ---------------- Aktivitas ---------------- */}
        <TabsContent value="aktivitas" className="mt-4">
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <h3 className="text-sm font-semibold">Feed aktivitas terbaru</h3>
            <ol className="mt-4 space-y-3">
              {ACTIVITIES.map((a, i) => (
                <li key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    {i < ACTIVITIES.length - 1 && <span className="w-px flex-1 bg-border" />}
                  </div>
                  <div className="pb-2">
                    <p className="text-sm leading-snug">{a.text}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {a.tag} · {a.time}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </TabsContent>
      </Tabs>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Ini contoh dashboard admin SaaS yang dibangun ZDL: multi-tenant, tagihan langganan, dan
        pengingat WhatsApp otomatis. Semua angka di atas adalah data simulasi.
      </p>
    </div>
  );
}
