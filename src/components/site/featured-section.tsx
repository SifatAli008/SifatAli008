"use client";

import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import { SectionReveal } from "@/components/motion/section-reveal";
import { LinkedInPostCard } from "@/components/site/linkedin-post-card";
import { PROFILE_AVATAR } from "@/lib/cloudinary/assets";
import type { FeaturedPost, Profile } from "@/types";

const DEFAULT_AVATAR = PROFILE_AVATAR;

interface FeaturedSectionProps {
  profile: Profile;
  items: FeaturedPost[];
}

export function FeaturedSection({ profile, items }: FeaturedSectionProps) {
  const linkedin = profile.socials.linkedin ?? "https://www.linkedin.com/in/sifat-ali/";
  const avatar = profile.avatar ?? DEFAULT_AVATAR;

  if (items.length === 0) return null;

  return (
    <SectionReveal id="featured" className="border-t-[3px] border-ink bg-cream">
      <div className="site-container section-pad">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b-2 border-ink pb-6">
          <div>
            <p className="label-mono text-accent">03 / FEATURED</p>
            <h2 className="mt-2 font-display text-display leading-none text-ink">
              LINKEDIN POSTS
            </h2>
            <p className="mt-3 max-w-xl text-[15px] text-ink/70">
              Three featured posts per row — open any card for the full LinkedIn thread.
            </p>
          </div>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d inline-flex items-center gap-2 border-2 border-ink bg-ink px-5 py-3 font-sans text-xs font-bold uppercase tracking-widest text-cream"
          >
            <Linkedin className="h-4 w-4" strokeWidth={2.5} />
            @SIFAT-ALI ↗
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <LinkedInPostCard
              key={item.id}
              item={item}
              profileName={profile.name}
              profileAvatar={avatar}
              index={i}
              compact
            />
          ))}
        </div>

        <p className="label-mono mt-8 text-center text-muted">
          EMBEDDED FROM LINKEDIN · OPEN POST FOR FULL THREAD & COMMENTS
        </p>
      </div>
    </SectionReveal>
  );
}
