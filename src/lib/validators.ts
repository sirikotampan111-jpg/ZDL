import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100),
  business: z.string().max(150).optional().or(z.literal("")),
  email: z.string().email("Email tidak valid"),
  whatsapp: z
    .string()
    .regex(/^[0-9+\-\s()]{6,20}$/, "Nomor WhatsApp tidak valid")
    .optional()
    .or(z.literal("")),
  projectType: z.string().max(100).optional().or(z.literal("")),
  description: z.string().min(10, "Deskripsi minimal 10 karakter").max(5000),
});

export const portfolioSchema = z.object({
  title: z.string().min(2, "Judul minimal 2 karakter").max(200),
  slug: z
    .string()
    .min(2)
    .max(220)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  categoryId: z.string().optional().nullable(),
  description: z.string().min(10, "Deskripsi minimal 10 karakter").max(20000),
  thumbnail: z.string().max(500).optional().nullable(),
  technologies: z.array(z.string().max(60)).max(30).default([]),
  client: z.string().max(150).optional().nullable(),
  projectUrl: z.string().max(500).optional().nullable(),
  githubUrl: z.string().max(500).optional().nullable(),
  year: z.number().int().min(1990).max(2100).optional().nullable(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  seoTitle: z.string().max(200).optional().nullable(),
  seoDescription: z.string().max(320).optional().nullable(),
  images: z
    .array(
      z.object({
        url: z.string().max(500),
        alt: z.string().max(200).optional().nullable(),
        sortOrder: z.number().int().default(0),
      })
    )
    .max(30)
    .default([]),
});

export const journalSchema = z.object({
  title: z.string().min(2, "Judul minimal 2 karakter").max(200),
  slug: z
    .string()
    .min(2)
    .max(220)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(1, "Konten tidak boleh kosong").max(200000),
  featuredImage: z.string().max(500).optional().nullable(),
  categoryId: z.string().optional().nullable(),
  authorName: z.string().max(100).optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  publishedAt: z.string().optional().nullable(),
  seoTitle: z.string().max(200).optional().nullable(),
  seoDescription: z.string().max(320).optional().nullable(),
  canonicalUrl: z.string().max(500).optional().nullable(),
  ogImage: z.string().max(500).optional().nullable(),
  tags: z.array(z.string().max(40)).max(15).default([]),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi").max(100),
  slug: z
    .string()
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung")
    .optional(),
  description: z.string().max(500).optional().nullable(),
  type: z.enum(["portfolio", "journal"]),
});

export const mediaSchema = z.object({
  filename: z.string().max(300),
  url: z.string().min(1).max(1000),
  mimeType: z.string().max(100).optional().nullable(),
  size: z.number().int().optional().nullable(),
  alt: z.string().max(300).optional().nullable(),
});

export type PortfolioInput = z.infer<typeof portfolioSchema>;
export type JournalInput = z.infer<typeof journalSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
