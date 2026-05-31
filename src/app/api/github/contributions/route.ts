import { NextResponse } from "next/server";
import {
  fetchGitHubContributions,
  resolveGitHubUsernameForContributions,
} from "@/lib/github/contributions";
import { getDefaultGitHubUsername } from "@/lib/github/repo-info";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = resolveGitHubUsernameForContributions(
    searchParams.get("username") ?? getDefaultGitHubUsername()
  );
  const year = Number(searchParams.get("year") ?? new Date().getFullYear());

  if (!Number.isFinite(year) || year < 2008 || year > 2100) {
    return NextResponse.json({ error: "Invalid year" }, { status: 400 });
  }

  try {
    const calendar = await fetchGitHubContributions(username, year);
    return NextResponse.json(calendar);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load contributions";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
