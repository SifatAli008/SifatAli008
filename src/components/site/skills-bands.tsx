"use client";

import { SectionReveal } from "@/components/motion/section-reveal";

const bands = [
  {
    label: "FRONTEND",
    dark: true,
    skills: "REACT · NEXT.JS · TYPESCRIPT · TAILWIND · JAVASCRIPT",
  },
  {
    label: "BACKEND & AI",
    dark: false,
    skills: "NODE · FIREBASE · RAG · TENSORFLOW · CLINICALBERT · NLP · MACHINE LEARNING · PYTHON",
  },
  {
    label: "CMS",
    dark: true,
    skills: "WORDPRESS · ELEMENTOR · PAGE BUILDERS · CUSTOM THEMES · PLUGINS · WOOCOMMERCE",
  },
  {
    label: "TOOLS",
    dark: false,
    skills: "PYQT5 · GIT · DOCKER · LINUX · FIREBASE · REST APIS",
  },
];

export function SkillsBands() {
  return (
    <SectionReveal id="skills" className="bg-cream">
      <div className="site-container section-pad">
        <h2 className="font-display text-display leading-none text-ink">
          TECHNICAL DEPTH
        </h2>
        <p className="mt-4 font-serif text-2xl italic text-ink/70">
          Full-stack. Front to back. Zero to production.
        </p>

        <div className="mt-12 border-t-2 border-ink">
          {bands.map((band) => (
            <div
              key={band.label}
              className={`group flex min-h-[96px] items-stretch border-b-2 border-ink ${
                band.dark ? "bg-ink text-cream" : "bg-cream text-ink"
              }`}
            >
              <div className="hidden w-16 shrink-0 items-center justify-center border-r-2 border-inherit md:flex">
                <span
                  className={`label-mono whitespace-nowrap ${
                    band.dark ? "text-cream" : "text-ink"
                  }`}
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  {band.label}
                </span>
              </div>
              <div className="flex flex-1 items-center overflow-x-auto px-4 py-6 md:px-10">
                <p
                  className={`font-display text-[clamp(28px,5vw,52px)] tracking-[0.02em] ${
                    band.dark ? "text-cream" : "text-ink"
                  }`}
                >
                  {band.skills.split(" · ").map((word, i, arr) => (
                    <span key={word}>
                      <span className="cursor-default transition-colors duration-0 hover:text-accent">
                        {word}
                      </span>
                      {i < arr.length - 1 ? " · " : ""}
                    </span>
                  ))}
                </p>
              </div>
              <span className="label-mono flex items-center border-l-2 border-inherit px-4 md:hidden">
                {band.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}
