"use client";

import { motion } from "framer-motion";
import { Cpu, Users, BookOpen } from "lucide-react";
import { SectionReveal } from "@/components/motion/section-reveal";
import type { Profile } from "@/types";

interface AboutProps {
  profile: Profile;
}

const valueConfig = [
  { label: "ENGINEERING", icon: Cpu },
  { label: "COMMUNITY", icon: Users },
  { label: "TEACHING", icon: BookOpen },
];

export function About({ profile }: AboutProps) {
  return (
    <SectionReveal id="about" className="border-t-[3px] border-cream bg-ink text-cream">
      <div className="site-container section-pad">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="relative lg:col-span-3">
            <span
              className="font-display text-mega leading-none text-cream/[0.05]"
              aria-hidden
            >
              02
            </span>
            <p className="label-mono mt-4 text-accent">ABOUT</p>
          </div>

          <div className="lg:col-span-9">
            <h2 className="font-display text-display leading-[0.9] text-cream">
              I BUILD THINGS THAT THINK.
            </h2>
            <div className="my-8 h-px w-full bg-cream/30" />

            <div className="max-w-3xl space-y-6 text-[17px] leading-[1.85] text-cream/75">
              {profile.aboutStory.split("\n\n").slice(0, 2).map((para, i) => (
                <p key={i}>
                  {i === 0 ? (
                    <>
                      <span className="font-display text-2xl text-accent">
                        SIFAT
                      </span>{" "}
                      {para.replace(/^I'm Sifat Ali[^-]*-\s*/, "")}
                    </>
                  ) : (
                    para
                  )}
                </p>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-1 gap-0 border border-cream sm:grid-cols-3">
              {valueConfig.map((v) => {
                const Icon = v.icon;
                return (
                  <motion.button
                    key={v.label}
                    type="button"
                    className="group flex items-center gap-3 border-b border-cream px-6 py-5 text-left last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
                    whileHover={{ x: -2, y: -2 }}
                    whileTap={{ x: 2, y: 2 }}
                  >
                    <span className="icon-3d-box flex h-10 w-10 shrink-0 items-center justify-center border-2 border-cream bg-ink transition-colors group-hover:bg-accent">
                      <Icon className="h-4 w-4 text-cream" strokeWidth={2.5} />
                    </span>
                    <span className="label-mono group-hover:text-accent">
                      [ {v.label} ]
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-12 h-px w-full bg-cream/30" />
            <p className="mt-8 font-serif text-lg italic text-cream/60">
              {profile.engineeringPhilosophy}
            </p>
          </div>
        </div>
      </div>
      <div className="h-[3px] w-full bg-cream" />
    </SectionReveal>
  );
}
