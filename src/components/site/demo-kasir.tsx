"use client";

import { useMemo, useState } from "react";
import {
  Banknote,
  Coffee,
  Cookie,
  Croissant,
  CupSoda,
  GlassWater,
  Milk,
  Minus,
  Plus,
  Pizza,
  Popcorn,
  Printer,
  Receipt,
  RotateCcw,
  Salad,
  Sandwich,
  ShoppingCart,
  Soup,
  Trash2,
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

type Product = {
  id: string;
  name: string;
  price: number;
  category: "Makanan" | "Minuman" | "Snack";
  Icon: React.ComponentType<{ className?: string }>;
};

const PRODUCTS: Product[] = [
  { id: "p1", name: "Nasi Goreng Spesial", price: 18000, category: "Makanan", Icon: Soup },
  { id: "p2", name: "Ayam Geprek + Nasi", price: 15000, category: "Makanan", Icon: Sandwich },
  { id: "p3", name: "Mie Goreng Jawa", price: 14000, category: "Makanan", Icon: Salad },
  { id: "p4", name: "Soto Ayam Lamongan", price: 17000, category: "Makanan", Icon: Soup },
  { id: "p5", name: "Bakso Kuah Urat", price: 16000, category: "Makanan", Icon: Pizza },
  { id: "p6", name: "Es Teh Manis", price: 5000, category: "Minuman", Icon: GlassWater },
  { id: "p7", name: "Kopi Susu Gula Aren", price: 15000, category: "Minuman", Icon: Coffee },
  { id: "p8", name: "Es Jeruk Peras", price: 7000, category: "Minuman", Icon: CupSoda },
  { id: "p9", name: "Susu Cokelat Dingin", price: 8000, category: "Minuman", Icon: Milk },
  { id: "p10", name: "Risoles Mayo", price: 3000, category: "Snack", Icon: Croissant },
  { id: "p11", name: "Tahu Crispy Saus", price: 5000, category: "Snack", Icon: Cookie },
  { id: "p12", name: "Pisang Goreng (3 pcs)", price: 4000, category: "Snack", Icon: Popcorn },
];

const CATEGORIES = ["Semua", "Makanan", "Minuman", "Snack"] as const;

const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const PPN_RATE = 0.11;

type CartLine = { product: Product; qty: number };
type Receipt = {
  id: string;
  time: string;
  lines: CartLine[];
  subtotal: number;
  ppn: number;
  total: number;
  paid: number;
  change: number;
};

// ============================================================ KOMPONEN

export function DemoKasir() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Semua");
  const [query, setQuery] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cash, setCash] = useState<string>("");

  const visibleProducts = useMemo(() => {
    return PRODUCTS.filter(
      (p) =>
        (category === "Semua" || p.category === category) &&
        p.name.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [category, query]);

  const lines: CartLine[] = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ product: PRODUCTS.find((p) => p.id === id)!, qty }))
        .filter((l) => l.product && l.qty > 0)
        .sort((a, b) => a.product.name.localeCompare(b.product.name)),
    [cart]
  );

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const ppn = Math.round(subtotal * PPN_RATE);
  const total = subtotal + ppn;
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);

  const add = (id: string) =>
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));

  const subtract = (id: string) =>
    setCart((c) => {
      const next = { ...c, [id]: (c[id] ?? 0) - 1 };
      if (next[id] <= 0) delete next[id];
      return next;
    });

  const removeLine = (id: string) =>
    setCart((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });

  const resetAll = () => {
    setCart({});
    setReceipt(null);
    setCash("");
    setPayOpen(false);
    setCartOpen(false);
  };

  const cashAmount = cash === "" ? 0 : Number(cash.replace(/[^0-9]/g, ""));
  const change = cashAmount - total;
  const cashValid = cashAmount >= total;

  function confirmPayment() {
    const now = new Date();
    setReceipt({
      id: `ZDL-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
        now.getDate()
      ).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(
        now.getMinutes()
      ).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`,
      time: new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(now),
      lines,
      subtotal,
      ppn,
      total,
      paid: cashAmount,
      change,
    });
    setCart({});
    setCash("");
    setPayOpen(false);
    setCartOpen(false);
  }

  const cartPanel = (
    <div className="flex flex-col rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="inline-flex items-center gap-2 font-semibold">
          <ShoppingCart className="h-4 w-4 text-primary" />
          Pesanan
          {itemCount > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
              {itemCount}
            </span>
          )}
        </h2>
        {lines.length > 0 && (
          <button
            type="button"
            onClick={() => setCart({})}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-destructive"
          >
            <RotateCcw className="h-3 w-3" />
            Kosongkan
          </button>
        )}
      </div>

      {lines.length === 0 ? (
        <div className="flex flex-col items-center px-5 py-12 text-center">
          <ShoppingCart className="h-9 w-9 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium">Keranjang masih kosong</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Ketuk menu di sebelah kiri untuk menambah pesanan.
          </p>
        </div>
      ) : (
        <>
          <ul className="max-h-[300px] space-y-3 overflow-y-auto px-5 py-4 lg:max-h-[340px]">
            {lines.map(({ product, qty }) => (
              <li key={product.id} className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {rupiah(product.price)} × {qty}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full border border-border bg-background p-0.5">
                  <button
                    type="button"
                    aria-label={`Kurangi ${product.name}`}
                    onClick={() => subtract(product.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-muted"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                  <button
                    type="button"
                    aria-label={`Tambah ${product.name}`}
                    onClick={() => add(product.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-muted"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <span className="w-20 text-right text-sm font-semibold">
                  {rupiah(product.price * qty)}
                </span>
              </li>
            ))}
          </ul>

          <div className="space-y-2 border-t border-border px-5 py-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{rupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>PPN 11%</span>
              <span>{rupiah(ppn)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3 text-base font-bold">
              <span>Total</span>
              <span className="text-primary">{rupiah(total)}</span>
            </div>
            <Button
              type="button"
              onClick={() => setPayOpen(true)}
              className="mt-2 w-full rounded-full bg-primary font-semibold text-primary-foreground"
            >
              <Banknote className="mr-2 h-4 w-4" />
              Bayar Sekarang
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="mt-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Menu */}
        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                    category === cat
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari menu…"
              className="w-full sm:w-44"
              aria-label="Cari menu"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {visibleProducts.map(({ id, name, price, category: cat, Icon }) => {
              const qty = cart[id] ?? 0;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => add(id)}
                  className={cn(
                    "group relative flex flex-col items-start rounded-xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    qty > 0 && "border-primary/60 bg-primary/5"
                  )}
                >
                  {qty > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {qty}
                    </span>
                  )}
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug">
                    {name}
                  </span>
                  <span className="mt-1 text-sm font-bold text-primary">{rupiah(price)}</span>
                  <span className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                    {cat}
                  </span>
                </button>
              );
            })}
            {visibleProducts.length === 0 && (
              <p className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Menu tidak ditemukan — coba kata kunci lain.
              </p>
            )}
          </div>
        </div>

        {/* Cart — desktop */}
        <div className="hidden lg:block">
          <div className="sticky top-20">{cartPanel}</div>
        </div>
      </div>

      {/* Cart — mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">
              {itemCount > 0 ? `${itemCount} item di keranjang` : "Keranjang kosong"}
            </p>
            <p className="text-sm font-bold">{rupiah(total)}</p>
          </div>
          <Button
            type="button"
            onClick={() => setCartOpen(true)}
            disabled={itemCount === 0}
            className="rounded-full bg-primary font-semibold text-primary-foreground"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Lihat Pesanan
          </Button>
        </div>
      </div>
      <div className="h-16 lg:hidden" />

      {/* Cart dialog — mobile */}
      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
          <DialogHeader className="sr-only">
            <DialogTitle>Pesanan</DialogTitle>
            <DialogDescription>Ringkasan pesanan demo kasir</DialogDescription>
          </DialogHeader>
          {cartPanel}
        </DialogContent>
      </Dialog>

      {/* Payment dialog */}
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pembayaran</DialogTitle>
            <DialogDescription>
              Total tagihan {rupiah(total)} — masukkan uang yang diberikan pelanggan.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-lg font-bold">{rupiah(total)}</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Pas", value: total },
                { label: "50rb", value: 50000 },
                { label: "100rb", value: 100000 },
                { label: "150rb", value: 150000 },
              ].map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => setCash(String(q.value))}
                  className={cn(
                    "rounded-lg border border-border px-2 py-2 text-xs font-semibold transition-colors hover:border-primary/50 hover:bg-primary/5",
                    cashAmount === q.value && "border-primary bg-primary/10 text-primary"
                  )}
                >
                  {q.label}
                </button>
              ))}
            </div>

            <div className="space-y-1.5">
              <Input
                inputMode="numeric"
                value={cash ? cashAmount.toLocaleString("id-ID") : ""}
                onChange={(e) => setCash(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="Nominal uang, misal 100000"
                aria-label="Nominal uang diterima"
              />
              <p className="text-xs text-muted-foreground">
                Kembalian:{" "}
                <span className={cn("font-semibold", cashValid ? "text-primary" : "text-destructive")}>
                  {cashValid ? rupiah(change) : "kurang " + rupiah(total - cashAmount)}
                </span>
              </p>
            </div>

            <Button
              type="button"
              disabled={!cashValid}
              onClick={confirmPayment}
              className="w-full rounded-full bg-primary font-semibold text-primary-foreground"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Selesaikan Pembayaran
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt dialog */}
      <Dialog open={Boolean(receipt)} onOpenChange={(open) => !open && setReceipt(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="inline-flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Transaksi Berhasil
            </DialogTitle>
            <DialogDescription>
              Ini tampilan struk yang dicetak otomatis oleh sistem kasir asli.
            </DialogDescription>
          </DialogHeader>

          {receipt && (
            <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed">
              <p className="text-center font-bold">WARUNG BU SARI (SIMULASI)</p>
              <p className="text-center text-muted-foreground">Jl. Contoh No. 123, Tangerang</p>
              <p className="mt-2 text-center text-muted-foreground">
                {receipt.id} • {receipt.time}
              </p>
              <div className="my-3 border-t border-dashed border-border" />
              {receipt.lines.map(({ product, qty }) => (
                <div key={product.id} className="flex justify-between gap-2">
                  <span className="truncate">
                    {product.name} x{qty}
                  </span>
                  <span>{rupiah(product.price * qty)}</span>
                </div>
              ))}
              <div className="my-3 border-t border-dashed border-border" />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{rupiah(receipt.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>PPN 11%</span>
                <span>{rupiah(receipt.ppn)}</span>
              </div>
              <div className="mt-1 flex justify-between font-bold">
                <span>TOTAL</span>
                <span>{rupiah(receipt.total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Bayar</span>
                <span>{rupiah(receipt.paid)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kembali</span>
                <span>{rupiah(receipt.change)}</span>
              </div>
              <div className="my-3 border-t border-dashed border-border" />
              <p className="text-center text-muted-foreground">Terima kasih — demo ZDL</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={resetAll}
              className="flex-1 rounded-full bg-primary font-semibold text-primary-foreground"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Transaksi Baru
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.print()}
              className="rounded-full"
              aria-label="Cetak struk simulasi"
            >
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
