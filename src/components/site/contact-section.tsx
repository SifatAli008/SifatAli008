import { ContactBookingSection } from "@/components/site/contact-booking-section";
import type { Profile } from "@/types";

interface ContactSectionProps {
  profile: Profile;
}

export function ContactSection({ profile }: ContactSectionProps) {
  return <ContactBookingSection profile={profile} />;
}
