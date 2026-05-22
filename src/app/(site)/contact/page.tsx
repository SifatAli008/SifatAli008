import type { Metadata } from "next";
import { getProfile } from "@/lib/firebase/queries";
import { ContactSection } from "@/components/site/contact-section";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Sifat Ali for opportunities and collaborations.",
};

export default async function ContactPage() {
  const profile = await getProfile();

  return <ContactSection profile={profile} />;
}
