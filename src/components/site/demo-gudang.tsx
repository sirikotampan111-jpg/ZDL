"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  ChevronDown,
  History,
  Minus,
  PackageOpen,
  Plus,
  Search,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type Item = {
  sku: string;
  name: string;
  category: string;
  stock: number;
  min: number;
  unit: string;
  cost: number; // harga beli per unit
  loc: string;
};

const INITIAL: Item[] = [
  { sku: "BHN-001", name: "Biji Kopi Arabika 1kg", category: "Bahan Baku", stock: 14, min: 5, unit: "kg", cost: 92000, loc: "G1-A1-01" },
  { sku: "BHN-002", name: "Susu UHT Full Cream 1L", category: "Bahan Baku", stock: 3, min: 12, unit: "ltr", cost: 19500, loc: "G1-A1-02" },
  { sku: "BHN-003", name: "Gula Aren Cair 500ml", category: "Bahan Baku", stock: 9, min: 4, unit: "btl", cost: 21000, loc: "G1-A1-03" },
  { sku: "BHN-004", name: "Es BatuKristal 5kg", category: "Bahan Baku", stock: 0, min: 3, unit: "pack", cost: 8000, loc: "G2-FZ-01" },
  { sku: "KMS-001", name: "Cup 16oz + Lid (50pcs)", category: "Kemasan", stock: 22, min: 10, unit: "pack", cost: 45000, loc: "G1-B2-01" },
  { sku: "KMS-002", name: "Paper Bag Medium", category: "Kemasan", stock: 6, min: 8, unit: "pack", cost: 28000, loc: "G1-B2-02" },
  { sku: "KMS-003", name: "Straw Kertas 100pcs", category: "Kemasan", stock: 31, min: 10, unit: "pack", cost: 18000, loc: "G1-B2-03" },
  { sku: "PRD-001", name: "Kopi Susu Botol 250ml", category: "Produk Jadi", stock: 40, min: 15, unit: "btl", cost: 11000, loc: "G1-C1-01" },
  { sku: "PRD-002", name: "Croissant Frozen", category: "Produk Jadi", stock: 12, min: 6, unit: "pack", cost: 52000, loc: "G2-FZ-02" },
  { sku: "ALX-001", name: "Sarung Tangan Food Grade", category: "Alat", stock: 18, min: 5, unit: "pack", cost: 15000, loc: "G1-D1-01" },
  { sku: "ALX-002", name: "Cairan Pembersih 5L", category: "Alat", stock: 4, min: 3, unit: "jerigen", cost: 78000, loc: "G1-D1-02" },
];

const CATEGORIES = ["Semua", "Bahan Baku", "Kemasan", "Produk Jadi", "Alat"];

type Movement = {
  sku: string;
  name: string;
  type: "MASUK" | "KELUAR";
  qty: number;
  note: string;
  time: string;
};

type MoveTarget = { item: Item; type: "MASUK" | "KELUAR" };

function statusOf(item: Item) {
  if (item.stock <= 0) return { label: "Habis", cls: "bg-destructive/10 text-destructive" };
  if (item.stock <= item.min) return { label: "Menipis", cls: "bg-amber-500/10 text-amber-600 dark:text-amber-500" };
  return { label: "Aman", cls: "bg-primary/10 text-primary" };
}

// ============================================================ KOMPONEN

export function DemoGudang() {
  const [items, setItems] = useState<Item[]>(INITIAL);
  const [category, setCategory] = useState("Semua");
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState<MoveTarget | null>(null);
  const [qty, setQty] = useState("1");
  const [note, setNote] = useState("");
  const [history, setHistory] = useState<Movement[]>([
    { sku: "BHN-001", name: "Biji Kopi Arabika 1kg", type: "MASUK", qty: 10, note: "PO dari roastery Bandung", time: "Hari ini 07:12" },
    { sku: "PRD-001", name: "Kopi Susu Botol 250ml", type: "KELUAR", qty: 24, note: "Kirim ke cabang BSD", time: "Hari ini 06:40" },
    { sku: "KMS-001", name: "Cup 16oz + Lid (50pcs)", type: "MASUK", qty: 5, note: "PO kemasan rutin", time: "Kemarin 15:05" },
  ]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const visible = useMemo(
    () =>
      items.filter(
        (i) =>
          (category === "Semua" || i.category === category) &&
          (i.name.toLowerCase().includes(query.trim().toLowerCase()) ||
            i.sku.toLowerCase().includes(query.trim().toLowerCase()))
      ),
    [items, category, query]
  );

  const nilaiStok = items.reduce((s, i) => s + i.stock * i.cost, 0);
  const menipis = items.filter((i) => i.stock > 0 && i.stock <= i.min);
  const habis = items.filter((i) => i.stock <= 0);

  function openMove(item: Item, type: "MASUK" | "KELUAR") {
    setTarget({ item, type });
    setQty("1");
    setNote("");
  }

  function confirmMove() {
    if (!target) return;
    const n = Math.max(0, Number(qty) || 0);
    if (n === 0) return;
    const delta = target.type === "MASUK" ? n : -n;
    setItems((list) =>
      list.map((i) => (i.sku === target.item.sku ? { ...i, stock: Math.max(0, i.stock + delta) } : i))
    );
    setHistory((h) => [
      {
        sku: target.item.sku,
        name: target.item.name,
        type: target.type,
        qty: n,
        note: note.trim() || (target.type === "MASUK" ? "Barang masuk manual" : "Barang keluar manual"),
        time: "Baru saja",
      },
      ...h,
    ]);
    setTarget(null);
  }

  return (
    <div className="mt-8">
      {/* KPI */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Total SKU", value: String(items.length), Icon: Boxes },
          { label: "Nilai stok (HPP)", value: rupiah(nilaiStok), Icon: Warehouse },
          { label: "SKU menipis", value: String(menipis.length), Icon: AlertTriangle, warn: menipis.length > 0 },
          { label: "Stok habis", value: String(habis.length), Icon: PackageOpen, warn: habis.length > 0 },
        ].map(({ label, value, Icon, warn }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-4">
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg",
                warn ? "bg-amber-500/10 text-amber-600 dark:text-amber-500" : "bg-primary/10 text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <p className="mt-2 text-xs text-muted-foreground">{label}</p>
            <p className="truncate text-lg font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Alert restock */}
      {(menipis.length > 0 || habis.length > 0) && (
        <div className="mt-4 rounded-2xl border border-amber-500/40 bg-amber-500/5 p-4">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-500">
            <AlertTriangle className="h-4 w-4" />
            {habis.length > 0
              ? `${habis.length} SKU habis dan ${menipis.length} SKU menipis — saatnya restock`
              : `${menipis.length} SKU menyentuh batas minimum`}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[...habis, ...menipis].map((i) => (
              <button
                key={i.sku}
                type="button"
                onClick={() => openMove(i, "MASUK")}
                className="rounded-full border border-amber-500/50 bg-background px-3 py-1 text-xs font-medium transition-colors hover:bg-amber-500/10"
              >
                + Restock {i.name.split(" ").slice(0, 2).join(" ")} ({i.stock}/{i.min})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau SKU…"
            className="pl-9"
            aria-label="Cari item gudang"
          />
        </div>
      </div>

      {/* Tabel stok */}
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">SKU / Nama</th>
              <th className="px-4 py-3 font-medium">Lokasi</th>
              <th className="px-4 py-3 font-medium text-right">Stok</th>
              <th className="px-4 py-3 font-medium text-center">Status</th>
              <th className="px-4 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((i) => {
              const st = statusOf(i);
              return (
                <tr key={i.sku} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{i.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {i.sku} · {i.category}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{i.loc}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-bold tabular-nums">{i.stock}</span>{" "}
                    <span className="text-xs text-muted-foreground">{i.unit}</span>
                    <p className="text-[10px] text-muted-foreground">min {i.min}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", st.cls)}>
                      {st.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openMove(i, "MASUK")}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                        aria-label={`Stok masuk ${i.name}`}
                      >
                        <Plus className="h-3 w-3" /> Masuk
                      </button>
                      <button
                        type="button"
                        onClick={() => openMove(i, "KELUAR")}
                        className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Stok keluar ${i.name}`}
                      >
                        <Minus className="h-3 w-3" /> Keluar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  Tidak ada item yang cocok — coba kata kunci lain.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Riwayat mutasi */}
      <div className="mt-4 rounded-2xl border border-border bg-card">
        <button
          type="button"
          onClick={() => setHistoryOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold sm:px-5"
          aria-expanded={historyOpen}
        >
          <span className="inline-flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            Riwayat Mutasi ({history.length})
          </span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", historyOpen && "rotate-180")} />
        </button>
        {historyOpen && (
          <ul className="space-y-2 border-t border-border px-4 py-3 sm:px-5">
            {history.slice(0, 8).map((m, idx) => (
              <li key={idx} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/60 px-3 py-2 text-sm">
                <span className="inline-flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold",
                      m.type === "MASUK" ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-600 dark:text-amber-500"
                    )}
                  >
                    {m.type}
                  </span>
                  <span className="font-medium">{m.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {m.type === "MASUK" ? "+" : "-"}{m.qty}
                  </span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {m.note} · {m.time}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Di versi asli: stok terpotong otomatis setiap ada penjualan di kasir, petani/supplier bisa
        menerima pesanan pembelian (PO), dan laporan kartu stok tersedia per item per bulan.
      </p>

      {/* Dialog stok masuk/keluar */}
      <Dialog open={Boolean(target)} onOpenChange={(open) => !open && setTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="inline-flex items-center gap-2">
              {target?.type === "MASUK" ? (
                <>
                  <Plus className="h-5 w-5 text-primary" /> Stok Masuk
                </>
              ) : (
                <>
                  <Minus className="h-5 w-5 text-amber-600 dark:text-amber-500" /> Stok Keluar
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {target?.item.name} — stok sekarang {target?.item.stock} {target?.item.unit}.
            </DialogDescription>
          </DialogHeader>

          {target && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="qty-move">Jumlah ({target.item.unit})</Label>
                <Input
                  id="qty-move"
                  inputMode="numeric"
                  value={qty}
                  onChange={(e) => setQty(e.target.value.replace(/[^0-9]/g, ""))}
                  className="font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="note-move">Catatan</Label>
                <Input
                  id="note-move"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={target.type === "MASUK" ? "mis. PO dari supplier" : "mis. dipakai produksi pagi"}
                />
              </div>
              <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                Setelah disimpan:{" "}
                <span className="font-bold">
                  {target.item.stock + (target.type === "MASUK" ? Number(qty || 0) : -Number(qty || 0))}{" "}
                  {target.item.unit}
                </span>
              </div>
              <Button
                type="button"
                onClick={confirmMove}
                disabled={!Number(qty)}
                className="w-full rounded-full bg-primary font-semibold text-primary-foreground"
              >
                Simpan Mutasi
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
