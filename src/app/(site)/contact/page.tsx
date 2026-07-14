import type { Metadata } from "next";
import { getProfile } from "@/lib/firebase/queries";
import {
  buildPageMetadata,
  contactPageJsonLd,
  personJsonLd,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { ContactSection } from "@/components/site/contact-section";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Contact Sifat Ali - Book a Call",
    description:
      "Book a call or email Sifat Ali for AI/RAG, full-stack, and product work. Fast path: sifatali008@gmail.com.",
    path: "/contact",
  }),
  title: {
    absolute: "Contact Sifat Ali - Book a Call | AI & Full-Stack",
  },
};

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <>
      <JsonLd data={[contactPageJsonLd(), personJsonLd(profile)]} />
      <ContactSection profile={profile} />
    </>
  );
}
