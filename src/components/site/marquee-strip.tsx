"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { simpleIconUrl } from "@/lib/data/tech-stack";
import type { TechStackItem } from "@/types";

interface MarqueeStripProps {
  items: TechStackItem[];
}

function StackIcon({ tech }: { tech: TechStackItem }) {
  if (!tech.iconSlug) {
    return (
      <Sparkles
        className="h-[18px] w-[18px] shrink-0 text-ink/40"
        strokeWidth={2}
        aria-hidden
      />
    );
  }

  return (
    <Image
      src={simpleIconUrl(tech.iconSlug)}
      alt=""
      width={18}
      height={18}
      className="marquee-tech-icon shrink-0"
      unoptimized
    />
  );
}

function StackItem({ tech }: { tech: TechStackItem }) {
  return (
    <span className="group inline-flex shrink-0 items-center gap-2.5">
      <StackIcon tech={tech} />
      <span className="font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/45 transition-colors group-hover:text-ink/75">
        {tech.label}
      </span>
    </span>
  );
}

function MarqueeRow({ rowId, items }: { rowId: string; items: TechStackItem[] }) {
  return (
    <div
      className="flex shrink-0 items-center py-1 pl-12 pr-4"
      aria-hidden={rowId !== "primary" ? true : undefined}
    >
      {items.map((tech) => (
        <span key={`${rowId}-${tech.id}`} className="mr-10 inline-flex shrink-0 items-center">
          <StackItem tech={tech} />
        </span>
      ))}
    </div>
  );
}

export function MarqueeStrip({ items }: MarqueeStripProps) {
  if (items.length === 0) return null;

  return (
    <div
      className="overflow-hidden border-y border-ink bg-cream py-5"
      aria-label="Tech stack marquee"
    >
      <div className="marquee-track flex w-max items-center">
        <MarqueeRow rowId="primary" items={items} />
        <MarqueeRow rowId="clone" items={items} />
      </div>
    </div>
  );
}
