"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeading } from "@/components/layout/section-heading";
import type { Skill, SkillCategory } from "@/types";

const categories: SkillCategory[] = [
  "Frontend",
  "Backend",
  "AI & Data",
  "Tools",
];

function SkillBar({ skill }: { skill: Skill }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={ref}
            className="group glass rounded-xl p-4 transition-all hover:glow-border"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">{skill.name}</span>
              <span className="text-xs text-zinc-500">{skill.proficiency}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent-indigo to-accent-violet"
                initial={{ width: 0 }}
                animate={inView ? { width: `${skill.proficiency}%` } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>{skill.category} · {skill.icon}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface SkillsBentoProps {
  skills: Skill[];
}

export function SkillsBento({ skills }: SkillsBentoProps) {
  return (
    <section id="skills" className="section-gap border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          label="Skills"
          title="Technical depth"
          description="Proficiency across the full stack — from interfaces to AI pipelines."
        />

        <Tabs defaultValue="Frontend" className="mt-12">
          <TabsList className="flex flex-wrap">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((cat) => (
            <TabsContent key={cat} value={cat}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {skills
                  .filter((s) => s.category === cat)
                  .map((skill) => (
                    <SkillBar key={skill.id} skill={skill} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
