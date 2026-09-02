import {
  Globe,
  Smartphone,
  LayoutDashboard,
  FileSpreadsheet,
  TrendingUp,
  Server,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ServiceItem {
  name: string;
  description: string;
  benefits: string[];
  examples: string[];
}

export interface ServiceCategory {
  slug: string;
  icon: LucideIcon;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  benefits: string[];
  useCases: string[];
  items: ServiceItem[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "web-development",
    icon: Globe,
    name: "Web Development",
    shortName: "Web Development",
    tagline: "Website cepat, rapi, dan siap mendatangkan pelanggan.",
    description:
      "Kami membangun website yang bukan hanya tampil bagus, tetapi cepat diakses dari perangkat mobile, mudah dikelola, dan dirancang sejak awal dengan struktur SEO yang benar. Setiap halaman dikembangkan dengan fokus pada konversi — membantu pengunjung menjadi pelanggan.",
    benefits: [
      "Kecepatan loading optimal dengan Core Web Vitals hijau",
      "Struktur SEO teknis lengkap: metadata, sitemap, structured data",
      "Tampilan mobile-first yang nyaman di semua ukuran layar",
      "CMS untuk mengelola konten tanpa mengedit kode",
    ],
    useCases: [
      "Bisnis jasa yang butuh profil kredibel di Google",
      "Brand yang ingin mulai mendapat traffic organik",
      "Perusahaan yang website lamanya lambat dan sulit diupdate",
    ],
    items: [
      {
        name: "Landing Page",
        description:
          "Satu halaman dengan fokus konversi tinggi untuk kampanye iklan, peluncuran produk, atau penawaran jasa tertentu.",
        benefits: ["Muat sangat cepat", "Struktur copywriting menjual", "Terhubung WhatsApp / form"],
        examples: ["Landing page promo produk", "Halaman pre-launch aplikasi", "Halaman penawaran jasa B2B"],
      },
      {
        name: "Company Profile",
        description:
          "Website profil perusahaan lengkap: tentang, layanan, portofolio, dan artikel — membangun kepercayaan calon klien.",
        benefits: ["Kredibilitas di mata klien", "Konten mudah diperbarui via CMS", "SEO lokal untuk area layanan"],
        examples: ["Profil kontraktor & konstruksi", "Profil konsultan profesional", "Profil sekolah & komunitas"],
      },
      {
        name: "Web Application",
        description:
          "Aplikasi web custom yang berjalan di browser: sistem internal, booking, manajemen data, hingga platform bisnis.",
        benefits: ["Diakses dari perangkat apa pun", "Otomasi proses manual", "Skalabel sesuai pertumbuhan bisnis"],
        examples: ["Sistem booking klinik", "Aplikasi manajemen proyek internal", "Sistem peminjaman aset"],
      },
      {
        name: "E-Commerce",
        description:
          "Toko online dengan katalog produk, keranjang, checkout, integrasi pembayaran, dan panel admin yang lengkap.",
        benefits: ["Integrasi payment gateway lokal", "Manajemen stok & pesanan", "Mobile-first untuk pembeli dari HP"],
        examples: ["Toko online UMKM", "Katalog produk + order via WhatsApp", "Dropshipping & pre-order"],
      },
      {
        name: "Custom Website",
        description:
          "Website dengan kebutuhan khusus di luar template standar — kami rancang sesuai alur bisnis Anda.",
        benefits: ["Fitur sesuai kebutuhan unik", "Integrasi sistem pihak ketiga", "Arsitektur fleksibel untuk pengembangan"],
        examples: ["Website komunitas dengan membership", "Portal lowongan kerja", "Directory & listing bisnis"],
      },
    ],
  },
  {
    slug: "application-development",
    icon: Smartphone,
    name: "Application Development",
    shortName: "App Development",
    tagline: "Aplikasi custom yang mengotomasi dan menskalakan operasional.",
    description:
      "Dari aplikasi mobile hingga SaaS multi-tenant, kami membangun aplikasi yang menggantikan proses manual dan spreadsheet yang menumpuk. Setiap aplikasi dirancang dengan arsitektur yang sehat, aman, dan siap berkembang mengikuti bisnis Anda.",
    benefits: [
      "Proses bisnis terotomasi end-to-end",
      "Data terpusat dan aman dengan kontrol akses",
      "Teknologi modern yang mudah dirawat jangka panjang",
      "Integrasi dengan sistem yang sudah berjalan",
    ],
    useCases: [
      "Operasional yang masih mengandalkan Excel manual",
      "Bisnis yang butuh aplikasi untuk tim lapangan",
      "Ide produk digital yang ingin dibangun dari nol",
    ],
    items: [
      {
        name: "Mobile Application",
        description:
          "Aplikasi Android/iOS untuk pelanggan atau tim internal — katalog, absensi, sales tool, hingga layanan on-demand.",
        benefits: ["Bisa berjalan offline-first", "Push notification untuk engagement", "Terhubung ke backend terpusat"],
        examples: ["Aplikasi katalog untuk tim sales", "Aplikasi absensi & patroli lapangan", "Aplikasi layanan pelanggan"],
      },
      {
        name: "SaaS",
        description:
          "Platform software as a service multi-tenant: pelanggan Anda berlangganan, mengelola akunnya sendiri, dan Anda mengontrol semuanya dari satu admin.",
        benefits: ["Multi-tenant & subscription", "Dashboard admin & billing", "Skalabel dari 10 hingga 10.000 pengguna"],
        examples: ["Platform booking untuk klinik/salon", "SaaS manajemen membership", "Tool internal yang dijual ke industri serupa"],
      },
      {
        name: "CRM",
        description:
          "Customer relationship management yang disesuaikan alur penjualan Anda — follow-up, pipeline, dan riwayat interaksi pelanggan.",
        benefits: ["Pipeline sesuai proses sales Anda", "Reminder follow-up otomatis", "Laporan performa tim"],
        examples: ["CRM untuk agency digital", "CRM distribusi & reseller", "CRM edukasi/kursus"],
      },
      {
        name: "Management System",
        description:
          "Sistem manajemen operasional: inventori, keuangan, HR, proyek, aset — dirancang dari alur kerja nyata bisnis Anda.",
        benefits: ["Modul sesuai kebutuhan", "Approval workflow", "Audit trail aktivitas pengguna"],
        examples: ["Sistem inventori multi-gudang", "Manajemen proyek konstruksi", "Sistem keuangan komunitas"],
      },
      {
        name: "Custom Application",
        description:
          "Aplikasi dengan kombinasi fitur unik yang tidak tersedia di produk siap pakai — kami bangun dari nol sesuai spesifikasi Anda.",
        benefits: ["Eksak sesuai spesifikasi", "Kepemilikan penuh atas kode", "Evolusi bertahap per modul"],
        examples: ["Aplikasi monitoring IoT sederhana", "Sistem penilaian & ujian online", "Platform event & tiket"],
      },
    ],
  },
  {
    slug: "business-system",
    icon: LayoutDashboard,
    name: "Business System",
    shortName: "Business System",
    tagline: "Dashboard dan sistem internal yang benar-benar dipakai tim.",
    description:
      "Sistem internal yang baik mengubah data tersebar menjadi keputusan yang cepat. Kami membangun admin dashboard, CMS, dashboard monitoring, database system, dan automation yang menyatukan data bisnis Anda dalam satu sumber kebenaran.",
    benefits: [
      "Satu sumber data untuk semua tim",
      "Laporan real-time tanpa rekap manual",
      "Hak akses per peran (role-based access)",
      "Riwayat aktivitas untuk akuntabilitas",
    ],
    useCases: [
      "Rekap penjualan yang masih disusun manual tiap pagi",
      "Data tersebar di banyak file dan tidak sinkron",
      "Manajemen sulit memantau performa operasional",
    ],
    items: [
      {
        name: "Admin Dashboard",
        description:
          "Panel admin untuk mengelola data bisnis: transaksi, pengguna, produk, konten — dengan ringkasan KPI yang jelas.",
        benefits: ["KPI ringkas di halaman utama", "CRUD lengkap + pencarian & filter", "Ekspor data ke Excel/CSV"],
        examples: ["Admin panel e-commerce", "Dashboard manajemen konten", "Panel manajemen pengguna"],
      },
      {
        name: "CMS",
        description:
          "Content management system custom dengan rich text editor, media library, dan alur draft–review–publish.",
        benefits: ["Editor artikel yang nyaman", "Media library terpusat", "Jadwal publikasi otomatis"],
        examples: ["CMS jurnal/artikel korporat", "CMS portal berita internal", "CMS katalog produk"],
      },
      {
        name: "Dashboard Monitoring",
        description:
          "Dashboard pemantauan real-time: penjualan, okupansi, performa outlet, status perangkat, hingga KPI operasional.",
        benefits: ["Data selalu terbaru otomatis", "Alert ketika nilai di luar normal", "Tampilan TV/large screen"],
        examples: ["Monitoring penjualan multi-outlet", "Dashboard produksi harian", "Monitoring status server/aplikasi"],
      },
      {
        name: "Database System",
        description:
          "Perancangan dan implementasi database yang rapi: struktur tabel, relasi, backup, dan akses yang aman.",
        benefits: ["Struktur data yang sehat & cepat", "Backup & recovery plan", "Kolom audit createdAt/updatedAt"],
        examples: ["Migrasi data dari Excel ke database", "Redesign database aplikasi lama", "Data warehouse sederhana"],
      },
      {
        name: "Automation System",
        description:
          "Otomasi alur kerja: notifikasi otomatis, sinkronisasi antar sistem, generate dokumen, dan robot process sederhana.",
        benefits: ["Menghemat jam kerja manual", "Mengurangi human error", "Berjalan 24/7 tanpa pengawasan"],
        examples: ["Notifikasi order ke WhatsApp", "Generate invoice otomatis", "Sinkronisasi marketplace → spreadsheet"],
      },
    ],
  },
  {
    slug: "productivity",
    icon: FileSpreadsheet,
    name: "Productivity",
    shortName: "Productivity",
    tagline: "Excel dan Google Sheets yang bekerja untuk Anda, bukan sebaliknya.",
    description:
      "Spreadsheet masih menjadi alat kerja utama banyak bisnis — masalahnya bukan alatnya, tapi cara pakainya. Kami merapikan, mengotomasi, dan mengubah Excel serta Google Sheets menjadi sistem pelaporan dan operasional yang efisien.",
    benefits: [
      "Hemat puluhan jam kerja manual per bulan",
      "Laporan konsisten dengan format standar",
      "Formula rapi yang mudah dipahami tim",
      "Berjalan di tools yang sudah Anda miliki",
    ],
    useCases: [
      "Tim finance yang masih rekap manual tiap akhir bulan",
      "Data penjualan tersebar di banyak file",
      "Laporan yang formatnya berubah-ubah setiap bulan",
    ],
    items: [
      {
        name: "Microsoft Excel",
        description:
          "Pemodelan Excel profesional: struktur data, formula lanjutan, pivot, dan dashboard interaktif.",
        benefits: ["Template yang rapi & reusable", "Formula error-proof", "Dashboard ringkasan otomatis"],
        examples: ["Laporan keuangan bulanan", "Analisis penjualan per produk", "Perhitungan komisi tim"],
      },
      {
        name: "Google Sheets",
        description:
          "Google Sheets kolaboratif untuk tim: database sederhana, tracking, dan integrasi dengan Google Forms.",
        benefits: ["Kolaborasi real-time", "Terhubung dengan Forms & Apps Script", "Akses dari mana saja"],
        examples: ["Tracking pipeline sales", "Absensi & jadwal shift", "Monitoring stok gudang"],
      },
      {
        name: "Excel Automation",
        description:
          "Otomasi proses Excel dengan VBA/Office Scripts: import data, rekap otomatis, generate laporan sekali klik.",
        benefits: ["Sekali klik untuk laporan bulanan", "Konsolidasi multi-file otomatis", "Validasi data masuk"],
        examples: ["Auto-rekap transaksi harian", "Generate PO/invoice otomatis", "Import & cleaning data mentah"],
      },
      {
        name: "Google Sheets Automation",
        description:
          "Otomasi dengan Google Apps Script: trigger otomatis, kirim notifikasi, sinkronisasi antar sheet dan layanan Google.",
        benefits: ["Notifikasi otomatis via email/WhatsApp", "Sinkronisasi antar sheet", "Berjalan tanpa dibuka"],
        examples: ["Alert stok minimum otomatis", "Laporan harian terkirim otomatis", "Sinkronisasi form → database"],
      },
      {
        name: "Reporting System",
        description:
          "Sistem pelaporan end-to-end: data dikumpulkan otomatis, diolah, dan disajikan sebagai laporan yang siap dibaca manajemen.",
        benefits: ["Format laporan standar & konsisten", "Riwayat laporan tersimpan rapi", "Distribusi otomatis ke penerima"],
        examples: ["Laporan penjualan mingguan", "Laporan operasional bulanan", "Dashboard KPI manajemen"],
      },
    ],
  },
  {
    slug: "digital-growth",
    icon: TrendingUp,
    name: "Digital Growth",
    shortName: "Digital Growth",
    tagline: "Traffic organik dan iklan yang terukur, bukan sekadar ramai.",
    description:
      "Website yang bagus perlu ditemukan. Kami membantu bisnis mendapatkan traffic organik melalui SEO yang benar — teknis, on-page, dan off-page — serta kampanye iklan digital yang fokus pada hasil yang terukur, bukan keyword stuffing.",
    benefits: [
      "Audit SEO teknis yang menyeluruh",
      "Konten dan struktur yang ramah mesin pencari",
      "Laporan progres yang transparan",
      "Iklan dengan target CPA yang jelas",
    ],
    useCases: [
      "Website bagus tapi tidak muncul di Google",
      "Ingin mendapat leads tanpa bergantung pada iklan terus-menerus",
      "Iklan berjalan tapi konversinya tidak jelas",
    ],
    items: [
      {
        name: "SEO",
        description:
          "Strategi SEO menyeluruh: riset keyword, optimasi konten, dan perbaikan teknis untuk jangka panjang.",
        benefits: ["Riset keyword berbasis intent", "Roadmap konten bulanan", "Monitoring posisi & traffic"],
        examples: ["SEO untuk jasa lokal", "SEO untuk toko online", "SEO untuk bisnis B2B"],
      },
      {
        name: "Technical SEO",
        description:
          "Perbaikan fondasi teknis: kecepatan, crawlability, indexing, schema, Core Web Vitals, dan struktur internal link.",
        benefits: ["Site yang mudah di-crawl", "Core Web Vitals hijau", "Fix error indexing di Search Console"],
        examples: ["Audit teknis website lama", "Perbaikan sitemap & robots", "Implementasi structured data"],
      },
      {
        name: "SEO On-Page",
        description:
          "Optimasi di halaman: title, heading, konten, internal linking, dan struktur informasi yang sesuai search intent.",
        benefits: ["Halaman menjawab search intent", "Metadata yang menarik klik", "Struktur heading yang benar"],
        examples: ["Optimasi halaman layanan", "Rewrite artikel lama", "Optimasi halaman produk"],
      },
      {
        name: "SEO Off-Page & Backlink",
        description:
          "Membangun otoritas domain melalui backlink yang berkualitas dan relevan — tanpa spam, tanpa PBN murahan.",
        benefits: ["Backlink dari situs relevan", "Profil link yang natural", "Meningkatkan otoritas domain"],
        examples: ["Guest posting di media lokal", "Listing directory bisnis", "Digital PR kecil-menengah"],
      },
      {
        name: "Google Ads & Digital Advertising",
        description:
          "Kampanye iklan digital yang terukur: penargetan tepat, copy yang menjual, dan laporan yang jujur.",
        benefits: ["Target audience yang presisi", "Landing page yang nyambung dengan iklan", "Laporan biaya per hasil"],
        examples: ["Search Ads untuk jasa", "Ads untuk produk e-commerce", "Retargeting pengunjung website"],
      },
    ],
  },
  {
    slug: "infrastructure",
    icon: Server,
    name: "Infrastructure",
    shortName: "Infrastructure",
    tagline: "Domain, hosting, email profesional — semua disiapkan rapi.",
    description:
      "Infrastruktur yang benar sering terlihat 'tidak terlihat' — website yang selalu online, email profesional dengan nama domain sendiri, dan SSL yang membuat pengunjung aman. Kami menyiapkan dan mengelolanya untuk Anda.",
    benefits: [
      "Setup benar sejak awal, aman jangka panjang",
      "Email profesional dengan domain sendiri",
      "SSL & deployment otomatis",
      "Tidak perlu pusing urusan teknis",
    ],
    useCases: [
      "Bisnis baru yang baru mau punya domain & website",
      "Email masih memakai @gmail.com untuk komunikasi bisnis",
      "Website lambat karena hosting tidak sesuai",
    ],
    items: [
      {
        name: "Domain",
        description: "Registrasi dan pengelolaan domain (.my.id, .id, .com, dll.) atas nama Anda sendiri.",
        benefits: ["Kepemilikan atas nama Anda", "Konfigurasi DNS rapi", "Pengingat perpanjangan"],
        examples: ["Registrasi domain baru", "Migrasi domain antar registrar", "Setup subdomain untuk sistem"],
      },
      {
        name: "Hosting",
        description: "Rekomendasi dan setup hosting yang sesuai kebutuhan dan anggaran — VPS, cloud, atau platform modern.",
        benefits: ["Performa sesuai kebutuhan", "Skalabel saat traffic naik", "Backup terjadwal"],
        examples: ["Setup hosting untuk company profile", "Migrasi hosting tanpa downtime", "Optimasi hosting lambat"],
      },
      {
        name: "SSL",
        description: "Pemasangan sertifikat SSL (HTTPS) agar website terpercaya dan aman di mata pengunjung maupun Google.",
        benefits: ["Indikator gembok aman", "Syarat ranking SEO", "Auto-renewal"],
        examples: ["Pasang SSL baru", "Perbaiki mixed content", "Redirect HTTP → HTTPS"],
      },
      {
        name: "Professional Email",
        description: "Email profesional dengan domain sendiri (nama@bisnisanda.com) menggunakan Google Workspace/Zoho.",
        benefits: ["Kredibilitas komunikasi bisnis", "Sinkron dengan HP & laptop", "Kuota dan anti-spam memadai"],
        examples: ["Setup email @zdl.my.id", "Migrasi email lama", "Setup email tim & alias"],
      },
      {
        name: "Deployment",
        description: "Deployment aplikasi modern ke platform cloud (Vercel, VPS) dengan pipeline CI/CD yang rapi.",
        benefits: ["Update aplikasi tanpa downtime", "Preview environment", "Rollback yang mudah"],
        examples: ["Deploy Next.js ke Vercel", "Setup CI/CD GitHub", "Deploy ke VPS sendiri"],
      },
    ],
  },
];

export function getServiceCategory(slug: string) {
  return serviceCategories.find((c) => c.slug === slug);
}
