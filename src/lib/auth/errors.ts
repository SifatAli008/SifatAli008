import { FirebaseError } from "firebase/app";

import { UnauthorizedAdminError } from "@/lib/auth/allowed-admins";

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof UnauthorizedAdminError) {
    return "This Google account doesn’t have dashboard access.";
  }

  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/operation-not-allowed":
        return "Google sign-in is off. Firebase Console → Authentication → Sign-in method → enable Google.";
      case "auth/unauthorized-domain":
        return `Domain not authorized. Add "${getHostname()}" in Firebase Console → Authentication → Settings → Authorized domains.`;
      case "auth/popup-blocked":
        return "Popup blocked — use redirect sign-in or allow popups for this site.";
      case "auth/popup-closed-by-user":
        return "Sign-in cancelled.";
      case "auth/cancelled-popup-request":
        return "Another sign-in popup is already open.";
      case "auth/network-request-failed":
        return "Network error. Check your connection and try again.";
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Invalid email or password.";
      case "auth/too-many-requests":
        return "Too many attempts. Wait a few minutes and try again.";
      default:
        return error.message || `Sign-in failed (${error.code}).`;
    }
  }

  if (error instanceof Error) return error.message;
  return "Sign-in failed. Please try again.";
}

function getHostname(): string {
  if (typeof window === "undefined") return "localhost";
  return window.location.hostname;
}

export function shouldFallbackToRedirect(error: unknown): boolean {
  if (!(error instanceof FirebaseError)) return false;
  return (
    error.code === "auth/popup-blocked" ||
    error.code === "auth/cancelled-popup-request"
  );
}

export function isAuthCancelled(error: unknown): boolean {
  return error instanceof FirebaseError && error.code === "auth/popup-closed-by-user";
}
