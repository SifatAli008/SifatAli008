import type { Metadata } from "next";
import {
  Bebas_Neue,
  Space_Grotesk,
  JetBrains_Mono,
  DM_Serif_Display,
} from "next/font/google";
import { Toaster } from "sonner";
import { defaultMetadata, serializeJsonLd, siteWideJsonLd } from "@/lib/seo";
import "highlight.js/styles/github.css";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  weight: ["400"],
  style: ["italic"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteSchema = siteWideJsonLd();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteSchema) }}
        />
      </head>
      <body
        className={`${bebas.variable} ${spaceGrotesk.variable} ${jetbrains.variable} ${dmSerif.variable} font-sans antialiased`}
      >
        {children}
        <Toaster
          theme="light"
          position="bottom-right"
          toastOptions={{
            style: {
              border: "2px solid #0A0A0A",
              borderRadius: "0",
              background: "#F5F0E8",
              color: "#0A0A0A",
            },
          }}
        />
      </body>
    </html>
  );
}
