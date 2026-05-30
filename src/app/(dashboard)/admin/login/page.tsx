"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth, consumeAuthRedirect } from "@/lib/auth/context";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { getAuthErrorMessage, isAuthCancelled } from "@/lib/auth/errors";
import { BrutalButton } from "@/components/ui/brutal-button";
import { ADMIN_HOME_PATH } from "@/lib/admin/routes";
import { isAllowedAdminEmail } from "@/lib/auth/allowed-admins";

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function LoginForm() {
  const { signInWithGoogle, signInWithGoogleRedirect, signInWithEmail, user, loading } =
    useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? ADMIN_HOME_PATH;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authHint, setAuthHint] = useState<string | null>(null);

  if (!loading && user && isAllowedAdminEmail(user.email)) {
    router.replace(consumeAuthRedirect(from));
    return null;
  }

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Enter email and password");
      return;
    }
    setSubmitting(true);
    setAuthHint(null);
    try {
      await signInWithEmail(email.trim(), password);
      router.push(from);
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setAuthHint(null);
    try {
      await signInWithGoogle(from);
      router.push(from);
    } catch (error) {
      if (isAuthCancelled(error)) {
        toast.message("Sign-in cancelled");
        return;
      }
      const message = getAuthErrorMessage(error);
      toast.error(message);
      setAuthHint(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleRedirect = async () => {
    setGoogleLoading(true);
    setAuthHint(null);
    try {
      await signInWithGoogleRedirect(from);
    } catch (error) {
      const message = getAuthErrorMessage(error);
      toast.error(message);
      setAuthHint(message);
      setGoogleLoading(false);
    }
  };

  const firebaseReady = isFirebaseConfigured();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-ink px-6 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #f5f0e8 0px, #f5f0e8 1px, transparent 1px, transparent 48px), repeating-linear-gradient(90deg, #f5f0e8 0px, #f5f0e8 1px, transparent 1px, transparent 48px)",
        }}
      />

      <div className="relative w-full max-w-md">
        <div
          className="border-[3px] border-ink bg-cream p-8 md:p-10"
          style={{ boxShadow: "10px 10px 0 0 #ff3b00" }}
        >
          <p className="label-mono text-accent">ADMIN</p>
          <h1 className="mt-2 font-display text-4xl leading-none tracking-tight text-ink">
            LOGIN
          </h1>
          <p className="mt-3 text-sm text-ink/70">
            Sign in to manage projects, blog, and site content.
          </p>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={!firebaseReady || googleLoading || submitting}
            className="btn-3d mt-8 flex w-full items-center justify-center gap-3 border-2 border-ink bg-cream px-4 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleGoogleRedirect}
            disabled={!firebaseReady || googleLoading || submitting}
            className="mt-3 w-full border-2 border-ink/20 py-2 font-mono text-[10px] uppercase tracking-wider text-ink/60 transition-colors hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            Popup blocked? Sign in with redirect
          </button>

          {authHint && (
            <div className="mt-4 border-2 border-accent bg-accent/10 p-3 text-xs leading-relaxed text-ink">
              <p className="label-mono text-accent">SETUP CHECKLIST</p>
              <ol className="mt-2 list-decimal space-y-1 pl-4 text-ink/80">
                <li>
                  Firebase Console → Authentication → Sign-in method →{" "}
                  <strong>Enable Google</strong>
                </li>
                <li>
                  Authentication → Settings → Authorized domains → add{" "}
                  <strong>{typeof window !== "undefined" ? window.location.hostname : "localhost"}</strong>
                </li>
                <li>Support email required when enabling Google</li>
              </ol>
            </div>
          )}

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-ink/20" />
            <span className="label-mono text-muted">OR</span>
            <div className="h-px flex-1 bg-ink/20" />
          </div>

          <form onSubmit={handleEmail} className="space-y-5">
            <div>
              <label htmlFor="email" className="label-mono text-ink">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                disabled={!firebaseReady || submitting || googleLoading}
                className="field-brutal-box mt-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="label-mono text-ink">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={!firebaseReady || submitting || googleLoading}
                className="field-brutal-box mt-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <BrutalButton
              type="submit"
              variant="accent"
              className="w-full justify-center py-3.5"
              disabled={!firebaseReady || submitting || googleLoading}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </BrutalButton>
          </form>
        </div>

        <Link
          href="/"
          className="label-mono mt-6 flex items-center justify-center gap-2 text-cream/60 transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to site
        </Link>
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
