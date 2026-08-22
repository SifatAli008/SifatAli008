import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LazySifatAiChat } from "@/components/site/lazy-sifat-ai-chat";
import { SiteBootLoader } from "@/components/site/loading-screen";
import { LocaleProvider } from "@/components/i18n/locale-provider";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocaleProvider>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "document.documentElement.classList.add('boot-loading');document.body&&(document.body.style.overflow='hidden');",
        }}
      />
      <SiteBootLoader />
      <Header />
      <main id="main-content">{children}</main>
      <LazySifatAiChat />
      <Footer />
    </LocaleProvider>
  );
}
