"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Briefcase, Download, FolderKanban, Layers } from "lucide-react";
import { BrutalButton } from "@/components/ui/brutal-button";
import { HeroSocialLinks } from "@/components/site/hero-social-links";
import { HeroMetrics } from "@/components/site/hero-metrics";
import { Typewriter } from "@/components/motion/typewriter";
import { PROFILE_AVATAR } from "@/lib/cloudinary/assets";
import type { Profile } from "@/types";

const DEFAULT_AVATAR = PROFILE_AVATAR;
const DEFAULT_DOMAINS = ["EdTech", "MedTech", "SaaS", "AI"];

interface HeroProps {
  profile: Profile;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const slideUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function Hero({ profile }: HeroProps) {
  const avatarSrc = profile.avatar ?? DEFAULT_AVATAR;
  const domains = profile.domains?.length ? profile.domains : DEFAULT_DOMAINS;

  return (
    <section className="bg-cream">
      <motion.div
        className="border-b-[3px] border-ink bg-ink"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="site-container flex flex-wrap items-center justify-between gap-4 py-3">
          {profile.availableForWork && (
            <motion.span
              className="label-mono flex items-center gap-2 text-cream"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="inline-block h-2 w-2 bg-accent pulse-dot" />
              [ AVAILABLE FOR WORK ]
            </motion.span>
          )}
          <span className="label-mono text-cream md:ml-auto">
            {profile.location.toUpperCase()} · {profile.timezone}
          </span>
        </div>
      </motion.div>

      <motion.div
        className="site-container section-pad !pb-16 md:!pb-20"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <motion.div variants={slideLeft} className="lg:col-span-7">
            <p className="label-mono text-muted">01 / INTRO</p>

            <div className="mt-3 flex items-end gap-3">
              <h1 className="font-display text-hero leading-[0.88] tracking-[-0.02em] text-ink">
                SIFAT AL<span className="text-accent">I</span>
              </h1>
              <span
                className="mb-2 hidden h-16 w-2 shrink-0 bg-accent sm:block md:h-20"
                aria-hidden
              />
            </div>

            <motion.div
              className="mt-6 h-[3px] w-full max-w-lg bg-ink"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ originX: 0 }}
            />

            <p className="label-mono mt-6 flex items-center gap-2 text-ink">
              <Briefcase className="h-3.5 w-3.5 icon-animate" strokeWidth={2.5} />
              {profile.tagline.toUpperCase()}
            </p>

            {/* Domains */}
            <motion.div
              className="mt-6 w-fit max-w-full border-2 border-ink bg-cream p-4 md:p-5"
              style={{ boxShadow: "5px 5px 0 0 #0a0a0a" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              <p className="label-mono flex items-center gap-2 text-muted">
                <Layers className="h-3.5 w-3.5" strokeWidth={2.5} />
                DOMAIN
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {domains.map((domain, i) => (
                  <motion.span
                    key={domain}
                    className="label-mono border-2 border-ink bg-cream px-3 py-1.5 text-ink transition-colors hover:bg-ink hover:text-cream"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    whileHover={{ x: -2, y: -2 }}
                  >
                    {domain.toUpperCase()}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="mt-5 inline-flex min-h-[2.75rem] min-w-[min(100%,320px)] items-center border-2 border-ink bg-ink px-4 py-2"
              style={{ boxShadow: "4px 4px 0 0 #ff3b00" }}
            >
              <p className="font-mono text-sm text-cream">
                <Typewriter words={profile.typewriterRoles} />
              </p>
            </motion.div>

            <p className="mt-6 max-w-xl border-l-[4px] border-accent pl-4 text-[17px] leading-[1.85] text-ink/90">
              {profile.headline}
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <BrutalButton
                href="/#work"
                variant="primary"
                icon={FolderKanban}
                iconPosition="left"
              >
                VIEW WORK
              </BrutalButton>
              <BrutalButton
                href={profile.resumeUrl ?? "/resume.pdf"}
                variant="outline"
                icon={Download}
                external
                download
              >
                RESUME
              </BrutalButton>
            </div>

            <HeroSocialLinks profile={profile} />
          </motion.div>

          <motion.div variants={slideUp} className="lg:col-span-5 lg:pt-8">
            <motion.div
              className="relative"
              whileHover={{ x: -2, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
              <div
                className="absolute -right-2 -top-2 z-20 border-2 border-ink bg-accent px-3 py-1"
                aria-hidden
              >
                <span className="label-mono text-cream">PORTRAIT</span>
              </div>

              <div
                className="relative border-[3px] border-ink bg-ink"
                style={{ boxShadow: "8px 8px 0 0 #0a0a0a" }}
              >
                <motion.div
                  className="relative aspect-[4/5] w-full overflow-hidden"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={avatarSrc}
                    alt={`${profile.name} — portrait`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover object-top grayscale transition-[filter] duration-300 hover:grayscale-0"
                  />
                </motion.div>
                <motion.div
                  className="flex items-center justify-between border-t-[3px] border-ink bg-cream px-4 py-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <div>
                    <p className="font-display text-xl leading-none text-ink">
                      {profile.name.toUpperCase()}
                    </p>
                    <p className="label-mono mt-1 text-muted">
                      {profile.location.split(",")[0].toUpperCase()}
                    </p>
                  </div>
                  <span className="font-display text-4xl text-accent">↗</span>
                </motion.div>
              </div>

              <span
                className="pointer-events-none absolute -left-4 bottom-12 hidden font-display text-[72px] leading-none text-ink/[0.06] lg:block"
                aria-hidden
              >
                SA
              </span>
            </motion.div>
          </motion.div>
        </div>

        <HeroMetrics profile={profile} />
      </motion.div>
    </section>
  );
}
