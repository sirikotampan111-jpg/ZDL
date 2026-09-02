/* ZDL seed script — run with: bun prisma/seed.ts */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const portfolioCategories = [
  { name: "Website", slug: "website", description: "Landing page, company profile, e-commerce, dan custom website." },
  { name: "Web App", slug: "web-app", description: "Aplikasi web custom untuk kebutuhan bisnis." },
  { name: "Mobile App", slug: "mobile-app", description: "Aplikasi mobile Android & iOS." },
  { name: "E-Commerce", slug: "e-commerce", description: "Toko online dan platform jual-beli." },
  { name: "SaaS", slug: "saas", description: "Software as a Service untuk berbagai industri." },
  { name: "Dashboard", slug: "dashboard", description: "Admin dashboard, monitoring, dan reporting." },
  { name: "CMS", slug: "cms", description: "Content management system custom." },
  { name: "Game", slug: "game", description: "Game interaktif dan gamifikasi." },
  { name: "Automation", slug: "automation", description: "Otomasi proses bisnis dan workflow." },
  { name: "Other", slug: "other", description: "Project digital lainnya." },
];

const journalCategories = [
  { name: "Web Development", slug: "web-development" },
  { name: "Mobile Development", slug: "mobile-development" },
  { name: "AI", slug: "ai" },
  { name: "Programming", slug: "programming" },
  { name: "SEO", slug: "seo" },
  { name: "Digital Marketing", slug: "digital-marketing" },
  { name: "Business", slug: "business" },
  { name: "Technology", slug: "technology" },
  { name: "Tutorial", slug: "tutorial" },
  { name: "Case Study", slug: "case-study" },
];

async function main() {
  console.log("Seeding ZDL database...");

  // ---------- Admin user ----------
  const email = process.env.ADMIN_EMAIL || "admin@zdl.my.id";
  const password = process.env.ADMIN_PASSWORD || "ZdlAdmin2026!";
  const passwordHash = await bcrypt.hash(password, 12);
  await db.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "ZDL Admin", passwordHash, role: "ADMIN" },
  });
  console.log(`Admin user ready: ${email}`);

  // ---------- Categories ----------
  for (const c of portfolioCategories) {
    await db.portfolioCategory.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }
  for (const c of journalCategories) {
    await db.journalCategory.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }
  console.log("Categories ready");

  const pc = Object.fromEntries((await db.portfolioCategory.findMany()).map((c) => [c.slug, c.id]));
  const jc = Object.fromEntries((await db.journalCategory.findMany()).map((c) => [c.slug, c.id]));
  const admin = await db.user.findUnique({ where: { email } });

  // ---------- Portfolios ----------
  const portfolios = [
    {
      title: "Sistem Manajemen Inventori Retail",
      slug: "sistem-manajemen-inventori-retail",
      category: "dashboard",
      description:
        "Aplikasi web untuk mengelola stok, pembelian, dan penjualan multi-outlet secara real-time. Dilengkapi dashboard monitoring, laporan otomatis, serta sistem notifikasi ketika stok berada di bawah ambang minimum. Dibangun agar tim gudang dan manajemen dapat bekerja dari satu sumber data yang sama tanpa rekonsiliasi manual.",
      technologies: JSON.stringify(["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"]),
      client: "Contoh Project — ganti melalui CMS",
      year: 2025,
      featured: true,
      thumbnail: "/placeholders/portfolio-dashboard.png",
      seoTitle: "Studi Kasus: Sistem Manajemen Inventori Retail | ZDL",
      seoDescription:
        "Contoh pengembangan sistem inventori retail dengan dashboard monitoring real-time, laporan otomatis, dan manajemen multi-outlet oleh ZDL.",
    },
    {
      title: "Company Profile Perusahaan Konstruksi",
      slug: "company-profile-konstruksi",
      category: "website",
      description:
        "Website company profile modern dengan struktur konten yang mudah dikelola, optimasi Core Web Vitals, dan struktur SEO yang lengkap. Halaman proyek, layanan, dan artikel dikontrol melalui CMS sehingga tim internal dapat mempublikasikan update tanpa menyentuh kode.",
      technologies: JSON.stringify(["Next.js", "Tailwind CSS", "CMS", "SEO"]),
      client: "Contoh Project — ganti melalui CMS",
      year: 2025,
      featured: true,
      thumbnail: "/placeholders/portfolio-website.png",
      seoTitle: "Studi Kasus: Company Profile Konstruksi | ZDL",
      seoDescription: "Contoh pengembangan website company profile dengan CMS dan optimasi SEO oleh ZDL.",
    },
    {
      title: "Platform E-Commerce UMKM",
      slug: "platform-e-commerce-umkm",
      category: "e-commerce",
      description:
        "Toko online untuk UMKM dengan katalog produk, keranjang, checkout, integrasi pembayaran, dan panel admin untuk mengelola produk serta pesanan. Dirancang mobile-first karena mayoritas pengunjung berasal dari perangkat mobile.",
      technologies: JSON.stringify(["Next.js", "PostgreSQL", "Midtrans", "Tailwind CSS"]),
      client: "Contoh Project — ganti melalui CMS",
      year: 2024,
      featured: true,
      thumbnail: "/placeholders/portfolio-e-commerce.png",
      seoTitle: "Studi Kasus: Platform E-Commerce UMKM | ZDL",
      seoDescription: "Contoh pengembangan toko online UMKM lengkap dengan payment gateway dan panel admin oleh ZDL.",
    },
    {
      title: "Aplikasi Kasir (POS) Multi-Device",
      slug: "aplikasi-kasir-pos-multi-device",
      category: "web-app",
      description:
        "Aplikasi point-of-sale yang dapat dijalankan dari browser desktop maupun tablet, dengan sinkronisasi data real-time, manajemen shift kasir, dan rekap penjualan harian. Dibangun dengan pendekatan offline-tolerant agar transaksi tetap berjalan saat koneksi tidak stabil.",
      technologies: JSON.stringify(["React", "Node.js", "SQLite", "PWA"]),
      client: "Contoh Project — ganti melalui CMS",
      year: 2024,
      featured: false,
      thumbnail: "/placeholders/portfolio-web-app.png",
      seoTitle: "Studi Kasus: Aplikasi Kasir POS Multi-Device | ZDL",
      seoDescription: "Contoh aplikasi kasir multi-device dengan sinkronisasi real-time oleh ZDL.",
    },
    {
      title: "SaaS Booking & Scheduling",
      slug: "saas-booking-scheduling",
      category: "saas",
      description:
        "Platform SaaS untuk bisnis jasa (klinik, salon, bengkel) yang mencakup sistem booking online, manajemen jadwal staf, pengingat otomatis via WhatsApp, dan dasbor analitik okupansi. Arsitektur multi-tenant memungkinkan setiap bisnis mengelola operasionalnya sendiri.",
      technologies: JSON.stringify(["Next.js", "PostgreSQL", "Prisma", "Fonnte API"]),
      client: "Contoh Project — ganti melalui CMS",
      year: 2024,
      featured: true,
      thumbnail: "/placeholders/portfolio-saas.png",
      seoTitle: "Studi Kasus: SaaS Booking & Scheduling | ZDL",
      seoDescription: "Contoh platform SaaS booking multi-tenant dengan pengingat WhatsApp oleh ZDL.",
    },
    {
      title: "Otomasi Laporan Keuangan Excel",
      slug: "otomasi-laporan-keuangan-excel",
      category: "automation",
      description:
        "Sistem otomasi berbasis Excel dan Google Sheets untuk merapikan data transaksi mentah menjadi laporan keuangan bulanan: rekonsiliasi, konsolidasi multi-sheet, dan dashboard ringkasan. Menghemat puluhan jam kerja manual setiap bulan.",
      technologies: JSON.stringify(["Microsoft Excel", "VBA", "Google Sheets", "Apps Script"]),
      client: "Contoh Project — ganti melalui CMS",
      year: 2023,
      featured: false,
      thumbnail: "/placeholders/portfolio-automation.png",
      seoTitle: "Studi Kasus: Otomasi Laporan Keuangan Excel | ZDL",
      seoDescription: "Contoh otomasi pelaporan keuangan berbasis Excel dan Google Sheets oleh ZDL.",
    },
    {
      title: "Aplikasi Mobile Katalog Produk",
      slug: "aplikasi-mobile-katalog-produk",
      category: "mobile-app",
      description:
        "Aplikasi mobile untuk tim sales menampilkan katalog produk, stok tersedia, dan harga tier, lengkap dengan mode offline agar tetap bisa dipresentasikan di lapangan. Terhubung ke backend yang sama dengan sistem web perusahaan.",
      technologies: JSON.stringify(["React Native", "REST API", "PostgreSQL"]),
      client: "Contoh Project — ganti melalui CMS",
      year: 2023,
      featured: false,
      thumbnail: "/placeholders/portfolio-mobile-app.png",
      seoTitle: "Studi Kasus: Aplikasi Mobile Katalog Produk | ZDL",
      seoDescription: "Contoh aplikasi mobile katalog untuk tim sales dengan mode offline oleh ZDL.",
    },
    {
      title: "CMS Portal Berita Internal",
      slug: "cms-portal-berita-internal",
      category: "cms",
      description:
        "Content management system untuk portal informasi internal perusahaan dengan alur review artikel, manajemen media, dan kontrol peran pengguna. Tim konten dapat menulis, menjadwalkan, dan mempublikasikan artikel sepenuhnya tanpa campur tangan developer.",
      technologies: JSON.stringify(["Next.js", "Rich Text Editor", "PostgreSQL", "Role-based Access"]),
      client: "Contoh Project — ganti melalui CMS",
      year: 2024,
      featured: false,
      thumbnail: "/placeholders/portfolio-cms.png",
      seoTitle: "Studi Kasus: CMS Portal Berita Internal | ZDL",
      seoDescription: "Contoh CMS internal dengan alur review artikel dan manajemen media oleh ZDL.",
    },
  ];

  for (const p of portfolios) {
    const { category, ...rest } = p;
    const data = { ...rest, categoryId: pc[category] ?? null };
    await db.portfolio.upsert({ where: { slug: p.slug }, update: {}, create: data });
  }
  console.log("Portfolios ready");

  // ---------- Journal articles ----------
  const articles = [
    {
      title: "Jasa Pembuatan Website: Panduan Lengkap untuk Bisnis di Indonesia",
      slug: "jasa-pembuatan-website-panduan-lengkap",
      category: "web-development",
      excerpt:
        "Sebelum memesan website, pahami proses, biaya, dan hal-hal yang sering diabaikan. Panduan praktis ini membantu pemilik bisnis memutuskan dengan tepat.",
      content: `## Mengapa Bisnis Butuh Website Profesional

Website bukan lagi sekadar "kartu nama digital". Bagi kebanyakan calon pelanggan hari ini, website adalah titik pertama mereka menilai kredibilitas sebuah bisnis. Ketika seseorang mencari produk atau jasa di Google, bisnis yang tidak muncul — atau tampil dengan website yang lambat dan tidak rapi — praktis tidak ada bagi mereka.

Website profesional memberikan tiga hal sekaligus: **kredibilitas**, **jalur penjualan 24 jam**, dan **aset marketing jangka panjang**. Konten yang Anda publikasikan hari ini bisa jadi sumber trafik organik bertahun-tahun ke depan, sesuatu yang tidak bisa diberikan oleh sekadar akun media sosial.

## Jenis Website yang Umum Dibutuhkan

Setiap kebutuhan bisnis berbeda, dan jenis website-nya pun berbeda:

- **Landing page** — fokus satu tujuan: konversi. Cocok untuk kampanye iklan atau peluncuran produk tertentu.
- **Company profile** — membangun kepercayaan dengan menampilkan profil, layanan, portofolio, dan cara kontak.
- **E-commerce** — toko online lengkap dengan katalog, keranjang, dan pembayaran.
- **Web application** — sistem operasional seperti booking, kasir, manajemen stok, atau dashboard internal.

Salah satu kesalahan paling umum adalah membangun jenis yang salah: misalnya membuat company profile padahal kebutuhan sesungguhnya adalah sistem booking. Tentukan tujuan utama terlebih dahulu, baru pilih bentuknya.

## Proses Pengerjaan yang Sehat

Pengerjaan website profesional biasanya melewati tahapan berikut:

1. **Discovery** — memahami bisnis, target audiens, dan tujuan pengukuran.
2. **Perencanaan** — menentukan struktur halaman (sitemap), fitur, dan prioritas.
3. **Desain** — menyusun tampilan yang konsisten dengan brand dan nyaman digunakan di mobile.
4. **Pengembangan** — membangun website dengan teknologi yang tepat, teruji, dan mudah dirawat.
5. **Pengujian** — memeriksa fungsionalitas, kecepatan, dan kompatibilitas perangkat.
6. **Deployment** — memasang website ke domain dan hosting Anda.
7. **Pemeliharaan** — update konten, backup, dan perbaikan berkelanjutan.

Tahapan yang jelas melindungi kedua belah pihak: Anda tahu apa yang sedang dikerjakan, developer tahu apa yang harus diserahkan.

## Hal yang Sering Diabaikan (Padahal Penting)

- **Kecepatan di jaringan mobile.** Mayoritas pengunjung dari Indonesia mengakses website lewat ponsel dengan koneksi yang bervariasi. Website yang berat di 4G akan kehilangan pengunjung sebelum halaman selesai dimuat.
- **SEO teknis sejak awal.** Struktur URL, metadata, sitemap, dan structured data sebaiknya dirancang dari awal — bukan ditempel belakangan.
- **CMS untuk tim non-teknis.** Jika mengubah satu kalimat harus menghubungi developer, konten website akan cepat usang.
- **Kepemilikan aset.** Pastikan domain, hosting, dan kode berada di bawah nama Anda.

## Bagaimana Memilih Penyedia Jasa

Gunakan tiga pertanyaan ini sebagai filter sederhana: Portofolio mereka relevan dengan kebutuhan Anda? Mereka menjelaskan teknologi dan alasannya dengan bahasa yang bisa dipahami? Setelah serah terima, Anda bisa mengelola konten sendiri?

Jika ketiga jawabannya "ya", kemungkinan besar Anda berbicara dengan pihak yang bekerja dengan proses yang benar. Mulailah dari konsultasi kecil — jelaskan kebutuhan Anda, dan lihat apakah rekomendasi mereka masuk akal, bukan sekadar menawarkan paket paling mahal.`,
      tags: ["website", "bisnis", "panduan"],
      featuredImage: "/placeholders/journal-0.png",
      status: "PUBLISHED",
    },
    {
      title: "Custom Software vs Aplikasi Instant: Mana yang Cocok untuk Bisnis Anda?",
      slug: "custom-software-vs-aplikasi-instant",
      category: "business",
      excerpt:
        "Platform instant cepat dan murah di awal, custom software fleksibel dan jangka panjang. Artikel ini membedah trade-off keduanya dengan contoh nyata.",
      content: `## Dua Jalan yang Berbeda

Ketika bisnis butuh sistem digital, ada dua jalur utama: menggunakan **platform instant** (template, SaaS siap pakai, low-code) atau membangun **custom software** sesuai proses bisnis Anda. Keduanya valid — yang membedakan adalah konteks penggunaannya.

## Keunggulan Platform Instant

Platform instant menang di tiga hal: kecepatan (bisa jalan dalam hitungan hari), biaya awal yang rendah, dan pemeliharaan yang ditangani vendor. Untuk kebutuhan standar — misalnya form pendaftaran sederhana atau toko online kecil — ini sering kali pilihan paling masuk akal.

## Kapan Custom Software Menjadi Pilihan yang Tepat

Custom software mulai masuk akal ketika:

- **Proses bisnis Anda unik.** Jika Anda menemukan diri "menumpangkan" proses bisnis ke fitur yang disediakan platform, biaya kerja manualnya akan terus membesar.
- **Data dan integrasi penting.** Sistem yang harus terhubung dengan gudang, akuntansi, atau WhatsApp otomatis butuh kontrol penuh.
- **Skala pertumbuhan.** Biaya platform instant biasanya naik seiring pemakaian; custom software justru makin efisien seiring waktu.
- **Kepemilikan penuh.** Anda tidak tergantung kebijakan harga atau keberlangsungan vendor pihak ketiga.

## Menghitung Biaya Secara Jujur

Perbandingan yang adil bukan harga awal, melainkan **total biaya kepemilikan** (total cost of ownership): biaya awal + biaya bulanan + biaya kerja manual + risiko migrasi. Platform instant dengan langganan Rp 2 juta/bulan selama tiga tahun berarti Rp 72 juta — belum termasuk kenaikan harga dan biaya kerja manual yang tidak terotomasi.

## Rekomendasi Praktis

Mulai dari yang sederhana: petakan proses bisnis Anda, hitung waktu yang hilang karena kerja manual, lalu tanyakan pada diri sendiri — apakah platform instant bisa menutup 80% kebutuhan tanpa pemaksaan? Jika ya, gunakan dulu. Jika tidak, investasikan pada custom software dengan tahapan bertahap: bangun modul paling kritis dulu, ukur hasilnya, lalu kembangkan.`,
      tags: ["saas", "software", "strategi"],
      featuredImage: "/placeholders/journal-1.png",
      status: "PUBLISHED",
    },
    {
      title: "SEO Teknis: Checklist yang Sering Terlewat Saat Website Dibangun",
      slug: "seo-teknis-checklist-website",
      category: "seo",
      excerpt:
        "Banyak masalah SEO sebenarnya lahir sejak website dibangun. Ini checklist teknis yang kami terapkan di setiap project — dari metadata hingga structured data.",
      content: `## SEO Dimulai dari Ruang Kode

Banyak bisnis menganggap SEO sebagai pekerjaan setelah website jadi: pasang plugin, isi keyword, selesai. Kenyataannya, sebagian besar keputusan SEO paling berpengaruh dibuat **saat website sedang dibangun** — struktur URL, arsitektur halaman, kecepatan render, dan cara konten disajikan ke mesin pencari.

## Checklist Teknis Wajib

### 1. Metadata Dinamis per Halaman

Setiap halaman harus punya **title** dan **meta description** unik yang mencerminkan isinya. Untuk situs dengan ratusan halaman (produk, artikel, portofolio), metadata sebaiknya digenerate dari data — bukan ditulis manual satu per satu.

### 2. URL yang Stabil dan Deskriptif

URL seperti \`/journal/seo-teknis-checklist\` jauh lebih baik daripada \`/post?id=123\`. Ubah URL sekali saja di awal; mengubahnya setelah terindeks berarti kehilangan trafik.

### 3. Sitemap dan Robots

\`sitemap.xml\` harus dibuat dinamis — otomatis memuat halaman baru begitu dipublikasikan. \`robots.txt\` memblokir area admin dan API, sambil membuka seluruh konten publik.

### 4. Structured Data (JSON-LD)

Schema membantu mesin pencari memahami konteks: **Organization** untuk identitas bisnis, **Article** untuk jurnal, **BreadcrumbList** untuk navigasi, dan **Service** untuk halaman layanan. Ini fondasi untuk tampilan hasil pencarian yang lebih kaya.

### 5. Core Web Vitals

- **LCP** (Large Contentful Paint) — seberapa cepat konten utama tampil. Optimasi gambar hero dan font.
- **CLS** (Cumulative Layout Shift) — hindari elemen yang "melompat" saat halaman memuat.
- **INP** (Interaction to Next Paint) — respons cepat saat pengguna berinteraksi.

Server-side rendering dan image optimization menyelesaikan sebagian besar masalah ini sejak awal.

### 6. Heading yang Hierarkis

Satu \`h1\` per halaman, lalu \`h2\`/\`h3\` yang tersusun logis. Ini membantu mesin pencari (dan pembaca) memahami struktur konten Anda.

## Kesalahan yang Paling Sering Kami Temui

Saat mengaudit website klien, tiga masalah paling sering muncul: gambar tanpa optimasi (3–5 MB per foto), metadata duplikat di semua halaman, dan halaman penting yang tidak tertaut dari navigasi mana pun. Ketiganya mudah dicegah jika SEO dipikirkan sejak desain.

## Kesimpulan

SEO teknis bukan sulap — ia adalah konsekuensi dari fondasi yang dibangun benar. Website yang cepat, terstruktur, dan mudah di-crawl akan selalu lebih mudah dioptimasi daripada website yang diperbaiki setengah jalan. Jika Anda sedang membangun website baru, pastikan checklist ini masuk ke dalam lingkup pengerjaan sejak hari pertama.`,
      tags: ["seo", "web development", "checklist"],
      featuredImage: "/placeholders/journal-2.png",
      status: "PUBLISHED",
    },
    {
      title: "Membangun Dashboard Bisnis yang Benar-Benar Dipakai (Bukan Sekadar Cantik)",
      slug: "membangun-dashboard-bisnis-yang-dipakai",
      category: "case-study",
      excerpt:
        "Dashboard gagal bukan karena tampilannya, tapi karena datanya. Pelajari prinsip membangun dashboard monitoring yang benar-benar dipakai tim setiap hari.",
      content: `## Masalah yang Familiar

Banyak bisnis pernah berinvestasi pada dashboard yang akhirnya ditinggalkan: tampilannya bagus saat demo, tapi tiga bulan kemudian tim kembali ke spreadsheet. Penyebabnya hampir selalu sama — dashboard itu menjawab pertanyaan yang tidak pernah ditanyakan tim.

## Mulai dari Pertanyaan, Bukan dari Grafik

Dashboard yang baik dimulai dari daftar **keputusan** yang harus diambil setiap hari atau setiap minggu. Contoh untuk bisnis retail: produk mana yang harus direstock minggu ini? Outlet mana yang performanya turun? Tim kasir mana yang perlu pelatihan?

Setiap pertanyaan itu menerjemahkan menjadi satu atau dua visual — tidak lebih. Grafik yang tidak terhubung ke keputusan adalah dekorasi.

## Prinsip yang Kami Terapkan

### 1. Satu Sumber Data

Semua angka harus berasal dari sumber yang sama dengan sistem operasional. Jika dashboard menarik data dari salinan manual, angkanya akan selalu diragukan — dan dashboard yang diragukan tidak akan dipakai.

### 2. Data Terbaru, Otomatis

Update manual adalah pembunuh dashboard yang paling senyap. Integrasi langsung dengan database atau API operasional membuat dashboard selalu menampilkan kondisi terkini tanpa langkah tambahan.

### 3. Ringkasan di Atas, Detail di Bawah

Struktur yang terbukti bekerja: ringkasan KPI di bagian atas (3–6 angka utama), tren di tengah, tabel detail interaktif di bawah. Pengguna bisa berhenti di level mana pun sesuai kebutuhan.

### 4. Akses Sesuai Peran

Pemilik bisnis, manajer, dan staf tidak butuh tampilan yang sama. Kontrol akses per peran menjaga dashboard relevan bagi tiap pengguna — sekaligus aman.

## Studi Kasus Mini: Dashboard Multi-Outlet

Pada salah satu project, kami membangun dashboard untuk bisnis dengan beberapa outlet. Sebelumnya, rekap penjualan disusun manual setiap pagi — butuh 1–2 jam kerja staf. Setelah dashboard berjalan, rekap tersedia real-time dan tim manajemen mulai memakai data untuk keputusan restock harian. Nilai dashboard-nya bukan pada grafiknya, melainkan pada **jam kerja yang kembali** dan keputusan yang lebih cepat.

## Kesimpulan

Bangun dashboard dari keputusan bisnis, sambungkan ke sumber data resmi, dan jaga tetap sederhana. Teknologi terbaik pun tidak menyelamatkan dashboard yang menjawab pertanyaan yang salah.`,
      tags: ["dashboard", "bisnis", "case study"],
      featuredImage: "/placeholders/journal-3.png",
      status: "PUBLISHED",
    },
  ];

  for (const a of articles) {
    const tagNames: string[] = a.tags;
    const existing = await db.journal.findUnique({ where: { slug: a.slug } });
    if (existing) continue;

    const created = await db.journal.create({
      data: {
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        content: a.content,
        featuredImage: a.featuredImage,
        categoryId: jc[a.category] ?? null,
        authorId: admin?.id ?? null,
        authorName: "Tim ZDL",
        status: a.status,
        publishedAt: new Date(Date.now() - articles.indexOf(a) * 86400000 * 7),
        seoTitle: `${a.title} | ZDL Journal`,
        seoDescription: a.excerpt,
      },
    });
    for (const t of tagNames) {
      const slug = t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const tag = await db.tag.upsert({ where: { slug }, update: {}, create: { name: t, slug } });
      await db.journalTag.create({ data: { journalId: created.id, tagId: tag.id } });
    }
  }
  console.log("Journal articles ready");

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
