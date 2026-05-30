"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Filter, GitFork, Globe, Star } from "lucide-react";
import { SectionReveal } from "@/components/motion/section-reveal";
import { BrutalButton } from "@/components/ui/brutal-button";
import {
  getPortfolioHref,
  isPortfolioExternal,
  type PortfolioWorkItem,
} from "@/lib/github/portfolio";
import { formatGitHubRelativeDate } from "@/lib/github/repo-info";
import { PORTFOLIO_PREVIEW_LIMIT } from "@/lib/github/load-portfolio";

const filters = ["ALL", "AI/ML", "WEB", "DESKTOP", "GAMES"] as const;

function matchesFilter(item: PortfolioWorkItem, filter: string): boolean {
  if (filter === "ALL") return true;
  if (filter === "AI/ML") return item.category === "AI";
  if (filter === "WEB") return item.category === "Web" || item.category === "Mobile";
  if (filter === "DESKTOP") {
    return item.category === "Desktop" || item.category === "Tool";
  }
  if (filter === "GAMES") return item.category === "Game";
  return true;
}

interface ProjectsRowsProps {
  projects: PortfolioWorkItem[];
  showHeader?: boolean;
  /** Homepage preview — first N only, no pagination */
  limit?: number;
  /** Paginate list (e.g. /projects) — fixed items per page */
  pageSize?: number;
}

function ProjectRowContent({
  project,
  index,
}: {
  project: PortfolioWorkItem;
  index: number;
}) {
  const categoryLabel = project.category.toUpperCase();
  const repoSlug = project.githubUrl
    ? project.githubUrl.replace("https://github.com/", "")
    : project.slug;

  return (
    <>
      <div className="flex items-center justify-center border-b border-ink px-4 py-6 md:border-b-0 md:border-r md:py-8">
        <span className="font-display text-[64px] leading-none text-ink/[0.08] group-hover:text-cream/20">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="border-b border-ink px-6 py-6 md:border-b-0 md:border-r md:py-8 md:text-left">
        <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
          <span className="label-mono border border-ink bg-ink px-2 py-0.5 text-[10px] text-cream group-hover:border-cream group-hover:bg-cream group-hover:text-ink">
            {categoryLabel}
          </span>
          {project.demoUrl && (
            <span className="label-mono inline-flex items-center gap-1 border border-accent bg-accent/10 px-2 py-0.5 text-[10px] text-accent group-hover:border-cream group-hover:bg-cream group-hover:text-ink">
              <Globe className="h-3 w-3" />
              LIVE
            </span>
          )}
          {project.isArchived && (
            <span className="label-mono border border-ink/30 px-2 py-0.5 text-[10px] text-ink/50 group-hover:border-cream/40 group-hover:text-cream/70">
              ARCHIVED
            </span>
          )}
        </div>

        <h3 className="mt-3 text-center font-sans text-xl font-bold group-hover:text-cream md:text-left">
          {project.title}
        </h3>
        <p className="label-mono mt-1 text-center text-[10px] text-ink/45 group-hover:text-cream/60 md:text-left">
          {repoSlug}
        </p>

        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-ink/75 group-hover:text-cream/90 md:mx-0 md:text-left">
          {project.description || project.tagline}
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 md:justify-start">
          {project.language && (
            <span className="inline-flex items-center gap-1.5 text-xs text-ink/70 group-hover:text-cream/80">
              <span className="h-2 w-2 rounded-full bg-accent group-hover:bg-cream" />
              {project.language}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-xs text-ink/70 group-hover:text-cream/80">
            <Star className="h-3.5 w-3.5 text-amber-500 group-hover:text-cream" />
            {project.stars} stars
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-ink/70 group-hover:text-cream/80">
            <GitFork className="h-3.5 w-3.5 group-hover:text-cream" />
            {project.forks} forks
          </span>
          <span className="label-mono text-[10px] text-ink/45 group-hover:text-cream/60">
            Updated {formatGitHubRelativeDate(project.updatedAt)}
          </span>
        </div>

        <p className="label-mono mt-4 text-center text-[11px] text-accent group-hover:text-cream md:text-left">
          {project.techStack.join(" · ").toUpperCase()}
        </p>

        {project.topics.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-1.5 md:justify-start">
            {project.topics.slice(0, 5).map((topic) => (
              <span
                key={topic}
                className="label-mono border border-ink/15 bg-ink/[0.03] px-1.5 py-0.5 text-[9px] text-ink/55 group-hover:border-cream/30 group-hover:bg-cream/10 group-hover:text-cream/80"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="hidden border-r border-ink md:flex md:flex-col md:justify-center md:px-5 md:py-8">
        <p className="label-mono text-[10px] text-ink/40 group-hover:text-cream/50">LINKS</p>
        <div className="mt-3 space-y-2">
          {project.githubUrl && (
            <span className="label-mono block text-[10px] text-ink/60 group-hover:text-cream/80">
              GitHub →
            </span>
          )}
          {project.demoUrl && (
            <span className="label-mono block text-[10px] text-accent group-hover:text-cream">
              Live demo →
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-6 md:py-8">
        <motion.span
          className="icon-3d-box flex h-12 w-12 items-center justify-center border-2 border-ink bg-cream group-hover:bg-accent group-hover:[&_svg]:text-cream"
          whileHover={{ rotate: 45 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ArrowUpRight className="h-6 w-6 text-ink" strokeWidth={2.5} />
        </motion.span>
      </div>
    </>
  );
}

export function ProjectsRows({
  projects,
  showHeader = true,
  limit,
  pageSize = PORTFOLIO_PREVIEW_LIMIT,
}: ProjectsRowsProps) {
  const [filter, setFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const paginate = !limit && !showHeader;

  const sorted = useMemo(
    () => [...projects].sort((a, b) => a.order - b.order),
    [projects]
  );
  const filtered = sorted.filter((item) => matchesFilter(item, filter));

  const totalPages = paginate
    ? Math.max(1, Math.ceil(filtered.length / pageSize))
    : 1;

  const safePage = Math.min(page, totalPages);

  const visible = useMemo(() => {
    if (limit) return filtered.slice(0, limit);
    if (paginate) {
      const start = (safePage - 1) * pageSize;
      return filtered.slice(start, start + pageSize);
    }
    return filtered;
  }, [filtered, limit, paginate, safePage, pageSize]);

  const hasMore = limit ? projects.length > limit : false;
  const startIndex = paginate ? (safePage - 1) * pageSize : 0;

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setPage(1);
  };

  const rowClassName =
    "group grid grid-cols-1 border-t-2 border-ink transition-colors duration-75 hover:bg-accent hover:text-cream md:grid-cols-[72px_minmax(0,1fr)_120px_64px]";

  return (
    <SectionReveal id="work" className="bg-cream">
      {showHeader && (
        <div className="border-b-2 border-ink bg-ink">
          <div className="site-container flex h-12 items-center justify-between">
            <span className="font-display text-xl text-cream">
              05 / SELECTED WORK
            </span>
            <span className="label-mono text-cream/70">
              ({String(projects.length).padStart(2, "0")} PROJECTS)
            </span>
          </div>
        </div>
      )}

      {!limit && (
        <div className="site-container flex flex-wrap items-center justify-center border-b border-ink">
          <Filter className="mx-4 hidden h-4 w-4 text-ink sm:block" strokeWidth={2.5} />
          {filters.map((f) => (
            <motion.button
              key={f}
              type="button"
              onClick={() => handleFilterChange(f)}
              className={`label-mono border-r border-ink px-6 py-3 last:border-r-0 ${
                filter === f
                  ? "bg-ink text-cream shadow-[4px_4px_0_0_#ff3b00]"
                  : "bg-cream text-ink"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              [ {f} ]
            </motion.button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="site-container border-t-2 border-ink py-16 text-center">
          <p className="font-display text-2xl text-ink">No projects to show yet.</p>
          <p className="mt-2 text-sm text-ink/60">
            GitHub sync is temporarily unavailable — check back soon or view{" "}
            <a
              href="https://github.com/SifatAli008"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              github.com/SifatAli008
            </a>
          </p>
        </div>
      ) : (
        <div>
          {visible.map((project, index) => {
            const href = getPortfolioHref(project);
            const external = isPortfolioExternal(project);

            if (external) {
              return (
                <a
                  key={project.id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={rowClassName}
                >
                  <ProjectRowContent project={project} index={startIndex + index} />
                </a>
              );
            }

            return (
              <Link key={project.id} href={href} className={rowClassName}>
                <ProjectRowContent project={project} index={startIndex + index} />
              </Link>
            );
          })}
        </div>
      )}

      {paginate && visible.length > 0 && (
        <div className="site-container flex flex-col items-center gap-4 border-t-2 border-ink py-8">
          <p className="label-mono text-xs text-ink/50">
            Page {safePage} of {totalPages} · {pageSize} per page · {filtered.length} projects
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="inline-flex items-center gap-2 border-2 border-ink bg-cream px-5 py-2.5 font-semibold uppercase tracking-wider text-ink transition-all hover:bg-ink hover:text-cream disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-cream disabled:hover:text-ink"
              style={{ boxShadow: safePage > 1 ? "4px 4px 0 0 #0a0a0a" : undefined }}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="label-mono min-w-[4rem] text-center text-sm text-ink">
              {String(safePage).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => {
                setPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={safePage >= totalPages}
              className="inline-flex items-center gap-2 border-2 border-ink bg-accent px-5 py-2.5 font-semibold uppercase tracking-wider text-cream transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ boxShadow: safePage < totalPages ? "4px 4px 0 0 #0a0a0a" : undefined }}
            >
              Next page
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {showHeader && hasMore && (
        <div className="site-container flex flex-col items-center gap-3 border-t-2 border-ink py-8">
          <p className="label-mono text-xs text-ink/50">
            Showing {visible.length} of {projects.length} projects
          </p>
          <BrutalButton
            href="/projects"
            variant="accent"
            icon={ArrowUpRight}
            className="!text-base"
          >
            VIEW ALL PROJECTS
          </BrutalButton>
        </div>
      )}
    </SectionReveal>
  );
}
