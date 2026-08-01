"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SifatAiChat = dynamic(
  () =>
    import("@/components/site/sifat-ai-chat").then((mod) => mod.SifatAiChat),
  { ssr: false, loading: () => null }
);

/** Load chat only after idle / first interaction so first paint stays light. */
export function LazySifatAiChat() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let done = false;
    const enable = () => {
      if (done) return;
      done = true;
      setReady(true);
      cleanup();
    };

    const onInteract = () => enable();
    const idleId =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(() => enable(), { timeout: 4000 })
        : undefined;
    const timer = window.setTimeout(enable, 5000);

    const cleanup = () => {
      window.clearTimeout(timer);
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("scroll", onInteract);
    };

    window.addEventListener("pointerdown", onInteract, { once: true, passive: true });
    window.addEventListener("keydown", onInteract, { once: true });
    window.addEventListener("scroll", onInteract, { once: true, passive: true });

    return cleanup;
  }, []);

  if (!ready) return null;
  return <SifatAiChat />;
}
