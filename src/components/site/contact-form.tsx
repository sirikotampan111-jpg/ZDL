"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Send, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/site";

const projectTypes = [
  "Website (Landing Page / Company Profile)",
  "Website (E-Commerce)",
  "Web Application / SaaS",
  "Mobile Application",
  "Dashboard / Sistem Internal",
  "Excel / Google Sheets Automation",
  "SEO / Digital Marketing",
  "Domain / Hosting / Infrastructure",
  "Lainnya / Belum yakin",
];

export function ContactForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [projectType, setProjectType] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      business: String(formData.get("business") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      whatsapp: String(formData.get("whatsapp") || "").trim(),
      projectType,
      description: String(formData.get("description") || "").trim(),
    };

    // Basic client validation
    if (payload.name.length < 2 || payload.description.length < 10 || !payload.email.includes("@")) {
      toast({
        title: "Periksa kembali isian Anda",
        description: "Nama, email yang valid, dan deskripsi (min. 10 karakter) wajib diisi.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Pesan terkirim!",
          description:
            "Terima kasih! Tim ZDL akan menghubungi Anda melalui email/WhatsApp dalam 1×24 jam kerja.",
        });
        form.reset();
        setProjectType("");
      } else {
        toast({
          title: "Gagal mengirim pesan",
          description: data.error || "Terjadi kesalahan. Silakan coba lagi atau hubungi kami via WhatsApp.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Gagal mengirim pesan",
        description: "Koneksi bermasalah. Silakan coba lagi atau hubungi kami via WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nama <span className="text-destructive">*</span>
          </Label>
          <Input id="name" name="name" placeholder="Nama lengkap Anda" required maxLength={100} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="business">Nama bisnis / perusahaan</Label>
          <Input id="business" name="business" placeholder="Opsional" maxLength={150} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input id="email" name="email" type="email" placeholder="nama@email.com" required maxLength={200} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
          <Input id="whatsapp" name="whatsapp" type="tel" placeholder="08xx-xxxx-xxxx" maxLength={20} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectType">Jenis project</Label>
        <Select value={projectType} onValueChange={setProjectType}>
          <SelectTrigger id="projectType" className="w-full">
            <SelectValue placeholder="Pilih jenis project yang Anda butuhkan" />
          </SelectTrigger>
          <SelectContent>
            {projectTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Deskripsi kebutuhan project <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Ceritakan konteks bisnis Anda dan apa yang ingin dibangun — semakin jelas konteksnya, semakin tepat rekomendasi kami."
          rows={6}
          required
          minLength={10}
          maxLength={5000}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-full bg-primary font-semibold text-primary-foreground"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Discuss Your Project
            </>
          )}
        </Button>
        <Button asChild variant="outline" className="flex-1 rounded-full">
          <a href={waLink()} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-4 w-4 text-[#25D366]" />
            Konsultasi via WhatsApp
          </a>
        </Button>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Dengan mengirim form ini, Anda setuju untuk dihubungi oleh tim ZDL
        terkait kebutuhan project Anda. Data Anda hanya digunakan untuk keperluan
        komunikasi dan tidak dibagikan ke pihak ketiga.
      </p>
    </form>
  );
}
