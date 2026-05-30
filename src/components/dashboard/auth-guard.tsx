"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { isAllowedAdminEmail } from "@/lib/auth/allowed-admins";
import { ADMIN_LOGIN_PATH } from "@/lib/admin/routes";
import { isFirebaseConfigured } from "@/lib/firebase/client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || !isFirebaseConfigured()) return;
    if (!user || !isAllowedAdminEmail(user.email)) {
      router.replace(
        `${ADMIN_LOGIN_PATH}?from=${encodeURIComponent(pathname)}`
      );
    }
  }, [user, loading, router, pathname]);

  if (loading && isFirebaseConfigured()) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
        Loading…
      </div>
    );
  }

  if (isFirebaseConfigured() && (!user || !isAllowedAdminEmail(user.email))) {
    return null;
  }

  return <>{children}</>;
}
