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

export default async function AdminOverviewPage() {
  const [
    totalPortfolios,
    totalJournals,
    publishedJournals,
    draftJournals,
    totalPortfolioCategories,
    totalJournalCategories,
    unreadMessages,
    recentPortfolios,
    recentJournals,
    recentMessages,
  ] = await Promise.all([
    db.portfolio.count(),
    db.journal.count(),
    db.journal.count({ where: { status: "PUBLISHED" } }),
    db.journal.count({ where: { status: "DRAFT" } }),
    db.portfolioCategory.count(),
    db.journalCategory.count(),
    db.contactMessage.count({ where: { isRead: false } }),
    db.portfolio.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
    db.journal.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
    db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

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
