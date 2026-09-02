"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, Star, StarOff } from "lucide-react";
import { formatDate } from "@/lib/site";

interface PortfolioRow {
  id: string;
  title: string;
  slug: string;
  year: number | null;
  featured: boolean;
  published: boolean;
  updatedAt: string;
  category: { name: string; slug: string } | null;
}

export function PortfolioManager() {
  const { toast } = useToast();
  const [rows, setRows] = useState<PortfolioRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/portfolios");
      if (res.ok) {
        const data = await res.json();
        setRows(data.portfolios || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggle(id: string, action: "toggle-published" | "toggle-featured") {
    const res = await fetch(`/api/admin/portfolios/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      const data = await res.json();
      setRows((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                published: data.portfolio.published,
                featured: data.portfolio.featured,
              }
            : r
        )
      );
    } else {
      toast({ title: "Gagal memperbarui status", variant: "destructive" });
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/portfolios/${deleteId}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Portfolio dihapus" });
      setRows((prev) => prev.filter((r) => r.id !== deleteId));
    } else {
      toast({ title: "Gagal menghapus", variant: "destructive" });
    }
    setDeleteId(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} project terdaftar — kelola tampilan portfolio website di sini.
          </p>
        </div>
        <Button asChild className="rounded-full bg-primary font-semibold text-primary-foreground">
          <Link href="/admin/portfolios/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Portfolio Baru
          </Link>
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-14 text-center">
          <p className="font-medium">Belum ada portfolio.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tambahkan project pertama Anda untuk menampilkannya di website.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <ul className="divide-y divide-border">
            {rows.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{row.title}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    /portfolio/{row.slug}
                    {row.category ? ` • ${row.category.name}` : ""}
                    {row.year ? ` • ${row.year}` : ""} • diubah {formatDate(row.updatedAt)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full"
                    onClick={() => toggle(row.id, "toggle-featured")}
                    aria-label={row.featured ? "Batalkan featured" : "Jadikan featured"}
                  >
                    {row.featured ? (
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ) : (
                      <StarOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full"
                    onClick={() => toggle(row.id, "toggle-published")}
                    aria-label={row.published ? "Unpublish" : "Publish"}
                  >
                    {row.published ? (
                      <>
                        <Eye className="mr-1.5 h-4 w-4 text-emerald-500" />
                        <span className="hidden text-xs sm:inline">Publik</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="mr-1.5 h-4 w-4 text-muted-foreground" />
                        <span className="hidden text-xs sm:inline">Draft</span>
                      </>
                    )}
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="rounded-full">
                    <Link href={`/admin/portfolios/${row.id}`} aria-label={`Edit ${row.title}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-destructive"
                    onClick={() => setDeleteId(row.id)}
                    aria-label={`Hapus ${row.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus portfolio ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Portfolio akan dihapus permanen
              beserta galerinya.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
