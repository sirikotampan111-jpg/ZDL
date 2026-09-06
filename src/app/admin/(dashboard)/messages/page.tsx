"use client";

import { useCallback, useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Building2,
  Inbox,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Tag,
  Trash2,
  CheckCheck,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ContactMessage = {
  id: string;
  name: string;
  business: string | null;
  email: string;
  whatsapp: string | null;
  projectType: string | null;
  description: string;
  isRead: boolean;
  createdAt: string;
};

function timeAgo(iso: string) {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: localeId });
  } catch {
    return iso;
  }
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/messages", { cache: "no-store" });
      if (!res.ok) throw new Error(`Gagal memuat pesan (${res.status})`);
      const data = await res.json();
      setMessages(data.messages ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleRead(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error();
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: !m.isRead } : m))
      );
    } catch {
      setError("Gagal memperbarui status pesan.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Hapus pesan ini secara permanen?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch {
      setError("Gagal menghapus pesan.");
    } finally {
      setBusyId(null);
    }
  }

  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pesan Masuk</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Konsultasi yang dikirim pengunjung melalui form kontak website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
              {messages.length} pesan • {unread} belum dibaca
            </span>
          )}
          <Button onClick={load} variant="outline" size="sm" className="rounded-full">
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Muat ulang
          </Button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-border bg-card py-16 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Memuat pesan...
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
          <Inbox className="h-10 w-10 text-muted-foreground/50" />
          <p className="mt-4 font-medium">Belum ada pesan masuk</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Pesan konsultasi dari form kontak website akan muncul di sini.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`rounded-2xl border bg-card p-5 transition-colors ${
                m.isRead ? "border-border" : "border-primary/40 shadow-sm"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-semibold">
                    {m.name}
                    {!m.isRead && (
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                        Baru
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {timeAgo(m.createdAt)} • {format(new Date(m.createdAt), "d MMM yyyy HH:mm", { locale: localeId })}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    onClick={() => toggleRead(m.id)}
                    disabled={busyId === m.id}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    {busyId === m.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : m.isRead ? (
                      <>
                        <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Tandai belum dibaca
                      </>
                    ) : (
                      <>
                        <CheckCheck className="mr-1.5 h-3.5 w-3.5" /> Tandai dibaca
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => remove(m.id)}
                    disabled={busyId === m.id}
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <a href={`mailto:${m.email}`} className="truncate text-primary hover:underline">
                    {m.email}
                  </a>
                </div>
                {m.whatsapp && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <a
                      href={`https://wa.me/${m.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-primary hover:underline"
                    >
                      {m.whatsapp}
                    </a>
                  </div>
                )}
                {m.business && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{m.business}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{m.projectType || "Tanpa kategori"}</span>
                </div>
              </dl>

              {m.description && (
                <div className="mt-4 rounded-xl bg-muted/60 p-4">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" /> Deskripsi kebutuhan
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{m.description}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
