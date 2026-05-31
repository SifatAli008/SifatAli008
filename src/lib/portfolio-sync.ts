import type { ArchiveTimelineItem } from "@/lib/data/archive";
import type { Achievement } from "@/types";

export function achievementsToArchiveItems(
  achievements: Achievement[]
): ArchiveTimelineItem[] {
  return achievements.map((achievement) => ({
    year: achievement.year,
    category: achievement.category,
    title: achievement.title,
    description: achievement.description,
    metrics: achievement.metrics ?? {},
  }));
}

export const SITE_SYNC_MAP = [
  {
    admin: "Projects",
    public: "Homepage (top 10) + /projects",
    source: "GitHub repos",
  },
  {
    admin: "Featured",
    public: "Homepage LinkedIn grid",
    source: "Firestore · ordered",
  },
  {
    admin: "Blog",
    public: "Homepage writing + /blog",
    source: "Firestore · published only",
  },
  {
    admin: "Skills",
    public: "Homepage skills bands",
    source: "Firestore · ordered",
  },
  {
    admin: "Experience",
    public: "Homepage experience table",
    source: "Firestore · ordered",
  },
  {
    admin: "Research",
    public: "Homepage academic section",
    source: "Firestore · settings + papers",
  },
  {
    admin: "Tech stack",
    public: "Homepage marquee strip",
    source: "Firestore · ordered",
  },
  {
    admin: "Achievements",
    public: "/archive timeline",
    source: "Firestore · ordered",
  },
  {
    admin: "Settings",
    public: "Hero stats + about",
    source: "Firestore · projectsBuilt from GitHub",
  },
] as const;
