import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LazySifatAiChat } from "@/components/site/lazy-sifat-ai-chat";
import { SiteBootLoader } from "@/components/site/loading-screen";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteBootLoader />
      <Header />
      <main id="main-content">{children}</main>
      <LazySifatAiChat />
      <Footer />
    </>
  );
}
