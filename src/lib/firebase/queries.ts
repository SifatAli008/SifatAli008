import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./client";
import type {
  Achievement,
  BlogPost,
  ContactSubmission,
  Experience,
  Profile,
  Project,
  Skill,
} from "@/types";
import { normalizeProfile } from "@/lib/profile-normalize";
import {
  loadPortfolio,
  resolveGitHubUsername,
} from "@/lib/github/load-portfolio";
import {
  mapProjectToPortfolioWork,
  type PortfolioWorkItem,
} from "@/lib/github/portfolio";
import {
  fallbackAchievements,
  fallbackBlogPosts,
  fallbackExperience,
  fallbackProfile,
  fallbackProjects,
  fallbackSkills,
  getFallbackBlogPost,
  getFallbackProject,
  publishedFallbackPosts,
} from "@/lib/data/fallback";

function mapDoc<T>(id: string, data: DocumentData): T {
  return { id, ...data } as T;
}

export async function getProfile(): Promise<Profile> {
  if (!db) return normalizeProfile(fallbackProfile);
  try {
    const snap = await getDoc(doc(db, "profile", "main"));
    if (snap.exists()) return normalizeProfile(snap.data() as Profile);
  } catch {
    /* fallback */
  }
  return normalizeProfile(fallbackProfile);
}

export async function getProjects(): Promise<Project[]> {
  if (!db) return fallbackProjects;
  try {
    const q = query(collection(db, "projects"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    if (snap.empty) return fallbackProjects;
    return snap.docs.map((d) => mapDoc<Project>(d.id, d.data()));
  } catch {
    return fallbackProjects;
  }
}

/** Live GitHub portfolio — falls back to bundled snapshot if API is rate-limited */
export async function getPortfolioWork(): Promise<PortfolioWorkItem[]> {
  const profile = await getProfile();
  const username = resolveGitHubUsername(profile.socials?.github);
  const { portfolio } = await loadPortfolio(username);
  return portfolio;
}

export async function getPortfolioWorkBySlug(
  slug: string
): Promise<PortfolioWorkItem | null> {
  const cmsProject = await getProjectBySlug(slug);
  if (cmsProject) return mapProjectToPortfolioWork(cmsProject);

  const portfolio = await getPortfolioWork();
  return portfolio.find((item) => item.slug === slug.toLowerCase()) ?? null;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!db) return getFallbackProject(slug) ?? null;
  try {
    const q = query(collection(db, "projects"), where("slug", "==", slug));
    const snap = await getDocs(q);
    if (snap.empty) return getFallbackProject(slug) ?? null;
    const d = snap.docs[0];
    return mapDoc<Project>(d.id, d.data());
  } catch {
    return getFallbackProject(slug) ?? null;
  }
}

export async function getSkills(): Promise<Skill[]> {
  if (!db) return fallbackSkills;
  try {
    const q = query(collection(db, "skills"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    if (snap.empty) return fallbackSkills;
    return snap.docs.map((d) => mapDoc<Skill>(d.id, d.data()));
  } catch {
    return fallbackSkills;
  }
}

export async function getExperience(): Promise<Experience[]> {
  if (!db) return fallbackExperience;
  try {
    const q = query(collection(db, "experiences"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    if (snap.empty) return fallbackExperience;
    return snap.docs.map((d) => mapDoc<Experience>(d.id, d.data()));
  } catch {
    return fallbackExperience;
  }
}

export async function getAchievements(): Promise<Achievement[]> {
  if (!db) return fallbackAchievements;
  try {
    const q = query(collection(db, "achievements"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    if (snap.empty) return fallbackAchievements;
    return snap.docs.map((d) => mapDoc<Achievement>(d.id, d.data()));
  } catch {
    return fallbackAchievements;
  }
}

export async function getBlogPosts(publishedOnly = true): Promise<BlogPost[]> {
  if (!db) {
    return publishedOnly ? publishedFallbackPosts : fallbackBlogPosts;
  }
  try {
    const q = publishedOnly
      ? query(
          collection(db, "blog_posts"),
          where("status", "==", "published"),
          orderBy("createdAt", "desc")
        )
      : query(collection(db, "blog_posts"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    if (snap.empty) {
      return publishedOnly ? publishedFallbackPosts : fallbackBlogPosts;
    }
    return snap.docs.map((d) => mapDoc<BlogPost>(d.id, d.data()));
  } catch {
    return publishedOnly ? publishedFallbackPosts : fallbackBlogPosts;
  }
}

export async function getBlogPostBySlug(
  slug: string,
  options: { includeDrafts?: boolean } = {}
): Promise<BlogPost | null> {
  if (!db) return getFallbackBlogPost(slug) ?? null;
  const { includeDrafts = false } = options;

  try {
    const q = includeDrafts
      ? query(collection(db, "blog_posts"), where("slug", "==", slug))
      : query(
          collection(db, "blog_posts"),
          where("slug", "==", slug),
          where("status", "==", "published")
        );
    const snap = await getDocs(q);
    if (snap.empty) return getFallbackBlogPost(slug) ?? null;
    const d = snap.docs[0];
    return mapDoc<BlogPost>(d.id, d.data());
  } catch {
    return getFallbackBlogPost(slug) ?? null;
  }
}

export async function submitContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!db) {
    console.info("[Contact fallback]", data);
    return { success: true };
  }
  try {
    await addDoc(collection(db, "contacts"), {
      ...data,
      read: false,
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to submit",
    };
  }
}
