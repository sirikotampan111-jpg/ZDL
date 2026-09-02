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
import { Loader2, Plus, Pencil, Trash2, Send, Undo2 } from "lucide-react";
import { formatDate } from "@/lib/site";

interface JournalRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  publishedAt: string | null;
  updatedAt: string;
  category: { name: string; slug: string } | null;
}

export function JournalManager() {
  const { toast } = useToast();
  const [rows, setRows] = useState<JournalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/journals");
      if (res.ok) {
        const data = await res.json();
        setRows(data.journals || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function togglePublish(row: JournalRow) {
    const action = row.status === "PUBLISHED" ? "unpublish" : "publish";
    const res = await fetch(`/api/admin/journals/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      const data = await res.json();
      setRows((prev) =>
        prev.map((r) =>
          r.id === row.id
            ? { ...r, status: data.journal.status, publishedAt: data.journal.publishedAt }
            : r
        )
      );
      toast({
        title: action === "publish" ? "Artikel dipublikasikan" : "Artikel dijadikan draft",
      });
    } else {
      toast({ title: "Gagal memperbarui status", variant: "destructive" });
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/journals/${deleteId}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Artikel dihapus" });
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
          <h1 className="text-2xl font-bold tracking-tight">Journal</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} artikel terdaftar — kelola ZDL Journal di sini.
          </p>
        </div>
        <Button asChild className="rounded-full bg-primary font-semibold text-primary-foreground">
          <Link href="/admin/journals/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Artikel Baru
          </Link>
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-14 text-center">
          <p className="font-medium">Belum ada artikel.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tulis artikel pertama untuk membangun authority SEO website.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <ul className="divide-y divide-border">
            {rows.map((row) => {
              const scheduled =
                row.status === "PUBLISHED" &&
                row.publishedAt &&
                new Date(row.publishedAt) > new Date();
              return (
                <li key={row.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{row.title}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      /journal/{row.slug}
                      {row.category ? ` • ${row.category.name}` : ""} • diubah{" "}
                      {formatDate(row.updatedAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        scheduled
                          ? "bg-cyan-500/15 text-cyan-500"
                          : row.status === "PUBLISHED"
                            ? "bg-emerald-500/15 text-emerald-500"
                            : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {scheduled ? "Terjadwal" : row.status === "PUBLISHED" ? "Publik" : "Draft"}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full"
                      onClick={() => togglePublish(row)}
                      aria-label={row.status === "PUBLISHED" ? "Jadikan draft" : "Publikasikan"}
                    >
                      {row.status === "PUBLISHED" ? (
                        <Undo2 className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Send className="h-4 w-4 text-emerald-500" />
                      )}
                    </Button>
                    <Button asChild variant="ghost" size="sm" className="rounded-full">
                      <Link href={`/admin/journals/${row.id}`} aria-label={`Edit ${row.title}`}>
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
              );
            })}
          </ul>
        </div>
      )}

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus artikel ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Artikel akan dihapus permanen.
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
