"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Check,
  Info,
  MessageCircle,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/client";
import { site } from "@/lib/site";
import { pick, psychTests, scoreTest, type Localized, type PsychTest, type TraitScore } from "@/content/psych-tests";
import { cn } from "@/lib/utils";

type Stage = "intro" | "run" | "result";

const LABELS = {
  id: {
    pickTitle: "Pilih tes yang mau dicoba",
    pickHint: "Semua berjalan di browser Anda — jawaban tidak dikirim ke mana pun.",
    start: "Mulai tes",
    questions: "pertanyaan",
    back: "Kembali",
    next: "Lanjut",
    seeResult: "Lihat hasil",
    finish: "Selesai & lihat hasil",
    unanswered: "{n} pertanyaan belum terjawab — tombol selesai aktif setelah semua terisi",
    resultTitle: "Hasil Anda",
    dominant: "Paling menonjol",
    riskHigh: "Sinyal burnout tinggi",
    riskMid: "Sinyal burnout menengah",
    riskLow: "Kondisi energi kerja terjaga",
    riskEfficacy: "Perhatian: rasa kompeten sedang menurun",
    band: { low: "Rendah", mid: "Sedang", high: "Tinggi" } as Record<string, string>,
    disclaimer:
      "Catatan penting: hasil ini adalah gambaran diri untuk edukasi dan refleksi — bukan diagnosis medis/psikologis. Untuk kondisi yang mengganggu kehidupan Anda, konsultasikan dengan psikolog atau psikiater.",
    privacy: "Privasi: jawaban dan hasil diproses sepenuhnya di perangkat Anda, tidak ada data yang dikirim ke server.",
    again: "Ulangi tes ini",
    otherTest: "Coba tes lain",
    waCta: "Pesan sistem assessment seperti ini",
    simulateNote: "Demo interaktif oleh ZDL — versi produksinya bisa disambungkan ke HRIS, dikirim via email, atau diisi karyawan lalu direkap otomatis per tim.",
    lastRun: "Terakhir dikerjakan",
    q: "Pertanyaan",
    of: "dari",
  },
  en: {
    pickTitle: "Pick a test to try",
    pickHint: "Everything runs in your browser — your answers never leave your device.",
    start: "Start the test",
    questions: "questions",
    back: "Back",
    next: "Next",
    seeResult: "See results",
    finish: "Finish & see results",
    unanswered: "{n} question(s) left — the finish button unlocks once everything is answered",
    resultTitle: "Your results",
    dominant: "Most prominent",
    riskHigh: "High burnout signals",
    riskMid: "Moderate burnout signals",
    riskLow: "Work energy looks healthy",
    riskEfficacy: "Attention: your sense of competence is dipping",
    band: { low: "Low", mid: "Moderate", high: "High" } as Record<string, string>,
    disclaimer:
      "Important note: this result is a self-reflection snapshot for education — it is not a medical or psychological diagnosis. For anything that disrupts your life, please consult a psychologist or psychiatrist.",
    privacy: "Privacy: answers and results are processed entirely on your device — no data is sent to any server.",
    again: "Retake this test",
    otherTest: "Try the other test",
    waCta: "Order a system like this",
    simulateNote: "Interactive demo by ZDL — the production version can plug into your HRIS, be sent by email, or filled in by employees with automatic per-team recaps.",
    lastRun: "Last taken",
    q: "Question",
    of: "of",
  },
};

function L(l: Localized, locale: "id" | "en"): string {
  return l[locale];
}

function fmtTemplate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_m, key: string) => String(vars[key] ?? ""));
}

/** Overall burnout verdict from the three dimension scores. */
function burnoutVerdict(scores: TraitScore[], labels: (typeof LABELS)["id"]): { text: string; tone: "danger" | "warn" | "ok" } {
  const get = (k: string) => scores.find((s) => s.key === k);
  const exhaustion = get("exhaustion");
  const cynicism = get("cynicism");
  const efficacy = get("efficacy");

  const strainHigh = exhaustion?.band === "high" || cynicism?.band === "high";
  const strainMid = exhaustion?.band === "mid" || cynicism?.band === "mid";
  const efficacyLow = efficacy?.band === "low";

  if (strainHigh && efficacyLow) return { text: labels.riskHigh, tone: "danger" };
  if (strainHigh) return { text: labels.riskHigh, tone: "danger" };
  if (strainMid || efficacyLow) return { text: efficacyLow ? labels.riskEfficacy : labels.riskMid, tone: "warn" };
  return { text: labels.riskLow, tone: "ok" };
}

const BAND_STYLE: Record<TraitScore["band"], string> = {
  low: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  mid: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  high: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

const TONE_STYLE = {
  danger: "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400",
  warn: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  ok: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

export function DemoPsikologi() {
  const locale = useLocale();
  const t = LABELS[locale];
  const [stage, setStage] = useState<Stage>("intro");
  const [test, setTest] = useState<PsychTest | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [scores, setScores] = useState<TraitScore[]>([]);
  const [lastRun, setLastRun] = useState<{ title: string; date: string } | null>(null);

  // Read-back of the localStorage history (client-only, after mount).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("zdl-psych-last");
      if (raw) setLastRun(JSON.parse(raw));
    } catch {
      // storage unavailable
    }
  }, []);

  const answeredCount = Object.keys(answers).length;
  const progress = test ? Math.round((answeredCount / test.items.length) * 100) : 0;
  const item = test?.items[current];
  const isLast = test ? current === test.items.length - 1 : false;
  const allAnswered = test ? answeredCount === test.items.length : false;

  function startTest(t0: PsychTest) {
    setTest(t0);
    setAnswers({});
    setCurrent(0);
    setScores([]);
    setStage("run");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function choose(value: number) {
    if (!test) return;
    const next = { ...answers, [current]: value };
    setAnswers(next);
    // Small delay so the selection is visible before sliding forward.
    setTimeout(() => {
      if (current < test.items.length - 1) {
        setCurrent((c) => c + 1);
      }
    }, 180);
  }

  function finish() {
    if (!test) return;
    const s = scoreTest(test, answers);
    setScores(s);
    setStage("result");
    try {
      window.localStorage.setItem(
        "zdl-psych-last",
        JSON.stringify({ title: L(test.title, locale), date: new Date().toISOString() })
      );
    } catch {
      // storage unavailable
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ------------------------------------------------------------ INTRO */
  if (stage === "intro") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mono-label flex items-center gap-3 text-muted-foreground">
          <BrainCircuit className="h-4 w-4 text-primary" />
          <span>{L(psychTests[0].title, locale)} · {L(psychTests[1].title, locale)}</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {t.pickTitle}
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
          {t.pickHint}
        </p>
        {lastRun && (
          <p className="mono-label mt-4 text-muted-foreground/80">
            {t.lastRun}: {lastRun.title} ·{" "}
            {new Date(lastRun.date).toLocaleDateString(locale === "en" ? "en-GB" : "id-ID")}
          </p>
        )}

        <div className="mt-8 grid gap-4">
          {psychTests.map((test0) => (
            <button
              key={test0.id}
              type="button"
              onClick={() => startTest(test0)}
              className="group rounded-2xl border border-border bg-card p-6 text-left transition-all hover:border-primary/50 hover:shadow-[0_4px_20px_-6px_rgba(16,16,24,0.18)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight group-hover:text-primary">
                    {L(test0.title, locale)}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-primary/90">{L(test0.tagline, locale)}</p>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {L(test0.description, locale)}
                  </p>
                </div>
                <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-all group-hover:border-primary group-hover:text-primary sm:flex">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
              <div className="mono-label mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
                <span>{L(test0.duration, locale)}</span>
                <span aria-hidden="true" className="text-border">/</span>
                <span>{test0.traits.length} {locale === "en" ? "dimensions" : "dimensi"}</span>
                <span aria-hidden="true" className="text-border">/</span>
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {locale === "en" ? "100% in-browser" : "100% di browser"}
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-6 flex items-start gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {t.privacy}
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------------- RUN */
  if (stage === "run" && test && item) {
    const selected = answers[current];
    const scaleLabel = selected ? test.scale[selected - 1] : null;

    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        {/* Progress */}
        <div className="flex items-center justify-between gap-4">
          <span className="mono-label text-muted-foreground">
            {t.q} {current + 1} {t.of} {test.items.length}
          </span>
          <button
            type="button"
            onClick={() => setStage("intro")}
            className="font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            ← {L(test.title, locale)}
          </button>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${Math.max(progress, 4)}%` }}
          />
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.18 }}
            className="mt-8 rounded-2xl border border-border bg-card p-7 sm:p-9"
          >
            <h2 className="text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
              {L(item.text, locale)}
            </h2>

            <div className="mt-7 grid gap-2.5">
              {(Array.from({ length: 5 }, (_, i) => i + 1) as number[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => choose(v)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all",
                    answers[current] === v
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                      answers[current] === v ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    )}
                  >
                    {answers[current] === v && <Check className="h-3.5 w-3.5" />}
                  </span>
                  {L(test.scale[v - 1], locale)}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Nav */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.back}
          </Button>
          {isLast ? (
            <Button
              onClick={finish}
              disabled={!allAnswered}
              className="rounded-full bg-primary text-primary-foreground"
            >
              {t.finish}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setCurrent((c) => Math.min(test.items.length - 1, c + 1))}
              disabled={answers[current] === undefined}
            >
              {t.next}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        {!allAnswered && isLast && (
          <p className="mt-3 text-center font-mono text-[11px] text-amber-600 dark:text-amber-400">
            {fmtTemplate(t.unanswered, { n: test.items.length - answeredCount })}
          </p>
        )}
        <p className="mt-4 text-center font-mono text-[11px] text-muted-foreground/70">
          {scaleLabel ? `↳ ${L(scaleLabel, locale)}` : ""}
        </p>
      </div>
    );
  }
  if (stage === "result" && test) {
    const radarData = scores.map((s) => ({
      trait: L(pick(test, s.key).short, locale),
      value: s.score,
    }));
    const dominant = [...scores].sort((a, b) => b.score - a.score)[0];
    const verdict = test.id === "burnout" ? burnoutVerdict(scores, t) : null;

    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mono-label text-muted-foreground">{L(test.title, locale)}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">{t.resultTitle}</h1>
          </div>
          {verdict && (
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold",
                TONE_STYLE[verdict.tone]
              )}
            >
              {verdict.text}
            </span>
          )}
        </div>

        {/* Chart — radar for 4+ dims, bars otherwise */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          {scores.length >= 4 ? (
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="72%">
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis
                    dataKey="trait"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    dataKey="value"
                    stroke="var(--primary)"
                    fill="var(--primary)"
                    fillOpacity={0.22}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="space-y-5">
              {scores.map((s) => (
                <div key={s.key}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-medium">{L(pick(test, s.key).name, locale)}</span>
                    <span className="font-mono text-xs text-muted-foreground">{s.score}/100</span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-border">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        s.key === "efficacy" ? "bg-emerald-500" : "bg-primary"
                      )}
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Per-trait breakdown */}
        <div className="mt-6 space-y-4">
          {scores.map((s) => {
            const trait = pick(test, s.key);
            return (
              <div key={s.key} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold tracking-tight">{L(trait.name, locale)}</h3>
                  <span
                    className={cn(
                      "rounded-full border px-3 py-0.5 text-xs font-semibold",
                      BAND_STYLE[trait.positive ? (s.band === "high" ? "low" : s.band === "low" ? "high" : "mid") : s.band]
                    )}
                  >
                    {t.band[s.band]} · {s.score}
                  </span>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {L(trait[s.band], locale)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Dominant trait (Big Five only) */}
        {test.id === "bigfive" && dominant && (
          <p className="mono-label mt-6 text-muted-foreground">
            {t.dominant}: {L(pick(test, dominant.key).name, locale)} ({dominant.score})
          </p>
        )}

        {/* Disclaimer */}
        <p className="mt-8 flex items-start gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {t.disclaimer}
        </p>

        {/* CTA row */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="flex-1 rounded-full bg-primary font-semibold text-primary-foreground"
          >
            <a
              href={`https://wa.me/${site.whatsapp.intl}?text=${encodeURIComponent(L(test.waMessage, locale))}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              {t.waCta}
            </a>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-6" onClick={() => startTest(test)}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            {t.again}
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="rounded-full px-6"
            onClick={() => setStage("intro")}
          >
            {t.otherTest}
          </Button>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground/80">
          {t.simulateNote}
        </p>
      </div>
    );
  }

  return null;
}

/** Small back-link used by the demo page header. */
export function PsychBackLink({ locale }: { locale: "id" | "en" }) {
  return (
    <Link
      href={locale === "en" ? "/en/demo" : "/demo"}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
    >
      <ArrowLeft className="h-4 w-4" />
      {locale === "en" ? "Back to demos" : "Kembali ke galeri demo"}
    </Link>
  );
}
