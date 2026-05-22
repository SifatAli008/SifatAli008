"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  const { signInWithGoogle, signInWithEmail, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!loading && user) {
    router.replace(from);
    return null;
  }

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
      router.push(from);
    } catch {
      toast.error("Invalid credentials or Firebase not configured");
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      router.push(from);
    } catch {
      toast.error("Google sign-in failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="glass-strong w-full max-w-md rounded-2xl p-8">
        <h1 className="font-display text-2xl font-semibold text-white">
          Admin Login
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Firebase Auth — Google or email/password
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-8 w-full"
          onClick={handleGoogle}
        >
          Continue with Google
        </Button>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-zinc-600">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleEmail} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className="mt-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              className="mt-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>

        <Link
          href="/"
          className="mt-6 block text-center text-xs text-zinc-500 hover:text-white"
        >
          ← Back to site
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginForm />
    </Suspense>
  );
}
