/**
 * ZDL — Content seed (production-safe, idempotent)
 * Runs during Vercel build AFTER seed-core.mjs.
 *
 * Fills the site with starting content so no page feels "empty":
 *   - 6 portfolio case studies (published, with placeholder images)
 *   - 6 journal articles     (published, full markdown, tagged)
 *
 * Upsert semantics: existing slugs are NEVER overwritten, so any edits
 * made through the CMS are safe across redeploys.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/* ------------------------------------------------------------------ */
/* PORTFOLIO                                                           */
/* ------------------------------------------------------------------ */
const portfolios = [
  {
    slug: "website-company-profile-modern",
    title: "Website Company Profile Modern",
    categorySlug: "website",
    description:
      "Company profile satu halaman dengan struktur naratif yang rapi: keunggulan layanan, alur kerja, portofolio ringkas, dan CTA WhatsApp langsung. Dibangun dengan Next.js agar cepat dan ramah SEO.",
    thumbnail: "/placeholders/portfolio-website.png",
    client: "Usaha jasa lokal",
    year: 2025,
    featured: true,
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    body: [
      { url: "/placeholders/portfolio-website.png", alt: "Tampilan halaman utama" },
      { url: "/placeholders/portfolio-cms.png", alt: "Halaman admin CMS" },
    ],
  },
  {
    slug: "toko-online-fashion",
    title: "Toko Online Fashion Multivendor",
    categorySlug: "e-commerce",
    description:
      "Platform toko online dengan katalog produk, keranjang, checkout, dan panel admin untuk mengelola stok maupun pesanan. Fokus pada kecepatan halaman dan pengalaman mobile.",
    thumbnail: "/placeholders/portfolio-e-commerce.png",
    client: "Brand fashion UMKM",
    year: 2025,
    featured: true,
    technologies: ["Next.js", "PostgreSQL", "Prisma", "Midtrans"],
    body: [
      { url: "/placeholders/portfolio-e-commerce.png", alt: "Katalog produk" },
      { url: "/placeholders/portfolio-dashboard.png", alt: "Dashboard pesanan" },
    ],
  },
  {
    slug: "dashboard-admin-laporan",
    title: "Dashboard Admin & Laporan Penjualan",
    categorySlug: "dashboard",
    description:
      "Dashboard internal untuk memantau penjualan harian, performa produk, dan aktivitas tim. Data divisualisasikan dengan grafik interaktif dan dapat diekspor untuk laporan bulanan.",
    thumbnail: "/placeholders/portfolio-dashboard.png",
    client: "Distributor ritel",
    year: 2024,
    featured: false,
    technologies: ["React", "Recharts", "Node.js", "PostgreSQL"],
    body: [{ url: "/placeholders/portfolio-dashboard.png", alt: "Grafik penjualan" }],
  },
  {
    slug: "aplikasi-kasir-mobile",
    title: "Aplikasi Kasir (POS) Mobile",
    categorySlug: "mobile-app",
    description:
      "Aplikasi kasir untuk usaha kuliner: input pesanan, pembagian meja, struk digital, dan rekap penjualan harian. Berjalan di Android dengan mode offline saat koneksi terputus.",
    thumbnail: "/placeholders/portfolio-mobile-app.png",
    client: "Jaringan kedai kopi",
    year: 2024,
    featured: false,
    technologies: ["React Native", "SQLite", "REST API"],
    body: [{ url: "/placeholders/portfolio-mobile-app.png", alt: "Layar kasir" }],
  },
  {
    slug: "sistem-booking-online",
    title: "Sistem Booking Online Usaha Jasa",
    categorySlug: "web-app",
    description:
      "Sistem reservasi jadwal dengan kalender ketersediaan, konfirmasi otomatis via WhatsApp, dan panel pengelolaan pesanan. Mengurangi bolak-balik chat saat penjadwalan.",
    thumbnail: "/placeholders/portfolio-web-app.png",
    client: "Studio foto",
    year: 2025,
    featured: true,
    technologies: ["Next.js", "Prisma", "Cron Jobs"],
    body: [{ url: "/placeholders/portfolio-web-app.png", alt: "Kalender booking" }],
  },
  {
    slug: "otomasi-laporan-whatsapp",
    title: "Otomasi Laporan Harian via WhatsApp",
    categorySlug: "automation",
    description:
      "Otomasi yang merangkum transaksi harian dari spreadsheet lalu mengirim ringkasannya ke grup WhatsApp pemilik usaha setiap malam — tanpa input manual apa pun.",
    thumbnail: "/placeholders/portfolio-automation.png",
    client: "Usaha retail",
    year: 2024,
    featured: false,
    technologies: ["Node.js", "Google Sheets API", "WhatsApp API"],
    body: [{ url: "/placeholders/portfolio-automation.png", alt: "Contoh laporan otomatis" }],
  },
];

/* ------------------------------------------------------------------ */
/* JOURNAL                                                             */
/* ------------------------------------------------------------------ */
const journals = [
  {
    slug: "mengapa-umkm-butuh-website-profesional",
    title: "Mengapa UMKM Butuh Website Profesional di 2026",
    categorySlug: "business",
    tags: ["umkm", "website"],
    image: "/placeholders/journal-0.png",
    excerpt:
      "Media sosial saja tidak cukup. Website profesional memberi bisnis Anda kredibilitas, kepemilikan data, dan jalur penjualan yang tidak bergantung pada algoritma.",
    publishedAt: "2026-09-12",
    content: `Banyak pemilik usaha merasa cukup berjualan di media sosial. Padahal ketergantungan penuh pada satu platform menyimpan risiko besar: algoritma berubah, jangkauan organik turun, dan akun bisa dibatasi kapan saja tanpa peringatan. Website adalah satu-satunya aset digital yang benar-benar Anda miliki penuh — dari tampilan, data pengunjung, hingga cara pelanggan menemukan Anda.

## Kredibilitas yang langsung terlihat

Calon pelanggan yang serius biasanya memeriksa nama bisnis di Google sebelum memutuskan membeli. Ketika yang muncul hanya akun Instagram dan beberapa ulasan tersebar, kesan profesionalisme belum maximal. Sebuah website dengan alamat resmi, informasi layanan yang jelas, dan cara menghubungi yang mudah memberi sinyal bahwa bisnis Anda dijalankan serius. Bagi banyak pelanggan, perbedaan "toko online" dan "bisnis yang punya website" sangat memengaruhi keputusan.

## Kepemilikan data dan pelanggan

Di media sosial, data pengikut bukan milik Anda. Di website, setiap kunjungan, formulir kontak, dan pertanyaan masuk adalah data yang Anda pegang. Data inilah modal untuk email marketing, retargeting, dan analitik jangka panjang. Anda bisa melihat halaman mana yang paling diminati, layanan apa yang paling sering ditanyakan, lalu menyusun strategi berdasarkan angka — bukan perkiraan.

## Bukan hanya untuk bisnis besar

Dulu membuat website mahal dan rumit. Sekarang teknologi modern seperti Next.js membuat website cepat, aman, dan mudah dikelola dengan biaya yang jauh lebih masuk akal. Konten bisa diperbarui sendiri lewat CMS tanpa menyentuh kode, dan situs tampil rapi di semua ukuran layar.

## Mulai dari yang sederhana

Website pertama Anda tidak harus rumit. Halaman beranda yang menjelaskan layanan, portofolio singkat, dan tombol kontak WhatsApp sudah lebih dari cukup untuk mulai tampil di Google. Yang penting adalah mulai — karena setiap bulan tanpa website adalah pelanggan yang lepas ke pesaing yang lebih mudah ditemukan.`,
  },
  {
    slug: "seo-dasar-biar-ditemukan-di-google",
    title: "SEO Dasar: Biar Website Bisnis Anda Ditemukan di Google",
    categorySlug: "seo",
    tags: ["seo", "google"],
    image: "/placeholders/journal-1.png",
    excerpt:
      "Bagaimana Google bekerja menemukan dan mengurutkan halaman? Pahami tiga fondasi SEO teknis, konten, dan reputasi — lalu praktikkan langkah paling berdampak dulu.",
    publishedAt: "2026-08-20",
    content: `Punya website tapi tidak kunjung muncul di Google itu seperti membuka toko di gang sepi tanpa papan nama. Kabar baiknya: aturan mainnya bisa dipelajari. SEO (Search Engine Optimization) pada intinya punya tiga fondasi — teknis, konten, dan reputasi.

## 1. Fondasi teknis: pastikan Google bisa membaca

Sebelum bicara peringkat, pastikan situs Anda ramah mesin. Artinya: kecepatan muat baik di ponsel, struktur HTML rapi, setiap halaman punya judul dan deskripsi meta yang unik, serta ada sitemap yang membantu Google menjelajah semua halaman. Framework modern seperti Next.js secara bawaan sudah menangani sebagian besar hal ini — tinggal diisi dengan benar.

## 2. Konten: jawab pertanyaan pelanggan

Google semakin pintar menilai apakah sebuah halaman benar-benar menjawab apa yang dicari orang. Karena itu kunci konten bukan jumlah kata, melainkan kecocokan niat pencarian. Buat halaman layanan yang menjelaskan apa, untuk siapa, dan bagaimana cara kerjanya. Tambahkan artikel jurnal yang menjawab pertanyaan nyata pelanggan — misalnya "berapa lama proses pembuatan website" atau "apa bedanya landing page dan company profile". Satu artikel yang benar-benar membantu lebih berharga daripada sepuluh artikel asal ada.

## 3. Reputasi: biar orang lain bicara tentang Anda

Tautan dari situs lain menuju situs Anda adalah bentuk rekomendasi. Untuk usaha lokal, ini bisa dimulai dari hal sederhana: daftarkan bisnis di Google Business Profile, masuk direktori usaha setempat, atau minta mitra bisnis mencantumkan tautan situs Anda.

## Ukur, lalu perbaiki

Pasang Google Search Console sejak hari pertama. Gratis, dan menunjukkan kata kunci apa yang membawa orang ke situs Anda, halaman mana yang paling sering dilihat, serta error teknis yang perlu diperbaiki. SEO adalah marathon, bukan sprint — perbaikan kecil yang konsisten selama beberapa bulan hampir selalu mengalahkan "trik" instan.`,
  },
  {
    slug: "landing-page-vs-company-profile",
    title: "Landing Page vs Company Profile: Mana yang Cocok untuk Bisnis Anda?",
    categorySlug: "web-development",
    tags: ["landing-page", "strategi"],
    image: "/placeholders/journal-2.png",
    excerpt:
      "Dua jenis website, dua tujuan berbeda. Kenali karakter keduanya supaya anggaran digital pertama Anda tepat sasaran.",
    publishedAt: "2026-07-15",
    content: `Saat pertama kali ingin "punya website", banyak pemilik bisnis bingung memilih bentuknya. Dua pilihan yang paling sering dipertimbangkan adalah landing page dan company profile. Keduanya sah — yang membedakan adalah tujuannya.

## Landing page: fokus pada satu aksi

Landing page dirancang untuk satu tujuan spesifik: mengubah pengunjung menjadi prospek. Biasanya dipakai saat Anda menjalankan iklan, meluncurkan produk baru, atau menawarkan satu layanan unggulan. Strukturnya linear — headline kuat, penjelasan masalah dan solusi, bukti kredibilitas, lalu tombol ajakan (WhatsApp, formulir, atau pendaftaran) yang berulang di beberapa titik. Karena fokusnya tunggal, landing page yang baik jarang menyediakan tautan keluar yang mengalihkan perhatian.

## Company profile: rumah digital bisnis

Company profile lebih luas. Ia menjadi tempat calon pelanggan mempelajari segalanya tentang bisnis Anda: layanan yang tersedia, portofolio pekerjaan, cara kerja tim, dan kontak resmi. Strukturnya berlapis dengan navigasi antarhalaman. Jenis website ini bekerja sebagai "kartu nama digital" yang Anda tunjukkan saat bernegosiasi, dicantumkan di proposal, atau ditemukan orang lewat Google.

## Jadi, pilih yang mana?

Pertanyaannya bukan mana yang lebih baik, melainkan apa tujuan utama Anda saat ini. Jika sedang menggalakkan satu penawaran tertentu dan mengarahkan iklan ke satu tempat — landing page lebih tepat. Jika ingin membangun kehadiran digital jangka panjang yang menjadi rujukan resmi bisnis — company profile yang Anda butuhkan. Banyak bisnis akhirnya membangun keduanya: company profile sebagai fondasi, lalu landing page khusus untuk kampanye.

## Yang sering terlewat

Apa pun pilihannya, pastikan website Anda cepat diakses dari ponsel, judul halamannya jelas di hasil pencarian, dan tombol kontak mudah ditemukan. Detail-detail kecil inilah yang memisahkan website yang sekadar ada dengan website yang benar-benar membawa pelanggan.`,
  },
  {
    slug: "5-tanda-website-perlu-redesign",
    title: "5 Tanda Website Bisnis Anda Perlu Di-redesign",
    categorySlug: "technology",
    tags: ["ux", "redesign"],
    image: "/placeholders/journal-3.png",
    excerpt:
      "Tampilan usang bukan satu-satunya alasan. Perhatikan lima sinyal ini — dari lambat dimuat hingga sepi formulir masuk.",
    publishedAt: "2026-06-10",
    content: `Website bukan produk sekali jadi. Teknologi, standar desain, dan kebiasaan pengunjung terus berubah — situs yang lima tahun lalu terlihat modern bisa terasa lambat dan membingungkan hari ini. Berikut lima tanda paling umum bahwa saatnya menyegarkan website Anda.

## 1. Lambat dimuat di ponsel

Mayoritas pengunjung kini datang dari ponsel. Jika halaman utama butuh lebih dari tiga detik untuk siap dibaca, sebagian pengunjung pergi sebelum sempat membaca apa pun. Penyebabnya biasanya gambar tidak dikompres, skrip lama, atau hosting yang tidak memadai — semuanya bisa diperbaiki saat redesign.

## 2. Tidak nyaman dibuka di ponsel

Coba buka situs Anda dari ponsel sekarang. Apakah tombol mudah ditekan? Apakah teks perlu dicubit-zoom? Navigasi yang menumpuk atau formulir yang menyulitkan adalah alasan terbesar pengunjung pergi tanpa meninggalkan jejak.

## 3. Informasi sudah tidak akurat

Layanan berubah, nomor kontak berganti, harga dan penawaran lama masih terpampang. Website yang isinya kedaluwarsa justru menurunkan kepercayaan. Jika memperbarui konten terasa merepotkan karena tidak ada CMS, itu juga sinyal redesign — situs modern seharusnya bisa Anda kelola sendiri.

## 4. Sepi formulir masuk

Jika situs mendapat kunjungan tapi hampir tidak ada pertanyaan masuk, biasanya masalahnya pada kejelasan: pengunjung tidak langsung paham apa yang Anda tawarkan dan apa langkah selanjutnya. Redesign berfokus pada struktur pesan dan penempatan ajakan kontak bisa mengubah angka ini drastis.

## 5. Sulit ditemukan di Google

Situs lama sering dibangun tanpa memperhatikan SEO: judul halaman generik, struktur tidak rapi, tidak ada sitemap. Saat redesign dengan framework modern, fondasi teknis ini ikut dibereskan sehingga peluang muncul di pencarian meningkat.

Memperbarui website bukan pengakuan gagal — justru bentuk perawatan aset digital. Dimulai dari audit kecil: buka situs Anda sebagai pengunjung baru, catat yang terasa mengganjal, lalu prioritaskan perbaikannya.`,
  },
  {
    slug: "otomasi-bisnis-sederhana-hemat-waktu",
    title: "Otomasi Bisnis Sederhana yang Menghemat Waktu Tim Anda",
    categorySlug: "technology",
    tags: ["otomasi", "produktivitas"],
    image: "/placeholders/journal-1.png",
    excerpt:
      "Otomasi bukan hanya perusahaan besar. Mulai dari laporan harian otomatis sampai balasan pesan pertama — ini contoh yang bisa langsung diterapkan.",
    publishedAt: "2026-05-18",
    content: `Ketika mendengar kata "otomasi", yang terbayang biasanya pabrik dengan robot atau perusahaan besar dengan sistem rumit. Padahal otomasi paling berdampak untuk usaha kecil justru yang sederhana: pekerjaan berulang yang dilakukan manual setiap hari, lalu dijalankan sistem secara otomatis.

## Mulai dari pekerjaan yang berulang

Perhatikan satu minggu kerja tim Anda. Ada berapa kali data disalin dari satu tempat ke tempat lain? Berapa lama waktu habis untuk menyusun laporan dari angka yang sama? Pekerjaan seperti ini adalah kandidat otomasi terbaik karena aturannya jelas dan berulang — ideal untuk diserahkan ke sistem.

## Contoh yang langsung terasa manfaatnya

**Laporan harian otomatis.** Setiap malam, sistem membaca data transaksi hari itu lalu mengirim ringkasan ke grup WhatsApp atau email. Pemilik usaha mulai hari dengan gambaran lengkap tanpa meminta laporan manual.

**Konfirmasi dan pengingat otomatis.** Untuk usaha jasa dengan jadwal (salon, studio, bimbingan belajar), pesan konfirmasi booking dan pengingat H-1 bisa dikirim otomatis. Ini menurunkan ketidakhadiran sekaligus mengurangi chat bolak-balik.

**Notifikasi formulir website.** Setiap ada calon pelanggan mengisi formulir di website, notifikasi langsung masuk ke WhatsApp tim penjualan — tidak ada prospek yang telat direspon karena email lupa dibuka.

**Pengelompokan data.** Data pesanan yang tersebar di pesan, catatan, dan spreadsheet dirangkum otomatis ke satu dashboard sederhana.

## Prinsip sebelum memulai

Otomasi yang baik selalu dimulai dari proses yang sudah jelas. Peta dulu alurnya: apa pemicunya, data apa yang dibutuhkan, dan hasilnya dikirim ke mana. Setelah itu barulah dipilihkan teknologinya — kadang cukup skrip ringan dan API yang sudah tersedia, tanpa aplikasi baru yang mahal.

Mulailah dari satu proses. Satu otomasi yang berjalan baik akan menghemat waktu setiap hari, dan tim Anda bisa fokus ke pekerjaan yang benar-benar butuh manusia: melayani pelanggan.`,
  },
  {
    slug: "studi-kasus-sistem-booking-online",
    title: "Studi Kasus: Membangun Sistem Booking Online untuk Usaha Jasa",
    categorySlug: "case-study",
    tags: ["studi-kasus", "booking"],
    image: "/placeholders/journal-2.png",
    excerpt:
      "Bagaimana sistem reservasi sederhana mengubah cara usaha jasa menerima pesanan — dari chat bolak-balik menjadi kalender yang terkelola sendiri.",
    publishedAt: "2026-04-22",
    content: `Usaha jasa — studio foto, klinik, bimbingan belajar, hingga jasa servis — punya masalah klasik yang sama: penjadwalan. Hampir semua pemesanan masuk lewat chat, ditangani manual, dan rentan bentrok. Studi kasus ini merangkum pendekatan yang biasa kami ambil saat membangun sistem booking online.

## Memetakan masalahnya dulu

Tahap pertama selalu memahami alur yang sudah berjalan. Pertanyaan kuncinya sederhana: dari pesan masuk sampai jadwal final, apa saja yang terjadi? Biasanya hasilnya seperti ini: pelanggan menanyakan ketersediaan, admin memeriksa catatan, menawarkan beberapa slot, menunggu balasan, lalu mencatat ulang. Setiap langkah manual adalah titik tertunda — dan titik gagal.

## Merancang solusi yang pas

Sistem booking yang kami bangun menyelesaikan tiga hal. Pertama, kalender ketersediaan real-time: pelanggan hanya bisa memilih slot yang benar-benar terbuka. Kedua, konfirmasi otomatis: setelah memesan, pelanggan langsung menerima ringkasan pesanan dan pengingat menjelang jadwal. Ketiga, panel admin sederhana: pemilik usaha bisa melihat, memindahkan, atau menolak pesanan dari satu layar tanpa mencatat manual.

## Detail kecil yang menentukan

Beberapa keputusan kecil ternyata paling berdampak. Misalnya membatasi pilihan durasi agar tidak membingungkan, menampilkan estimasi waktu respon, dan mengirim pengingat H-1 secara otomatis. Yang terakhir ini terbukti menurunkan ketidakhadiran secara nyata karena pelanggan jarang lupa jadwal yang sudah terkonfirmasi.

## Hasil yang bisa dirasakan

Manfaatnya bukan sekadar "lebih modern". Admin tidak lagi menjadi botol tengah untuk hal-hal rutin, kesalahan penjadwalan hampir hilang karena tidak ada lagi pencatatan ganda, dan pemilik usaha mendapat gambaran okupansi mingguan untuk merencanakan tenaga kerja. Pelanggan pun lebih tenang karena prosesnya transparan.

## Pelajaran untuk bisnis Anda

Kalau bisnis Anda masih mengatur jadwal lewat chat, mulailah dengan memetakan alurnya hari ini juga. Sering kali sistem yang dibutuhkan tidak serumit yang dibayangkan — yang penting alurnya jelas, datanya satu sumber, dan pengingatnya otomatis. Dari situ, perbaikan berikutnya tinggal bertahap.`,
  },
];

/* ------------------------------------------------------------------ */

async function main() {
  let created = 0;

  // ---- Portfolio ----
  for (const p of portfolios) {
    const existing = await db.portfolio.findUnique({ where: { slug: p.slug } });
    if (existing) continue;

    await db.portfolio.create({
      data: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        category: { connect: { slug: p.categorySlug } },
        thumbnail: p.thumbnail,
        year: p.year,
        client: p.client,
        featured: p.featured,
        published: true,
        technologies: JSON.stringify(p.technologies),
        seoTitle: `${p.title} — Portofolio ZDL`,
        seoDescription: p.description.slice(0, 155),
        images: {
          create: p.body.map((img, i) => ({ url: img.url, alt: img.alt, sortOrder: i })),
        },
      },
    });
    created++;
  }
  console.log(`[seed-content] Portfolio ready: ${created} created (target ${portfolios.length})`);

  // ---- Journal ----
  let jCreated = 0;
  for (const j of journals) {
    const existing = await db.journal.findUnique({ where: { slug: j.slug } });
    if (existing) continue;

    await db.journal.create({
      data: {
        title: j.title,
        slug: j.slug,
        excerpt: j.excerpt,
        content: j.content,
        featuredImage: j.image,
        ogImage: j.image,
        category: { connect: { slug: j.categorySlug } },
        authorName: "Tim ZDL",
        status: "PUBLISHED",
        publishedAt: new Date(j.publishedAt),
        seoTitle: j.title,
        seoDescription: j.excerpt.slice(0, 155),
        tags: {
          create: j.tags.map((t) => ({
            tag: {
              connectOrCreate: {
                where: { slug: t },
                create: { name: t.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), slug: t },
              },
            },
          })),
        },
      },
    });
    jCreated++;
  }
  console.log(`[seed-content] Journal ready: ${jCreated} created (target ${journals.length})`);
  console.log("[seed-content] Done ✔");
}

main()
  .catch((err) => {
    console.error("[seed-content] FAILED:", err?.message || err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
