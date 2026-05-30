import { NextResponse } from "next/server";
import {
  getDefaultGitHubUsername,
  GitHubApiError,
  parseGitHubUsername,
} from "@/lib/github/repo-info";
import { loadPortfolio } from "@/lib/github/load-portfolio";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = parseGitHubUsername(
    searchParams.get("username") ?? getDefaultGitHubUsername()
  );
  const includeForks = searchParams.get("forks") === "1";
  const includeArchived = searchParams.get("archived") === "1";
  const forceRefresh = searchParams.get("refresh") === "1";

  try {
    const result = await loadPortfolio(username, {
      includeForks,
      includeArchived,
      revalidate: forceRefresh ? false : undefined,
    });
    const { username: resolved, repos, portfolio } = result;

    return NextResponse.json({
      username: resolved,
      count: repos.length,
      repos,
      portfolio,
      fromSnapshot: result.fromSnapshot ?? false,
    });
  } catch (error) {
    const message =
      error instanceof GitHubApiError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Failed to load GitHub repos";
    const status = error instanceof GitHubApiError && error.status === 403 ? 403 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
