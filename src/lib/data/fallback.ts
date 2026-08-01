import {
  seedAchievements,
  seedExperience,
  seedProfile,
  seedProjects,
  seedSkills,
} from "./seed-data";
import { featuredItems } from "./featured";
import { defaultResearchSettings } from "./research";
import { techStackMarquee } from "./tech-stack";
import type {
  Achievement,
  Experience,
  FeaturedPost,
  Profile,
  Project,
  ResearchPaper,
  ResearchSectionSettings,
  Skill,
  TechStackItem,
} from "@/types";

function withIds<T extends object>(
  items: Omit<T, "id">[],
  prefix: string
): (T & { id: string })[] {
  return items.map((item, i) => ({
    ...item,
    id: `${prefix}-${i + 1}`,
  })) as (T & { id: string })[];
}

export const fallbackProfile: Profile = seedProfile;

export const fallbackProjects: Project[] = withIds<Project>(
  seedProjects,
  "proj"
);

export const fallbackSkills: Skill[] = withIds<Skill>(seedSkills, "skill");

export const fallbackExperience: Experience[] = withIds<Experience>(
  seedExperience,
  "exp"
);

export const fallbackAchievements: Achievement[] = withIds<Achievement>(
  seedAchievements,
  "ach"
);

export function getFallbackProject(slug: string): Project | undefined {
  return fallbackProjects.find((p) => p.slug === slug);
}

export const fallbackFeaturedPosts: FeaturedPost[] = featuredItems;

export const fallbackTechStack: TechStackItem[] = techStackMarquee;

export const fallbackResearchSettings: ResearchSectionSettings = defaultResearchSettings;

export const fallbackResearchPapers: ResearchPaper[] = [];
