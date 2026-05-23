"use client";

import { motion } from "framer-motion";
import { FlaskConical, Loader2 } from "lucide-react";
import { SectionReveal } from "@/components/motion/section-reveal";

export function AcademicResearchSection() {
  return (
    <SectionReveal id="research" className="border-t-[3px] border-ink bg-cream">
      <div className="border-b-2 border-ink bg-ink">
        <motion.div
          className="site-container flex h-12 flex-wrap items-center justify-between gap-4"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
        >
          <span className="font-display text-xl text-cream">06 / ACADEMIC RESEARCH</span>
          <span className="label-mono flex items-center gap-2 text-cream/70">
            <FlaskConical className="h-4 w-4 text-accent" strokeWidth={2.5} />
            COMING SOON
          </span>
        </motion.div>
      </div>

      <div className="site-container section-pad">
        <motion.div
          className="flex min-h-[280px] flex-col items-center justify-center border-[3px] border-ink bg-cream px-6 py-16 text-center md:min-h-[320px]"
          style={{ boxShadow: "8px 8px 0 0 #0a0a0a" }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <motion.span
            className="icon-3d-box mb-6 flex h-16 w-16 items-center justify-center border-2 border-ink bg-accent"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-8 w-8 text-cream" strokeWidth={2.5} />
          </motion.span>
          <p className="label-mono text-accent">STATUS</p>
          <h2 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-ink">
            IN PROGRESS
          </h2>
          <p className="label-mono mt-6 max-w-md text-muted">
            RESEARCH PAPERS & PUBLICATIONS WILL BE LISTED HERE SOON.
          </p>
          <span className="label-mono mt-8 inline-flex items-center gap-2 border-2 border-ink bg-ink px-4 py-2 text-cream">
            <span className="inline-block h-2 w-2 bg-accent pulse-dot" />
            UPDATING
          </span>
        </motion.div>
      </div>
    </SectionReveal>
  );
}
