"use client";

import { useEffect, useState } from "react";
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
import { Loader2, Save, Wand2, X, ArrowLeft } from "lucide-react";
import { slugify } from "@/lib/markdown";
import Link from "next/link";

export interface PortfolioFormValues {
  id?: string;
  title: string;
  slug: string;
  categoryId: string | null;
  description: string;
  thumbnail: string | null;
  technologies: string[];
  client: string | null;
  projectUrl: string | null;
  githubUrl: string | null;
  year: number | null;
  featured: boolean;
  published: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  images: { url: string; alt: string | null; sortOrder: number }[];
}

const emptyValues: PortfolioFormValues = {
  title: "",
  slug: "",
  categoryId: null,
  description: "",
  thumbnail: null,
  technologies: [],
  client: null,
  projectUrl: null,
  githubUrl: null,
  year: new Date().getFullYear(),
  featured: false,
  published: true,
  seoTitle: null,
  seoDescription: null,
  images: [],
};

export function PortfolioForm({
  initial,
  categories,
}: {
  initial?: PortfolioFormValues;
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = Boolean(initial?.id);

  const [values, setValues] = useState<PortfolioFormValues>(initial || emptyValues);
  const [techInput, setTechInput] = useState((initial?.technologies || []).join(", "));
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof PortfolioFormValues>(key: K, val: PortfolioFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: val }));

  // Auto-generate slug from title on new records
  useEffect(() => {
    if (!isEdit && values.title && !values.slug) {
      set("slug", slugify(values.title));
    }
     
  }, [values.title]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (values.title.trim().length < 2) {
      toast({ title: "Judul minimal 2 karakter", variant: "destructive" });
      return;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug)) {
      toast({
        title: "Slug tidak valid",
        description: "Gunakan huruf kecil, angka, dan tanda hubung (contoh: my-project-2025).",
        variant: "destructive",
      });
      return;
    }
    if (values.description.trim().length < 10) {
      toast({ title: "Deskripsi minimal 10 karakter", variant: "destructive" });
      return;
    }

    const technologies = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setSaving(true);
    try {
      const res = await fetch(
        isEdit ? `/api/admin/portfolios/${initial!.id}` : "/api/admin/portfolios",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            technologies,
            year: values.year ? Number(values.year) : null,
            images: values.images.map((img, i) => ({ ...img, sortOrder: i })),
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast({
          title: isEdit ? "Portfolio diperbarui" : "Portfolio dibuat",
          description: `“${values.title}” tersimpan.`,
        });
        router.push("/admin/portfolios");
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
            <Link href="/admin/portfolios">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Kembali
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEdit ? "Edit Portfolio" : "Portfolio Baru"}
          </h1>
        </div>
        <Button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary font-semibold text-primary-foreground"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Simpan Portfolio
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main column */}
        <div className="space-y-6">
          <section className="space-y-5 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold">Informasi utama</h2>

            <div className="space-y-2">
              <Label htmlFor="title">
                Judul <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={values.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Contoh: Sistem Manajemen Inventori Retail"
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
                    /portfolio/
                  </span>
                  <Input
                    id="slug"
                    value={values.slug}
                    onChange={(e) => set("slug", slugify(e.target.value))}
                    placeholder="sistem-manajemen-inventori"
                    className="pl-24"
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
              <p className="text-xs text-muted-foreground">
                URL final: <code className="rounded bg-secondary px-1.5 py-0.5">zdl.my.id/portfolio/{values.slug || "..."}</code>
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
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
                <Label htmlFor="year">Tahun</Label>
                <Input
                  id="year"
                  type="number"
                  min={1990}
                  max={2100}
                  value={values.year ?? ""}
                  onChange={(e) =>
                    set("year", e.target.value ? Number(e.target.value) : null)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Deskripsi <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                rows={8}
                value={values.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Jelaskan konteks bisnis, masalah yang diselesaikan, dan hasil yang dicapai. Pisahkan paragraf dengan baris kosong."
                required
                minLength={10}
                maxLength={20000}
              />
              <p className="text-xs text-muted-foreground">
                Paragraf dipisahkan dengan baris kosong.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="technologies">Teknologi (pisahkan dengan koma)</Label>
              <Input
                id="technologies"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Next.js, TypeScript, PostgreSQL, Tailwind CSS"
              />
              {techInput.trim() && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {techInput
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((t, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                      >
                        {t}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </section>

          {/* SEO */}
          <section className="space-y-5 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold">SEO</h2>
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={values.seoTitle || ""}
                onChange={(e) => set("seoTitle", e.target.value)}
                placeholder="Kosongkan untuk memakai judul project"
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                rows={3}
                value={values.seoDescription || ""}
                onChange={(e) => set("seoDescription", e.target.value)}
                placeholder="Maksimal 160 karakter — tampil di hasil pencarian Google"
                maxLength={320}
              />
            </div>
          </section>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <section className="space-y-5 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold">Status</h2>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="published">Publikasi</Label>
                <p className="text-xs text-muted-foreground">Tampil di website publik</p>
              </div>
              <Switch
                id="published"
                checked={values.published}
                onCheckedChange={(v) => set("published", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="featured">Featured</Label>
                <p className="text-xs text-muted-foreground">Tampil di homepage</p>
              </div>
              <Switch
                id="featured"
                checked={values.featured}
                onCheckedChange={(v) => set("featured", v)}
              />
            </div>
          </section>

          <section className="space-y-5 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold">Klien & tautan</h2>
            <div className="space-y-2">
              <Label htmlFor="client">Nama klien / bisnis</Label>
              <Input
                id="client"
                value={values.client || ""}
                onChange={(e) => set("client", e.target.value || null)}
                placeholder="Opsional"
                maxLength={150}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectUrl">URL project</Label>
              <Input
                id="projectUrl"
                type="url"
                value={values.projectUrl || ""}
                onChange={(e) => set("projectUrl", e.target.value || null)}
                placeholder="https://…"
                maxLength={500}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubUrl">URL GitHub</Label>
              <Input
                id="githubUrl"
                type="url"
                value={values.githubUrl || ""}
                onChange={(e) => set("githubUrl", e.target.value || null)}
                placeholder="https://github.com/…"
                maxLength={500}
              />
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold">Thumbnail</h2>
            {values.thumbnail ? (
              <div className="relative overflow-hidden rounded-xl border border-border">
                { }
                <img
                  src={values.thumbnail}
                  alt="Thumbnail preview"
                  className="aspect-video w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => set("thumbnail", null)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-white"
                  aria-label="Hapus thumbnail"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                Belum ada thumbnail
              </div>
            )}
            <MediaPicker
              value={values.thumbnail}
              onSelected={(url) => set("thumbnail", url)}
              label={values.thumbnail ? "Ganti Thumbnail" : "Pilih / Upload Thumbnail"}
            />
          </section>

          <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Galeri ({values.images.length})</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() =>
                  set("images", [...values.images, { url: "", alt: null, sortOrder: values.images.length }])
                }
              >
                Tambah slot
              </Button>
            </div>
            {values.images.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Tambahkan slot galeri untuk menampilkan beberapa gambar project.
              </p>
            )}
            {values.images.map((img, i) => (
              <div key={i} className="space-y-2 rounded-xl border border-border p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">#{i + 1}</span>
                  <div className="flex-1">
                    {img.url ? (
                       
                      <img
                        src={img.url}
                        alt={img.alt || "Galeri"}
                        className="aspect-video w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex aspect-video items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
                        Belum ada gambar
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <MediaPicker
                    value={img.url}
                    onSelected={(url) => {
                      const next = [...values.images];
                      next[i] = { ...next[i], url };
                      set("images", next);
                    }}
                    label="Pilih gambar"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full text-destructive"
                    onClick={() => set("images", values.images.filter((_, j) => j !== i))}
                  >
                    Hapus
                  </Button>
                </div>
                <Input
                  placeholder="Alt text (deskripsi gambar untuk SEO)"
                  value={img.alt || ""}
                  onChange={(e) => {
                    const next = [...values.images];
                    next[i] = { ...next[i], alt: e.target.value || null };
                    set("images", next);
                  }}
                  maxLength={200}
                />
              </div>
            ))}
          </section>
        </div>
      </div>
    </form>
  );
}
