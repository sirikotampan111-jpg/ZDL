import Link from "next/link";
import {
  FolderKanban,
  Newspaper,
  Tags,
  Inbox,
  FileText,
  EyeOff,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/site";

export const dynamic = "force-dynamic";

type Q<T> = { label: string; data: T; error?: string };

async function q<T>(label: string, fn: () => Promise<T>): Promise<Q<T>> {
  try {
    return { label, data: await fn() };
  } catch (e) {
    return {
      label,
      data: null as T,
      error: e instanceof Error ? `${e.name}: ${e.message}` : String(e),
    };
  }
}

export default async function AdminOverviewPage() {
  const queryList: Array<[string, () => Promise<unknown>]> = [
    ["portfolio.count()", () => db.portfolio.count()],
    ["journal.count()", () => db.journal.count()],
    ["journal.count(PUBLISHED)", () => db.journal.count({ where: { status: "PUBLISHED" } })],
    ["journal.count(DRAFT)", () => db.journal.count({ where: { status: "DRAFT" } })],
    ["portfolioCategory.count()", () => db.portfolioCategory.count()],
    ["journalCategory.count()", () => db.journalCategory.count()],
    ["contactMessage.count(unread)", () => db.contactMessage.count({ where: { isRead: false } })],
    ["portfolio.findMany(recent)", () =>
      db.portfolio.findMany({ orderBy: { updatedAt: "desc" }, take: 5 })
    ],
    ["journal.findMany(recent)", () =>
      db.journal.findMany({ orderBy: { updatedAt: "desc" }, take: 5 })
    ],
    ["contactMessage.findMany(recent)", () =>
      db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
    ],
  ];

  // Run queries SEQUENTIALLY — never in parallel.
  // The serverless database pool is tiny (connection_limit=1 through PgBouncer);
  // parallel fan-out causes Prisma P2024 "connection pool timeout" on Vercel.
  const results: Q<unknown>[] = [];
  for (const [label, fn] of queryList) {
    results.push(await q(label, fn));
  }

  const failed = results.filter((r) => r.error);

  // ── Diagnostic mode: show the real DB error instead of crashing with 500 ──
  if (failed.length > 0) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard — mode diagnostik</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {failed.length} dari {results.length} query database gagal dijalankan di server
            produksi. Pesan error asli ditampilkan di bawah ini untuk memudahkan diagnosis.
          </p>
        </div>
        <ul className="space-y-2 rounded-2xl border border-border bg-card p-5 font-mono text-xs leading-relaxed">
          {results.map((r) => (
            <li key={r.label} className={r.error ? "text-destructive" : "text-emerald-600"}>
              {r.error ? (
                <>
                  <span className="font-bold">GAGAL</span> {r.label} → {r.error}
                </>
              ) : (
                <>
                  <span className="font-bold">OK</span>&nbsp;&nbsp; {r.label}
                </>
              )}
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          Waktu server: {new Date().toISOString()} • Region function &amp; koneksi database
          dapat memengaruhi hasil. Setelah masalah diperbaiki, dashboard akan kembali normal
          secara otomatis.
        </p>
      </div>
    );
  }

  const totalPortfolios = results[0].data as number;
  const totalJournals = results[1].data as number;
  const publishedJournals = results[2].data as number;
  const draftJournals = results[3].data as number;
  const totalPortfolioCategories = results[4].data as number;
  const totalJournalCategories = results[5].data as number;
  const unreadMessages = results[6].data as number;
  const recentPortfolios = results[7].data as Awaited<
    ReturnType<typeof db.portfolio.findMany>
  >;
  const recentJournals = results[8].data as Awaited<ReturnType<typeof db.journal.findMany>>;
  const recentMessages = results[9].data as Awaited<
    ReturnType<typeof db.contactMessage.findMany>
  >;

  const stats = [
    { label: "Total Portfolio", value: totalPortfolios, icon: FolderKanban, href: "/admin/portfolios" },
    { label: "Total Artikel", value: totalJournals, icon: Newspaper, href: "/admin/journals" },
    { label: "Terpublikasi", value: publishedJournals, icon: FileText, href: "/admin/journals" },
    { label: "Draft", value: draftJournals, icon: EyeOff, href: "/admin/journals" },
    { label: "Kategori Portfolio", value: totalPortfolioCategories, icon: Tags, href: "/admin/categories" },
    { label: "Kategori Journal", value: totalJournalCategories, icon: Tags, href: "/admin/categories" },
    { label: "Pesan Belum Dibaca", value: unreadMessages, icon: Inbox, href: "/admin/messages" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ringkasan konten ZDL — semua data dapat dikelola tanpa menyentuh source code.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" className="rounded-full bg-primary text-primary-foreground">
            <Link href="/admin/portfolios/new">
              <Plus className="mr-1.5 h-4 w-4" />
              Portfolio Baru
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link href="/admin/journals/new">
              <Plus className="mr-1.5 h-4 w-4" />
              Artikel Baru
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <stat.icon className="h-5 w-5 text-primary" />
            <p className="mt-3 text-2xl font-bold">{stat.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground group-hover:text-foreground">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold">Portfolio terbaru diperbarui</h2>
            <Link
              href="/admin/portfolios"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Kelola <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </header>
          <ul className="divide-y divide-border">
            {recentPortfolios.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(p.updatedAt)} • {p.published ? "Publik" : "Draft"}
                    {p.featured ? " • Featured" : ""}
                  </p>
                </div>
                <Button asChild variant="ghost" size="sm" className="shrink-0 rounded-full">
                  <Link href={`/admin/portfolios/${p.id}`}>Edit</Link>
                </Button>
              </li>
            ))}
            {recentPortfolios.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-muted-foreground">
                Belum ada portfolio.
              </li>
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold">Artikel terbaru diperbarui</h2>
            <Link
              href="/admin/journals"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Kelola <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </header>
          <ul className="divide-y divide-border">
            {recentJournals.map((j) => (
              <li key={j.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{j.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(j.updatedAt)} • {j.status === "PUBLISHED" ? "Publik" : "Draft"}
                  </p>
                </div>
                <Button asChild variant="ghost" size="sm" className="shrink-0 rounded-full">
                  <Link href={`/admin/journals/${j.id}`}>Edit</Link>
                </Button>
              </li>
            ))}
            {recentJournals.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-muted-foreground">
                Belum ada artikel.
              </li>
            )}
          </ul>
        </section>
      </div>

      {/* Recent messages */}
      <section className="rounded-2xl border border-border bg-card">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold">Pesan konsultasi terbaru</h2>
          <Link
            href="/admin/messages"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Semua pesan <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </header>
        <ul className="divide-y divide-border">
          {recentMessages.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {m.name}
                  {!m.isRead && (
                    <span className="ml-2 inline-block rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      BARU
                    </span>
                  )}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {m.projectType || "Tanpa kategori"} • {formatDate(m.createdAt)}
                </p>
              </div>
              <Button asChild variant="ghost" size="sm" className="shrink-0 rounded-full">
                <Link href="/admin/messages">Lihat</Link>
              </Button>
            </li>
          ))}
          {recentMessages.length === 0 && (
            <li className="px-5 py-8 text-center text-sm text-muted-foreground">
              Belum ada pesan masuk.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
