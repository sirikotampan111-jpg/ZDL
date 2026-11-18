"use client";

import { useMemo, useState } from "react";
import {
  Bike,
  Check,
  Coffee,
  Cookie,
  Croissant,
  CupSoda,
  Minus,
  Plus,
  Search,
  Store,
  Trash2,
  Send,
  Milk,
  Sandwich,
  Cake,
  Wheat,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// ============================================================ DATA SIMULASI

type Category = "Kopi" | "Non-Kopi" | "Roti & Kue" | "Snack";

type Product = {
  id: string;
  name: string;
  desc: string;
  price: number;
  category: Category;
  Icon: React.ComponentType<{ className?: string }>;
  tile: string; // warna kartu produk
  lowStock?: boolean;
};

const PRODUCTS: Product[] = [
  { id: "p1", name: "Kopi Susu Gula Aren", desc: "Espresso, susu segar, gula aren asli", price: 18000, category: "Kopi", Icon: Coffee, tile: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  { id: "p2", name: "Americano", desc: "Double shot, air mineral, es", price: 15000, category: "Kopi", Icon: CupSoda, tile: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  { id: "p3", name: "Caffé Latte", desc: "Espresso dengan steamed milk", price: 20000, category: "Kopi", Icon: Coffee, tile: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  { id: "p4", name: "Kopi Butterscotch", desc: "Signature — sirup butterscotch rumahan", price: 22000, category: "Kopi", Icon: Coffee, tile: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  { id: "p5", name: "Matcha Latte", desc: "Matcha premium, susu, tanpa gula tambahan", price: 22000, category: "Non-Kopi", Icon: CupSoda, tile: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  { id: "p6", name: "Cokelat Panas", desc: "Dark chocolate 60%, marshmallow", price: 18000, category: "Non-Kopi", Icon: Milk, tile: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  { id: "p7", name: "Es Lemon Tea", desc: "Teh hitam, lemon peras, gula separuh", price: 10000, category: "Non-Kopi", Icon: CupSoda, tile: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  { id: "p8", name: "Teh Melati Gula Batu", desc: "Melati pilihan, diseduh per gelas", price: 8000, category: "Non-Kopi", Icon: CupSoda, tile: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  { id: "p9", name: "Roti Bakar Cokelat Keju", desc: "Roti sourdough, cokelat, keju parut", price: 15000, category: "Roti & Kue", Icon: Sandwich, tile: "bg-orange-500/15 text-orange-600 dark:text-orange-400", lowStock: true },
  { id: "p10", name: "Croissant Butter", desc: "Renyang luar, lembut dalam — panggang pagi", price: 16000, category: "Roti & Kue", Icon: Croissant, tile: "bg-orange-500/15 text-orange-600 dark:text-orange-400" },
  { id: "p11", name: "Cinnamon Roll", desc: "Gulungan kayu manis dengan cream cheese", price: 17000, category: "Roti & Kue", Icon: Cake, tile: "bg-orange-500/15 text-orange-600 dark:text-orange-400" },
  { id: "p12", name: "Banana Bread", desc: "Pisang raja, kacang kenari — per slice", price: 14000, category: "Roti & Kue", Icon: Wheat, tile: "bg-orange-500/15 text-orange-600 dark:text-orange-400" },
  { id: "p13", name: "Kentang Goreng", desc: "Potong tebal, bumbu truffle salt", price: 12000, category: "Snack", Icon: Cookie, tile: "bg-rose-500/15 text-rose-600 dark:text-rose-400" },
  { id: "p14", name: "Pisang Goreng Keju", desc: "Pisang kepok, keju, susu kental manis", price: 8000, category: "Snack", Icon: Cookie, tile: "bg-rose-500/15 text-rose-600 dark:text-rose-400" },
  { id: "p15", name: "Risoles Mayo (3 pcs)", desc: "Isi smoked beef, telur, mayones", price: 5000, category: "Snack", Icon: Cookie, tile: "bg-rose-500/15 text-rose-600 dark:text-rose-400" },
  { id: "p16", name: "Tahu Crispy Sambal Matah", desc: "Tahu goreng garing, sambal matah segar", price: 6000, category: "Snack", Icon: Cookie, tile: "bg-rose-500/15 text-rose-600 dark:text-rose-400", lowStock: true },
];

const CATEGORIES: ("Semua" | Category)[] = ["Semua", "Kopi", "Non-Kopi", "Roti & Kue", "Snack"];

const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const ONGKIR = 8000;
const FREE_ONGKIR_MIN = 100000;

type Method = "ambil" | "antar";

// ============================================================ KOMPONEN

export function DemoKatalog() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<(typeof CATEGORIES)[number]>("Semua");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [method, setMethod] = useState<Method>("ambil");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchCat = activeCat === "Semua" || p.category === activeCat;
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, activeCat]);

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ product: PRODUCTS.find((p) => p.id === id)!, qty }))
        .filter((l) => l.product && l.qty > 0),
    [cart]
  );

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const ongkir = method === "antar" && subtotal > 0
    ? (subtotal >= FREE_ONGKIR_MIN ? 0 : ONGKIR)
    : 0;
  const total = subtotal + ongkir;
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);

  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const dec = (id: string) =>
    setCart((c) => {
      const next = { ...c, [id]: (c[id] ?? 0) - 1 };
      if (next[id] <= 0) delete next[id];
      return next;
    });

  const waMessage = useMemo(() => {
    const arr: string[] = ["Halo Kedai Nara, saya mau pesan:"];
    lines.forEach((l, i) => {
      arr.push(
        `${i + 1}. ${l.qty}x ${l.product.name} — ${rupiah(l.product.price * l.qty)}`
      );
    });
    arr.push("");
    arr.push(`Subtotal: ${rupiah(subtotal)}`);
    if (method === "antar") {
      arr.push(`Ongkir: ${ongkir === 0 ? "Gratis" : rupiah(ongkir)}`);
    }
    arr.push(`Total: ${rupiah(total)}`);
    arr.push("");
    arr.push(`Nama: ${name.trim() || "-"}`);
    arr.push(method === "antar" ? `Metode: Diantar — ${address.trim() || "(alamat belum diisi)"}` : "Metode: Ambil sendiri di gerai");
    if (note.trim()) arr.push(`Catatan: ${note.trim()}`);
    return arr.join("\n");
  }, [lines, subtotal, ongkir, total, method, name, address, note]);

  const waLink = `https://wa.me/?text=${encodeURIComponent(waMessage)}`;

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(waMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard tidak tersedia — abaikan */
    }
  };

  return (
    <div className="mt-8">
      {/* strip pencarian + kategori */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari menu…"
            className="pl-9"
            aria-label="Cari menu"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCat(c)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                activeCat === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        {/* ============ GRID PRODUK */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => {
            const qty = cart[p.id] ?? 0;
            return (
              <div
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/50"
              >
                <div className={cn("relative flex h-28 items-center justify-center", p.tile)}>
                  <p.Icon className="h-10 w-10 opacity-80 transition-transform duration-300 group-hover:scale-110" />
                  {p.lowStock && (
                    <span className="absolute left-2.5 top-2.5 rounded-md bg-background/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-amber-600 dark:text-amber-400">
                      Terbatas
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-sm font-semibold leading-snug tracking-tight">{p.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">{rupiah(p.price)}</span>
                    {qty === 0 ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-full px-3.5 text-xs"
                        onClick={() => add(p.id)}
                      >
                        <Plus className="mr-1 h-3.5 w-3.5" />
                        Tambah
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1.5 rounded-full border border-border px-1.5 py-1">
                        <button
                          type="button"
                          aria-label={`Kurangi ${p.name}`}
                          onClick={() => dec(p.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-5 text-center text-sm font-semibold">{qty}</span>
                        <button
                          type="button"
                          aria-label={`Tambah ${p.name}`}
                          onClick={() => add(p.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="col-span-full rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Tidak ada menu yang cocok dengan pencarian Anda.
            </p>
          )}
        </div>

        {/* ============ KERANJANG */}
        <aside id="keranjang" className="lg:sticky lg:top-24">
          <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="font-semibold tracking-tight">
                Pesanan Anda{" "}
                {itemCount > 0 && (
                  <span className="ml-1 rounded-full bg-primary px-2 py-0.5 font-mono text-[11px] text-primary-foreground">
                    {itemCount}
                  </span>
                )}
              </h3>
              {itemCount > 0 && (
                <button
                  type="button"
                  onClick={() => setCart({})}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Kosongkan
                </button>
              )}
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-col items-center px-5 py-10 text-center">
                <ShoppingBag className="h-8 w-8 text-muted-foreground/40" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Belum ada item. Pilih menu dari katalog — pesanan akan tersusun otomatis menjadi pesan WhatsApp.
                </p>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto px-5 py-3">
                <ul className="divide-y divide-border">
                  {lines.map((l) => (
                    <li key={l.product.id} className="flex items-center gap-3 py-2.5">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{l.product.name}</p>
                        <p className="font-mono text-[11px] text-muted-foreground">
                          {rupiah(l.product.price)} × {l.qty}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          aria-label={`Kurangi ${l.product.name}`}
                          onClick={() => dec(l.product.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-5 text-center text-sm font-semibold">{l.qty}</span>
                        <button
                          type="button"
                          aria-label={`Tambah ${l.product.name}`}
                          onClick={() => add(l.product.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="w-20 text-right text-sm font-semibold">
                        {rupiah(l.product.price * l.qty)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* metode */}
            <div className="border-t border-border px-5 py-4">
              <p className="mono-label text-muted-foreground">Metode pemesanan</p>
              <div className="mt-2.5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod("ambil")}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    method === "ambil"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Store className="h-4 w-4" />
                  Ambil sendiri
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("antar")}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    method === "antar"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Bike className="h-4 w-4" />
                  Diantar
                </button>
              </div>
              {method === "antar" && (
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Alamat lengkap pengantaran…"
                  className="mt-2.5"
                  aria-label="Alamat pengantaran"
                />
              )}
            </div>

            {/* data pemesan */}
            <div className="border-t border-border px-5 py-4">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama pemesan…"
                aria-label="Nama pemesan"
              />
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Catatan: pedas level 2, tanpa es, dst…"
                className="mt-2.5 min-h-16"
                aria-label="Catatan pesanan"
              />
            </div>

            {/* ringkasan */}
            <div className="border-t border-border px-5 py-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono">{rupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Ongkir{method === "antar" && subtotal >= FREE_ONGKIR_MIN && " (gratis, min. 100rb)"}</span>
                  <span className="font-mono">{ongkir === 0 ? "—" : rupiah(ongkir)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                  <span>Total</span>
                  <span className="font-mono">{rupiah(total)}</span>
                </div>
              </div>
              <Button
                className="mt-4 w-full rounded-full bg-[#25D366] font-semibold text-white hover:bg-[#1fb857]"
                disabled={itemCount === 0}
                onClick={() => setCheckoutOpen(true)}
              >
                <Send className="mr-2 h-4 w-4" />
                Pesan via WhatsApp
              </Button>
              <p className="mt-2.5 text-center text-[11px] leading-relaxed text-muted-foreground">
                Di versi asli, tombol ini membuka WhatsApp toko dengan pesan yang sudah tersusun rapi.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* ============ DIALOG KONFIRMASI WA */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pesan siap dikirim</DialogTitle>
            <DialogDescription>
              Ini persis pesan yang diterima admin toko di WhatsApp di versi asli — tertata, lengkap, tinggal dibalas.
            </DialogDescription>
          </DialogHeader>
          <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/50 p-4 font-mono text-xs leading-relaxed text-foreground">
            {waMessage}
          </pre>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="flex-1 rounded-full" onClick={copyMessage}>
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-emerald-500" />
                  Tersalin
                </>
              ) : (
                "Salin teks pesanan"
              )}
            </Button>
            <Button
              asChild
              className="flex-1 rounded-full bg-[#25D366] font-semibold text-white hover:bg-[#1fb857]"
            >
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                Buka WhatsApp
              </a>
            </Button>
          </div>
          <p className="text-center text-[11px] text-muted-foreground">
            Mode demo — pesan tidak dikirim ke siapa pun.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
