"use client";

import { motion } from "framer-motion";
import {
  FolderKanban,
  GraduationCap,
  Calendar,
  Trophy,
  Code2,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Profile } from "@/types";

interface HeroMetricsProps {
  profile: Profile;
}

interface MetricCard {
  icon: LucideIcon;
  value: string;
  label: string;
  sub?: string;
  highlight?: boolean;
}

export function HeroMetrics({ profile }: HeroMetricsProps) {
  const s = profile.stats;
  const lc = s.leetcode;

  const cards: MetricCard[] = [
    {
      icon: FolderKanban,
      value: `${s.projectsBuilt}+`,
      label: "PROJECTS",
      sub: "Shipped end-to-end",
    },
    {
      icon: GraduationCap,
      value: `${s.studentsMentored}+`,
      label: "STUDENTS",
      sub: `${s.bootcampsLed ?? 12} bootcamps`,
    },
    {
      icon: Calendar,
      value: `${s.yearsExperience}+`,
      label: "YEARS EXP",
      sub: "In production",
    },
    {
      icon: Code2,
      value: `${lc.solved}+`,
      label: "LEETCODE",
      sub: "Problems solved",
      highlight: true,
    },
    {
      icon: Trophy,
      value: `${s.hackathonWins}×`,
      label: "HACKATHONS",
      sub: "National wins",
      highlight: true,
    },
    {
      icon: Users,
      value: `${s.clientsServed ?? 500}+`,
      label: "CLIENTS",
      sub: "Delivered globally",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative mt-10 lg:mt-14"
    >
      <div
        className="border-[3px] border-ink bg-accent"
        style={{ boxShadow: "10px 10px 0 0 #0a0a0a" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-ink bg-ink px-5 py-4">
          <span className="font-display text-2xl tracking-wide text-cream md:text-3xl">
            IMPACT AT A GLANCE
          </span>
          <span className="label-mono text-cream">SCROLL ↓ FOR ABOUT</span>
        </div>

        <div className="grid grid-cols-2 bg-cream md:grid-cols-3 lg:grid-cols-6">
          {cards.map((card, i) => {
            const Icon = card.icon;
            const isHighlight = card.highlight;
            return (
              <motion.div
                key={card.label}
                className={`flex flex-col px-4 py-6 md:px-5 md:py-8 ${
                  i < cards.length - 1 ? "border-r-[3px] border-ink" : ""
                } ${i < 4 ? "border-b-[3px] border-ink lg:border-b-0" : ""} ${
                  isHighlight ? "bg-ink text-cream" : "bg-cream text-ink"
                }`}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                <Icon
                  className={`mb-3 h-6 w-6 ${isHighlight ? "text-accent" : "text-accent"}`}
                  strokeWidth={2.5}
                />
                <p
                  className={`font-display font-bold leading-none ${
                    isHighlight
                      ? "text-[clamp(44px,6vw,64px)] text-accent"
                      : "text-[clamp(40px,5.5vw,56px)] text-ink"
                  }`}
                >
                  {card.value}
                </p>
                <p
                  className={`label-mono mt-2 text-sm font-bold tracking-widest ${
                    isHighlight ? "text-cream" : "text-ink"
                  }`}
                >
                  {card.label}
                </p>
                {card.sub && (
                  <p
                    className={`mt-2 font-sans text-xs font-semibold uppercase tracking-wide ${
                      isHighlight ? "text-cream/70" : "text-muted"
                    }`}
                  >
                    {card.sub}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
