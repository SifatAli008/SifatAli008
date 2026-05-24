import type { ArchiveCategory } from "@/types";

export interface ArchiveTimelineItem {
  year: number;
  category: ArchiveCategory;
  title: string;
  description: string;
  metrics: Record<string, string | number>;
}

export const archiveTimeline: ArchiveTimelineItem[] = [
  {
    year: 2026,
    category: "Job",
    title: "COO @ FLUVO SOFT",
    description: "Leading operations for AI, web, mobile, and SaaS delivery.",
    metrics: {},
  },
  {
    year: 2025,
    category: "Achievement",
    title: "2× NATIONAL HACKATHON WINNER",
    description: "InnovateX 2025 & NextGen @ IIUC Tech Fest.",
    metrics: { wins: 2 },
  },
  {
    year: 2024,
    category: "Community",
    title: "UIU DEVELOPERS HUB",
    description: "PyDItor, Sir Kothay, mentorship.",
    metrics: { tools: 2 },
  },
  {
    year: 2024,
    category: "Learning",
    title: "GOOGLE ANALYTICS & DIGITAL MARKETING",
    description: "Certifications completed.",
    metrics: { certs: 2 },
  },
  {
    year: 2022,
    category: "Achievement",
    title: "B.SC. CS — UIU",
    description: "United International University.",
    metrics: {},
  },
  {
    year: 2021,
    category: "Learning",
    title: "SHOHOZ SKILL — 300+ STUDENTS",
    description: "12 bootcamps, 65% completion lift.",
    metrics: { students: 300 },
  },
  {
    year: 2019,
    category: "Job",
    title: "FREELANCE FRONTEND",
    description: "500+ clients globally.",
    metrics: { clients: 500 },
  },
];

export const archiveCategories: (ArchiveCategory | "ALL")[] = [
  "ALL",
  "Project",
  "Learning",
  "Job",
  "Research",
  "Community",
  "Achievement",
];

export const archiveYears = Array.from(
  new Set(archiveTimeline.map((a) => a.year))
).sort((a, b) => b - a);
