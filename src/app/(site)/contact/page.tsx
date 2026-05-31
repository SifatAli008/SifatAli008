import type { Metadata } from "next";
import { getProfile } from "@/lib/firebase/queries";
import { buildPageMetadata } from "@/lib/seo";
import { ContactSection } from "@/components/site/contact-section";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact - Work With Sifat Ali",
  description:
    "Book a call or send a project inquiry to Sifat Ali - AI/RAG engineer and full-stack builder.",
  path: "/contact",
});

export default async function ContactPage() {
  const profile = await getProfile();

  return <ContactSection profile={profile} />;
}
