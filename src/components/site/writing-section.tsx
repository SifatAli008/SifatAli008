"use client";

import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import { SectionReveal } from "@/components/motion/section-reveal";
import { BrutalButton } from "@/components/ui/brutal-button";
import type { BlogPost } from "@/types";

interface WritingSectionProps {
  posts: BlogPost[];
}

export function WritingSection({ posts }: WritingSectionProps) {
  const [featured, ...rest] = posts.slice(0, 4);

  if (!featured) return null;

  return (
    <SectionReveal className="bg-ink text-cream">
      <div className="site-container section-pad">
        <h2 className="font-display text-display leading-none text-cream">
          WRITING
        </h2>
        <div className="my-8 h-px w-full bg-cream/30" />

        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2 lg:divide-x-2 lg:divide-cream">
          <div className="pb-12 lg:pb-0 lg:pr-12">
            <p className="label-mono text-accent">- FEATURED ESSAY</p>
            <Link href={`/blog/${featured.slug}`} className="group mt-6 block">
              <h3 className="mt-4 font-sans text-[32px] font-bold leading-tight text-cream group-hover:text-accent">
                {featured.title}
              </h3>
              <p className="mt-4 line-clamp-3 text-[15px] leading-[1.8] text-cream/60">
                {featured.excerpt}
              </p>
              <p className="label-mono mt-6 flex items-center gap-2 text-cream/30">
                <Clock className="h-3.5 w-3.5" />
                {featured.readingTime} MIN READ ·{" "}
                {featured.tags.join(" · ").toUpperCase()}
              </p>
            </Link>
          </div>

          <div className="lg:pl-12">
            {rest.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex items-start justify-between gap-4 border-t border-cream/20 py-5 transition-[background,color] duration-75 first:border-t-0 hover:bg-accent hover:px-4"
              >
                <span className="flex items-center gap-3 font-sans text-[17px] text-cream">
                  <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  {post.title}
                </span>
                <span className="label-mono shrink-0 text-cream/40 group-hover:text-cream">
                  {post.readingTime} MIN
                </span>
              </Link>
            ))}
            <div className="mt-8">
              <BrutalButton
                href="/blog"
                variant="cream-outline"
                icon={ArrowUpRight}
                darkShadow
              >
                ALL WRITING
              </BrutalButton>
            </div>
          </div>
        </div>

        <div className="mt-12 h-px w-full bg-cream/30" />
      </div>
    </SectionReveal>
  );
}
