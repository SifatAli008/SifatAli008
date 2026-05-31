"use client";

import { useMemo, useState } from "react";
import type { ArchiveTimelineItem } from "@/lib/data/archive";
import { archiveCategories, getArchiveYearsFromItems } from "@/lib/data/archive";

interface ArchiveViewProps {
  items: ArchiveTimelineItem[];
}

export function ArchiveView({ items }: ArchiveViewProps) {
  const [category, setCategory] = useState<string>("ALL");
  const [year, setYear] = useState<string>("ALL");

  const years = useMemo(() => getArchiveYearsFromItems(items), [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const catMatch = category === "ALL" || item.category === category;
      const yearMatch = year === "ALL" || String(item.year) === year;
      return catMatch && yearMatch;
    });
  }, [items, category, year]);

  const visibleKeys = new Set(
    filtered.map((item) => `${item.year}-${item.title}`)
  );

  return (
    <div className="site-container section-pad">
      <div className="flex flex-wrap gap-0 border-2 border-ink">
        {archiveCategories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`label-mono border-r border-ink px-4 py-3 last:border-r-0 ${
              category === c ? "bg-ink text-cream" : "bg-cream text-ink"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {["ALL", ...years.map(String)].map((y) => (
          <button
            key={y}
            type="button"
            onClick={() => setYear(y)}
            className={`tag-brutal ${year === y ? "!bg-ink !text-cream" : ""}`}
          >
            {y}
          </button>
        ))}
      </div>

      <div className="mt-16 border-l-2 border-ink pl-8">
        {items.map((item) => {
          const key = `${item.year}-${item.title}`;
          const anchorId = `${item.year}-${item.title.replace(/\s+/g, "-").toLowerCase()}`;
          const isVisible = visibleKeys.has(key);

          return (
            <article
              key={key}
              id={anchorId}
              hidden={!isVisible}
              className={`relative mb-12 border-b border-ink pb-12 last:border-b-0 ${
                isVisible ? "" : "hidden"
              }`}
            >
              <span className="absolute -left-[41px] top-1 h-3 w-3 bg-accent" />
              <div className="flex flex-wrap items-center gap-3">
                <span className="label-mono text-muted">{item.year}</span>
                <span className="tag-brutal">{item.category}</span>
              </div>
              <h2 className="mt-2 font-display text-3xl text-ink">{item.title}</h2>
              <p className="mt-2 text-sm text-ink/70">{item.description}</p>
              {Object.keys(item.metrics).length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-4">
                  {Object.entries(item.metrics).map(([k, v]) => (
                    <div key={k} className="border-2 border-ink px-4 py-2">
                      <p className="font-display text-2xl">{v}</p>
                      <p className="label-mono text-muted">{k}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
