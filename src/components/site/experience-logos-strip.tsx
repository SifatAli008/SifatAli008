"use client";

import Image from "next/image";
import { experienceLogos } from "@/lib/data/experience-logos";

export function ExperienceLogosStrip() {
  return (
    <div
      className="border-b border-ink bg-cream pb-10 pt-8"
      aria-label="Experience organizations"
    >
      <p className="label-mono mb-8 text-center text-muted">ORGANIZATIONS</p>
      <div className="site-container flex flex-wrap items-end justify-center gap-x-16 gap-y-10">
        {experienceLogos.map((logo) => (
          <span
            key={logo.id}
            className="group flex flex-col items-center gap-4 text-center"
          >
            <Image
              src={logo.src}
              alt={logo.name}
              width={80}
              height={80}
              className="experience-logo-img h-16 w-auto max-h-16 max-w-[120px] bg-transparent object-contain md:h-20 md:max-h-20 md:max-w-[140px]"
              unoptimized
            />
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-ink/45 transition-colors group-hover:text-ink/75 md:text-[13px]">
              {logo.name}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
