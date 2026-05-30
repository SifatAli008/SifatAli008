"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { GitHubUserRepo } from "@/lib/github/repo-info";
import { getDefaultGitHubUsername } from "@/lib/github/repo-info";
import { computeGitHubStats, sortGitHubRepos } from "@/lib/github/portfolio";
import { resolveGitHubUsername } from "@/lib/github/load-portfolio";

async function loadProfileUsername(): Promise<string> {
  if (!db) return getDefaultGitHubUsername();

  const profileSnap = await getDoc(doc(db, "profile", "main"));
  if (!profileSnap.exists()) return getDefaultGitHubUsername();

  const profile = profileSnap.data() as { socials?: { github?: string } };
  return resolveGitHubUsername(profile.socials?.github);
}

export function useGitHubRepos() {
  const [profileUsername, setProfileUsername] = useState(getDefaultGitHubUsername());
  const [activeUsername, setActiveUsername] = useState(getDefaultGitHubUsername());
  const [repos, setRepos] = useState<GitHubUserRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadProfileUsername().then((loaded) => {
      if (cancelled) return;
      setProfileUsername(loaded);
      setActiveUsername(loaded);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const fetchRepos = useCallback(async (username: string, includeForks = false, refresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ username });
      if (includeForks) params.set("forks", "1");
      if (refresh) params.set("refresh", "1");

      const res = await fetch(`/api/github/repos?${params.toString()}`);
      const data = (await res.json()) as {
        repos?: GitHubUserRepo[];
        error?: string;
        username?: string;
      };

      if (!res.ok) throw new Error(data.error ?? "Failed to load repositories");

      setRepos(sortGitHubRepos(data.repos ?? []));
      setActiveUsername(data.username ?? username);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load GitHub repos";
      setError(msg);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const stats = useMemo(() => computeGitHubStats(repos), [repos]);

  const languages = useMemo(
    () => Object.keys(stats.languageBreakdown).sort(),
    [stats.languageBreakdown]
  );

  const topRepos = useMemo(() => repos.slice(0, 5), [repos]);

  return {
    profileUsername,
    activeUsername,
    repos,
    stats,
    languages,
    topRepos,
    loading,
    error,
    fetchRepos,
  };
}

export type { GitHubRepoStats } from "@/lib/github/portfolio";
