/**
 * Indonesian dictionary — the reference shape for all site strings.
 * English translations live in dict-en.ts and must match this shape.
 */

const idDict = {
  common: {
    menit: "mnt",
    menitBaca: "menit baca",
    draft: "Draft",
    share: "Bagikan:",
    shareWA: "Bagikan via WhatsApp",
    shareFB: "Bagikan via Facebook",
    shareX: "Bagikan via X/Twitter",
    copyLink: "Salin tautan artikel",
    toc: "Daftar isi",
    all: "Semua",
  },

  nav: {
    consult: "Konsultasi",
    consultProject: "Konsultasi Project",
    openMenu: "Buka menu navigasi",
    menuTitle: "Menu navigasi",
    ariaMain: "Navigasi utama",
    brandAria: "ZDL — Beranda",
    theme: "Ganti tema",
  },

  lang: {
    aria: "Ganti bahasa",
    toEn: "Switch to English",
    toId: "Ganti ke Bahasa Indonesia",
    label: "EN",
    labelCurrent: "ID",
  },

  wa: {
    float: "Konsultasi via WhatsApp",
    close: "Tutup tombol WhatsApp",
    defaultMsg:
      "Halo ZDL, saya ingin konsultasi mengenai pengembangan website/aplikasi untuk bisnis saya.",
  },

  footer: {
    blurb:
      "Studio web kecil di Tangerang. Kami membangun dan merawat website, aplikasi, dan sistem internal untuk bisnis yang ingin serius tampil digital — dari UMKM sampai industri.",
    navTitle: "Navigasi",
    servicesTitle: "Layanan",
    ariaNav: "Tautan footer",
    ariaServices: "Layanan",
    location: "melayani seluruh Indonesia",
    rights: "Seluruh hak cipta dilindungi.",
    websiteBy: "Website by",
  },

  cta: {
    defaultTitle: "Punya rencana? Ceritakan saja dulu",
    defaultDesc:
      "Konsultasi awal tidak ribet: Anda jelaskan masalah bisnisnya, kami bilang apa yang perlu — dan apa yang tidak perlu — dibangun. Kalau cocok, baru kami mulai.",
    primary: "Chat WhatsApp langsung",
    secondary: "Lihat Portfolio",
  },

  home: {
    statusNew: "Terima project baru",
    location: "Tangerang, Indonesia",
    h1Pre: "Website & sistem bisnis yang",
    h1Accent: "dikerjakan sampai beres",
    heroBody:
      "ZDL membangun dan merawat website, aplikasi, dan sistem internal untuk {n} brand — dari catering Surabaya sampai fabrikasi tangki migas. Dikerjakan langsung oleh orang yang bisa Anda ajak bicara.",
    ctaPrimary: "Diskusikan project",
    ctaDemo: "Coba demo interaktif",
    regions: "Tangerang · Jakarta · Jabodetabek — seluruh Indonesia",
    trusted: "Dipercaya {n} brand di {m} industri",
    svcEyebrow: "Layanan",
    svcTitle: "Enam lini layanan, satu penanggung jawab",
    svcDesc:
      "Semua dikerjakan internal — tidak dilepas ke pihak ketiga. Kalau ada yang perlu diubah, Anda tahu harus bicara dengan siapa.",
    whyEyebrow: "Kenapa ZDL",
    whyTitle: "Prinsip kerja yang kami pegang",
    whyDesc: "Bukan slogan — ini cara kami bekerja setiap hari pada project klien.",
    howEyebrow: "Cara kerja",
    howTitle: "Enam tahap, tanpa kejutan",
    howDesc:
      "Dari cerita awal sampai website terawat — setiap tahap Anda tahu sedang di mana. Skala project berbeda, disiplinnya sama.",
    portEyebrow: "Portofolio",
    portTitle: "Project yang berjalan, bukan mockup",
    portDesc:
      "Semua website di bawah live dan kami kelola. Buka situsnya langsung dari halaman detail project.",
    demoEyebrow: "Demo interaktif",
    demoTitle: "Coba dulu, baru percaya",
    demoDesc:
      "Simulasi aplikasi yang benar-benar bisa diklik — kasir, payroll, stok gudang, dan lainnya. Langsung di browser, tanpa daftar dan tanpa instal.",
    jrnEyebrow: "ZDL Journal",
    jrnTitle: "Catatan dari lapangan",
    jrnDesc:
      "Yang kami pelajari dari mengerjakan website bisnis nyata — ditulis ringkas dan bisa langsung dipraktikkan.",
    portfolioEmpty:
      "Portfolio akan segera ditampilkan — tambahkan project pertama Anda melalui CMS Admin.",
    journalEmpty: "Artikel pertama akan segera dipublikasikan — kelola melalui CMS Admin.",
    moreProjects: "+ {n} project lainnya",
    viewAllPortfolio: "Lihat semua portfolio",
    demoCount: "{n} simulasi tersedia",
    exploreDemos: "Jelajahi semua demo",
    allArticles: "Semua artikel",
    valueProps: [
      {
        title: "Bicara dengan yang mengerjakan",
        description:
          "Tidak ada lapisan account manager. Yang Anda ajak meeting adalah orang yang menulis kodenya — jadi keputusan teknis cepat dan tidak ada yang hilang di terjemahan.",
      },
      {
        title: "Dibangun untuk dikembangkan, bukan dilepas",
        description:
          "Stack modern (Next.js, TypeScript, PostgreSQL) dengan dokumentasi rapi. Website Anda bukan file yang dititipkan — ini aset yang bisa Anda pindahkan, kembangkan, atau audit kapan saja.",
      },
      {
        title: "Cepat di jaringan HP Indonesia",
        description:
          "Mayoritas pengunjung Anda buka dari ponsel dengan sinyal 4G. Setiap halaman kami optimasi untuk itu: gambar terkompresi, JavaScript hemat, server rendering.",
      },
      {
        title: "Satu penanggung jawab sampai beres",
        description:
          "Website, domain, hosting, email bisnis, otomasi spreadsheet — satu tempat. Tidak perlu mengoordinasikan lima vendor yang saling menunjuk kalau ada masalah.",
      },
    ],
    processSteps: [
      { name: "Dengar", description: "Ceritakan masalahnya — kami pelajari bisnis dan tujuan Anda dulu, belum bicara teknis." },
      { name: "Rancang", description: "Ruang lingkup, struktur, dan prioritas disepakati tertulis sebelum kode pertama." },
      { name: "Bangun", description: "Pengerjaan dengan progres yang bisa Anda lihat — bukan kotak hitam selama berbulan-bulan." },
      { name: "Uji", description: "Diperiksa di HP nyata dan jaringan nyata: kecepatan, alur, dan sudut-sudut yang jarang dicek." },
      { name: "Tayang", description: "Dipasang dengan konfigurasi aman, domain dan SSL beres, siap dikunjungi." },
      { name: "Rawat", description: "Setelah live kami tidak menghilang — pemeliharaan, perbaikan, dan pengembangan lanjutan." },
    ],
  },

  about: {
    metaTitle: "Tentang ZDL — Digital Development Studio dari Tangerang",
    metaDesc:
      "ZDL (Zheng Digital Lab) adalah digital development studio yang membantu bisnis membangun website, aplikasi, sistem internal, automation, dan digital presence. Berbasis di Tangerang, melayani seluruh Indonesia.",
    ogTitle: "Tentang ZDL — Zheng Digital Lab",
    ogDesc:
      "Digital development studio yang membantu bisnis membangun website, aplikasi, sistem internal, dan automation dengan proses yang jelas.",
    heroEyebrow: "Tentang ZDL",
    heroTitlePre: "Studio pengembangan yang",
    heroTitleAccent: "mengerjakan sendiri",
    heroDesc:
      "ZDL (Zheng Digital Lab) adalah digital development studio dari Tangerang yang membantu bisnis membangun fondasi digitalnya — website, aplikasi, sistem internal, automation, dan digital presence — dengan proses yang jelas dan hasil yang bisa dipertanggungjawabkan.",
    meta: ["Berdiri di Tangerang", "Melayani seluruh Indonesia", "16 brand klien aktif"],
    storyTitle: "Berawal dari masalah yang familier",
    story1:
      "Banyak bisnis di Indonesia sudah sadar pentingnya digital, tapi terjebak di antara dua pilihan yang sama-sama tidak ideal: tools instant yang tidak sesuai proses bisnis, atau vendor besar dengan biaya yang belum masuk akal untuk tahap perkembangan mereka.",
    story2:
      "ZDL lahir untuk mengisi ruang itu — studio pengembangan yang bekerja dengan standar engineering yang baik, tapi dekat dengan realita bisnis menengah: anggaran yang harus efisien, sistem yang harus cepat jadi, dan hasil yang harus terukur.",
    story3:
      "Kami bekerja dari {city}, {region} dan melayani klien di {areas} — sebagian besar proses bisa berjalan daring, dengan pertemuan tatap muka untuk area Jabodetabek dan sekitarnya.",
    buildTitle: "Apa yang kami bangun",
    buildItems: [
      { name: "Website", detail: "landing page, company profile, e-commerce, custom website" },
      { name: "Aplikasi", detail: "mobile app, SaaS, CRM, management system" },
      { name: "Sistem Internal", detail: "admin dashboard, CMS, dashboard monitoring, database system" },
      { name: "Automation", detail: "Excel/Google Sheets automation, reporting system, integrasi" },
      { name: "Digital Presence", detail: "SEO, iklan digital, domain, hosting, email profesional" },
    ],
    buildCta: "Diskusikan kebutuhan Anda",
    valuesEyebrow: "Prinsip",
    valuesTitle: "Tiga hal yang kami pegang",
    valuesDesc:
      "Prinsip yang memandu setiap keputusan — dari cara kami merancang sistem sampai cara kami berkomunikasi dengan Anda.",
    values: [
      { title: "Solusi, bukan sekadar produk", description: "Kami terbiasa menolak fitur yang tidak perlu. Yang penting sistemnya menyelesaikan masalah, bukan terlihat canggih di demo." },
      { title: "Transparan sejak awal", description: "Ruang lingkup, progress, dan kendala dikomunikasikan apa adanya. Tidak ada biaya siluman, tidak ada janji yang tidak bisa kami penuhi." },
      { title: "Edukasi sebagai bagian dari kerja", description: "Kami menjelaskan keputusan teknis dengan bahasa yang bisa dipahami, sehingga Anda bisa mengambil keputusan bisnis yang lebih baik." },
    ],
    approachEyebrow: "Cara kerja",
    approachTitle: "Tujuh tahap, dari dengar sampai rawat",
    approachDesc:
      "Tahapan yang kami lalui di setiap project — skalanya menyesuaikan kompleksitas, disiplinnya tidak pernah berubah.",
    approach: [
      { name: "Understand", description: "Kami mulai dengan mendengar — memahami model bisnis, hambatan operasional, dan hasil yang Anda harapkan. Tanpa pemahaman yang benar, teknologi apa pun hanya akan menjadi biaya baru." },
      { name: "Plan", description: "Kebutuhan diterjemahkan menjadi ruang lingkup, prioritas, dan rencana kerja yang jelas. Anda tahu apa yang akan dibangun, kapan, dan dengan urutan mana — sebelum satu baris kode pun ditulis." },
      { name: "Design", description: "Tampilan dan alur dirancang untuk pengguna Anda, bukan untuk pameran fitur. Mobile-first, bersih, dan konsisten dengan brand Anda." },
      { name: "Develop", description: "Kode ditulis dengan standar yang bisa dirawat: terstruktur, teruji, dan terdokumentasi. Kami memakai teknologi modern yang populer agar pengembangan lanjutan tidak bergantung pada satu orang." },
      { name: "Test", description: "Setiap fitur diperiksa: fungsionalitas lintas perangkat, kecepatan loading di jaringan mobile, dan skenario penggunaan nyata — bukan sekadar 'jalan di laptop kami'." },
      { name: "Deploy", description: "Peluncuran dilakukan rapi: domain, hosting, SSL, dan monitoring disiapkan. Sistem Anda online dengan konfigurasi yang aman sejak hari pertama." },
      { name: "Improve", description: "Digital product bukan proyek sekali jadi. Kami mengukur pemakaian, memelihara sistem, dan membantu Anda mengembangkan fitur berikutnya berdasarkan data." },
    ],
    areasBadge: "Area Layanan",
    areasTitle: "Berbasis di Tangerang, melayani seluruh Indonesia",
    areas1:
      "Basis kami di {city} menempatkan kami strategis untuk melayani wilayah {region} dan Jakarta — area dengan dinamika bisnis tertinggi di Indonesia. Untuk area Jabodetabek, pertemuan tatap muka dapat dijadwalkan sesuai tahapan project.",
    areas2:
      "Di luar Jawa, seluruh proses berjalan mulus secara daring: discovery call via WhatsApp/Google Meet, dokumentasi requirement tertulis, demo progres berkala, dan serah terima lengkap dengan panduan penggunaan. Jarak bukan penghalang kualitas kerja.",
    areasLink: "Diskusikan project di area Anda",
  },

  servicesIndex: {
    metaTitle: "Layanan — Jasa Web Development, Aplikasi, Sistem & Digital Growth",
    metaDesc:
      "Layanan ZDL: jasa pembuatan website, aplikasi mobile, SaaS, dashboard & sistem internal, otomasi Excel/Google Sheets, SEO, hingga domain & hosting. Melayani Tangerang, Jakarta, Jabodetabek, dan seluruh Indonesia.",
    ogTitle: "Layanan ZDL — Web & App Development, Digital Solutions",
    ogDesc:
      "Enam lini layanan digital end-to-end: web development, application development, business system, productivity, digital growth, dan infrastructure.",
    heroEyebrow: "Layanan",
    heroTitlePre: "Satu tim,",
    heroTitleAccent: "enam lini kerja",
    heroDesc:
      "Website, aplikasi, sistem internal, otomasi, dan digital growth — semua dikerjakan internal oleh tim yang sama, tanpa subkontraktor. Kalau ada yang perlu diubah, Anda tahu harus bicara dengan siapa.",
    meta: ["6 lini layanan", "Tanpa subkontraktor", "Tangerang — seluruh Indonesia"],
    ctaTitle: "Belum yakin mulai dari mana?",
    ctaDesc:
      "Itu normal. Banyak klien datang dengan masalah, bukan dengan spesifikasi. Ceritakan masalahnya — kami bantu terjemahkan menjadi solusi yang tepat dan bertahap.",
    ctaSecondary: "Lihat portfolio kami",
  },

  serviceDetail: {
    fitFor: "Cocok untuk",
    scope: "Lingkup layanan {name}",
    benefits: "Manfaat",
    examples: "Contoh penggunaan",
    consult: "Konsultasi {name}",
    consultCta: "Konsultasikan Project Anda",
    others: "Layanan lainnya",
    ctaTitle: "Butuh {name} untuk bisnis Anda?",
    ctaDesc:
      "Ceritakan kebutuhan Anda lewat WhatsApp — kami bantu petakan solusi yang paling sesuai tanpa kewajiban apa pun.",
    ctaSecondary: "Kembali ke semua layanan",
    waCategory: "Halo ZDL, saya tertarik dengan layanan {name}. Bisa konsultasi dulu?",
    waItem: "Halo ZDL, saya ingin konsultasi mengenai {name}.",
  },

  portfolio: {
    metaTitle: "Portfolio — Website Klien ZDL Lintas Industri",
    metaDesc:
      "Portofolio website klien ZDL lintas industri: kuliner & F&B, properti, interior & konstruksi, edukasi, transportasi & logistik, industri & energi, hingga organisasi.",
    ogTitle: "Portfolio ZDL — Zheng Digital Lab",
    ogDesc:
      "Koleksi website klien yang pernah ZDL kerjakan & kelola — dari catering, restoran, dan brand skincare hingga developer properti, supplier lantai olahraga, dan fabrikasi tangki migas.",
    heroEyebrow: "Portofolio klien",
    heroTitlePre: "Website yang",
    heroTitleAccent: "berjalan hari ini",
    heroTitlePost: "— bukan mockup",
    heroDesc:
      "{n} website klien yang live dan kami kelola sekarang — dari catering di Surabaya sampai fabrikasi tangki migas. Filter berdasarkan industri, atau buka langsung situsnya dari halaman detail project.",
    metaLive: "{n} project live",
    metaIndustries: "{n} industri",
    metaInhouse: "Dikerjakan internal",
    ctaTitle: "Project Anda bisa jadi yang berikutnya",
    ctaDesc:
      "Setiap project dimulai dari percakapan singkat. Ceritakan kebutuhan Anda dan lihat bagaimana kami akan mengeksekusinya.",
    ctaSecondary: "Lihat layanan kami",
    ariaFilter: "Filter kategori portfolio",
    empty: "Belum ada project pada kategori ini.",
    emptyPre: "Coba pilih kategori lain, atau",
    emptyLink: "diskusikan project Anda",
    emptyPost: "untuk menjadi yang pertama.",
  },

  portfolioDetail: {
    about: "Tentang project",
    gallery: "Galeri",
    tech: "Teknologi",
    client: "Klien",
    year: "Tahun",
    category: "Kategori",
    viewLive: "Lihat live project",
    sourceCode: "Source code",
    buildSimilar: "Bangun project serupa",
    back: "Kembali ke portfolio",
    related: "Project terkait",
    viewAll: "Semua portfolio",
    thumbAlt: "Thumbnail project {name}",
    viewAlt: "Tampilan project {name}",
    galleryAlt: "Galeri project {name}",
    waMsg: "Halo ZDL, saya melihat project \"{name}\" di portfolio. Saya ingin membangun project serupa.",
    seoTitle: "{name} — Studi Kasus Project",
    ctaTitle: "Tertarik membangun project seperti ini?",
    ctaDesc:
      "Ceritakan kebutuhan bisnis Anda — kami bantu dari perencanaan hingga deployment, dengan proses yang jelas di setiap tahapnya.",
    ctaSecondary: "Pelajari layanan kami",
  },

  journal: {
    metaTitle: "ZDL Journal — Artikel Teknologi, Web Development & Bisnis Digital",
    metaDesc:
      "Baca artikel ZDL Journal: panduan web development, tutorial, SEO, studi kasus, dan wawasan bisnis digital dari pengalaman mengerjakan project nyata.",
    ogTitle: "ZDL Journal — Wawasan Teknologi & Bisnis Digital",
    ogDesc:
      "Artikel praktis tentang web development, aplikasi, SEO, dan sistem bisnis — ditulis dari pengalaman project nyata.",
    heroEyebrow: "ZDL Journal",
    heroTitlePre: "Catatan dari",
    heroTitleAccent: "lapangan",
    heroTitlePost: ", bukan teori",
    heroDesc:
      "Pengalaman membangun dan merawat website untuk 16 brand nyata — ditulis ringkas, tanpa jargon berlebihan, dan bisa langsung dipraktikkan untuk bisnis Anda.",
    meta: ["Ditulis dari project nyata", "Bisa dipraktikkan"],
    ctaTitle: "Suka membacanya? Tunggu sampai bekerja sama.",
    ctaDesc:
      "Knowledge kami tidak berhenti di artikel — diskusikan kebutuhan bisnis Anda dan rasakan perbedaan partner teknis yang paham konteks.",
    ctaSecondary: "Lihat portfolio",
    ariaFilter: "Filter kategori artikel",
    empty: "Belum ada artikel pada kategori ini.",
    emptyPre: "Coba pilih kategori lain, atau kunjungi",
    emptyLink: "halaman utama",
    subscribeNote: "Artikel baru dipublikasikan secara berkala melalui ZDL CMS.",
    langNotice:
      "Artikel ini ditulis dalam Bahasa Indonesia — konten laporan/insight tetap bisa dibaca dengan bantuan penerjemah browser.",
  },

  journalDetail: {
    minutes: "{n} menit baca",
    team: "Tim ZDL",
    updated: "Terakhir diperbarui {date}",
    needPartner: "Butuh partner untuk membangun sistem digital bisnis Anda?",
    needPartnerDesc: "Konsultasi gratis via WhatsApp — tanpa kewajiban.",
    contact: "Hubungi ZDL",
    prev: "Artikel sebelumnya",
    next: "Artikel berikutnya",
    ariaPrevNext: "Artikel sebelumnya dan berikutnya",
    related: "Artikel terkait",
    featuredAlt: "Ilustrasi artikel: {name}",
    ctaTitle: "Punya pertanyaan seputar topik ini?",
    ctaDesc:
      "Diskusi singkat via WhatsApp bisa menjawab banyak hal — ceritakan konteks bisnis Anda dan kami bantu arahkan.",
  },

  demo: {
    metaTitle: "Demo — Coba Langsung Sistem yang Kami Bangun",
    metaDesc:
      "Wadah demo interaktif ZDL: coba langsung simulasi aplikasi kasir, sistem booking, dashboard, dan sistem lain yang bisa kami bangun untuk bisnis Anda — tanpa perlu daftar atau install apa pun.",
    ogTitle: "Demo ZDL — Zheng Digital Lab",
    ogDesc:
      "Coba langsung simulasi aplikasi yang bisa kami bangun: kasir, booking, dashboard, dan lainnya. Semua berjalan di browser, tanpa install.",
    heroEyebrow: "Wadah demo",
    heroTitlePre: "Jangan cuma baca —",
    heroTitleAccent: "coba langsung",
    heroDesc:
      "Setiap demo di halaman ini adalah simulasi berfungsi penuh dari sistem yang sering kami bangun untuk klien — kasir, payroll, stok gudang, booking, katalog pesan WhatsApp. Semua jalan di browser, tanpa daftar dan tanpa install.",
    metaCount: "{n} simulasi interaktif",
    metaFree: "Gratis",
    metaMobile: "Cocok dibuka dari HP",
    ctaTitle: "Mau sistem seperti ini untuk bisnis Anda?",
    ctaDesc:
      "Demo di halaman ini adalah simulasi ringan. Versi aslinya dibuat sesuai kebutuhan bisnis Anda — lengkap dengan data, laporan, dan integrasi yang Anda mau.",
    ctaSecondary: "Lihat layanan kami",
    ariaFilter: "Filter kategori demo",
    empty: "Belum ada demo pada kategori ini.",
    emptyDesc:
      "Demo baru terus ditambahkan. Mau melihat cara kerja sistem tertentu? Hubungi kami — kami siap menyiapkan sesi demo langsung untuk Anda.",
  },

  demoDetail: {
    accessWA: "Akses via WhatsApp",
    accessPublic: "Bisa dicoba langsung",
    requestAccess: "Minta akses demo via WhatsApp",
    tryNow: "Coba demo sekarang",
    openNow: "Buka demo sekarang",
    reqNote: "Demo ini butuh kredensial — kredensial dibagikan lewat WhatsApp.",
    publicNote: "Demo berjalan di browser, tidak perlu daftar atau install.",
    about: "Tentang demo ini",
    tryThese: "Yang bisa Anda coba",
    simNotePre: "Catatan: semua data pada demo ini adalah",
    simNoteBold: "data simulasi",
    simNotePost:
      "— tidak ada informasi asli yang disimpan. Versi produksi dibuat khusus sesuai kebutuhan bisnis Anda.",
    tech: "Teknologi",
    category: "Kategori",
    accessType: "Tipe akses",
    accessWAValue: "Via WhatsApp (kredensial)",
    accessPublicValue: "Publik — langsung dicoba",
    buildReal: "Bangun versi asli untuk saya",
    back: "Kembali ke galeri demo",
    more: "Demo lainnya",
    viewAll: "Semua demo",
    thumbAlt: "Tampilan demo {name}",
    seoTitle: "{name} — Demo Interaktif ZDL",
    waReq: "Halo ZDL, saya ingin minta akses demo \"{name}\". Terima kasih.",
    waBuild: "Halo ZDL, saya melihat demo \"{name}\". Saya ingin membangun sistem serupa untuk bisnis saya.",
    ctaTitle: "Dari simulasi ke sistem nyata",
    ctaDesc:
      "Yang Anda coba di sini hanya permukaannya. Versi produksinya mencakup data bisnis Anda, laporan, keamanan, dan integrasi — dibangun sesuai alur kerja Anda.",
    ctaSecondary: "Pelajari layanan kami",
  },

  card: {
    demoFallback: "Demo ZDL",
    requestAccess: "Minta akses",
    canTry: "Bisa dicoba",
    portfolioFallback: "ZDL Project",
  },

  contact: {
    metaTitle: "Contact — Konsultasikan Project Web & Aplikasi Anda",
    metaDesc:
      "Hubungi ZDL untuk konsultasi pembuatan website, aplikasi, dashboard, dan sistem digital. WhatsApp, email, atau form konsultasi — respon cepat 1×24 jam kerja.",
    ogTitle: "Contact ZDL — Zheng Digital Lab",
    ogDesc:
      "Konsultasikan project digital Anda: website, aplikasi, sistem internal, automation. Respon dalam 1×24 jam kerja.",
    heroEyebrow: "Kontak",
    heroTitlePre: "Mari diskusikan",
    heroTitleAccent: "project Anda",
    heroDesc:
      "Isi form di bawah atau langsung chat via WhatsApp — konsultasi awal gratis dan kami membalas setiap permintaan dalam 1×24 jam kerja.",
    meta: ["Respon 1×24 jam", "Senin–Sabtu 09.00–18.00 WIB", "Konsultasi awal gratis"],
    formTitle: "Form konsultasi project",
    requiredNote: "Semua field bertanda * wajib diisi.",
    direct: "Kontak langsung",
    emailLabel: "Email",
    locationLabel: "Lokasi",
    hoursLabel: "Jam respon",
    hours: "Senin–Sabtu, 09.00–18.00 WIB",
    social: "Social media",
    beforeTitle: "Sebelum menghubungi",
    beforeDesc:
      "Tidak perlu menyiapkan dokumen teknis. Cukup ceritakan: bisnis Anda menjalankan apa, proses apa yang ingin diperbaiki, dan hasil seperti apa yang Anda bayangkan. Kami akan memandu sisanya lewat pertanyaan yang tepat.",
    name: "Nama",
    namePlaceholder: "Nama lengkap Anda",
    business: "Nama bisnis / perusahaan",
    businessPlaceholder: "Opsional",
    email: "Email",
    whatsapp: "Nomor WhatsApp",
    whatsappPlaceholder: "08xx-xxxx-xxxx",
    projectType: "Jenis project",
    projectTypePlaceholder: "Pilih jenis project yang Anda butuhkan",
    projectTypes: [
      "Website (Landing Page / Company Profile)",
      "Website (E-Commerce)",
      "Web Application / SaaS",
      "Mobile Application",
      "Dashboard / Sistem Internal",
      "Excel / Google Sheets Automation",
      "SEO / Digital Marketing",
      "Domain / Hosting / Infrastructure",
      "Lainnya / Belum yakin",
    ],
    description: "Deskripsi kebutuhan project",
    descriptionPlaceholder:
      "Ceritakan konteks bisnis Anda dan apa yang ingin dibangun — semakin jelas konteksnya, semakin tepat rekomendasi kami.",
    sending: "Mengirim...",
    submit: "Discuss Your Project",
    waCta: "Konsultasi via WhatsApp",
    errTitle: "Periksa kembali isian Anda",
    errDesc: "Nama, email yang valid, dan deskripsi (min. 10 karakter) wajib diisi.",
    failTitle: "Gagal mengirim pesan",
    failDesc: "Terjadi kesalahan. Silakan coba lagi atau hubungi kami via WhatsApp.",
    netDesc: "Koneksi bermasalah. Silakan coba lagi atau hubungi kami via WhatsApp.",
    okTitle: "Pesan terkirim!",
    okDesc: "Terima kasih! Tim ZDL akan menghubungi Anda melalui email/WhatsApp dalam 1×24 jam kerja.",
    privacy:
      "Dengan mengirim form ini, Anda setuju untuk dihubungi oleh tim ZDL terkait kebutuhan project Anda. Data Anda hanya digunakan untuk keperluan komunikasi dan tidak dibagikan ke pihak ketiga.",
  },

  notFound: {
    title: "Halaman tidak ditemukan",
    body: "Halaman yang Anda cari mungkin sudah dipindahkan atau dihapus. Mari kembali ke jalur yang benar.",
    home: "Kembali ke Home",
    portfolio: "Lihat Portfolio",
  },
};

export default idDict;
