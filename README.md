# ZDL — Zheng Digital Lab

Website resmi **ZDL (Zheng Digital Lab)** — digital development studio untuk
Web & App Development dan Digital Solutions. Dibangun dengan Next.js 16,
TypeScript, Tailwind CSS 4, shadcn/ui, Prisma, dan NextAuth.

## Fitur

### Website Publik
- **Home** — hero, layanan, keunggulan, proses kerja, portfolio unggulan, artikel terbaru, CTA WhatsApp
- **Services** (`/services`) — 6 kategori layanan + halaman detail per kategori (`/services/[slug]`) lengkap dengan manfaat, contoh penggunaan, dan Service structured data
- **Portfolio** (`/portfolio`) — dinamis dari database, filter kategori, halaman detail (`/portfolio/[slug]`) dengan galeri, teknologi, link project/GitHub, dan CreativeWork JSON-LD
- **ZDL Journal** (`/journal`) — artikel SEO, filter kategori, halaman detail (`/journal/[slug]`) dengan table of contents, share buttons, artikel terkait, prev/next, dan Article JSON-LD
- **About** — profil studio, prinsip kerja, Our Approach (7 tahap), area layanan (Local SEO)
- **Contact** — form konsultasi (tersimpan ke database + muncul di CMS), WhatsApp, email, social media

### CMS Admin (`/admin`)
- Login aman (NextAuth + bcrypt, sesi JWT 24 jam)
- Dashboard overview: statistik konten + aktivitas terbaru
- **Portfolio management** — CRUD penuh, publish/unpublish, featured/unfeatured, galeri, SEO fields
- **Journal management** — CRUD penuh, draft/publish, **scheduled publish** (isi tanggal publikasi masa depan), tag, SEO fields, canonical URL
- **Rich text editor** (MDXEditor) — heading, bold, italic, link, gambar, list, quote, code block, tabel, divider + shortcut markdown
  - Embed YouTube: tulis `{{youtube:VIDEO_ID}}` pada baris terpisah di konten
- **Category management** — kategori portfolio & journal
- **Media library** — upload gambar (self-hosted) atau tambah dari URL (serverless-friendly), dipakai di semua form
- **Inbox pesan** — pesan konsultasi dari form contact, tandai dibaca, balas langsung via email/WhatsApp

### SEO & Performa
- Metadata dinamis per halaman + canonical
- `sitemap.xml` dinamis (termasuk portfolio & journal dari database)
- `robots.txt` (admin & API di-disallow)
- JSON-LD: Organization (ProfessionalService), WebSite, BreadcrumbList, Article, CreativeWork, Service/ItemList
- Open Graph + Twitter Card (default image + per-artikel)
- Server Components untuk halaman konten (JavaScript client minimal)
- Image optimization + lazy loading via `next/image`
- Rate limiting pada form contact (3 pesan / 10 menit / IP)

## Akun Admin Default

> Dibuat oleh `prisma/seed.ts`

```
URL     : /admin/login
Email   : admin@zdl.my.id
Password: ZdlAdmin2026!
```

⚠️ **Ganti password ini segera** setelah deployment. Lihat bagian "Mengganti password admin" di bawah.

## Menjalankan Lokal

```bash
# 1. Install dependencies
bun install   # atau: npm install

# 2. Salin environment
cp .env.example .env
# edit .env — sesuaikan DATABASE_URL & NEXTAUTH_SECRET

# 3. Push schema + seed data awal
bunx prisma db push
bunx prisma generate
bun prisma/seed.ts

# 4. Jalankan
bun run dev   # atau: npm run dev
```

Buka `http://localhost:3000` — CMS di `http://localhost:3000/admin`.

## Deploy ke Vercel

1. **Database** — buat PostgreSQL gratis di [Neon](https://neon.tech) atau [Supabase](https://supabase.com), catat connection string.
   - Di Neon, pakai connection string **pooled** (yang mengandung `-pooler`) untuk `DATABASE_URL`.
2. **Import repo ke Vercel** — [vercel.com/new](https://vercel.com/new) → pilih repo `ZDL` → framework Next.js.
3. **Environment variables di Vercel** (Project Settings → Environment Variables) — WAJIB diisi **sebelum** deploy pertama:
   | Key | Value | Wajib? |
   |---|---|---|
   | `DATABASE_URL` | connection string Postgres (pooled) | ✅ |
   | `NEXTAUTH_SECRET` | secret acak (`openssl rand -base64 32`) | ✅ |
   | `NEXTAUTH_URL` | `https://www.zdl.my.id` (atau URL vercel.app) | ✅ |
   | `NEXT_PUBLIC_SITE_URL` | `https://zdl.my.id` | ✅ |
   | `ADMIN_EMAIL` | email akun admin CMS | opsional |
   | `ADMIN_PASSWORD` | password akun admin CMS | opsional |
   | `BLOB_READ_WRITE_TOKEN` | token Vercel Blob (Storage → Blob → connect) | opsional |
4. **Deploy** — build Vercel otomatis menjalankan (lihat `vercel.json`):
   - `prisma generate` dengan schema PostgreSQL (`prisma/schema.postgres.prisma`)
   - `prisma db push` — **membuat semua tabel otomatis** di database
   - `node scripts/seed-core.mjs` — **auto-seed akun admin + 20 kategori** (idempotent)
   - `next build`
   > Jika `DATABASE_URL` belum diset, build gagal dengan pesan yang jelas — tidak ada deploy "setengah jadi".
   > Halaman publik (home, portfolio, journal) dirender per-request (`force-dynamic`), jadi konten dari CMS langsung tampil tanpa redeploy.
5. **Media/upload di produksi** — filesystem serverless read-only. Dua opsi:
   - **Direkomendasikan**: aktifkan Vercel Blob (tab Storage di project Vercel → Create Database → Blob → connect ke project). Env `BLOB_READ_WRITE_TOKEN` otomatis ditambahkan, dan fitur upload di Media Library langsung menyimpan ke Blob CDN.
   - Alternatif: tab **"Dari URL"** di Media Library dengan storage eksternal (Cloudinary / S3).
6. **Custom domain** — tambahkan `zdl.my.id` + `www.zdl.my.id` di Vercel, arahkan DNS sesuai instruksi.

### Mengganti password admin

```bash
bun -e "const b=require('bcryptjs');console.log(b.hashSync('PASSWORD_BARU',12))"
```
Lalu jalankan SQL (Neon/Supabase SQL editor atau `prisma studio`):
```sql
UPDATE "User" SET "passwordHash" = '<hasil-hash-di-atas>' WHERE email = 'admin@zdl.my.id';
```

## Struktur Project

```
src/
├── app/
│   ├── (site)/               # Halaman publik (dengan navbar/footer)
│   │   ├── page.tsx          # Home
│   │   ├── services/         # Services + [slug]
│   │   ├── portfolio/        # Portfolio + [slug]
│   │   ├── journal/          # Journal + [slug]
│   │   ├── about/            # About
│   │   └── contact/          # Contact
│   ├── admin/                # CMS (protected)
│   │   ├── login/
│   │   └── (dashboard)/      # Overview, portfolios, journals, categories, media, messages
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── contact/          # Form publik + rate limit
│   │   └── admin/            # CRUD (semua route verifikasi sesi)
│   ├── sitemap.ts · robots.ts · layout.tsx · not-found.tsx
├── components/site/          # Navbar, footer, cards, editor render, CTA
├── components/admin/         # Forms, managers, sidebar, media picker
├── lib/                      # db, auth, queries, validators (zod), rate-limit, services-data
└── middleware.ts             # Proteksi route /admin/*
prisma/
├── schema.prisma             # SQLite (sandbox/dev)
├── schema.postgres.prisma    # PostgreSQL (produksi — dipakai otomatis oleh vercel.json)
└── seed.ts                   # Data awal + akun admin
vercel.json                   # Build command Vercel (prisma generate postgres + next build)
```

## Catatan Konten

- Data portfolio/journal yang tampil di website berasal dari database — kelola semuanya lewat CMS tanpa menyentuh source code.
- Data contoh (portfolio & artikel) ditandai "Contoh Project" — ganti/hapus melalui CMS.
- Nomor WhatsApp, email, dan konfigurasi brand terpusat di `src/lib/site.ts`.
