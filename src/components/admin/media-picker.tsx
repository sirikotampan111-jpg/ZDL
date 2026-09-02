"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Images, Link2, UploadCloud, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string | null;
  alt: string | null;
  createdAt: string;
}

/**
 * Media picker dialog: pick from library, upload a file, or paste an external URL.
 * Calls onSelected(url) with the chosen media URL.
 */
export function MediaPicker({
  value,
  onSelected,
  label = "Pilih dari Media Library",
}: {
  value?: string | null;
  onSelected: (url: string) => void;
  label?: string;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const loadMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        setMedia(data.media || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) loadMedia();
  }, [open, loadMedia]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Upload berhasil" });
        onSelected(data.media.url);
        setOpen(false);
      } else {
        toast({ title: "Upload gagal", description: data.error, variant: "destructive" });
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="rounded-full">
          <Images className="mr-1.5 h-4 w-4" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="library" className="overflow-hidden">
          <TabsList>
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="url">Dari URL</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="scrollbar-thin max-h-[55vh] overflow-y-auto pr-1">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : media.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Belum ada media. Upload file atau tambah dari URL terlebih dahulu.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {media.map((item) => (
                  <div key={item.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => {
                        onSelected(item.url);
                        setOpen(false);
                      }}
                      className={`block w-full overflow-hidden rounded-xl border-2 transition-colors ${
                        value === item.url
                          ? "border-primary"
                          : "border-transparent hover:border-primary/50"
                      }`}
                    >
                      { }
                      <img
                        src={item.url}
                        alt={item.alt || item.filename}
                        className="aspect-video w-full object-cover"
                        loading="lazy"
                      />
                      <span className="block truncate px-2 py-1.5 text-left text-[11px] text-muted-foreground">
                        {item.filename}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-10 transition-colors hover:border-primary/50">
              {uploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : (
                <UploadCloud className="h-8 w-8 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">
                {uploading ? "Mengunggah..." : "Klik untuk memilih gambar"}
              </span>
              <span className="text-xs text-muted-foreground">
                JPG, PNG, WebP, GIF, SVG • maksimal 5MB
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Catatan deployment: pada serverless (mis. Vercel) filesystem hanya-baca —
              gunakan tab <strong>Dari URL</strong> dengan storage eksternal (Vercel Blob,
              Cloudinary, S3) untuk hasil terbaik.
            </p>
          </TabsContent>

          <TabsContent value="url">
            <div className="space-y-3 py-2">
              <Label htmlFor="media-url">URL gambar</Label>
              <Input
                id="media-url"
                placeholder="https://contoh.com/gambar.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <Button
                type="button"
                className="w-full rounded-full bg-primary text-primary-foreground"
                onClick={() => {
                  if (!urlInput.trim()) return;
                  onSelected(urlInput.trim());
                  setUrlInput("");
                  setOpen(false);
                }}
              >
                <Link2 className="mr-1.5 h-4 w-4" />
                Gunakan URL ini
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

/** Full media manager page component (list + delete). */
export function MediaManager() {
  const { toast } = useToast();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [urlInput, setUrlInput] = useState("");

  const loadMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        setMedia(data.media || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  async function handleDelete(id: string) {
    if (!confirm("Hapus media ini? Referensi di konten yang sudah dipublikasikan tidak akan otomatis terhapus.")) return;
    const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Media dihapus" });
      setMedia((prev) => prev.filter((m) => m.id !== id));
    } else {
      toast({ title: "Gagal menghapus", variant: "destructive" });
    }
  }

  async function handleAddUrl() {
    if (!urlInput.trim()) return;
    const res = await fetch("/api/admin/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: urlInput.split("/").pop() || "external", url: urlInput.trim() }),
    });
    if (res.ok) {
      toast({ title: "Media ditambahkan" });
      setUrlInput("");
      loadMedia();
    } else {
      const data = await res.json();
      toast({ title: "Gagal menambahkan", description: data.error, variant: "destructive" });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row">
        <Input
          placeholder="Tambah gambar dari URL (mis. Vercel Blob / Cloudinary)…"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleAddUrl} className="rounded-full bg-primary text-primary-foreground">
          <Link2 className="mr-1.5 h-4 w-4" />
          Tambah
        </Button>
      </div>

      {media.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-14 text-center">
          <Images className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <p className="mt-4 font-medium">Belum ada media.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload gambar melalui form portfolio/artikel atau tambahkan dari URL di atas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="relative aspect-video bg-muted">
                { }
                <img
                  src={item.url}
                  alt={item.alt || item.filename}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <button
                  onClick={() => handleDelete(item.id)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-white opacity-0 shadow transition-opacity group-hover:opacity-100"
                  aria-label={`Hapus ${item.filename}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-medium">{item.filename}</p>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{item.url}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
