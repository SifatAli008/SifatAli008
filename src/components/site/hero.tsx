"use client";

import { motion } from "framer-motion";
import { ArrowDown, Download, FolderKanban } from "lucide-react";
import { BrutalButton } from "@/components/ui/brutal-button";
import { HeroSocialLinks } from "@/components/site/hero-social-links";
import { HeroMetrics, HeroOrbitMetrics } from "@/components/site/hero-metrics";
import type { Profile } from "@/types";

const HERO_PORTRAIT = "/assets/images/hero-portrait.png?v=6";

const ROLES = [
  "AI/RAG ENGINEER",
  "FULL-STACK BUILDER",
  "COO @ FLUVO SOFT",
  "HACKATHON WINNER",
];

const BG_WORDS = [
  { text: "MACHINE LEARNING", className: "left-[8%] top-[10%] rotate-[3deg]" },
  { text: "FULL STACK", className: "right-[6%] top-[14%] rotate-[6deg]" },
  { text: "RAG", className: "left-[4%] top-[42%] -rotate-[5deg]" },
  { text: "AUTOMATION", className: "right-[5%] top-[48%] rotate-[4deg]" },
  { text: "PYTHON", className: "left-[12%] bottom-[18%] rotate-[5deg]" },
  { text: "FIREBASE", className: "right-[10%] bottom-[22%] -rotate-[4deg]" },
  { text: "CLOUD", className: "left-[38%] top-[16%] rotate-[2deg]" },
  { text: "RESEARCH", className: "right-[28%] top-[11%] -rotate-[5deg]" },
];

const BIO =
  "I build AI systems that shouldn't be fragile — then ship them to production. Clarity before complexity.";

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: easeOut },
  }),
};

const fadeSide = (dir: "left" | "right") => ({
  hidden: { opacity: 0, x: dir === "left" ? -28 : 28 },
  show: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, delay, ease: easeOut },
  }),
});

interface HeroProps {
  profile: Profile;
}

export function Hero({ profile }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-cream">
      {/* Atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
        aria-hidden
      >
        {BG_WORDS.map((word, i) => (
          <motion.span
            key={word.text}
            className={`absolute font-display text-[clamp(1rem,2.4vw,2rem)] leading-none tracking-wide text-ink/[0.03] ${word.className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 + i * 0.07 }}
          >
            {word.text}
          </motion.span>
        ))}
        <div
          className="absolute inset-0 opacity-[0.028]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #0a0a0a 1px, transparent 1px), linear-gradient(to bottom, #0a0a0a 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      {/* Desktop / large — 3-column cinematic frame */}
      <div className="relative z-[1] hidden min-h-[calc(100dvh-4.25rem)] lg:block">
        <h1 className="sr-only">{profile.name}</h1>

        {/* Giant name */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[10%] z-0 flex select-none justify-center xl:top-[8%]"
          aria-hidden
        >
          <div className="flex items-baseline">
            <motion.span
              className="font-display text-[clamp(7rem,22vw,16rem)] leading-[0.72] tracking-[-0.07em] text-accent"
              initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: easeOut }}
            >
              SIFAT
            </motion.span>
            <span className="w-[min(5vw,48px)] shrink-0 sm:w-[min(4.5vw,56px)]" aria-hidden />
            <motion.span
              className="-ml-3 font-display text-[clamp(7rem,22vw,16rem)] leading-[0.72] tracking-[-0.07em] text-accent md:-ml-4"
              initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.08, ease: easeOut }}
            >
              ALI
            </motion.span>
          </div>
        </div>

        <div className="site-container relative z-10 grid h-full min-h-[calc(100dvh-4.25rem)] grid-cols-[minmax(130px,170px)_minmax(0,1fr)_minmax(180px,240px)] items-stretch gap-4 pt-6 xl:gap-6 xl:pt-8">
          {/* LEFT */}
          <motion.div
            className="relative z-20 flex flex-col justify-end gap-8 pb-[20%] pt-[28%]"
            variants={fadeSide("left")}
            initial="hidden"
            animate="show"
            custom={0.28}
          >
            <div className="flex flex-col gap-2">
              <motion.p
                className="label-mono tracking-[0.16em] text-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                01 / INTRO
              </motion.p>
              {ROLES.map((role, i) => (
                <motion.p
                  key={role}
                  className="font-sans text-[11px] font-bold uppercase leading-tight tracking-[0.14em] text-ink xl:text-xs"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1 - i * 0.07, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.07, duration: 0.4, ease: easeOut }}
                >
                  {role}
                </motion.p>
              ))}
            </div>
            <HeroSocialLinks profile={profile} ghost align="left" />
          </motion.div>

          {/* CENTER */}
          <div className="relative z-10 flex items-end justify-center gap-3 self-end xl:gap-5">
            <div className="mb-[16%] shrink-0">
              <HeroOrbitMetrics profile={profile} side="left" />
            </div>

            <motion.div
              className="relative w-full max-w-[400px] xl:max-w-[430px]"
              initial={{ opacity: 0, y: 36, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.12, ease: easeOut }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <div
                  className="pointer-events-none absolute bottom-[2%] left-1/2 z-0 h-[18%] w-[78%] -translate-x-1/2 rounded-[100%] bg-ink/35 blur-2xl"
                  aria-hidden
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={HERO_PORTRAIT}
                  alt={`${profile.name} - portrait`}
                  width={673}
                  height={983}
                  decoding="async"
                  fetchPriority="high"
                  className="relative z-[1] mx-auto h-auto max-h-[min(82dvh,720px)] w-full select-none object-contain object-bottom drop-shadow-[0_28px_50px_rgba(10,10,10,0.45)]"
                />
              </motion.div>
            </motion.div>

            <div className="mb-[16%] shrink-0">
              <HeroOrbitMetrics profile={profile} side="right" />
            </div>
          </div>

          {/* RIGHT */}
          <motion.div
            className="relative z-20 flex flex-col items-end justify-end gap-6 pb-[20%] pt-[28%]"
            variants={fadeSide("right")}
            initial="hidden"
            animate="show"
            custom={0.32}
          >
            <motion.p
              className="max-w-[220px] text-right font-sans text-[14px] font-medium leading-[1.55] tracking-[-0.01em] text-ink xl:max-w-[240px] xl:text-[15px]"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.42}
            >
              {BIO}
            </motion.p>
            <div className="flex w-full flex-col gap-3">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.45, ease: easeOut }}
              >
                <BrutalButton
                  href="/#work"
                  variant="primary"
                  icon={FolderKanban}
                  iconPosition="left"
                  className="w-full justify-center px-5 py-3.5 text-[13px]"
                >
                  VIEW WORK
                </BrutalButton>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.58, duration: 0.45, ease: easeOut }}
              >
                <BrutalButton
                  href={profile.resumeUrl ?? "/resume.pdf"}
                  variant="outline"
                  icon={Download}
                  external
                  download
                  className="w-full justify-center px-5 py-3.5 text-[13px]"
                >
                  RESUME
                </BrutalButton>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom scroll cue */}
        <motion.a
          href="#about"
          className="absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.2em] text-ink transition-colors hover:text-accent lg:flex"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5, ease: easeOut }}
        >
          SCROLL
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-3.5 w-3.5 text-accent" strokeWidth={2.75} />
          </motion.span>
        </motion.a>
      </div>

      {/* Mobile / tablet */}
      <div className="relative z-[1] lg:hidden">
        <h1 className="sr-only">{profile.name}</h1>

        <div
          className="pointer-events-none absolute inset-x-0 top-6 z-0 flex select-none justify-center"
          aria-hidden
        >
          <div className="flex items-baseline">
            <motion.span
              className="font-display text-[clamp(4.5rem,26vw,9rem)] leading-[0.72] tracking-[-0.07em] text-accent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: easeOut }}
            >
              SIFAT
            </motion.span>
            <span className="w-[min(6vw,32px)] shrink-0" aria-hidden />
            <motion.span
              className="-ml-1.5 font-display text-[clamp(4.5rem,26vw,9rem)] leading-[0.72] tracking-[-0.07em] text-accent"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.06, ease: easeOut }}
            >
              ALI
            </motion.span>
          </div>
        </div>

        <motion.div
          className="relative z-10 flex justify-center px-4 pt-14"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15, ease: easeOut }}
        >
          <div className="relative">
            <div
              className="pointer-events-none absolute bottom-[2%] left-1/2 z-0 h-[16%] w-[75%] -translate-x-1/2 rounded-[100%] bg-ink/30 blur-2xl"
              aria-hidden
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_PORTRAIT}
              alt={`${profile.name} - portrait`}
              width={673}
              height={983}
              decoding="async"
              fetchPriority="high"
              className="relative z-[1] h-auto max-h-[min(58vh,520px)] w-[min(86vw,380px)] select-none object-contain object-bottom drop-shadow-[0_24px_44px_rgba(10,10,10,0.42)]"
            />
          </div>
        </motion.div>

        <motion.div
          className="border-t-[3px] border-ink px-6 py-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: easeOut }}
        >
          <div className="mx-auto flex max-w-lg flex-col gap-6">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {ROLES.map((role, i) => (
                <motion.span
                  key={role}
                  className="label-mono text-[11px] tracking-wider text-ink"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.06, duration: 0.35 }}
                >
                  {role}
                </motion.span>
              ))}
            </div>
            <p className="text-[15px] font-medium leading-[1.6] text-ink">{BIO}</p>
            <HeroSocialLinks profile={profile} ghost align="left" />
            <div className="flex flex-wrap gap-3">
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
            <HeroMetrics profile={profile} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
