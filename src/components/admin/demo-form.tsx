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
import { Loader2, Save, Wand2, X, ArrowLeft, MousePointerClick, Lock } from "lucide-react";
import { slugify } from "@/lib/markdown";
import Link from "next/link";

export interface DemoFormValues {
  id?: string;
  title: string;
  slug: string;
  description: string;
  notes: string | null;
  category: string | null;
  thumbnail: string | null;
  demoUrl: string;
  accessType: "PUBLIC" | "REQUEST";
  technologies: string[];
  featured: boolean;
  published: boolean;
  sortOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
}

const emptyValues: DemoFormValues = {
  title: "",
  slug: "",
  description: "",
  notes: null,
  category: null,
  thumbnail: null,
  demoUrl: "",
  accessType: "PUBLIC",
  technologies: [],
  featured: false,
  published: true,
  sortOrder: 0,
  seoTitle: null,
  seoDescription: null,
};

export function DemoForm({ initial }: { initial?: DemoFormValues }) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = Boolean(initial?.id);

  const [values, setValues] = useState<DemoFormValues>(initial || emptyValues);
  const [techInput, setTechInput] = useState((initial?.technologies || []).join(", "));
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof DemoFormValues>(key: K, val: DemoFormValues[K]) =>
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
        description: "Gunakan huruf kecil, angka, dan tanda hubung (contoh: aplikasi-kasir).",
        variant: "destructive",
      });
      return;
    }
    if (values.description.trim().length < 10) {
      toast({ title: "Deskripsi minimal 10 karakter", variant: "destructive" });
      return;
    }
    if (!values.demoUrl.trim()) {
      toast({ title: "URL demo wajib diisi", variant: "destructive" });
      return;
    }

    const technologies = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setSaving(true);
    try {
      const res = await fetch(
        isEdit ? `/api/admin/demo/${initial!.id}` : "/api/admin/demo",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            technologies,
            sortOrder: Number(values.sortOrder) || 0,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast({
          title: isEdit ? "Demo diperbarui" : "Demo dibuat",
          description: `“${values.title}” tersimpan.`,
        });
        router.push("/admin/demo");
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
            <Link href="/admin/demo">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Kembali
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEdit ? "Edit Demo" : "Demo Baru"}
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
              Simpan Demo
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
                placeholder="Contoh: Demo Aplikasi Kasir"
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
                    /demo/
                  </span>
                  <Input
                    id="slug"
                    value={values.slug}
                    onChange={(e) => set("slug", slugify(e.target.value))}
                    placeholder="aplikasi-kasir"
                    className="pl-16"
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
                URL final: <code className="rounded bg-secondary px-1.5 py-0.5">zdl.my.id/demo/{values.slug || "..."}</code>
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Kategori (teks bebas)</Label>
                <Input
                  id="category"
                  value={values.category || ""}
                  onChange={(e) => set("category", e.target.value || null)}
                  placeholder="Contoh: Aplikasi Kasir"
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  Jadi chip filter di galeri /demo — demo dengan nama kategori sama dikelompokkan.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Urutan tampil</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min={0}
                  max={9999}
                  value={values.sortOrder}
                  onChange={(e) => set("sortOrder", Number(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">
                  Angka kecil tampil lebih atas.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Deskripsi <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                rows={7}
                value={values.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Jelaskan apa yang didemokan dan kenapa relevan untuk calon klien. Pisahkan paragraf dengan baris kosong."
                required
                minLength={10}
                maxLength={20000}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Yang bisa dicoba (opsional)</Label>
              <Textarea
                id="notes"
                rows={5}
                value={values.notes || ""}
                onChange={(e) => set("notes", e.target.value || null)}
                placeholder="Daftar hal yang bisa dicoba pengunjung di dalam demo. Pisahkan paragraf dengan baris kosong."
                maxLength={20000}
              />
              <p className="text-xs text-muted-foreground">
                Tampil di halaman detail sebagai bagian “Yang bisa Anda coba”.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="technologies">Teknologi (pisahkan dengan koma)</Label>
              <Input
                id="technologies"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Next.js, React, Tailwind CSS, Prisma"
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

          <section className="space-y-5 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold">SEO</h2>
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={values.seoTitle || ""}
                onChange={(e) => set("seoTitle", e.target.value)}
                placeholder="Kosongkan untuk memakai judul demo"
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
                <p className="text-xs text-muted-foreground">Tampil di galeri /demo</p>
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
                <p className="text-xs text-muted-foreground">Tampil paling atas</p>
              </div>
              <Switch
                id="featured"
                checked={values.featured}
                onCheckedChange={(v) => set("featured", v)}
              />
            </div>
          </section>

          <section className="space-y-5 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold">Akses demo</h2>
            <div className="space-y-2">
              <Label htmlFor="accessType">Tipe akses</Label>
              <Select
                value={values.accessType}
                onValueChange={(v) => set("accessType", v as "PUBLIC" | "REQUEST")}
              >
                <SelectTrigger className="w-full" id="accessType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLIC">
                    <span className="flex items-center gap-2">
                      <MousePointerClick className="h-4 w-4 text-primary" />
                      Publik — langsung dicoba
                    </span>
                  </SelectItem>
                  <SelectItem value="REQUEST">
                    <span className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Permintaan — akses via WhatsApp
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Tipe “Permintaan” cocok untuk demo sistem klien: URL demo tidak
                tampil di publik, pengunjung minta akses lewat WhatsApp dan
                kredensial dibagikan pribadi.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="demoUrl">
                URL demo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="demoUrl"
                value={values.demoUrl}
                onChange={(e) => set("demoUrl", e.target.value)}
                placeholder="/demo/coba/kasir atau https://demo-zzz.vercel.app"
                required
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                Isi path internal (diawali <code>/</code>) untuk demo interaktif
                bawaan, atau URL penuh untuk aplikasi yang di-deploy terpisah.
              </p>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold">Thumbnail</h2>
            {values.thumbnail ? (
              <div className="relative overflow-hidden rounded-xl border border-border">
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
        </div>
      </div>
    </form>
  );
}
