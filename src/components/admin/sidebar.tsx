"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FolderKanban,
  Newspaper,
  Tags,
  Images,
  Inbox,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/site/logo";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/portfolios", label: "Portfolio", icon: FolderKanban },
  { href: "/admin/journals", label: "Journal", icon: Newspaper },
  { href: "/admin/categories", label: "Kategori", icon: Tags },
  { href: "/admin/media", label: "Media Library", icon: Images },
  { href: "/admin/messages", label: "Pesan Masuk", icon: Inbox },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col border-r border-sidebar-border bg-sidebar lg:h-screen lg:w-64 lg:sticky lg:top-0">
      <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-4">
        <LogoMark className="h-9 w-9" />
        <div className="leading-none">
          <p className="font-bold">ZDL CMS</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Zheng Digital Lab</p>
        </div>
      </div>

      <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto p-3" aria-label="Menu admin">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-muted hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}

        <div className="my-3 border-t border-sidebar-border" />

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-muted hover:text-sidebar-foreground"
        >
          <ExternalLink className="h-4.5 w-4.5" />
          Lihat Website
        </Link>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-4.5 w-4.5" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
