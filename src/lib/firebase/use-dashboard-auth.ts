"use client";

import { useAuth } from "@/lib/auth/context";
import { isAllowedAdminEmail } from "@/lib/auth/allowed-admins";
import { isFirebaseConfigured } from "@/lib/firebase/client";

/**
 * Dashboard Firestore reads/writes require a signed-in Firebase user.
 * AuthGuard blocks the UI, but hooks should still wait for `ready`.
 */
export function useDashboardAuth() {
  const { user, loading } = useAuth();
  const configured = isFirebaseConfigured();

  return {
    user,
    loading,
    ready: configured ? !loading && !!user && isAllowedAdminEmail(user.email) : true,
  };
}
