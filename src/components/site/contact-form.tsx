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
import { site } from "@/lib/site";
import { useDict } from "@/i18n/client";

export function ContactForm() {
  const { toast } = useToast();
  const t = useDict();
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
        title: t.contact.errTitle,
        description: t.contact.errDesc,
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
          title: t.contact.okTitle,
          description: t.contact.okDesc,
        });
        form.reset();
        setProjectType("");
      } else {
        toast({
          title: t.contact.failTitle,
          description: data.error || t.contact.failDesc,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: t.contact.failTitle,
        description: t.contact.netDesc,
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
            {t.contact.name} <span className="text-destructive">*</span>
          </Label>
          <Input id="name" name="name" placeholder={t.contact.namePlaceholder} required maxLength={100} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="business">{t.contact.business}</Label>
          <Input id="business" name="business" placeholder={t.contact.businessPlaceholder} maxLength={150} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">
            {t.contact.email} <span className="text-destructive">*</span>
          </Label>
          <Input id="email" name="email" type="email" placeholder="nama@email.com" required maxLength={200} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">{t.contact.whatsapp}</Label>
          <Input id="whatsapp" name="whatsapp" type="tel" placeholder={t.contact.whatsappPlaceholder} maxLength={20} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectType">{t.contact.projectType}</Label>
        <Select value={projectType} onValueChange={setProjectType}>
          <SelectTrigger id="projectType" className="w-full">
            <SelectValue placeholder={t.contact.projectTypePlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {t.contact.projectTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          {t.contact.description} <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder={t.contact.descriptionPlaceholder}
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
              {t.contact.sending}
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {t.contact.submit}
            </>
          )}
        </Button>
        <Button asChild variant="outline" className="flex-1 rounded-full">
          <a
            href={`https://wa.me/${site.whatsapp.intl}?text=${encodeURIComponent(t.wa.defaultMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="mr-2 h-4 w-4 text-[#25D366]" />
            {t.contact.waCta}
          </a>
        </Button>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {t.contact.privacy}
      </p>
    </form>
  );
}
