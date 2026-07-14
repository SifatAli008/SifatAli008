"use client";

import dynamic from "next/dynamic";

const SifatAiChat = dynamic(
  () =>
    import("@/components/site/sifat-ai-chat").then((mod) => mod.SifatAiChat),
  { ssr: false, loading: () => null }
);

/** Lazily load the chat widget so homepage first paint stays lighter. */
export function LazySifatAiChat() {
  return <SifatAiChat />;
}
