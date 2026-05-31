"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Linkedin, ExternalLink } from "lucide-react";
import { FeaturedPostMedia } from "@/components/site/featured-post-media";
import type { FeaturedPost } from "@/types";

interface LinkedInPostCardProps {
  item: FeaturedPost;
  profileName: string;
  profileAvatar: string;
  index: number;
  /** Fits 3-column grid */
  compact?: boolean;
}

export function LinkedInPostCard({
  item,
  profileName,
  profileAvatar,
  index,
  compact = false,
}: LinkedInPostCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="flex h-full flex-col overflow-hidden border-[3px] border-ink bg-cream"
      style={{ boxShadow: compact ? "6px 6px 0 0 #0a0a0a" : "8px 8px 0 0 #0a0a0a" }}
    >
      <div
        className={`flex items-center gap-2 border-b-[3px] border-ink bg-cream ${
          compact ? "px-3 py-2" : "gap-3 px-4 py-3"
        }`}
      >
        <div
          className={`relative shrink-0 overflow-hidden border-2 border-ink ${
            compact ? "h-8 w-8" : "h-11 w-11"
          }`}
        >
          <Image
            src={profileAvatar}
            alt={profileName}
            fill
            className="object-cover object-top"
            sizes={compact ? "32px" : "44px"}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={`truncate font-sans font-bold text-ink ${
              compact ? "text-xs" : "text-sm"
            }`}
          >
            {profileName}
          </p>
          <p className="label-mono truncate text-[9px] text-muted">LINKEDIN POST</p>
        </div>
        <Linkedin className="h-4 w-4 shrink-0 text-[#0A66C2]" aria-hidden />
      </div>

      <div className="border-b-[3px] border-ink bg-[#f3f2ef]">
        <FeaturedPostMedia item={item} index={index} compact={compact} />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="label-mono border border-ink px-1.5 py-0.5 text-[9px] text-ink">
            {item.type}
          </span>
          {item.badge ? (
            <span className="label-mono bg-ink px-1.5 py-0.5 text-[9px] font-bold text-accent">
              {item.badge}
            </span>
          ) : null}
        </div>
        <h3
          className={`mt-2 font-sans font-bold leading-snug text-ink ${
            compact ? "line-clamp-2 text-base" : "text-xl md:text-2xl"
          }`}
        >
          {item.title}
        </h3>
        <p className="label-mono mt-1 line-clamp-2 text-[9px] text-muted">
          {item.subtitle}
        </p>
        <p
          className={`mt-2 flex-1 text-ink/85 ${
            compact ? "line-clamp-3 text-xs leading-relaxed" : "text-[15px] leading-relaxed"
          }`}
        >
          {item.excerpt}
        </p>

        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-4 flex items-center justify-between gap-2 border-[3px] border-ink bg-accent/10 px-3 py-2.5 transition-colors hover:bg-accent"
        >
          <span className="label-mono text-[10px] font-bold text-ink group-hover:text-cream">
            OPEN POST
          </span>
          <span className="flex items-center gap-1">
            <ExternalLink
              className="h-4 w-4 text-accent group-hover:text-cream"
              strokeWidth={2}
            />
            <ArrowUpRight
              className="h-4 w-4 text-ink transition-transform group-hover:rotate-45 group-hover:text-cream"
              strokeWidth={2.5}
            />
          </span>
        </a>
      </div>
    </motion.article>
  );
}
