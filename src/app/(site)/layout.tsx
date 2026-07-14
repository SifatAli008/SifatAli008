import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LazySifatAiChat } from "@/components/site/lazy-sifat-ai-chat";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:border-2 focus:border-ink focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-cream"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content">{children}</main>
      <LazySifatAiChat />
      <Footer />
    </>
  );
}
