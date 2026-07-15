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

interface MetricItem {
  icon: LucideIcon;
  value: string;
  label: string;
  sub?: string;
  accentValue?: boolean;
}

function getMetrics(profile: Profile): MetricItem[] {
  const s = profile.stats;
  const lc = s.leetcode;

  return [
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
      accentValue: true,
    },
    {
      icon: Trophy,
      value: `${s.hackathonWins}×`,
      label: "HACKATHONS",
      sub: "National wins",
      accentValue: true,
    },
    {
      icon: Users,
      value: `${s.clientsServed ?? 500}+`,
      label: "CLIENTS",
      sub: "Delivered globally",
    },
  ];
}

function SideStat({
  item,
  index,
  align,
}: {
  item: MetricItem;
  index: number;
  align: "left" | "right";
}) {
  const Icon = item.icon;
  const isRight = align === "right";

  return (
    <motion.div
      className={`flex flex-col gap-1 ${
        isRight ? "items-start text-left" : "items-end text-right"
      }`}
      initial={{ opacity: 0, x: isRight ? 20 : -20 }}
      animate={{
        opacity: 1,
        x: 0,
        y: [0, index % 2 === 0 ? -4 : 4, 0],
      }}
      transition={{
        opacity: { delay: 0.35 + index * 0.12, duration: 0.4 },
        x: { delay: 0.35 + index * 0.12, duration: 0.4 },
        y: {
          delay: 1 + index * 0.1,
          duration: 4.4 + index * 0.25,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      <div
        className={`flex items-center gap-2 ${isRight ? "flex-row" : "flex-row-reverse"}`}
      >
        <Icon className="h-4 w-4 shrink-0 text-accent" strokeWidth={2.25} />
        <span className="h-px w-5 bg-accent/70" aria-hidden />
      </div>
      <p
        className={`font-display text-[clamp(1.7rem,2.6vw,2.25rem)] font-bold leading-none tracking-tight ${
          item.accentValue ? "text-accent" : "text-ink"
        }`}
      >
        {item.value}
      </p>
      <p className="label-mono text-[10px] font-bold tracking-[0.16em] text-ink">
        {item.label}
      </p>
      {item.sub && (
        <p className="max-w-[9rem] font-sans text-[9px] font-medium uppercase tracking-[0.1em] text-ink/40">
          {item.sub}
        </p>
      )}
    </motion.div>
  );
}

/** One side column — sits BESIDE the portrait in the rail */
export function HeroOrbitMetrics({
  profile,
  side,
}: {
  profile: Profile;
  side: "left" | "right";
}) {
  const items = getMetrics(profile);
  const column = side === "left" ? items.slice(0, 3) : items.slice(3);
  const indexOffset = side === "left" ? 0 : 3;

  return (
    <div
      className={`flex w-full max-w-[148px] flex-col gap-6 xl:gap-8 ${
        side === "right" ? "items-start" : "items-end"
      }`}
    >
      {column.map((item, i) => (
        <SideStat
          key={item.label}
          item={item}
          index={i + indexOffset}
          align={side}
        />
      ))}
    </div>
  );
}

function MetricsStrip({ items }: { items: MetricItem[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="relative"
    >
      <div className="mb-5 flex items-end justify-between gap-3">
        <p className="label-mono tracking-[0.16em] text-muted">IMPACT</p>
        <a
          href="#about"
          className="label-mono text-[10px] text-ink/45 transition-colors hover:text-accent"
        >
          SCROLL ↓ FOR ABOUT
        </a>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              className="flex flex-col gap-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 + i * 0.07, duration: 0.3 }}
            >
              <Icon className="mb-0.5 h-3.5 w-3.5 text-accent" strokeWidth={2.25} />
              <p
                className={`font-display text-[1.75rem] font-bold leading-none tracking-tight ${
                  item.accentValue ? "text-accent" : "text-ink"
                }`}
              >
                {item.value}
              </p>
              <p className="label-mono text-[10px] font-bold tracking-[0.14em] text-ink">
                {item.label}
              </p>
              {item.sub && (
                <p className="font-sans text-[9px] font-medium uppercase tracking-[0.08em] text-ink/40">
                  {item.sub}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export function HeroMetrics({
  profile,
  mode = "strip",
}: {
  profile: Profile;
  mode?: "orbit" | "strip";
}) {
  const items = getMetrics(profile);
  if (mode === "orbit") {
    return (
      <div className="flex gap-10">
        <HeroOrbitMetrics profile={profile} side="left" />
        <HeroOrbitMetrics profile={profile} side="right" />
      </div>
    );
  }
  return <MetricsStrip items={items} />;
}
