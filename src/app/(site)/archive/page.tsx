"use client";

import { useMemo, useState } from "react";
import { FadeIn } from "@/components/motion/fade-in";
import type { ArchiveCategory } from "@/types";

const archiveData = [
  { year: 2026, category: "Job" as ArchiveCategory, title: "COO @ FLUVO SOFT", description: "Leading operations for AI, web, mobile, and SaaS delivery.", metrics: {} },
  { year: 2025, category: "Achievement" as ArchiveCategory, title: "2× NATIONAL HACKATHON WINNER", description: "InnovateX 2025 & NextGen @ IIUC Tech Fest.", metrics: { wins: 2 } },
  { year: 2024, category: "Community" as ArchiveCategory, title: "UIU DEVELOPERS HUB", description: "PyDItor, Sir Kothay, mentorship.", metrics: { tools: 2 } },
  { year: 2024, category: "Learning" as ArchiveCategory, title: "GOOGLE ANALYTICS & DIGITAL MARKETING", description: "Certifications completed.", metrics: { certs: 2 } },
  { year: 2022, category: "Achievement" as ArchiveCategory, title: "B.SC. CS — UIU", description: "United International University.", metrics: {} },
  { year: 2021, category: "Learning" as ArchiveCategory, title: "SHOHOZ SKILL — 300+ STUDENTS", description: "12 bootcamps, 65% completion lift.", metrics: { students: 300 } },
  { year: 2019, category: "Job" as ArchiveCategory, title: "FREELANCE FRONTEND", description: "500+ clients globally.", metrics: { clients: 500 } },
];

const categories: (ArchiveCategory | "ALL")[] = [
  "ALL", "Project", "Learning", "Job", "Research", "Community", "Achievement",
];

export default function ArchivePage() {
  const [category, setCategory] = useState<string>("ALL");
  const [year, setYear] = useState<string>("ALL");

  const filtered = useMemo(() => {
    return archiveData.filter((item) => {
      const catMatch = category === "ALL" || item.category === category;
      const yearMatch = year === "ALL" || String(item.year) === year;
      return catMatch && yearMatch;
    });
  }, [category, year]);

  const years = Array.from(new Set(archiveData.map((a) => a.year))).sort(
    (a, b) => b - a
  );

  return (
    <div className="bg-cream">
      <div className="border-b-[3px] border-ink bg-ink">
        <div className="site-container py-4">
          <p className="label-mono text-accent">ARCHIVE</p>
          <h1 className="font-display text-display leading-none text-cream">
            DIGITAL LEGACY
          </h1>
        </div>
      </div>

      <div className="site-container section-pad">
        <div className="flex flex-wrap gap-0 border-2 border-ink">
          {categories.map((c) => (
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
          {filtered.map((item, i) => (
            <FadeIn key={`${item.year}-${item.title}`} delay={i * 0.05}>
              <div className="relative mb-12 border-b border-ink pb-12 last:border-b-0">
                <span className="absolute -left-[41px] top-1 h-3 w-3 bg-accent" />
                <div className="flex flex-wrap items-center gap-3">
                  <span className="label-mono text-muted">{item.year}</span>
                  <span className="tag-brutal">{item.category}</span>
                </div>
                <h3 className="mt-2 font-display text-3xl text-ink">{item.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{item.description}</p>
                {Object.keys(item.metrics).length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-4">
                    {Object.entries(item.metrics).map(([k, v]) => (
                      <div key={k} className="border-2 border-ink px-4 py-2">
                        <p className="font-display text-2xl">{v}</p>
                        <p className="label-mono text-muted">{k}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
