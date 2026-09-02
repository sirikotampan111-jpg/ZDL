"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Loader2, Plus, Pencil, Trash2, Tags } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count?: { portfolios?: number; journals?: number };
}

type CategoryType = "portfolio" | "journal";

export function CategoryManager() {
  const { toast } = useToast();
  const [portfolioCats, setPortfolioCats] = useState<Category[]>([]);
  const [journalCats, setJournalCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<{ type: CategoryType; cat: Category } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: CategoryType; cat: Category } | null>(null);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setPortfolioCats(data.portfolio || []);
        setJournalCats(data.journal || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate(type: CategoryType) {
    setEditing({ type, cat: null as unknown as Category });
    setName("");
    setSlug("");
    setDescription("");
    setDialogOpen(true);
  }

  function openEdit(type: CategoryType, cat: Category) {
    setEditing({ type, cat });
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!editing) return;
    if (name.trim().length < 1) {
      toast({ title: "Nama kategori wajib diisi", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const isEdit = Boolean(editing.cat?.id);
      const res = await fetch(
        isEdit ? `/api/admin/categories/${editing.cat.id}` : "/api/admin/categories",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            slug: slug.trim() || undefined,
            description: description.trim() || null,
            type: editing.type,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast({ title: isEdit ? "Kategori diperbarui" : "Kategori dibuat" });
        setDialogOpen(false);
        load();
      } else {
        toast({ title: "Gagal menyimpan", description: data.error, variant: "destructive" });
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/categories/${deleteTarget.cat.id}?type=${deleteTarget.type}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast({ title: "Kategori dihapus" });
      load();
    } else {
      toast({ title: "Gagal menghapus kategori", variant: "destructive" });
    }
    setDeleteTarget(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const renderList = (type: CategoryType, cats: Category[]) => (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <p className="text-sm font-semibold">
          {cats.length} kategori {type === "portfolio" ? "portfolio" : "journal"}
        </p>
        <Button size="sm" variant="outline" className="rounded-full" onClick={() => openCreate(type)}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Baru
        </Button>
      </div>
      <ul className="divide-y divide-border">
        {cats.map((cat) => (
          <li key={cat.id} className="flex items-center gap-3 px-5 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{cat.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                /{type === "portfolio" ? "portfolio" : "journal"}?kategori={cat.slug}
                {cat._count?.portfolios !== undefined ? ` • ${cat._count.portfolios} project` : ""}
                {cat._count?.journals !== undefined ? ` • ${cat._count.journals} artikel` : ""}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => openEdit(type, cat)}
              aria-label={`Edit ${cat.name}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-destructive"
              onClick={() => setDeleteTarget({ type, cat })}
              aria-label={`Hapus ${cat.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
        {cats.length === 0 && (
          <li className="px-5 py-10 text-center text-sm text-muted-foreground">
            Belum ada kategori.
          </li>
        )}
      </ul>
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kategori</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kelola kategori untuk portfolio dan journal — dipakai untuk filter &amp; SEO.
        </p>
      </div>

      <Tabs defaultValue="portfolio">
        <TabsList>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
        </TabsList>
        <TabsContent value="portfolio" className="mt-4">
          {renderList("portfolio", portfolioCats)}
        </TabsContent>
        <TabsContent value="journal" className="mt-4">
          {renderList("journal", journalCats)}
        </TabsContent>
      </Tabs>

      {/* Create/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing?.cat?.id ? "Edit Kategori" : "Kategori Baru"}{" "}
              <span className="text-muted-foreground">
                ({editing?.type === "portfolio" ? "Portfolio" : "Journal"})
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cat-name">
                Nama <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cat-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Web Development"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-slug">Slug (opsional — otomatis dari nama)</Label>
              <Input
                id="cat-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="web-development"
                maxLength={120}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-desc">Deskripsi (opsional)</Label>
              <Textarea
                id="cat-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-full bg-primary font-semibold text-primary-foreground"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Tags className="mr-2 h-4 w-4" />
                  Simpan Kategori
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus kategori “{deleteTarget?.cat.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              Item yang memakai kategori ini tidak akan terhapus, namun akan kehilangan
              kategorinya (menjadi tanpa kategori).
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
