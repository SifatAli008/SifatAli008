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
}

export function HeroSocialLinks({ profile }: HeroSocialLinksProps) {
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

  return (
    <div className="mt-8">
      <p className="label-mono mb-4 text-muted">CONNECT</p>
      <div className="flex flex-wrap gap-5">
        {links.map((item, i) => {
          const Icon = item.icon;
          const isAccent = "accent" in item && item.accent;
          return (
            <motion.a
              key={item.label}
              href={item.href}
              target={item.label === "EMAIL" ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              whileHover={{ x: -3, y: -3 }}
              whileTap={{ x: 2, y: 2 }}
            >
              <span
                className={`icon-3d-box flex h-12 w-12 items-center justify-center border-2 border-ink transition-colors duration-0 group-hover:bg-accent ${
                  isAccent
                    ? "bg-accent [&_svg]:text-cream"
                    : "bg-cream group-hover:[&_svg]:text-cream"
                }`}
              >
                <Icon className="h-5 w-5 text-ink" strokeWidth={2.5} />
              </span>
              <span className="label-mono text-muted group-hover:text-accent">
                {item.label}
              </span>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
