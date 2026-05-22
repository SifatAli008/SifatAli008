"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Code2, Mail, MapPin, Phone } from "lucide-react";
import { SectionReveal } from "@/components/motion/section-reveal";
import { ContactForm } from "@/components/site/contact-form";
import { Icon3D } from "@/components/ui/icon-3d";
import type { Profile } from "@/types";

interface ContactSectionProps {
  profile: Profile;
}

const socialConfig = [
  { key: "github" as const, label: "GITHUB", icon: Github },
  { key: "linkedin" as const, label: "LINKEDIN", icon: Linkedin },
  { key: "leetcode" as const, label: "LEETCODE", icon: Code2 },
];

export function ContactSection({ profile }: ContactSectionProps) {
  const socials = socialConfig
    .map((s) => ({
      ...s,
      href: profile.socials[s.key],
    }))
    .filter((s) => s.href);

  return (
    <SectionReveal id="contact" className="bg-accent">
      <div className="border-t-[3px] border-ink">
        <div className="site-container section-pad">
          <motion.h2
            className="font-display text-[clamp(80px,12vw,160px)] leading-[0.85] text-ink"
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            LET&apos;S TALK.
          </motion.h2>
          <a
            href={`mailto:${profile.email}`}
            className="mt-6 inline-flex items-center gap-3 font-mono text-2xl text-ink underline-offset-4 hover:underline"
          >
            <Icon3D icon={Mail} size="sm" boxClassName="!bg-ink [&_svg]:text-cream" />
            {profile.email}
          </a>

          <div className="mt-16 grid grid-cols-1 border-2 border-ink lg:grid-cols-2">
            <div className="border-b-2 border-ink p-8 lg:border-b-0 lg:border-r-2">
              <div className="divide-y-2 divide-ink">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <motion.a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between py-4 font-sans text-[15px] font-medium tracking-[0.08em] text-ink"
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <span className="flex items-center gap-3">
                        <span className="icon-3d-box flex h-9 w-9 items-center justify-center border-2 border-ink bg-cream group-hover:bg-ink group-hover:[&_svg]:text-cream">
                          <Icon className="h-4 w-4" strokeWidth={2.5} />
                        </span>
                        {s.label} ↗
                      </span>
                    </motion.a>
                  );
                })}
              </div>
              <p className="label-mono mt-10 flex items-start gap-2 text-[13px] text-ink">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                BASED IN {profile.location.toUpperCase()}. / OPEN TO REMOTE.
              </p>
              {profile.phone && (
                <p className="label-mono mt-4 flex items-center gap-2 text-[13px] text-ink">
                  <Phone className="h-4 w-4" />
                  {profile.phone}
                </p>
              )}
            </div>

            <div className="p-8">
              <ContactForm variant="brutal" />
            </div>
          </div>
        </div>
      </div>
      <div className="h-[3px] w-full bg-ink" />
    </SectionReveal>
  );
}
