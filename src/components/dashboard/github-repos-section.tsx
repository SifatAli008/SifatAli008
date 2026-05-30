"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatGitHubRelativeDate } from "@/lib/github/repo-info";
import { useGitHubRepos } from "@/lib/github/use-github-repos";
import { PORTFOLIO_PREVIEW_LIMIT } from "@/lib/github/load-portfolio";
import { DashboardSelect } from "@/components/dashboard/dashboard-modal";
import {
  DashboardQuickLink,
} from "@/components/dashboard/page-header";
import {
  GitFork,
  Star,
  RefreshCw,
  Search,
  Loader2,
  Globe,
  Github,
  Code2,
} from "lucide-react";
import { toast } from "sonner";

export function GitHubReposSection() {
  const {
    profileUsername,
    activeUsername,
    repos,
    stats,
    languages,
    loading,
    error,
    fetchRepos,
  } = useGitHubRepos();

  const [draftUsername, setDraftUsername] = useState(profileUsername);
  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [showForks, setShowForks] = useState(false);

  useEffect(() => {
    if (profileUsername) {
      void fetchRepos(profileUsername, showForks);
    }
  }, [profileUsername, showForks, fetchRepos]);

  useEffect(() => {
    setDraftUsername(activeUsername || profileUsername);
  }, [activeUsername, profileUsername]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return repos
      .filter((repo) => {
        const matchesSearch =
          repo.name.toLowerCase().includes(q) ||
          repo.fullName.toLowerCase().includes(q) ||
          (repo.description ?? "").toLowerCase().includes(q) ||
          repo.topics.some((t) => t.toLowerCase().includes(q));
        const matchesLang =
          languageFilter === "all" || repo.language === languageFilter;
        return matchesSearch && matchesLang;
      })
      .sort((a, b) => b.stars - a.stars || b.updatedAt.localeCompare(a.updatedAt));
  }, [repos, search, languageFilter]);

  const handleRefresh = () => {
    void fetchRepos(draftUsername, showForks, true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <DashboardQuickLink
          href={`https://github.com/${activeUsername}`}
          external
        >
          VIEW PROFILE →
        </DashboardQuickLink>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Repositories", value: stats.repos, icon: Github },
          { label: "Total stars", value: stats.stars.toLocaleString(), icon: Star },
          { label: "Languages", value: stats.languages, icon: Code2 },
          { label: "Live demos", value: stats.demos, icon: Globe },
        ].map((item) => (
          <div key={item.label} className="dashboard-stat-card glow-border rounded-xl p-4">
            <item.icon className="h-4 w-4 text-accent" />
            <p className="mt-3 font-display text-3xl leading-none text-cream">
              {loading ? "—" : item.value}
            </p>
            <p className="label-mono mt-2 text-[10px] text-zinc-500">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-strong rounded-xl p-4 md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Search by name, description, or topic…"
              className="dashboard-field pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DashboardSelect
              className="mt-0 w-full min-w-[140px] sm:w-40"
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
            >
              <option value="all">All languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </DashboardSelect>
            <label className="flex items-center gap-2 whitespace-nowrap text-xs text-zinc-500">
              <input
                type="checkbox"
                checked={showForks}
                onChange={(e) => setShowForks(e.target.checked)}
                className="accent-accent"
              />
              Forks
            </label>
            <Input
              className="dashboard-field w-36 font-mono text-xs"
              value={draftUsername}
              onChange={(e) => setDraftUsername(e.target.value)}
              placeholder="Username"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {!loading && !error && (
          <p className="mt-3 text-xs text-zinc-600">
            Showing {filtered.length} of {repos.length} repos from{" "}
            <span className="text-zinc-400">github.com/{activeUsername}</span>
            {" · "}sorted by stars
            {" · "}
            <span className="text-zinc-400">
              top {PORTFOLIO_PREVIEW_LIMIT} = 05 / SELECTED WORK on homepage
            </span>
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-sm text-zinc-500">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-accent" />
          Loading GitHub repositories…
        </div>
      ) : error ? (
        <div className="dashboard-empty text-sm text-zinc-500">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="dashboard-empty text-sm text-zinc-500">
          No repositories match your filters.
        </div>
      ) : (
        <div className="dashboard-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="sticky top-0 z-10 border-b border-white/10 bg-[#121212]">
                <tr>
                  <th className="p-4 font-normal label-mono text-[10px] text-zinc-500">
                    REPOSITORY
                  </th>
                  <th className="p-4 font-normal label-mono text-[10px] text-zinc-500">
                    ABOUT
                  </th>
                  <th className="p-4 font-normal label-mono text-[10px] text-zinc-500">
                    LANG
                  </th>
                  <th className="p-4 font-normal label-mono text-[10px] text-zinc-500">
                    STARS
                  </th>
                  <th className="p-4 font-normal label-mono text-[10px] text-zinc-500">
                    FORKS
                  </th>
                  <th className="p-4 font-normal label-mono text-[10px] text-zinc-500">
                    UPDATED
                  </th>
                  <th className="p-4 font-normal label-mono text-[10px] text-zinc-500">
                    LINKS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((repo) => (
                  <tr key={repo.id} className="dashboard-table-row group">
                    <td className="p-4">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block min-w-[120px] font-mono text-sm text-cream transition-colors group-hover:text-accent"
                      >
                        {repo.name}
                      </a>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {repo.isFork && (
                          <Badge variant="outline" className="text-[10px]">
                            Fork
                          </Badge>
                        )}
                        {repo.isArchived && (
                          <Badge variant="secondary" className="text-[10px]">
                            Archived
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="max-w-sm p-4">
                      <p className="line-clamp-2 text-xs leading-relaxed text-zinc-400">
                        {repo.description ?? "No description"}
                      </p>
                      {repo.topics.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {repo.topics.slice(0, 4).map((topic) => (
                            <span
                              key={topic}
                              className="label-mono border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[8px] text-zinc-500"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {repo.language ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
                          <span className="h-2 w-2 rounded-full bg-accent" />
                          {repo.language}
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 font-mono text-xs text-zinc-300">
                        <Star className="h-3.5 w-3.5 text-amber-400" />
                        {repo.stars}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 font-mono text-xs text-zinc-300">
                        <GitFork className="h-3.5 w-3.5 text-zinc-500" />
                        {repo.forks}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="label-mono text-[10px] text-zinc-600">
                        {formatGitHubRelativeDate(repo.updatedAt)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 w-8 items-center justify-center border border-transparent text-zinc-500 transition-colors hover:border-white/10 hover:text-accent"
                          title="GitHub"
                        >
                          <Github className="h-3.5 w-3.5" />
                        </a>
                        {repo.homepage ? (
                          <a
                            href={repo.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-8 w-8 items-center justify-center border border-transparent text-zinc-500 transition-colors hover:border-white/10 hover:text-accent"
                            title="Live demo"
                          >
                            <Globe className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className="inline-flex h-8 w-8 items-center justify-center text-zinc-800">
                            <Globe className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
