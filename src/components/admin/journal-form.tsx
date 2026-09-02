"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MediaPicker } from "@/components/admin/media-picker";
import { MarkdownEditor, type MarkdownEditorHandle } from "@/components/admin/markdown-editor";
import { Loader2, Save, Wand2, X, ArrowLeft, CalendarClock } from "lucide-react";
import { slugify, readingTime } from "@/lib/markdown";

export interface JournalFormValues {
  id?: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  categoryId: string | null;
  authorName: string | null;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  ogImage: string | null;
  tags: string[];
}

const emptyValues: JournalFormValues = {
  title: "",
  slug: "",
  excerpt: null,
  content: "",
  featuredImage: null,
  categoryId: null,
  authorName: "Tim ZDL",
  status: "DRAFT",
  publishedAt: null,
  seoTitle: null,
  seoDescription: null,
  canonicalUrl: null,
  ogImage: null,
  tags: [],
};

export function JournalForm({
  initial,
  categories,
}: {
  initial?: JournalFormValues;
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = Boolean(initial?.id);

  const [values, setValues] = useState<JournalFormValues>(initial || emptyValues);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [minutes, setMinutes] = useState(1);
  const editorRef = useRef<MarkdownEditorHandle>(null);

  const set = <K extends keyof JournalFormValues>(key: K, val: JournalFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: val }));

  useEffect(() => {
    setMinutes(readingTime(values.content || ""));
     
  }, [values.content]);

  // Auto-slug for new articles
  useEffect(() => {
    if (!isEdit && values.title && !values.slug) {
      set("slug", slugify(values.title));
    }
     
  }, [values.title]);

  function addTag(raw: string) {
    const tag = raw.trim().replace(/,/g, "");
    if (!tag) return;
    if (values.tags.length >= 15) return;
    if (!values.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      set("tags", [...values.tags, tag]);
    }
    setTagInput("");
  }

  async function handleSubmit(e: React.FormEvent, overrideStatus?: "DRAFT" | "PUBLISHED") {
    e.preventDefault();

    const status = overrideStatus || values.status;
    if (values.title.trim().length < 2) {
      toast({ title: "Judul minimal 2 karakter", variant: "destructive" });
      return;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug)) {
      toast({
        title: "Slug tidak valid",
        description: "Gunakan huruf kecil, angka, dan tanda hubung.",
        variant: "destructive",
      });
      return;
    }

    // Pull live content from the uncontrolled editor instance
    const content = editorRef.current?.getMarkdown() || values.content;
    if (!content || content.trim().length < 20) {
      toast({ title: "Konten artikel terlalu pendek", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(
        isEdit ? `/api/admin/journals/${initial!.id}` : "/api/admin/journals",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, content, status }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast({
          title: status === "PUBLISHED" ? "Artikel dipublikasikan" : "Artikel tersimpan",
          description: `“${values.title}” — ${status === "PUBLISHED" ? "sudah live di website" : "disimpan sebagai draft"}.`,
        });
        router.push("/admin/journals");
        router.refresh();
      } else {
        toast({ title: "Gagal menyimpan", description: data.error, variant: "destructive" });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-1 -ml-2 rounded-full">
            <Link href="/admin/journals">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Kembali
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEdit ? "Edit Artikel" : "Artikel Baru"}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="submit"
            variant="outline"
            disabled={saving}
            className="rounded-full"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e, "DRAFT");
            }}
          >
            <Save className="mr-2 h-4 w-4" />
            Simpan Draft
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="rounded-full bg-primary font-semibold text-primary-foreground"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e, "PUBLISHED");
            }}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Publikasikan
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="space-y-6">
          <section className="space-y-5 rounded-2xl border border-border bg-card p-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Judul <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={values.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Contoh: Panduan Memilih Teknologi untuk Website Bisnis"
                required
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug URL <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    /journal/
                  </span>
                  <Input
                    id="slug"
                    value={values.slug}
                    onChange={(e) => set("slug", slugify(e.target.value))}
                    placeholder="panduan-memilih-teknologi"
                    className="pl-20"
                    required
                    maxLength={220}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Generate slug dari judul"
                  onClick={() => set("slug", slugify(values.title))}
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Ringkasan (excerpt)</Label>
              <Textarea
                id="excerpt"
                rows={2}
                value={values.excerpt || ""}
                onChange={(e) => set("excerpt", e.target.value || null)}
                placeholder="Ringkasan 1–2 kalimat yang tampil di listing dan hasil pencarian"
                maxLength={500}
              />
            </div>
          </section>

          {/* Editor */}
          <section className="space-y-3 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Konten artikel</h2>
              <span className="text-xs text-muted-foreground">±{minutes} menit baca</span>
            </div>
            <MarkdownEditor ref={editorRef} value={values.content} onChange={(md) => set("content", md)} />
            <p className="text-xs text-muted-foreground">
              Tips: untuk embed video YouTube, tulis{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5">{"{{youtube:VIDEO_ID}}"}</code>{" "}
              pada baris terpisah di posisi yang diinginkan.
            </p>
          </section>

          {/* SEO */}
          <section className="space-y-5 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold">SEO</h2>
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={values.seoTitle || ""}
                onChange={(e) => set("seoTitle", e.target.value || null)}
                placeholder="Kosongkan untuk memakai judul artikel"
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                rows={3}
                value={values.seoDescription || ""}
                onChange={(e) => set("seoDescription", e.target.value || null)}
                placeholder="Maksimal 160 karakter — tampil di hasil pencarian Google"
                maxLength={320}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="canonicalUrl">Canonical URL (opsional)</Label>
              <Input
                id="canonicalUrl"
                value={values.canonicalUrl || ""}
                onChange={(e) => set("canonicalUrl", e.target.value || null)}
                placeholder="Kosongkan untuk URL standar /journal/{slug}"
                maxLength={500}
              />
            </div>
          </section>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <section className="space-y-5 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold">Publikasi</h2>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                <span className="text-sm">
                  {values.status === "PUBLISHED" ? "Publik di website" : "Draft"}
                </span>
                <Switch
                  checked={values.status === "PUBLISHED"}
                  onCheckedChange={(v) => set("status", v ? "PUBLISHED" : "DRAFT")}
                  aria-label="Toggle status publikasi"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="publishedAt">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarClock className="h-3.5 w-3.5" />
                  Tanggal publikasi
                </span>
              </Label>
              <Input
                id="publishedAt"
                type="datetime-local"
                value={values.publishedAt ? values.publishedAt.slice(0, 16) : ""}
                onChange={(e) => set("publishedAt", e.target.value || null)}
              />
              <p className="text-xs text-muted-foreground">
                Isi tanggal masa depan + status Publik untuk menjadwalkan artikel
                (otomatis tampil saat tanggalnya tiba).
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="authorName">Nama penulis</Label>
              <Input
                id="authorName"
                value={values.authorName || ""}
                onChange={(e) => set("authorName", e.target.value || null)}
                maxLength={100}
              />
            </div>
          </section>

          <section className="space-y-5 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold">Kategori &amp; tag</h2>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select
                value={values.categoryId || "none"}
                onValueChange={(v) => set("categoryId", v === "none" ? null : v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Tanpa kategori —</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tag (Enter untuk menambah)</Label>
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
                placeholder="seo, web development, …"
                maxLength={40}
              />
              {values.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {values.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => set("tags", values.tags.filter((t) => t !== tag))}
                        aria-label={`Hapus tag ${tag}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold">Featured image</h2>
            {values.featuredImage ? (
              <div className="relative overflow-hidden rounded-xl border border-border">
                { }
                <img
                  src={values.featuredImage}
                  alt="Featured image preview"
                  className="aspect-video w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => set("featuredImage", null)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-white"
                  aria-label="Hapus featured image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                Belum ada featured image
              </div>
            )}
            <MediaPicker
              value={values.featuredImage}
              onSelected={(url) => set("featuredImage", url)}
              label={values.featuredImage ? "Ganti Gambar" : "Pilih / Upload Gambar"}
            />
          </section>

          <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold">OG Image</h2>
            {values.ogImage ? (
              <div className="relative overflow-hidden rounded-xl border border-border">
                { }
                <img
                  src={values.ogImage}
                  alt="OG image preview"
                  className="aspect-video w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => set("ogImage", null)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-white"
                  aria-label="Hapus OG image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Jika kosong, featured image akan dipakai untuk social sharing.
              </p>
            )}
            <MediaPicker
              value={values.ogImage}
              onSelected={(url) => set("ogImage", url)}
              label="Pilih OG Image"
            />
          </section>
        </div>
      </div>
    </form>
  );
}
