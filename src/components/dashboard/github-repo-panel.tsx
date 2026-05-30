"use client";

import { useEffect, useState } from "react";
import type { GitHubRepoInfo } from "@/lib/github/repo-info";
import { fetchGitHubRepoInfo, formatGitHubRelativeDate } from "@/lib/github/repo-info";
import { GitBranch, GitFork, Star, Circle } from "lucide-react";

export function GitHubRepoPanel({
  url,
  compact = false,
}: {
  url: string | undefined;
  compact?: boolean;
}) {
  const [info, setInfo] = useState<GitHubRepoInfo | null>(null);
  const [loading, setLoading] = useState(!!url);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url) {
      setInfo(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    fetchGitHubRepoInfo(url)
      .then((data) => {
        if (!cancelled) {
          setInfo(data);
          setError(!data);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (!url) {
    return (
      <p className="text-xs text-zinc-600">No GitHub repo linked</p>
    );
  }

  if (loading) {
    return <p className="label-mono text-[10px] text-zinc-600">Loading GitHub…</p>;
  }

  if (error || !info) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="label-mono text-[10px] text-accent hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        View on GitHub →
      </a>
    );
  }

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
        <a
          href={info.url}
          target="_blank"
          rel="noopener noreferrer"
          className="label-mono text-[10px] text-accent hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {info.fullName}
        </a>
        <span className="inline-flex items-center gap-1">
          <Star className="h-3 w-3 text-amber-400" />
          {info.stars}
        </span>
        <span className="inline-flex items-center gap-1">
          <GitFork className="h-3 w-3" />
          {info.forks}
        </span>
        {info.language && (
          <span className="inline-flex items-center gap-1">
            <Circle className="h-2 w-2 fill-accent text-accent" />
            {info.language}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="border-2 border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="label-mono text-[10px] text-accent">GITHUB</p>
          <a
            href={info.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block truncate font-mono text-sm text-cream hover:text-accent"
            onClick={(e) => e.stopPropagation()}
          >
            {info.fullName}
          </a>
          {info.description && (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-500">
              {info.description}
            </p>
          )}
        </div>
        <span className="label-mono shrink-0 text-[9px] text-zinc-600">
          Updated {formatGitHubRelativeDate(info.updatedAt)}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-400">
        <span className="inline-flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 text-amber-400" />
          {info.stars.toLocaleString()} stars
        </span>
        <span className="inline-flex items-center gap-1.5">
          <GitFork className="h-3.5 w-3.5" />
          {info.forks.toLocaleString()} forks
        </span>
        {info.language && (
          <span className="inline-flex items-center gap-1.5">
            <GitBranch className="h-3.5 w-3.5 text-accent" />
            {info.language}
          </span>
        )}
      </div>
    </div>
  );
}
