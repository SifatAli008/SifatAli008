"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Filter } from "lucide-react";
import { SectionReveal } from "@/components/motion/section-reveal";
import { BrutalButton } from "@/components/ui/brutal-button";
import type { Project, ProjectCategory } from "@/types";

const filters = ["ALL", "AI/ML", "WEB", "DESKTOP"] as const;

function matchesFilter(project: Project, filter: string): boolean {
  if (filter === "ALL") return true;
  if (filter === "AI/ML") return project.category === "AI";
  if (filter === "WEB") return project.category === "Web" || project.category === "Mobile";
  if (filter === "DESKTOP") return project.category === "Desktop" || project.category === "Tool";
  return true;
}

interface ProjectsRowsProps {
  projects: Project[];
  showHeader?: boolean;
}

export function ProjectsRows({ projects, showHeader = true }: ProjectsRowsProps) {
  const [filter, setFilter] = useState<string>("ALL");
  const sorted = useMemo(
    () => [...projects].sort((a, b) => a.order - b.order),
    [projects]
  );
  const filtered = sorted.filter((p) => matchesFilter(p, filter));

  return (
    <SectionReveal id="work" className="bg-cream">
      {showHeader && (
        <div className="border-b-2 border-ink bg-ink">
          <div className="site-container flex h-12 items-center justify-between">
            <span className="font-display text-xl text-cream">
              05 / SELECTED WORK
            </span>
            <span className="label-mono text-cream/70">
              ({String(projects.length).padStart(2, "0")} PROJECTS)
            </span>
          </div>
        </div>
      )}

      <div className="site-container flex flex-wrap items-center border-b border-ink">
        <Filter className="mx-4 hidden h-4 w-4 text-ink sm:block" strokeWidth={2.5} />
        {filters.map((f) => (
          <motion.button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`label-mono border-r border-ink px-6 py-3 last:border-r-0 ${
              filter === f
                ? "bg-ink text-cream shadow-[4px_4px_0_0_#ff3b00]"
                : "bg-cream text-ink"
            }`}
            whileTap={{ scale: 0.98 }}
          >
            [ {f} ]
          </motion.button>
        ))}
      </div>

      <div>
        {filtered.map((project, index) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="group grid grid-cols-1 border-t-2 border-ink transition-colors duration-75 hover:bg-accent hover:text-cream md:grid-cols-[80px_1fr_240px_60px]"
          >
            <div className="flex items-center border-b border-ink px-4 py-6 md:border-b-0 md:border-r md:py-8">
              <span className="font-display text-[64px] leading-none text-ink/[0.08] group-hover:text-cream/20">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="border-b border-ink px-6 py-6 md:border-b-0 md:border-r md:py-8">
              <h3 className="font-sans text-xl font-bold group-hover:text-cream">
                {project.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed opacity-80 group-hover:text-cream/90">
                {project.tagline}
              </p>
              <p className="label-mono mt-3 text-accent group-hover:text-cream">
                {project.techStack.join(" · ").toUpperCase()}
              </p>
            </div>
            <div className="hidden aspect-video border-r border-ink bg-ink/5 md:block">
              <div className="flex h-full w-full items-center justify-center border-2 border-ink bg-cream transition-[filter] duration-300 group-hover:grayscale-0 grayscale">
                <span className="label-mono text-ink/30 group-hover:text-cream/50">
                  {project.category.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center px-4 py-6 md:py-8">
              <motion.span
                className="icon-3d-box flex h-12 w-12 items-center justify-center border-2 border-ink bg-cream group-hover:bg-accent group-hover:[&_svg]:text-cream"
                whileHover={{ rotate: 45 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ArrowUpRight
                  className="h-6 w-6 text-ink"
                  strokeWidth={2.5}
                />
              </motion.span>
            </div>
          </Link>
        ))}
      </div>

      {showHeader && (
        <div className="site-container border-t-2 border-ink py-8 text-right">
          <BrutalButton
            href="/projects"
            variant="accent"
            icon={ArrowUpRight}
            className="!text-base"
          >
            VIEW ALL PROJECTS
          </BrutalButton>
        </div>
      )}
    </SectionReveal>
  );
}
