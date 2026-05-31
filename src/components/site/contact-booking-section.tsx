"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Mail, Video } from "lucide-react";
import { SectionReveal } from "@/components/motion/section-reveal";
import { Icon3D } from "@/components/ui/icon-3d";
import {
  BookingCalendar,
  getDefaultBookingSlot,
  type BookingSlot,
} from "@/components/site/booking-calendar";
import { ProjectInquiryForm } from "@/components/site/project-inquiry-form";
import type { Profile } from "@/types";
import { PROFILE_AVATAR } from "@/lib/cloudinary/assets";

const DEFAULT_AVATAR = PROFILE_AVATAR;

interface ContactBookingSectionProps {
  profile: Profile;
}

export function ContactBookingSection({ profile }: ContactBookingSectionProps) {
  const tzLabel = profile.timezone?.includes("GMT")
    ? `Bangladesh Time (${profile.timezone})`
    : profile.timezone || "GMT+6";
  const [slot, setSlot] = useState<BookingSlot>(() => getDefaultBookingSlot(tzLabel));
  const calendarRef = useRef<HTMLDivElement>(null);
  const avatar = profile.avatar ?? DEFAULT_AVATAR;

  const scrollToCalendar = () => {
    calendarRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <SectionReveal id="contact" className="bg-accent">
      <div className="border-t-[3px] border-ink">
        <div className="site-container section-pad">
          <motion.h2
            className="font-display text-[clamp(56px,10vw,140px)] leading-[0.85] text-ink"
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            LET&apos;S TALK.
          </motion.h2>
          <a
            href={`mailto:${profile.email}`}
            className="mt-6 inline-flex items-center gap-3 font-mono text-lg text-ink underline-offset-4 hover:underline md:text-xl"
          >
            <Icon3D icon={Mail} size="sm" boxClassName="!bg-ink [&_svg]:text-cream" />
            {profile.email}
          </a>

          <div className="mt-14 grid grid-cols-1 border-[3px] border-ink lg:grid-cols-2">
            {/* Left — book a call (on accent) */}
            <div className="border-b-[3px] border-ink p-6 md:p-8 lg:border-b-0 lg:border-r-[3px]">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden border-2 border-ink">
                  <Image
                    src={avatar}
                    alt={profile.name}
                    fill
                    className="object-cover object-top"
                    sizes="48px"
                  />
                </div>
                <p className="label-mono text-ink">{profile.name.toUpperCase()}</p>
              </div>

              <h3 className="mt-6 font-display text-[clamp(2rem,4vw,3rem)] leading-none text-ink">
                BOOK A QUICK CALL
              </h3>
              <p className="mt-4 max-w-lg font-sans text-[15px] leading-relaxed text-ink/85">
                {profile.headline}
              </p>

              <div className="label-mono mt-6 flex flex-wrap gap-6 text-[12px] text-ink">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" strokeWidth={2.5} />
                  30M
                </span>
                <span className="flex items-center gap-2">
                  <Video className="h-4 w-4" strokeWidth={2.5} />
                  GOOGLE MEET
                </span>
              </div>

              <div ref={calendarRef} className="mt-8">
                <BookingCalendar
                  timezoneLabel={tzLabel}
                  value={slot}
                  onChange={setSlot}
                />
              </div>
            </div>

            {/* Right — project form on cream */}
            <div className="bg-cream p-6 md:p-8">
              <p className="label-mono text-accent">TELL ME ABOUT YOUR PROJECT</p>
              <h3 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-none text-ink">
                HAVE A PROJECT
                <br />
                IDEA IN MIND?
              </h3>

              <div className="mt-8">
                <ProjectInquiryForm
                  selectedSlot={slot}
                  onChangeTimeSlot={scrollToCalendar}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[3px] w-full bg-ink" />
    </SectionReveal>
  );
}
