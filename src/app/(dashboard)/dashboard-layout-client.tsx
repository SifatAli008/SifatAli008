"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/lib/auth/context";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { AuthGuard } from "@/components/dashboard/auth-guard";
import { FirebaseBanner } from "@/components/dashboard/firebase-banner";
import { getFirebaseAnalytics } from "@/lib/firebase/analytics";
import { getAdminPageTitle } from "@/lib/admin/nav-labels";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { ADMIN_HOME_PATH, ADMIN_LOGIN_PATH } from "@/lib/admin/routes";

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === ADMIN_LOGIN_PATH;
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    void getFirebaseAnalytics();
  }, []);

  return (
    <AuthProvider>
      {isLogin ? (
        children
      ) : (
        <AuthGuard>
          <div className="dashboard-shell">
            <DashboardSidebar
              collapsed={collapsed}
              onToggle={() => setCollapsed(!collapsed)}
            />
            <DashboardMain collapsed={collapsed} pathname={pathname}>
              <FirebaseBanner />
              {children}
            </DashboardMain>
          </div>
        </AuthGuard>
      )}
    </AuthProvider>
  );
}

function DashboardMain({
  collapsed,
  pathname,
  children,
}: {
  collapsed: boolean;
  pathname: string;
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const pageTitle = getAdminPageTitle(pathname);
  const isOverview = pathname === ADMIN_HOME_PATH;
  const initial = (user?.displayName?.[0] ?? user?.email?.[0] ?? "A").toUpperCase();

  return (
    <div
      className={cn(
        "flex h-screen flex-col overflow-hidden transition-all duration-200",
        collapsed ? "pl-[72px]" : "pl-64"
      )}
    >
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        aria-hidden
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #f5f0e8 0px, #f5f0e8 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #f5f0e8 0px, #f5f0e8 1px, transparent 1px, transparent 40px)",
        }}
      />

      <header className="relative z-30 shrink-0 border-b-2 border-white/10 bg-background/95 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-8">
          <div>
            <p className="label-mono text-[10px] text-zinc-600">
              SIFAT ALI · ADMIN
              {!isOverview && (
                <>
                  <span className="mx-2 text-white/20">/</span>
                  <span className="text-accent">{pageTitle}</span>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="label-mono hidden items-center gap-1.5 border-2 border-white/10 px-3 py-2 text-[10px] text-zinc-400 transition-colors hover:border-accent hover:text-accent sm:inline-flex"
            >
              Live site
              <ExternalLink className="h-3 w-3" />
            </Link>
            <div className="flex items-center gap-2 border-2 border-white/10 bg-white/[0.03] px-3 py-2">
              <span className="flex h-7 w-7 items-center justify-center border border-accent/40 bg-accent/10 text-xs font-bold text-accent">
                {initial}
              </span>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-xs font-medium text-cream">
                  {user?.displayName ?? "Admin"}
                </p>
                <p className="truncate text-[10px] text-zinc-600">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
        <div className="mx-auto max-w-[1400px] p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
