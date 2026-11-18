/**
 * ZDL — Content seed (production-safe, idempotent)
 * Runs during Vercel build AFTER seed-core.mjs.
 *
 * Fills the site with starting content so no page feels "empty":
 *   - 16 REAL portfolio client sites (see scripts/portfolio-data.mjs)
 *   - 6 journal articles     (published, full markdown, tagged)
 *
 * Upsert semantics: existing slugs are NEVER overwritten, so any edits
 * made through the CMS are safe across redeploys.
 */
import { PrismaClient } from "@prisma/client";
import { seedPortfolios } from "./portfolio-data.mjs";

const db = new PrismaClient();

/* ------------------------------------------------------------------ */
/* PORTFOLIO — moved to scripts/portfolio-data.mjs (16 real client sites) */
/* ------------------------------------------------------------------ */

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
/* DEMOS — "wadah demo"                                                */
/* ------------------------------------------------------------------ */
const demos = [
  {
    slug: "aplikasi-kasir",
    title: "Demo Aplikasi Kasir (POS)",
    category: "Aplikasi Kasir",
    thumbnail: "/placeholders/portfolio-mobile-app.png",
    demoUrl: "/demo/coba/kasir",
    accessType: "PUBLIC",
    featured: true,
    sortOrder: 1,
    technologies: ["Next.js", "React", "Tailwind CSS"],
    description: `Bagaimana rasanya pemilik warung pakai kasir digital? Inilah simulasinya — aplikasi kasir lengkap yang berjalan langsung di browser Anda, memakai menu "Warung Bu Sari" sebagai data simulasi.

Semua alur di dalamnya meniru versi produksi: pemilihan menu, keranjang pesanan, perhitungan pajak, pembayaran tunai dengan hitungan kembalian otomatis, sampai pencetakan struk. Perbedaannya hanya satu: di sini tidak ada data yang disimpan, jadi Anda bebas mencoba apa saja.

Kalau Anda menjalankan kedai kopi, warung makan, toko kelontong, atau usaha kuliner lain, demo ini akan memberi gambaran jelas tentang apa yang Anda dapat sebelum mengambil keputusan membangun versi asli.`,
    notes: `Coba hal-hal berikut di dalam demo:

Ketuk menu untuk menambah pesanan, lalu atur jumlah dengan tombol plus-minus di keranjang. Gunakan pencarian dan tab kategori (Makanan, Minuman, Snack) untuk menemukan menu dengan cepat.

Selesaikan pembayaran: klik "Bayar Sekarang", coba tombol nominal cepat (Pas, 50rb, 100rb) atau ketik nominal manual, dan lihat kembalian dihitung otomatis. Setelah lunas, struk terbit lengkap dengan nomor transaksi — persis seperti yang dicetak oleh kasir asli.

Setelah selesai, klik "Transaksi Baru" dan seluruh layar kembali bersih, siap melayani pelanggan berikutnya.`,
    seoTitle: "Demo Aplikasi Kasir — Coba Langsung di Browser | ZDL",
    seoDescription:
      "Simulasi aplikasi kasir ZDL: pilih menu, kelola pesanan, hitung kembalian, dan cetak struk. Jalan langsung di browser tanpa daftar atau install.",
  },
  {
    slug: "sistem-booking-online",
    title: "Demo Sistem Booking Online",
    category: "Sistem Booking",
    thumbnail: "/placeholders/portfolio-web-app.png",
    demoUrl: "/demo/coba/booking",
    accessType: "PUBLIC",
    featured: true,
    sortOrder: 2,
    technologies: ["Next.js", "React", "Tailwind CSS"],
    description: `Sistem booking online mengubah cara usaha jasa menerima pelanggan: tidak ada lagi pencatatan ganda di chat, jadwal bentrok, atau pelanggan yang terlewat. Demo ini meniru alur pelanggan barbershop — pilih layanan, pilih jadwal, isi data diri, dan terima kode konfirmasi.

Anda akan merasakan langsung alur yang nantinya dialami pelanggan bisnis Anda setiap hari. Slot yang bergaris menandakan jadwal terisi — simulasi dari fitur ketersediaan di sistem asli yang membaca jadwal terapis dan kapasitas tim secara real-time.

Demo ini relevan untuk barbershop, klinik, studio foto, bengkel, lapangan futsal, hingga praktik terapis. Setiap industri punya kebutuhan berbeda — dan di versi produksi, alurnya disesuaikan dengan proses kerja Anda.`,
    notes: `Coba hal-hal berikut di dalam demo:

Pilih salah satu layanan (Potong Rambut, Cukur Jenggot, Hair Wash, atau Hair Coloring) dan perhatikan estimasi durasi serta biayanya tampil otomatis.

Pilih tanggal kunjungan — slot yang sudah terisi atau sudah lewat tidak bisa dipilih, persis seperti sistem asli yang mencegah double-booking.

Isi nama dan nomor WhatsApp, lalu konfirmasi. Kode booking akan terbit dan — di versi asli — detail yang sama langsung dikirim ke WhatsApp pelanggan secara otomatis.`,
    seoTitle: "Demo Sistem Booking Online — Coba Langsung | ZDL",
    seoDescription:
      "Simulasi sistem booking online ZDL: pilih layanan, jadwal tersedia, dan terima kode konfirmasi. Cocok untuk barbershop, klinik, studio, dan bengkel.",
  },
  {
    slug: "simulasi-payment-gateway",
    title: "Demo Simulasi Payment Gateway",
    category: "Payment Gateway",
    thumbnail: "/placeholders/portfolio-e-commerce.png",
    demoUrl: "/demo/coba/payment",
    accessType: "PUBLIC",
    featured: true,
    sortOrder: 3,
    technologies: ["Next.js", "React", "Tailwind CSS"],
    description: `Bagaimana rasanya menerima pembayaran digital tanpa uang tunai? Demo ini meniru alur payment gateway yang biasanya ZDL pasang di aplikasi klien: pelanggan menerima tagihan, memilih kanal, membayar, dan statusnya otomatis lunas.

Empat kanal tersedia di simulasi: QRIS (semua e-wallet dan mobile banking sekaligus), Virtual Account bank BCA/BNI/Mandiri/BRI dengan nomor VA dan tombol salin, e-wallet GoPay/OVO/DANA/ShopeePay, serta kartu kredit/debit dengan verifikasi 3D Secure dan OTP.

Yang penting Anda pahami: di integrasi asli, ada webhook dari penyedia payment gateway yang memberi tahu server Anda dalam hitungan detik setelah uang masuk — sehingga status pesanan, stok, dan struk WhatsApp pelanggan berjalan otomatis tanpa dicek manual. Demo ini menampilkan alur persis seperti itu, hanya tanpa uang sungguhan.`,
    notes: `Coba hal-hal berikut di dalam demo:

Pilih QRIS lalu tekan Buat Tagihan — QR muncul dengan timer kedaluwarsa 15 menit seperti QRIS asli, dan tombol Simulasikan Sudah Bayar memproses pembayaran.

Pilih Virtual Account, ganti-ganti bank dan lihat nomor VA berubah — salin dengan tombol di sebelah kanan seperti pelanggan menyalin nomor VA ke mobile banking.

Coba kartu kredit: masukkan 16 digit angka apa pun, sistem menampilkan verifikasi 3D Secure yang meminta OTP 6 digit — alur yang sama dengan pembayaran kartu nyata.

Setelah lunas, struk pembayaran terbit lengkap dengan Payment ID, waktu, dan metode.`,
    seoTitle: "Demo Simulasi Payment Gateway — QRIS, VA, E-Wallet | ZDL",
    seoDescription:
      "Simulasi payment gateway ZDL: QRIS, Virtual Account, e-wallet, dan kartu 3DS. Pahami alur pembayaran digital sebelum memasangnya di bisnis Anda.",
  },
  {
    slug: "simulasi-payroll",
    title: "Demo Simulasi Payroll",
    category: "Payroll",
    thumbnail: "/placeholders/portfolio-dashboard.png",
    demoUrl: "/demo/coba/payroll",
    accessType: "PUBLIC",
    featured: true,
    sortOrder: 4,
    technologies: ["Next.js", "React", "Tailwind CSS"],
    description: `Gajian adalah titik lemah banyak UMKM: dihitung manual di Excel, sering salah potongan, dan slip gaji tidak resmi. Demo ini menunjukkan bagaimana sistem payroll mengubah semua itu menjadi satu klik.

Tekan Proses Payroll untuk bulan November 2026 dan sistem langsung menghitung enam karyawan sekaligus: gaji pokok plus tunjangan menjadi bruto, potongan ketidakhadiran mengikuti rekap absensi, BPJS dihitung dari gaji pokok, dan PPh 21 pakai tarif TER sederhana. Hasilnya tabel take-home pay per karyawan plus slip gaji resmi yang siap dicetak.

Perhitungan di demo sengaja disederhanakan agar mudah dipahami. Di versi produksi, tarif BPJS, JP, dan TER diikuti regulasi terbaru, plus opsi komponen tambahan seperti lembur, bonus KPI, dan potongan kasbon. Rekap absensi pun ditarik langsung dari modul absensi — tidak diinput ulang.`,
    notes: `Coba hal-hal berikut di dalam demo:

Tekan Proses Payroll November 2026 dan tunggu satu detik — tabel hasil muncul dengan kolom bruto, potongan, dan take-home pay per karyawan.

Perhatikan Siti Aminah dan Dedi Kurniawan: hari kehadiran mereka di bawah 22, jadi ada potongan absensi otomatis. Bandingkan dengan Rina yang hadir penuh.

Klik Lihat pada baris mana pun untuk membuka slip gaji lengkap dengan rincian pendapatan dan potongan, lalu coba Cetak Slip.

Ganti periode ke September atau Oktober 2026 untuk memulai payroll baru dari awal.`,
    seoTitle: "Demo Simulasi Payroll — Slip Gaji Otomatis | ZDL",
    seoDescription:
      "Simulasi payroll ZDL: proses gaji semua karyawan sekali klik, potongan absensi, BPJS, dan PPh 21 otomatis, slip gaji siap kirim. Coba langsung di browser.",
  },
  {
    slug: "simulasi-absensi",
    title: "Demo Simulasi Absensi Karyawan",
    category: "Absensi",
    thumbnail: "/placeholders/portfolio-mobile-app.png",
    demoUrl: "/demo/coba/absensi",
    accessType: "PUBLIC",
    featured: true,
    sortOrder: 5,
    technologies: ["Next.js", "React", "Tailwind CSS"],
    description: `Buku tanda tangan mudah dimanipulasi dan sulit direkap. Aplikasi absensi menggantinya dengan check-in dari HP karyawan: jam tercatat presisi, lokasi divalidasi dari GPS, dan status tepat waktu atau terlambat muncul otomatis.

Di demo ini jam berjalan sesuai jam browser Anda. Pilih salah satu dari lima karyawan, lakukan Check-In, mulai dan selesaikan istirahat, lalu Check-Out — sistem menghitung total jam kerja dan menandai keterlambatan setelah pukul 08:00.

Panel rekap bulanan di kanan menunjukkan hasil sebulan penuh untuk setiap karyawan: hari hadir, telat, izin, alpha, plus estimasi potongan. Rekap inilah yang di versi asli langsung ditarik modul payroll, sehingga tanggal 25 tidak perlu lagi ada yang menghitung manual di Excel.`,
    notes: `Coba hal-hal berikut di dalam demo:

Lihat jam live di kartu absen — jika sekarang masih sebelum 08:00, check-in Anda akan tercatat Tepat waktu; setelah itu otomatis Terlambat.

Tekan Check-In Sekarang, lalu Mulai Istirahat dan Selesai Istirahat, akhiri dengan Check-Out untuk melihat total jam kerja dihitung.

Ganti karyawan dengan chip nama di atas — rekap 20 hari kerja berubah sesuai riwayat masing-masing orang.

Perhatikan estimasi potongan di bagian bawah rekap: keterlambatan langsung dikalikan biaya telat per kejadian.`,
    seoTitle: "Demo Simulasi Absensi Karyawan — Check-In Digital | ZDL",
    seoDescription:
      "Simulasi absensi ZDL: check-in GPS, status terlambat otomatis, istirahat, dan rekap bulanan siap payroll. Coba langsung di browser tanpa install.",
  },
  {
    slug: "manajemen-stok-gudang",
    title: "Demo Simulasi Manajemen Stok Gudang",
    category: "Stok Gudang",
    thumbnail: "/placeholders/portfolio-other.png",
    demoUrl: "/demo/coba/gudang",
    accessType: "PUBLIC",
    featured: true,
    sortOrder: 6,
    technologies: ["Next.js", "React", "Tailwind CSS"],
    description: `Stok yang tidak terkontrol = uang hilang dua kali: modal nanggung untuk barang yang tersesak, plus penjualan hilang karena barang habis tanpa ketahuan. Demo ini meniru aplikasi stok gudang yang membuat persediaan terlihat jelas setiap saat.

Ada 11 SKU dari gudang kedai kopi simulasi: bahan baku, kemasan, produk jadi, dan alat. Setiap item punya stok saat ini, batas minimum, lokasi rak, dan status otomatis Aman, Menipis, atau Habis. Catat barang masuk atau keluar lewat tombol aksi, dan lihat semua angka berubah seketika — nilai persediaan, KPI, peringatan restock, dan riwayat mutasi.

Di versi produksi, stok terpotong otomatis setiap transaksi kasir, pesanan pembelian ke supplier bisa dibuat dari halaman yang sama, dan laporan kartu stok per item tersedia kapan pun diminta. Demo ini sudah memakai alur kerja yang sama.`,
    notes: `Coba hal-hal berikut di dalam demo:

Cari Susu UHT di kolom pencarian — statusnya Menipis, stok 3 di bawah minimum 12. Tekan tombolnya di strip peringatan kuning untuk langsung restock.

Catat Stok Keluar pada Biji Kopi Arabika dan lihat riwayat mutasi terbaru langsung menampilkan transaksi Anda dengan catatan yang Anda tulis.

Filter per kategori (Bahan Baku, Kemasan, Produk Jadi, Alat) dan perhatikan nilai stok total di KPI ikut mencerminkan seluruh gudang.

Buka Riwayat Mutasi untuk melihat semua pergerakan masuk/keluar yang tercatat berurutan.`,
    seoTitle: "Demo Simulasi Stok Gudang — Barang Masuk Keluar | ZDL",
    seoDescription:
      "Simulasi aplikasi stok gudang ZDL: mutasi masuk/keluar, peringatan stok menipis, nilai persediaan, dan riwayat mutasi. Coba langsung di browser.",
  },
  {
    slug: "dashboard-saas",
    title: "Demo Dashboard Admin SaaS",
    category: "SaaS",
    thumbnail: "/placeholders/portfolio-saas.png",
    demoUrl: "/demo/coba/saas",
    accessType: "PUBLIC",
    featured: true,
    sortOrder: 7,
    technologies: ["Next.js", "React", "Tailwind CSS"],
    description: `Kalau rencana Anda bukan sekadar aplikasi internal, tetapi produk yang dijual berlangganan ke banyak pelanggan (SaaS), Anda butuh admin panel yang bisa memantau semuanya: siapa berlangganan, berapa pendapatan bulanan, siapa menunggak, dan paket mana yang paling laris.

Demo ini menampilkan dashboard admin SaaS multi-tenant: empat KPI utama (MRR, pengguna aktif, churn, trial baru) lengkap dengan tren 12 bulan, grafik pendapatan bulanan dari Rp62jt tumbuh ke Rp128jt, distribusi paket Starter/Pro/Business, daftar pelanggan yang bisa dicari dan difilter, serta feed aktivitas real-time.

Semua angka adalah simulasi, tetapi struktur dan fiturnya persis seperti yang ZDL bangun untuk produk klien: multi-tenant, tagihan langganan berulang, pengingat WhatsApp untuk menunggak, dan laporan pertumbuhan per bulan.`,
    notes: `Coba hal-hal berikut di dalam demo:

Jelajahi tiga tab: Ringkasan untuk KPI dan grafik, Pelanggan untuk daftar tenant, dan Aktivitas untuk feed kejadian terbaru.

Cari Laundr atau Klinik di tab Pelanggan, lalu filter per paket untuk melihat distribusi Starter, Pro, dan Business.

Arahkan kursor ke batang grafik pendapatan untuk melihat nilai MRR per bulan.

Perhatikan pelanggan berstatus Menunggak — di sistem asli, pengingat WhatsApp-nya sudah terkirim otomatis seperti terlihat di feed aktivitas.`,
    seoTitle: "Demo Dashboard Admin SaaS — Multi-Tenant | ZDL",
    seoDescription:
      "Simulasi dashboard admin SaaS ZDL: KPI MRR dan churn, grafik pendapatan, kelola pelanggan multi-tenant, dan feed aktivitas. Coba langsung di browser.",
  },
];

/* ------------------------------------------------------------------ */

async function main() {
  let created = 0;

  // ---- Portfolio (16 real client sites) ----
  await seedPortfolios(db);

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

  // ---- Demos ----
  let dCreated = 0;
  for (const d of demos) {
    const existing = await db.demo.findUnique({ where: { slug: d.slug } });
    if (existing) continue;

    await db.demo.create({
      data: {
        title: d.title,
        slug: d.slug,
        description: d.description,
        notes: d.notes,
        category: d.category,
        thumbnail: d.thumbnail,
        demoUrl: d.demoUrl,
        accessType: d.accessType,
        technologies: JSON.stringify(d.technologies),
        featured: d.featured,
        published: true,
        sortOrder: d.sortOrder,
        seoTitle: d.seoTitle,
        seoDescription: d.seoDescription,
      },
    });
    dCreated++;
  }
  console.log(`[seed-content] Demos ready: ${dCreated} created (target ${demos.length})`);
  console.log("[seed-content] Done ✔");
}

main()
  .catch((err) => {
    console.error("[seed-content] FAILED:", err?.message || err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
