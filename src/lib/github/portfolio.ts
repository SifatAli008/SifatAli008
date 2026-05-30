import type { GitHubUserRepo } from "@/lib/github/repo-info";
import type { Project, ProjectCategory } from "@/types";

export interface PortfolioWorkItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  techStack: string[];
  order: number;
  githubUrl: string;
  demoUrl?: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  updatedAt: string;
  isFork: boolean;
  isArchived: boolean;
  source: "github" | "cms";
}

export interface GitHubRepoStats {
  repos: number;
  stars: number;
  forks: number;
  languages: number;
  demos: number;
  languageBreakdown: Record<string, number>;
}

export function formatRepoTitle(name: string): string {
  return name
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function inferPortfolioCategory(repo: GitHubUserRepo): ProjectCategory {
  const lang = (repo.language ?? "").toLowerCase();
  const topics = repo.topics.map((topic) => topic.toLowerCase());

  if (
    lang === "gdscript" ||
    topics.some((topic) => topic.includes("game") || topic.includes("unity"))
  ) {
    return "Game";
  }

  if (
    topics.some((topic) =>
      ["ai", "ml", "machine-learning", "nlp", "deep-learning", "llm", "rag"].some((key) =>
        topic.includes(key)
      )
    ) ||
    lang === "jupyter notebook"
  ) {
    return "AI";
  }

  if (
    lang === "c#" ||
    lang === "c++" ||
    topics.some((topic) => topic.includes("desktop") || topic.includes("pyqt"))
  ) {
    return "Desktop";
  }

  if (["typescript", "javascript", "html", "php", "css"].includes(lang)) {
    return "Web";
  }

  if (lang === "python") return "AI";
  if (lang === "java" || lang === "c") return "Desktop";

  return "Tool";
}

export function mapGitHubRepoToPortfolioWork(
  repo: GitHubUserRepo,
  order: number
): PortfolioWorkItem {
  const techStack = [
    ...(repo.language ? [repo.language] : []),
    ...repo.topics.slice(0, 4),
  ];

  return {
    id: String(repo.id),
    slug: repo.name.toLowerCase(),
    title: formatRepoTitle(repo.name),
    tagline: repo.description ?? "Open-source project on GitHub",
    description: repo.description ?? "",
    category: inferPortfolioCategory(repo),
    techStack: techStack.length > 0 ? techStack : ["Open Source"],
    order,
    githubUrl: repo.url,
    demoUrl: repo.homepage,
    stars: repo.stars,
    forks: repo.forks,
    language: repo.language,
    topics: repo.topics,
    updatedAt: repo.updatedAt,
    isFork: repo.isFork,
    isArchived: repo.isArchived,
    source: "github",
  };
}

export function mapProjectToPortfolioWork(project: Project): PortfolioWorkItem {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    tagline: project.tagline,
    description: project.description,
    category: project.category,
    techStack: project.techStack,
    order: project.order,
    githubUrl: project.githubUrl ?? "",
    demoUrl: project.demoUrl ?? null,
    stars: 0,
    forks: 0,
    language: null,
    topics: project.techStack,
    updatedAt: project.updatedAt,
    isFork: false,
    isArchived: project.status === "archived",
    source: "cms",
  };
}

export function sortPortfolioByStars(items: PortfolioWorkItem[]): PortfolioWorkItem[] {
  return [...items].sort(
    (a, b) => b.stars - a.stars || a.order - b.order
  );
}

export function sortGitHubRepos(repos: GitHubUserRepo[]): GitHubUserRepo[] {
  return [...repos].sort(
    (a, b) => b.stars - a.stars || b.updatedAt.localeCompare(a.updatedAt)
  );
}

export function computeGitHubStats(repos: GitHubUserRepo[]): GitHubRepoStats {
  const languageBreakdown: Record<string, number> = {};

  repos.forEach((repo) => {
    if (repo.language) {
      languageBreakdown[repo.language] = (languageBreakdown[repo.language] ?? 0) + 1;
    }
  });

  return {
    repos: repos.length,
    stars: repos.reduce((sum, repo) => sum + repo.stars, 0),
    forks: repos.reduce((sum, repo) => sum + repo.forks, 0),
    languages: Object.keys(languageBreakdown).length,
    demos: repos.filter((repo) => repo.homepage).length,
    languageBreakdown,
  };
}

export function getPortfolioHref(item: PortfolioWorkItem): string {
  if (item.source === "cms") return `/projects/${item.slug}`;
  if (item.demoUrl) return item.demoUrl;
  return item.githubUrl;
}

export function isPortfolioExternal(item: PortfolioWorkItem): boolean {
  return item.source === "github";
}
