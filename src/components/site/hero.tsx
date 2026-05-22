"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Briefcase, Download, FolderKanban } from "lucide-react";
import { BrutalButton } from "@/components/ui/brutal-button";
import { HeroSocialLinks } from "@/components/site/hero-social-links";
import { HeroMetrics } from "@/components/site/hero-metrics";
import { Typewriter } from "@/components/motion/typewriter";
import type { Profile } from "@/types";

const DEFAULT_AVATAR = "/assets/images/profile-image.jpeg";

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

  return (
    <section className="bg-cream">
      <div className="border-b-[3px] border-ink bg-ink">
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
      </div>

      <motion.div
        className="site-container section-pad !pb-16 md:!pb-20"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <motion.div variants={slideLeft} className="lg:col-span-7">
            <p className="label-mono text-muted">01 / INTRO</p>
            <h1 className="mt-3 font-display text-hero leading-[0.88] tracking-[-0.02em] text-ink">
              SIFAT AL<span className="text-accent">I</span>
            </h1>
            <div className="mt-6 h-[3px] w-full max-w-md bg-ink" />
            <p className="label-mono mt-6 flex items-center gap-2 text-ink">
              <Briefcase className="h-3.5 w-3.5 icon-animate" strokeWidth={2.5} />
              {profile.tagline.toUpperCase()}
            </p>
            <p className="mt-3 min-h-[1.5rem] font-mono text-sm text-ink/70">
              <Typewriter words={profile.typewriterRoles} />
            </p>
            <p className="mt-6 max-w-xl text-[17px] leading-[1.8] text-ink/90">
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

          <motion.div
            variants={slideUp}
            className="lg:col-span-5 lg:pt-8"
          >
            <div className="relative">
              <div
                className="absolute -right-2 -top-2 z-20 border-2 border-ink bg-accent px-3 py-1"
                aria-hidden
              >
                <span className="label-mono text-cream">PORTRAIT</span>
              </div>

              <motion.div
                className="relative border-[3px] border-ink bg-ink"
                style={{ boxShadow: "8px 8px 0 0 #0a0a0a" }}
                whileHover={{ x: -4, y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={avatarSrc}
                    alt={`${profile.name} — portrait`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover object-top grayscale transition-[filter] duration-300 hover:grayscale-0"
                  />
                </div>
                <div className="flex items-center justify-between border-t-[3px] border-ink bg-cream px-4 py-3">
                  <div>
                    <p className="font-display text-xl leading-none text-ink">
                      {profile.name.toUpperCase()}
                    </p>
                    <p className="label-mono mt-1 text-muted">
                      {profile.location.split(",")[0].toUpperCase()}
                    </p>
                  </div>
                  <span className="font-display text-4xl text-accent">↗</span>
                </div>
              </motion.div>

              <span
                className="pointer-events-none absolute -left-4 bottom-12 hidden font-display text-[72px] leading-none text-ink/[0.06] lg:block"
                aria-hidden
              >
                SA
              </span>
            </div>
          </motion.div>
        </div>

        <HeroMetrics profile={profile} />
      </motion.div>
    </section>
  );
}
