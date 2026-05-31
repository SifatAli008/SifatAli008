"use client";

import { motion } from "framer-motion";
import { GitBranch, Github } from "lucide-react";
import { SectionReveal } from "@/components/motion/section-reveal";
import { GitHubContributionGraph } from "@/components/site/github-contribution-graph";
import type { Profile } from "@/types";

interface GitHubActivitySectionProps {
  profile: Profile;
}

const introVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function GitHubActivitySection({ profile }: GitHubActivitySectionProps) {
  return (
    <SectionReveal id="github" className="relative overflow-hidden border-t-[3px] border-ink bg-cream">
      <span
        className="pointer-events-none absolute -right-4 top-24 hidden font-display text-[clamp(8rem,22vw,16rem)] leading-none text-ink/[0.04] lg:block"
        aria-hidden
      >
        07
      </span>
      <span
        className="pointer-events-none absolute bottom-8 left-[8%] hidden h-24 w-24 border-2 border-accent/20 lg:block"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute right-[12%] top-1/2 hidden h-3 w-3 bg-accent lg:block"
        aria-hidden
      />

      <div className="border-b-2 border-ink bg-ink">
        <motion.div
          className="site-container flex h-12 flex-wrap items-center justify-between gap-3"
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
        >
          <span className="font-display text-xl text-cream">07 / GITHUB ACTIVITY</span>
          <span className="label-mono flex items-center gap-2 text-cream/70">
            <Github className="h-4 w-4 text-accent" strokeWidth={2.5} />
            COMMITS · PULL REQUESTS · CODE REVIEWS
          </span>
        </motion.div>
      </div>

      <div className="site-container section-pad">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <motion.div
            className="relative lg:col-span-4"
            variants={introVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.span
              variants={itemVariants}
              className="icon-3d-box mb-5 inline-flex h-11 w-11 items-center justify-center border-2 border-ink bg-accent"
            >
              <GitBranch className="h-5 w-5 text-cream" strokeWidth={2.5} />
            </motion.span>
            <motion.p variants={itemVariants} className="label-mono text-accent">
              OPEN SOURCE
            </motion.p>
            <motion.h2
              variants={itemVariants}
              className="mt-2 font-display text-[clamp(2rem,5vw,3.25rem)] leading-none text-ink"
            >
              BUILD IN
              <br />
              <span className="text-accent">PUBLIC</span>
            </motion.h2>
            <motion.div
              variants={itemVariants}
              className="my-5 h-[3px] w-16 bg-accent"
            />
            <motion.p
              variants={itemVariants}
              className="max-w-sm text-[15px] leading-relaxed text-ink/70"
            >
              Daily shipping on GitHub - the same repos that power the project list above.
              Hover any square for details.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="mt-6 flex flex-wrap gap-2"
            >
              {["COMMITS", "PRS", "REVIEWS", "ISSUES"].map((tag) => (
                <span
                  key={tag}
                  className="label-mono border-2 border-ink/15 bg-cream px-2.5 py-1 text-[10px] text-ink/60"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="flex justify-center lg:col-span-8 lg:justify-end"
            initial={{ opacity: 0, x: 32, rotate: -0.5 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <div className="group relative">
              <motion.div
                className="pointer-events-none absolute -right-2 -top-2 h-full w-full border-2 border-accent"
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.35 }}
                aria-hidden
              />
              <motion.div
                className="pointer-events-none absolute -bottom-2 -left-2 h-full w-full border-2 border-ink/20"
                aria-hidden
              />
              <div className="relative transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
                <GitHubContributionGraph githubUrl={profile.socials.github} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionReveal>
  );
}
