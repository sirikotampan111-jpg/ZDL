"use client";

import { useCallback, useEffect, useState } from "react";
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
import { Loader2, Trash2, Mail, Phone, Building2 } from "lucide-react";
import { formatDateTime } from "@/lib/site";

interface MessageRow {
  id: string;
  name: string;
  business: string | null;
  email: string;
  whatsapp: string | null;
  projectType: string | null;
  description: string;
  isRead: boolean;
  createdAt: string;
}

export function MessageList() {
  const { toast } = useToast();
  const [rows, setRows] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      if (res.ok) {
        const data = await res.json();
        setRows(data.messages || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  async function toggleRead(row: MessageRow) {
    const res = await fetch(`/api/admin/messages/${row.id}`, { method: "PATCH" });
    if (res.ok) {
      const data = await res.json();
      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, isRead: data.message.isRead } : r))
      );
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/messages/${deleteId}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Pesan dihapus" });
      setRows((prev) => prev.filter((r) => r.id !== deleteId));
    } else {
      toast({ title: "Gagal menghapus pesan", variant: "destructive" });
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pesan Masuk</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {rows.filter((r) => !r.isRead).length} belum dibaca dari total {rows.length} pesan
          konsultasi.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-14 text-center">
          <Mail className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <p className="mt-4 font-medium">Belum ada pesan masuk.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Pesan dari form konsultasi di halaman Contact akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => (
            <article
              key={row.id}
              className={`rounded-2xl border bg-card p-5 transition-colors ${
                row.isRead ? "border-border" : "border-primary/40 bg-primary/[0.03]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{row.name}</p>
                    {!row.isRead && (
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        BARU
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDateTime(row.createdAt)}
                    {row.projectType ? ` • ${row.projectType}` : ""}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => toggleRead(row)}
                  >
                    Tandai {row.isRead ? "belum dibaca" : "sudah dibaca"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-destructive"
                    onClick={() => setDeleteId(row.id)}
                    aria-label="Hapus pesan"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {row.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
                <a
                  href={`mailto:${row.email}`}
                  className="inline-flex items-center gap-1.5 hover:text-primary"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {row.email}
                </a>
                {row.whatsapp && (
                  <a
                    href={`https://wa.me/${row.whatsapp.replace(/[^0-9]/g, "").replace(/^0/, "62")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-primary"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {row.whatsapp}
                  </a>
                )}
                {row.business && (
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    {row.business}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus pesan ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan.
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
