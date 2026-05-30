"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { shouldFallbackToRedirect } from "@/lib/auth/errors";
import {
  isAllowedAdminEmail,
  UnauthorizedAdminError,
} from "@/lib/auth/allowed-admins";
import { ADMIN_HOME_PATH } from "@/lib/admin/routes";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: (redirectPath?: string) => Promise<void>;
  signInWithGoogleRedirect: (redirectPath?: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

function setSessionCookie(user: User | null) {
  if (user && isAllowedAdminEmail(user.email)) {
    document.cookie = `firebase-auth-session=1; path=/; max-age=86400; SameSite=Lax`;
  } else {
    document.cookie =
      "firebase-auth-session=; path=/; max-age=0; SameSite=Lax";
  }
}

async function enforceAdminAccess(user: User | null): Promise<User | null> {
  if (!user) return null;
  if (isAllowedAdminEmail(user.email)) return user;
  if (auth) await firebaseSignOut(auth);
  return null;
}

function storeRedirectPath(path: string) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("auth_redirect", path);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    void getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user && !isAllowedAdminEmail(result.user.email)) {
          await firebaseSignOut(auth!);
        }
      })
      .catch(() => {
        /* login page shows error if needed */
      });

    const unsub = onAuthStateChanged(auth, async (u) => {
      const allowedUser = await enforceAdminAccess(u);
      setUser(allowedUser);
      setSessionCookie(allowedUser);
      setLoading(false);
    });

    return unsub;
  }, []);

  const signInWithGoogleRedirect = async (redirectPath = ADMIN_HOME_PATH) => {
    if (!auth) throw new Error("Firebase not configured");
    storeRedirectPath(redirectPath);
    await signInWithRedirect(auth, googleProvider);
  };

  const signInWithGoogle = async (redirectPath = ADMIN_HOME_PATH) => {
    if (!auth) throw new Error("Firebase not configured");
    storeRedirectPath(redirectPath);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (!isAllowedAdminEmail(result.user.email)) {
        await firebaseSignOut(auth);
        throw new UnauthorizedAdminError();
      }
    } catch (error) {
      if (shouldFallbackToRedirect(error)) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase not configured");
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (!isAllowedAdminEmail(cred.user.email)) {
      await firebaseSignOut(auth);
      throw new UnauthorizedAdminError();
    }
  };

  const signOut = async () => {
    if (auth) await firebaseSignOut(auth);
    setSessionCookie(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithGoogleRedirect,
        signInWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function consumeAuthRedirect(fallback = ADMIN_HOME_PATH): string {
  if (typeof window === "undefined") return fallback;
  const stored = sessionStorage.getItem("auth_redirect");
  if (stored) sessionStorage.removeItem("auth_redirect");
  return stored || fallback;
}
