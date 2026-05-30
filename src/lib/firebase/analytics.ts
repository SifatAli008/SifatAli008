"use client";

import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { app } from "@/lib/firebase/client";

let analyticsInstance: Analytics | null = null;

/** Lazy-init Analytics in the browser only */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined" || !app) return null;
  if (analyticsInstance) return analyticsInstance;
  if (!(await isSupported())) return null;

  analyticsInstance = getAnalytics(app);
  return analyticsInstance;
}
