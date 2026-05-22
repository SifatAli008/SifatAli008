"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionHeading } from "@/components/layout/section-heading";
import { FadeIn } from "@/components/motion/fade-in";
import type { Experience } from "@/types";

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <section
      id="experience"
      className="section-gap border-t border-white/[0.06] bg-surface/50"
    >
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          label="Experience"
          title="Impact across teams"
          description="Leading engineering communities and delivering production systems."
        />

        <div ref={containerRef} className="relative mt-16">
          <svg
            className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 md:block"
            style={{ height: "100%" }}
          >
            <motion.line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              stroke="url(#gradient)"
              strokeWidth="2"
              style={{ pathLength }}
              vectorEffect="non-scaling-stroke"
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>

          <div className="space-y-12 md:space-y-0">
            {experiences.map((exp, i) => (
              <FadeIn key={exp.id} delay={i * 0.1}>
                <div
                  className={`relative md:grid md:grid-cols-2 md:gap-12 ${
                    i % 2 === 0 ? "" : "md:[&>div:first-child]:order-2"
                  }`}
                >
                  <div className={`${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    {i % 2 === 0 && (
                      <div className="hidden md:block md:col-start-2" />
                    )}
                  </div>
                  <div
                    className={`glass glow-border rounded-2xl p-6 md:max-w-lg ${
                      i % 2 === 0
                        ? "md:col-start-1 md:row-start-1 md:justify-self-end"
                        : "md:col-start-2 md:justify-self-start"
                    }`}
                  >
                    <p className="text-xs font-medium uppercase tracking-wider text-accent-indigo">
                      {exp.duration}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-semibold text-white">
                      {exp.role}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      {exp.company}
                      {exp.location && ` · ${exp.location}`}
                    </p>
                    <p className="mt-4 text-sm text-zinc-500">{exp.description}</p>
                    <ul className="mt-4 space-y-2">
                      {exp.impact.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-zinc-400"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-indigo" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {exp.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-white/5 px-2 py-1 text-xs text-zinc-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
