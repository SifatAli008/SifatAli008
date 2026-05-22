"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/lib/auth/context";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/dashboard/login";
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AuthProvider>
      {isLogin ? (
        children
      ) : (
        <div className="min-h-screen bg-background">
          <DashboardSidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed(!collapsed)}
          />
          <div
            className={cn(
              "min-h-screen transition-all",
              collapsed ? "pl-[72px]" : "pl-64"
            )}
          >
            <div className="border-b border-white/[0.06] bg-background/80 px-8 py-4 backdrop-blur">
              <p className="text-xs text-zinc-500">
                <kbd className="rounded border border-white/10 px-1.5 py-0.5">
                  ⌘K
                </kbd>{" "}
                shortcuts · Premium admin
              </p>
            </div>
            <div className="p-8">{children}</div>
          </div>
        </div>
      )}
    </AuthProvider>
  );
}
