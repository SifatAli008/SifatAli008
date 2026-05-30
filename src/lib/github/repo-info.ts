export interface GitHubRepoInfo {
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  openIssues: number;
  updatedAt: string;
  url: string;
}

export interface GitHubUserRepo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  homepage: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  updatedAt: string;
  isFork: boolean;
  isArchived: boolean;
}

const DEFAULT_GITHUB_USERNAME = "SifatAli008";
const DEFAULT_REVALIDATE_SECONDS = 900;

export class GitHubApiError extends Error {
  status: number;
  rateLimitReset?: Date;

  constructor(status: number, message: string, rateLimitReset?: Date) {
    super(message);
    this.name = "GitHubApiError";
    this.status = status;
    this.rateLimitReset = rateLimitReset;
  }
}

export function getGitHubToken(): string | undefined {
  return process.env.GITHUB_TOKEN?.trim() || undefined;
}

export function parseGitHubUsername(urlOrUsername: string | undefined): string {
  if (!urlOrUsername?.trim()) return DEFAULT_GITHUB_USERNAME;
  const value = urlOrUsername.trim();
  if (!value.includes("github.com") && !value.includes("/")) {
    return value.replace(/^@/, "");
  }
  try {
    const parsed = new URL(value.startsWith("http") ? value : `https://${value}`);
    const parts = parsed.pathname.split("/").filter(Boolean);
    return parts[0]?.replace(/^@/, "") ?? DEFAULT_GITHUB_USERNAME;
  } catch {
    return value.replace(/^@/, "") || DEFAULT_GITHUB_USERNAME;
  }
}

export function getDefaultGitHubUsername(): string {
  return process.env.GITHUB_USERNAME ?? DEFAULT_GITHUB_USERNAME;
}

function mapGitHubApiRepo(raw: {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  updated_at: string;
  fork: boolean;
  archived: boolean;
}): GitHubUserRepo {
  return {
    id: raw.id,
    name: raw.name,
    fullName: raw.full_name,
    description: raw.description,
    url: raw.html_url,
    homepage: raw.homepage || null,
    stars: raw.stargazers_count,
    forks: raw.forks_count,
    language: raw.language,
    topics: raw.topics ?? [],
    updatedAt: raw.updated_at,
    isFork: raw.fork,
    isArchived: raw.archived,
  };
}

export async function fetchGitHubUserRepos(
  username: string,
  options?: {
    includeForks?: boolean;
    includeArchived?: boolean;
    token?: string;
    /** Server cache TTL in seconds. Pass false to bypass cache (admin refresh). */
    revalidate?: number | false;
  }
): Promise<GitHubUserRepo[]> {
  const user = parseGitHubUsername(username);
  const token = options?.token ?? getGitHubToken();
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "sifat-ali-platform",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const revalidate = options?.revalidate ?? DEFAULT_REVALIDATE_SECONDS;
  const fetchInit: RequestInit & { next?: { revalidate: number } } =
    revalidate === false
      ? { cache: "no-store" }
      : { next: { revalidate } };

  const repos: GitHubUserRepo[] = [];
  let page = 1;

  while (page <= 10) {
    const res = await fetch(
      `https://api.github.com/users/${user}/repos?sort=updated&direction=desc&per_page=100&page=${page}&type=owner`,
      { ...fetchInit, headers }
    );

    if (!res.ok) {
      let detail = "";
      try {
        const body = (await res.json()) as { message?: string };
        detail = body.message ?? "";
      } catch {
        /* ignore */
      }

      const resetHeader = res.headers.get("x-ratelimit-reset");
      const rateLimitReset = resetHeader
        ? new Date(Number(resetHeader) * 1000)
        : undefined;

      if (res.status === 403 || res.status === 429) {
        const hint = token
          ? "GitHub API limit reached — try again later."
          : "Add GITHUB_TOKEN to .env.local (github.com/settings/tokens, no scopes needed).";
        throw new GitHubApiError(
          res.status,
          detail ? `${detail}. ${hint}` : hint,
          rateLimitReset
        );
      }

      throw new GitHubApiError(
        res.status,
        detail || `GitHub API error (${res.status})`,
        rateLimitReset
      );
    }

    const batch = (await res.json()) as Parameters<typeof mapGitHubApiRepo>[0][];
    if (batch.length === 0) break;

    repos.push(...batch.map(mapGitHubApiRepo));
    if (batch.length < 100) break;
    page += 1;
  }

  return repos.filter((repo) => {
    if (!options?.includeForks && repo.isFork) return false;
    if (!options?.includeArchived && repo.isArchived) return false;
    return true;
  });
}

export function parseGitHubRepoUrl(url: string | undefined): { owner: string; repo: string } | null {
  if (!url?.trim()) return null;
  try {
    const parsed = new URL(url.trim());
    if (parsed.hostname.replace("www.", "") !== "github.com") return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1].replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

export async function fetchGitHubRepoInfo(
  url: string | undefined
): Promise<GitHubRepoInfo | null> {
  const parsed = parseGitHubRepoUrl(url);
  if (!parsed) return null;

  const res = await fetch(
    `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`,
    { headers: { Accept: "application/vnd.github+json" } }
  );

  if (!res.ok) return null;

  const data = (await res.json()) as {
    full_name: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    open_issues_count: number;
    updated_at: string;
    html_url: string;
  };

  return {
    fullName: data.full_name,
    description: data.description,
    stars: data.stargazers_count,
    forks: data.forks_count,
    language: data.language,
    openIssues: data.open_issues_count,
    updatedAt: data.updated_at,
    url: data.html_url,
  };
}

export function formatGitHubRelativeDate(iso: string): string {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}
