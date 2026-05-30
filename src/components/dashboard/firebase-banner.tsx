"use client";

import { isFirebaseConfigured } from "@/lib/firebase/client";

export function FirebaseBanner() {
  if (isFirebaseConfigured()) return null;

  return (
    <div className="mb-6 border-2 border-accent bg-accent/10 px-4 py-3 text-sm text-cream">
      <p className="label-mono text-accent">FIREBASE</p>
      <p className="mt-1 text-zinc-300">
        Not configured — copy <code className="text-cream">.env.example</code> to{" "}
        <code className="text-cream">.env.local</code> and restart the dev server.
      </p>
    </div>
  );
}
