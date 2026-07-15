"use client";

import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Code2,
  BookOpen,
  Mail,
  Palette,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";

const socialMeta: {
  key: keyof Profile["socials"];
  label: string;
  icon: LucideIcon;
  accent?: boolean;
}[] = [
  { key: "github", label: "GITHUB", icon: Github },
  { key: "linkedin", label: "LINKEDIN", icon: Linkedin },
  { key: "leetcode", label: "LEETCODE", icon: Code2 },
  { key: "medium", label: "MEDIUM", icon: BookOpen },
  { key: "behance", label: "BEHANCE", icon: Palette },
];

interface HeroSocialLinksProps {
  profile: Profile;
  compact?: boolean;
  align?: "left" | "center";
  /** Icon-only row — no boxed tiles */
  ghost?: boolean;
}

export function HeroSocialLinks({
  profile,
  compact = false,
  align = "center",
  ghost = false,
}: HeroSocialLinksProps) {
  const links = [
    ...socialMeta
      .map((meta) => ({
        ...meta,
        href: profile.socials[meta.key],
      }))
      .filter((item) => item.href),
    {
      key: "email" as const,
      label: "EMAIL",
      icon: Mail,
      href: `mailto:${profile.email}`,
      accent: true,
    },
  ];

  if (ghost) {
    return (
      <div className={cn(align === "left" ? "text-left" : "text-center")}>
        <p className="label-mono mb-3 text-[11px] tracking-[0.18em] text-ink/50">
          CONNECT
        </p>
        <div
          className={cn(
            "grid max-w-[148px] grid-cols-3 gap-2.5",
            align === "center" && "mx-auto"
          )}
        >
          {links.map((item, i) => {
            const Icon = item.icon;
            const isAccent = "accent" in item && item.accent;
            return (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.label === "EMAIL" ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={item.label}
                title={item.label}
                className={cn(
                  "flex h-11 w-11 items-center justify-center transition-colors",
                  isAccent
                    ? "text-accent hover:text-ink"
                    : "text-ink hover:text-accent"
                )}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + i * 0.04 }}
                whileHover={{ y: -2, scale: 1.06 }}
              >
                <Icon className="h-5 w-5" strokeWidth={2.35} />
              </motion.a>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(!compact && "mt-9", align === "left" && "max-w-[220px]")}>
      <p
        className={cn(
          "label-mono mb-3 tracking-[0.18em] text-muted",
          align === "center" ? "text-center" : "text-left"
        )}
      >
        CONNECT
      </p>
      <div
        className={cn(
          "flex flex-wrap gap-3 sm:gap-4",
          align === "center" ? "justify-center" : "justify-start"
        )}
      >
        {links.map((item, i) => {
          const Icon = item.icon;
          const isAccent = "accent" in item && item.accent;
          return (
            <motion.a
              key={item.label}
              href={item.href}
              target={item.label === "EMAIL" ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-1.5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 + i * 0.05 }}
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
            >
              <span
                className={cn(
                  "flex h-11 w-11 items-center justify-center border-2 border-ink shadow-[3px_3px_0_0_#0a0a0a] transition-all duration-150 group-hover:shadow-[1px_1px_0_0_#0a0a0a] group-hover:bg-accent",
                  isAccent
                    ? "bg-accent [&_svg]:text-cream"
                    : "bg-cream group-hover:[&_svg]:text-cream"
                )}
              >
                <Icon className="h-4 w-4 text-ink" strokeWidth={2.5} />
              </span>
              <span className="label-mono text-[9px] tracking-wider text-ink/45 transition-colors group-hover:text-accent">
                {item.label}
              </span>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
