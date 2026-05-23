export type ProjectStatus = "completed" | "in-progress" | "archived";
export type ProjectCategory = "Desktop" | "AI" | "Web" | "Mobile" | "Tool" | "Game";

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  techStack: string[];
  status: ProjectStatus;
  featured: boolean;
  order: number;
  githubUrl?: string;
  demoUrl?: string;
  coverImage?: string;
  challenge?: string;
  process?: string;
  architecture?: string;
  features?: string[];
  screenshots?: string[];
  technicalDecisions?: string;
  results?: string;
  createdAt: string;
  updatedAt: string;
}

export type SkillCategory = "Frontend" | "Backend" | "AI & Data" | "Tools" | "Games" | "CMS";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  icon: string;
  proficiency: number;
  order: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  location?: string;
  description: string;
  impact: string[];
  stack: string[];
  order: number;
}

export type ArchiveCategory =
  | "Project"
  | "Learning"
  | "Job"
  | "Research"
  | "Community"
  | "Achievement";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  year: number;
  category: ArchiveCategory;
  metrics?: Record<string, string | number>;
  order: number;
}

export type BlogStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  status: BlogStatus;
  readingTime: number;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Profile {
  name: string;
  tagline: string;
  headline: string;
  bio: string;
  aboutStory: string;
  engineeringPhilosophy: string;
  values: string[];
  avatar?: string;
  resumeUrl?: string;
  email: string;
  phone?: string;
  address?: string;
  location: string;
  timezone: string;
  education?: string;
  responseTime: string;
  availableForWork: boolean;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    medium?: string;
    behance?: string;
    leetcode?: string;
  };
  stats: {
    projectsBuilt: number;
    studentsMentored: number;
    eventsOrganized: number;
    yearsExperience: number;
    hackathonWins: number;
    bootcampsLed: number;
    clientsServed: number;
    leetcode: {
      solved: number;
      easy: number;
      medium: number;
      hard: number;
    };
  };
  metrics?: {
    yearlyImpact: { year: number; label: string; value: number }[];
    activityMix: { label: string; value: number }[];
  };
  typewriterRoles: string[];
  /** Focus industries shown in hero */
  domains?: string[];
}
