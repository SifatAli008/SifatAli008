import {
  fetchGitHubUserRepos,
  getDefaultGitHubUsername,
  parseGitHubUsername,
  type GitHubUserRepo,
} from "@/lib/github/repo-info";
import {
  mapGitHubRepoToPortfolioWork,
  sortGitHubRepos,
  type PortfolioWorkItem,
} from "@/lib/github/portfolio";
import githubSnapshot from "@/lib/data/github-portfolio-snapshot.json";

/** Homepage SELECTED WORK preview — matches admin default list length */
export const PORTFOLIO_PREVIEW_LIMIT = 10;

export interface LoadPortfolioOptions {
  includeForks?: boolean;
  includeArchived?: boolean;
  /** Pass false to force a live GitHub fetch (admin refresh). */
  revalidate?: number | false;
}

export interface LoadedPortfolio {
  username: string;
  repos: GitHubUserRepo[];
  portfolio: PortfolioWorkItem[];
  fromSnapshot?: boolean;
}

function loadPortfolioFromSnapshot(username?: string): LoadedPortfolio {
  const repos = sortGitHubRepos(githubSnapshot.repos as GitHubUserRepo[]);
  const portfolio = repos.map((repo, index) =>
    mapGitHubRepoToPortfolioWork(repo, index + 1)
  );

  return {
    username: resolveGitHubUsername(username ?? githubSnapshot.username),
    repos,
    portfolio,
    fromSnapshot: true,
  };
}

export function resolveGitHubUsername(
  profileGithub?: string | null,
  override?: string | null
): string {
  if (override?.trim()) return parseGitHubUsername(override);
  if (profileGithub?.trim()) return parseGitHubUsername(profileGithub);
  return getDefaultGitHubUsername();
}

/** Single GitHub fetch used by site, API route, and admin dashboard */
export async function loadGitHubRepos(
  username: string,
  options: LoadPortfolioOptions = {}
): Promise<GitHubUserRepo[]> {
  const user = parseGitHubUsername(username);
  const repos = await fetchGitHubUserRepos(user, {
    includeForks: options.includeForks ?? false,
    includeArchived: options.includeArchived ?? false,
    revalidate: options.revalidate,
  });

  return sortGitHubRepos(repos);
}

export async function loadPortfolio(
  username: string,
  options: LoadPortfolioOptions = {}
): Promise<LoadedPortfolio> {
  try {
    const resolved = parseGitHubUsername(username);
    const repos = await loadGitHubRepos(resolved, options);
    const portfolio = repos.map((repo, index) =>
      mapGitHubRepoToPortfolioWork(repo, index + 1)
    );

    return {
      username: resolved,
      repos,
      portfolio,
      fromSnapshot: false,
    };
  } catch {
    return loadPortfolioFromSnapshot(username);
  }
}

export function getPortfolioPreview(portfolio: PortfolioWorkItem[]): PortfolioWorkItem[] {
  return portfolio.slice(0, PORTFOLIO_PREVIEW_LIMIT);
}
