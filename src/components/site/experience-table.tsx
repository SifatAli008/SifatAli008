"use client";

import { Fragment, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionReveal } from "@/components/motion/section-reveal";
import { ExperienceLogosStrip } from "@/components/site/experience-logos-strip";
import type { Experience } from "@/types";

const typeMap: Record<string, string> = {
  "Fluvo Soft": "FULL-TIME",
  "UIU Developers Hub": "VOLUNTEER",
  "Shohoz Skill": "PART-TIME",
  Freelance: "FREELANCE",
};

function getType(company: string, role: string): string {
  if (company === "Shohoz Skill" && role.includes("Assistant Managing Director")) {
    return "CONTRACTUAL";
  }
  if (company === "Shohoz Skill" && role.includes("Instructor")) {
    return "PART-TIME";
  }
  return typeMap[company] ?? "CONTRACT";
}

interface ExperienceTableProps {
  experiences: Experience[];
}

export function ExperienceTable({ experiences }: ExperienceTableProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <SectionReveal id="experience" className="bg-cream">
      <div className="border-b-2 border-ink bg-ink">
        <div className="site-container flex h-12 flex-wrap items-center justify-between gap-4">
          <span className="font-display text-xl text-cream">04 / EXPERIENCE</span>
          <span className="label-mono text-cream/70">
            WHAT I&apos;VE BUILT AND LED
          </span>
        </div>
      </div>

      <div className="site-container section-pad !pt-0 !pb-16">
        <div className="overflow-x-auto border-2 border-ink">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-ink bg-ink text-cream">
                {["PERIOD", "ROLE", "COMPANY", "TYPE"].map((h) => (
                  <th
                    key={h}
                    className="label-mono border-r border-cream/20 px-4 py-3 last:border-r-0"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp) => {
                const isOpen = openId === exp.id;
                return (
                  <Fragment key={exp.id}>
                    <tr
                      className="group cursor-pointer border-b border-ink transition-[background,color] duration-75 hover:bg-accent hover:text-cream"
                      onClick={() =>
                        setOpenId(isOpen ? null : exp.id)
                      }
                    >
                      <td className="border-r border-ink px-4 py-4 font-mono text-[13px] opacity-60 group-hover:opacity-100">
                        {exp.duration.toUpperCase()}
                      </td>
                      <td className="border-r border-ink px-4 py-4">
                        <span className="flex items-center gap-2 font-sans text-base font-bold">
                          {exp.role.toUpperCase()}
                          <motion.span
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
                          </motion.span>
                        </span>
                      </td>
                      <td className="border-r border-ink px-4 py-4 font-sans text-base group-hover:text-cream">
                        {exp.company.toUpperCase()}
                      </td>
                      <td className="px-4 py-4">
                        <span className="tag-brutal group-hover:border-cream group-hover:text-cream">
                          {getType(exp.company, exp.role)}
                        </span>
                      </td>
                    </tr>
                    <AnimatePresence>
                      {isOpen && (
                        <tr key={`${exp.id}-detail`} className="border-b border-ink bg-cream">
                          <td colSpan={4} className="px-6 py-6">
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="border-l-[2px] border-ink pl-6"
                            >
                              <p className="text-[15px] leading-relaxed text-ink/80">
                                {exp.description}
                              </p>
                              <ul className="mt-4 space-y-2">
                                {exp.impact.map((item) => (
                                  <li
                                    key={item}
                                    className="font-mono text-[13px] text-ink/70 before:content-['—_']"
                                  >
                                    {item}
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-4 flex flex-wrap gap-2">
                                {exp.stack.map((t) => (
                                  <span key={t} className="tag-brutal">
                                    {t.toUpperCase()}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ExperienceLogosStrip />
    </SectionReveal>
  );
}
