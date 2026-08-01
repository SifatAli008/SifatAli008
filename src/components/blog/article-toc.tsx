"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/blog/extract-toc";
import { cn } from "@/lib/utils";

interface ArticleTocProps {
  items: TocItem[];
}

export function ArticleToc({ items }: ArticleTocProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!items.length) return;

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-15% 0px -70% 0px",
        threshold: [0, 0.25, 0.5, 1],
      }
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav aria-label="Table of contents" className="space-y-1">
      <p className="label-mono text-accent">On this page</p>
      <ol className="mt-4 space-y-1 border-l-2 border-ink/15">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block border-l-2 -ml-[2px] py-1.5 text-[13px] leading-snug transition-colors",
                item.level === 3 ? "pl-6 text-ink/55" : "pl-4 font-medium text-ink/70",
                activeId === item.id
                  ? "border-accent text-accent"
                  : "border-transparent hover:border-ink/40 hover:text-ink"
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
