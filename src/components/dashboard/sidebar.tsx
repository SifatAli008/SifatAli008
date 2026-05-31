"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Sparkles,
  Briefcase,
  Trophy,
  Settings,
  LogOut,
  ChevronLeft,
  Mail,
  Linkedin,
  Layers,
  FlaskConical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/context";
import { ADMIN_HOME_PATH } from "@/lib/admin/routes";

const nav = [
  { href: ADMIN_HOME_PATH, icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/projects", icon: FolderKanban, label: "Projects" },
  { href: "/admin/featured", icon: Linkedin, label: "Featured" },
  { href: "/admin/blog", icon: FileText, label: "Blog" },
  { href: "/admin/skills", icon: Sparkles, label: "Skills" },
  { href: "/admin/experience", icon: Briefcase, label: "Experience" },
  { href: "/admin/research", icon: FlaskConical, label: "Research" },
  { href: "/admin/tech-stack", icon: Layers, label: "Tech stack" },
  { href: "/admin/achievements", icon: Trophy, label: "Achievements" },
  { href: "/admin/contacts", icon: Mail, label: "Contacts" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function DashboardSidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { signOut, user } = useAuth();
  const initial = (user?.displayName?.[0] ?? user?.email?.[0] ?? "A").toUpperCase();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r-2 border-white/10 bg-ink transition-all",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b-2 border-white/10 px-3",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {!collapsed && (
          <Link
            href={ADMIN_HOME_PATH}
            className="font-display text-lg tracking-wide text-cream"
          >
            ADMIN
          </Link>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="border-2 border-white/10 p-2 text-zinc-400 transition-colors hover:border-accent hover:text-accent"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")}
          />
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== ADMIN_HOME_PATH && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "relative flex items-center gap-3 border-2 px-3 py-2.5 text-sm transition-all",
                active
                  ? "border-accent bg-accent/10 text-cream shadow-[3px_3px_0_0_rgba(255,59,0,0.2)]"
                  : "border-transparent text-zinc-500 hover:translate-x-0.5 hover:border-white/10 hover:bg-white/[0.04] hover:text-zinc-200"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 bg-accent" />
              )}
              <item.icon
                className={cn("h-4 w-4 shrink-0", active && "text-accent")}
                strokeWidth={2.5}
              />
              {!collapsed && <span className="label-mono text-[11px]">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t-2 border-white/10 p-3">
        {!collapsed && user && (
          <div className="mb-3 flex items-center gap-2 px-2 py-1">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/10 bg-white/[0.04] text-xs font-bold text-accent">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium text-cream">
                {user.displayName ?? "Admin"}
              </p>
              <p className="truncate text-[9px] text-zinc-600">{user.email}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 border-2 border-transparent px-3 py-2.5 text-sm text-zinc-500 transition-colors hover:border-white/10 hover:text-zinc-200"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="label-mono text-[11px]">Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
