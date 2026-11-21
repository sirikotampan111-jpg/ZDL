/**
 * ZDL interactive demo — psychology tests (bilingual id/en).
 *
 * Two self-scored instruments:
 *  1. "bigfive"  — Big Five personality (OCEAN), 20 Likert items.
 *  2. "burnout"  — Work burnout check inspired by the Maslach dimensions
 *     (emotional exhaustion, cynicism, reduced efficacy), 12 Likert items.
 *
 * IMPORTANT: these are educational self-assessments, NOT clinical
 * diagnostic tools — the UI states this clearly.
 */

export type Localized = { id: string; en: string };

export interface PsychTrait {
  key: string;
  /** Higher score means MORE of this trait. */
  name: Localized;
  /** Short label for chart axes. */
  short: Localized;
  /** Band descriptions. */
  low: Localized;
  mid: Localized;
  high: Localized;
  /** When true, a high score is GOOD news (e.g. professional efficacy). */
  positive?: boolean;
}

export interface PsychItem {
  text: Localized;
  trait: string;
  /** Reverse-keyed item: answer 1 counts as 5. */
  reverse?: boolean;
}

export interface PsychTest {
  id: string;
  title: Localized;
  tagline: Localized;
  description: Localized;
  /** "±3 menit" style meta line. */
  duration: Localized;
  /** 5 Likert scale labels, low → high. */
  scale: Localized[];
  intro: Localized;
  traits: PsychTrait[];
  items: PsychItem[];
  /** CTA message for WhatsApp (product inquiry). */
  waMessage: Localized;
}

export const LIKERT_VALUES = [1, 2, 3, 4, 5] as const;

/* ====================================================================== */
/* TEST 1 — BIG FIVE PERSONALITY                                          */
/* ====================================================================== */

const bigfive: PsychTest = {
  id: "bigfive",
  title: { id: "Tes Kepribadian Big Five", en: "Big Five Personality Test" },
  tagline: {
    id: "Lima dimensi kepribadian — model paling banyak dipakai dalam psikologi modern",
    en: "Five personality dimensions — the most widely used model in modern psychology",
  },
  description: {
    id: "Mengukur lima dimensi kepribadian Anda: Keterbukaan terhadap Pengalaman, Ketelitian, Ekstroversi, Keramahan, dan Kestabilan Emosi. Cocok untuk self-assessment, persiapan psikotes kerja, atau memahami gaya kerja tim Anda.",
    en: "Measures five dimensions of your personality: Openness to Experience, Conscientiousness, Extraversion, Agreeableness, and Emotional Stability. Great for self-assessment, job psychotest prep, or understanding your team's working style.",
  },
  duration: { id: "20 pertanyaan · ±3 menit", en: "20 questions · ±3 min" },
  scale: [
    { id: "Sangat tidak setuju", en: "Strongly disagree" },
    { id: "Kurang setuju", en: "Disagree" },
    { id: "Netral", en: "Neutral" },
    { id: "Cukup setuju", en: "Agree" },
    { id: "Sangat setuju", en: "Strongly agree" },
  ],
  intro: {
    id: "Jawab sesuai keadaan Anda yang sehari-hari, bukan yang ideal. Tidak ada jawaban benar atau salah, dan hasil ini bersifat pribadi — tidak dikirim ke mana pun.",
    en: "Answer based on how you actually are day-to-day, not the ideal you. There are no right or wrong answers, and your results stay private — nothing is sent anywhere.",
  },
  traits: [
    {
      key: "openness",
      name: { id: "Keterbukaan terhadap Pengalaman", en: "Openness to Experience" },
      short: { id: "Keterbukaan", en: "Openness" },
      low: {
        id: "Anda cenderung memilih cara yang sudah terbukti dan familiar. Perubahan besar butuh alasan kuat, tapi gaya ini membuat eksekusi Anda konsisten dan jarang melenceng dari rencana.",
        en: "You tend to prefer proven, familiar approaches. Big changes need strong reasons, but this style makes your execution consistent and rarely derails from the plan.",
      },
      mid: {
        id: "Anda seimbang: terbuka pada ide baru selalu masuk akalnya, tapi tetap realistis menjaga hal-hal yang sudah berjalan baik.",
        en: "You are balanced: open to new ideas when they make sense, yet realistic about keeping what already works.",
      },
      high: {
        id: "Anda tertarik pada ide baru, abstrak, dan tidak biasa. Nyaman menjelajahi cara kerja alternatif — aset besar untuk inovasi, dengan catatan tidak terlalu sering ganti arah di tengah jalan.",
        en: "You are drawn to new, abstract, unconventional ideas. Exploring alternative approaches feels natural — a big asset for innovation, as long as you don't switch directions too often mid-flight.",
      },
    },
    {
      key: "conscientiousness",
      name: { id: "Ketelitian", en: "Conscientiousness" },
      short: { id: "Ketelitian", en: "Conscientiousness" },
      low: {
        id: "Anda fleksibel dan spontan, tapi jadwal serta detail kadang terlewat. Sistem pengingat dan checklist eksternal biasanya sangat membantu gaya kerja Anda.",
        en: "You are flexible and spontaneous, but schedules and details sometimes slip. External reminders and checklists usually help your working style a lot.",
      },
      mid: {
        id: "Anda cukup teratur: bisa mengikuti rencana, tapi tetap punya ruang santai tanpa merasa bersalah.",
        en: "You are fairly organized: able to follow plans while still leaving room to relax without guilt.",
      },
      high: {
        id: "Anda terorganisir, disiplin, dan menuntaskan apa yang mulai. Orang di sekitar Anda cenderung mengandalkan Anda untuk hal-hal yang butuh keakuratan dan kepatuhan pada tenggat.",
        en: "You are organized, disciplined, and finish what you start. People around you tend to rely on you for anything that needs accuracy and deadline discipline.",
      },
    },
    {
      key: "extraversion",
      name: { id: "Ekstroversi", en: "Extraversion" },
      short: { id: "Ekstroversi", en: "Extraversion" },
      low: {
        id: "Anda memperoleh energi dari waktu sendiri dan lingkungan yang tenang. Pikir dulu, bicara kemudian — pendekatan ini menghasilkan observasi tajam, apalagi di diskusi yang ramai.",
        en: "You recharge from time alone and calm environments. Think first, speak later — this produces sharp observations, especially in busy discussions.",
      },
      mid: {
        id: "Anda ambivert: nyaman bersosialisasi, tapi sama nyamannya menyendiri. Sesuaikan ritme Anda dengan situasi.",
        en: "You are an ambivert: comfortable socializing, equally comfortable alone. You adapt your pace to the situation.",
      },
      high: {
        id: "Anda energik di keramaian, mudah memulai percakapan, dan sering menjadi penggerak diskusi. Perhatikan agar waktu luang tetap ada untuk memulihkan energi.",
        en: "You are energized by crowds, start conversations easily, and often drive discussions. Just make sure to keep downtime to recover your energy.",
      },
    },
    {
      key: "agreeableness",
      name: { id: "Keramahan", en: "Agreeableness" },
      short: { id: "Keramahan", en: "Agreeableness" },
      low: {
        id: "Anda langsung, kritis, dan tidak ragu menantang ide. Gaya ini efektif untuk negosiasi dan keputusan sulit — selama disampaikan dengan empati, tidak mudah merusak hubungan.",
        en: "You are direct, critical, and unafraid to challenge ideas. Effective in negotiations and hard decisions — as long as it's delivered with empathy, it rarely damages relationships.",
      },
      mid: {
        id: "Anda bisa berempati sekaligus tegas — memilih momen yang tepat untuk berkompromi dan momen yang tepat untuk berdiri tegak.",
        en: "You can be empathetic and firm at once — choosing when to compromise and when to stand your ground.",
      },
      high: {
        id: "Anda kooperatif, mudah mempercayai orang, dan peka terhadap suasana tim. Pastikan kebutuhan pribadi Anda tidak selalu dikorbankan demi menjaga harmoni.",
        en: "You are cooperative, trusting, and sensitive to team morale. Just make sure your own needs aren't always sacrificed for harmony.",
      },
    },
    {
      key: "stability",
      name: { id: "Kestabilan Emosi", en: "Emotional Stability" },
      short: { id: "Stabilitas", en: "Stability" },
      low: {
        id: "Anda peka terhadap tekanan dan suasana hati bisa berubah cepat. Teknik pengelolaan stres yang rutin — jeda terjadwal, olahraga, atau journaling — akan terasa efeknya nyata.",
        en: "You are sensitive to pressure and your mood can shift quickly. A routine stress-management practice — scheduled breaks, exercise, or journaling — will make a real difference.",
      },
      mid: {
        id: "Reaksi emosional Anda umumnya terkendali; sesekali goyah di situasi bertekanan tinggi, tapi cepat pulih.",
        en: "Your emotional reactions are generally in check; occasionally shaken in high-pressure moments, but you recover fast.",
      },
      high: {
        id: "Anda tenang di bawah tekanan dan jarang panik. Keandalan emosional ini membuat Anda sering menjadi penyeimbang saat tim menghadapi situasi darurat.",
        en: "You stay calm under pressure and rarely panic. This emotional reliability often makes you the stabilizer when the team faces emergencies.",
      },
    },
  ],
  items: [
    { text: { id: "Saya tertarik mencoba hal-hal yang benar-benar baru bagi saya.", en: "I'm interested in trying things that are completely new to me." }, trait: "openness" },
    { text: { id: "Saya lebih suka rutinitas yang sudah saya kuasai.", en: "I prefer routines I have already mastered." }, trait: "openness", reverse: true },
    { text: { id: "Saya menikmati diskusi tentang ide abstrak.", en: "I enjoy discussions about abstract ideas." }, trait: "openness" },
    { text: { id: "Perubahan besar membuat saya tidak nyaman.", en: "Big changes make me uncomfortable." }, trait: "openness", reverse: true },

    { text: { id: "Saya menuntaskan tugas sebelum tenggat waktu.", en: "I finish tasks before the deadline." }, trait: "conscientiousness" },
    { text: { id: "Meja atau ruang kerja saya sering berantakan.", en: "My workspace is often messy." }, trait: "conscientiousness", reverse: true },
    { text: { id: "Saya membuat daftar rencana dan mengikutinya.", en: "I make plans and follow them." }, trait: "conscientiousness" },
    { text: { id: "Saya mudah terdistraksi dari pekerjaan yang sedang dikerjakan.", en: "I get easily distracted from the task at hand." }, trait: "conscientiousness", reverse: true },

    { text: { id: "Saya mudah memulai percakapan dengan orang baru.", en: "I find it easy to start conversations with new people." }, trait: "extraversion" },
    { text: { id: "Setelah seharian bertemu banyak orang, saya butuh waktu sendiri untuk memulihkan energi.", en: "After a day full of meetings, I need time alone to recharge." }, trait: "extraversion", reverse: true },
    { text: { id: "Di keramaian saya justru semakin bersemangat.", en: "Being around lots of people energizes me." }, trait: "extraversion" },
    { text: { id: "Saya biasanya memilih diam daripada bicara di forum besar.", en: "I usually stay quiet rather than speak up in large forums." }, trait: "extraversion", reverse: true },

    { text: { id: "Saya peduli dengan masalah orang lain.", en: "I care about other people's problems." }, trait: "agreeableness" },
    { text: { id: "Saya cenderung curiga terhadap niat orang yang baru dikenal.", en: "I tend to be suspicious of strangers' intentions." }, trait: "agreeableness", reverse: true },
    { text: { id: "Saya memilih kompromi daripada memperpanjang perdebatan.", en: "I prefer compromise over prolonging an argument." }, trait: "agreeableness" },
    { text: { id: "Saya tidak segan mengatakan hal yang tidak disukai orang kalau itu perlu.", en: "I don't hesitate to say things people dislike when it's necessary." }, trait: "agreeableness", reverse: true },

    { text: { id: "Saya jarang khawatir berlebihan terhadap hal kecil.", en: "I rarely worry excessively about small things." }, trait: "stability" },
    { text: { id: "Saya mudah tersinggung.", en: "I get irritated easily." }, trait: "stability", reverse: true },
    { text: { id: "Saya tetap tenang ketika rencana tiba-tiba berubah.", en: "I stay calm when plans suddenly change." }, trait: "stability" },
    { text: { id: "Saya sering merasa cemas tanpa alasan yang jelas.", en: "I often feel anxious without a clear reason." }, trait: "stability", reverse: true },
  ],
  waMessage: {
    id: "Halo ZDL, saya melihat demo Tes Kepribadian Big Five. Saya tertarik membangun sistem assessment/psikotes untuk kebutuhan tim atau bisnis saya.",
    en: "Hello ZDL, I saw your Big Five personality test demo. I'm interested in building an assessment/psychotest system for my team or business.",
  },
};

/* ====================================================================== */
/* TEST 2 — WORK BURNOUT CHECK                                            */
/* ====================================================================== */

const burnout: PsychTest = {
  id: "burnout",
  title: { id: "Cek Burnout Kerja", en: "Work Burnout Check" },
  tagline: {
    id: "Tiga sinyal kelelahan kerja — kelelahan emosional, sinisme, dan efikasi diri",
    en: "Three signals of work exhaustion — emotional exhaustion, cynicism, and self-efficacy",
  },
  description: {
    id: "Mengukur kondisi energi kerja Anda dari tiga dimensi yang biasa dipakai untuk mendeteksi burnout: kelelahan emosional, sikap sinis/terdistansiasi, dan penurunan efikasi profesional. Berguna sebagai pemantauan diri dan titik awal percakapan yang lebih sehat di tempat kerja.",
    en: "Measures your work energy across the three dimensions commonly used to detect burnout: emotional exhaustion, cynicism/detachment, and reduced professional efficacy. Useful for self-monitoring and as a starting point for healthier conversations at work.",
  },
  duration: { id: "12 pertanyaan · ±2 menit", en: "12 questions · ±2 min" },
  scale: [
    { id: "Tidak pernah", en: "Never" },
    { id: "Jarang", en: "Rarely" },
    { id: "Kadang-kadang", en: "Sometimes" },
    { id: "Sering", en: "Often" },
    { id: "Hampir setiap hari", en: "Almost every day" },
  ],
  intro: {
    id: "Jawab berdasarkan 30 hari terakhir. Ini bukan diagnosis — kalau hasilnya menunjukkan sinyal tinggi, anggap itu ajakan untuk beristirahat dan bicara dengan orang yang tepat.",
    en: "Answer based on the last 30 days. This is not a diagnosis — if your score is high, treat it as an invitation to rest and talk to the right people.",
  },
  traits: [
    {
      key: "exhaustion",
      name: { id: "Kelelahan Emosional", en: "Emotional Exhaustion" },
      short: { id: "Kelelahan", en: "Exhaustion" },
      low: {
        id: "Energi Anda terjaga. Pertahankan ritme kerja dan pemulihan yang sudah berjalan baik.",
        en: "Your energy is in good shape. Keep up the work rhythm and recovery habits that are already working.",
      },
      mid: {
        id: "Ada tanda kelelahan yang mulai menumpuk. Lindungi waktu pemulihan Anda — jadwal tidur, jeda tanpa layar, dan batasan kerja yang jelas.",
        en: "Signs of fatigue are starting to pile up. Protect your recovery time — sleep schedule, screen-free breaks, and clear work boundaries.",
      },
      high: {
        id: "Sinyal kelelahan kuat. Ini bukan kemalasan — biasanya ini tanda beban, ritme, atau lingkungan kerja yang perlu disesuaikan. Prioritaskan istirahat dan pertimbangkan membicarakannya dengan atasan atau profesional.",
        en: "Strong exhaustion signals. This is not laziness — it usually points to workload, pace, or environment that needs adjusting. Prioritize rest and consider discussing it with your manager or a professional.",
      },
    },
    {
      key: "cynicism",
      name: { id: "Sikap Sinis / Distansiasi", en: "Cynicism / Detachment" },
      short: { id: "Sinisme", en: "Cynicism" },
      low: {
        id: "Anda masih merasa terhubung dengan pekerjaan dan orang-orang di sekitarnya.",
        en: "You still feel connected to your work and the people around you.",
      },
      mid: {
        id: "Mulai ada jarak antara Anda dan pekerjaan. Coba re-connect: libatkan diri di satu proyek yang benar-benar Anda minati, atau bahas ulang pembagian tugas.",
        en: "Distance between you and your work is growing. Try reconnecting: get involved in one project you genuinely care about, or revisit how tasks are divided.",
      },
      high: {
        id: "Distansiasi tinggi — pekerjaan terasa seperti beban yang harus dihindari. Biasanya ini tanda hilangnya makna atau kontrol. Percakapan jujur tentang peran Anda bisa membuka pilihan yang tidak terpikirkan sebelumnya.",
        en: "High detachment — work feels like a burden to escape. This usually signals lost meaning or control. An honest conversation about your role can open options you hadn't considered.",
      },
    },
    {
      key: "efficacy",
      name: { id: "Efikasi Profesional", en: "Professional Efficacy" },
      short: { id: "Efikasi", en: "Efficacy" },
      positive: true,
      low: {
        id: "Rasa kompeten Anda sedang rendah — hal kecil pun terasa berat. Ingat kembali pencapaian nyata Anda 3–6 bulan terakhir, dan pilih satu tugas kecil yang bisa diselesaikan hari ini untuk memulihkan momentum.",
        en: "Your sense of competence is low right now — even small things feel heavy. Remind yourself of real achievements from the past 3–6 months, and pick one small task you can finish today to rebuild momentum.",
      },
      mid: {
        id: "Rasa efektif Anda cukup, tapi belum konsisten. Fokus pada satu area keahlian yang ingin Anda pertajam bulan ini.",
        en: "Your sense of effectiveness is okay but not consistent. Focus on one skill area you want to sharpen this month.",
      },
      high: {
        id: "Anda merasa kompeten dan produktif — fondasi penting untuk mencegah burnout. Bagikan keahlian itu: membantu rekan terbukti juga memperkuat rasa makna kerja Anda.",
        en: "You feel competent and productive — a key foundation that protects against burnout. Share it: helping colleagues also reinforces your own sense of meaning at work.",
      },
    },
  ],
  items: [
    { text: { id: "Pekerjaan membuat saya merasa lelah secara emosional.", en: "My work makes me feel emotionally drained." }, trait: "exhaustion" },
    { text: { id: "Saya merasa badan saya pegal dan lesu hanya karena memikirkan pekerjaan.", en: "Thinking about work alone makes me feel drained." }, trait: "exhaustion" },
    { text: { id: "Saya merasa kehabisan energi di akhir hari kerja.", en: "I feel out of energy at the end of a workday." }, trait: "exhaustion" },
    { text: { id: "Saya bangun pagi dengan merasa fresh dan siap bekerja.", en: "I wake up feeling fresh and ready to work." }, trait: "exhaustion", reverse: true },

    { text: { id: "Saya menjadi lebih sinis tentang nilai manfaat pekerjaan saya.", en: "I've become more cynical about whether my work matters." }, trait: "cynicism" },
    { text: { id: "Saya kurang peduli terhadap hasil kerja saya dibanding dulu.", en: "I care less about the quality of my work than I used to." }, trait: "cynicism" },
    { text: { id: "Saya merasa jarak antara saya dan rekan kerja semakin besar.", en: "I feel more distant from my colleagues." }, trait: "cynicism" },
    { text: { id: "Saya ragu pekerjaan saya berdampak pada apa pun.", en: "I doubt that my work makes any impact." }, trait: "cynicism" },

    { text: { id: "Saya mampu menyelesaikan masalah kerja dengan efektif.", en: "I can solve work problems effectively." }, trait: "efficacy", reverse: true },
    { text: { id: "Saya merasa produktif dan berkontribusi di pekerjaan saya.", en: "I feel productive and like I contribute at work." }, trait: "efficacy", reverse: true },
    { text: { id: "Saya yakin dengan kemampuan saya menangani tugas utama saya.", en: "I feel confident handling my main tasks." }, trait: "efficacy", reverse: true },
    { text: { id: "Saya sering merasa pekerjaan saya tidak berarti.", en: "I often feel like my work is meaningless." }, trait: "efficacy" },
  ],
  waMessage: {
    id: "Halo ZDL, saya melihat demo Cek Burnout Kerja. Saya tertarik membangun sistem survei kesehatan mental/engagement karyawan untuk organisasi saya.",
    en: "Hello ZDL, I saw your Work Burnout Check demo. I'm interested in building an employee well-being/engagement survey system for my organization.",
  },
};

export const psychTests: PsychTest[] = [bigfive, burnout];

export function getPsychTest(id: string): PsychTest | undefined {
  return psychTests.find((t) => t.id === id);
}

/* ====================================================================== */
/* SCORING                                                                */
/* ====================================================================== */

export interface TraitScore {
  key: string;
  score: number; // 0–100
  band: "low" | "mid" | "high";
}

export function scoreTest(test: PsychTest, answers: Record<number, number>): TraitScore[] {
  return test.traits.map((trait) => {
    const itemIdxs = test.items
      .map((it, idx) => ({ it, idx }))
      .filter(({ it }) => it.trait === trait.key);

    let sum = 0;
    for (const { it, idx } of itemIdxs) {
      const raw = answers[idx] ?? 3;
      sum += it.reverse ? 6 - raw : raw;
    }

    const max = itemIdxs.length * 5;
    const min = itemIdxs.length * 1;
    const score = max > min ? Math.round(((sum - min) / (max - min)) * 100) : 0;

    const band: TraitScore["band"] = score < 40 ? "low" : score <= 65 ? "mid" : "high";
    return { key: trait.key, score, band };
  });
}

export function pick(test: PsychTest, key: string): PsychTrait {
  return test.traits.find((tr) => tr.key === key) as PsychTrait;
}
