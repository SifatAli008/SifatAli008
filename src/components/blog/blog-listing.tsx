"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/components/i18n/locale-provider";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

const PAGE_SIZE = 6;

export type BlogCardPost = Pick<
  BlogPost,
  | "id"
  | "slug"
  | "title"
  | "excerpt"
  | "tags"
  | "status"
  | "readingTime"
  | "createdAt"
  | "publishedAt"
>;

type BlogListingProps = {
  posts: BlogCardPost[];
};

function uniqueTopics(posts: BlogCardPost[]): string[] {
  const set = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      const t = tag.trim();
      if (t) set.add(t);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function BlogListing({ posts }: BlogListingProps) {
  const { t } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const topics = useMemo(() => uniqueTopics(posts), [posts]);

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [topic, setTopic] = useState(searchParams.get("topic") ?? "all");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
    setTopic(searchParams.get("topic") ?? "all");
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTopic =
        topic === "all" ||
        (post.tags ?? []).some((t) => t.toLowerCase() === topic.toLowerCase());
      if (!matchesTopic) return false;
      if (!q) return true;
      const hay =
        `${post.title} ${post.excerpt} ${(post.tags ?? []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [posts, query, topic]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagePosts = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  function pushParams(next: { q?: string; topic?: string; page?: number }) {
    const params = new URLSearchParams(searchParams.toString());
    const q = next.q ?? query;
    const topicValue = next.topic ?? topic;
    const p = next.page ?? 1;

    if (q.trim()) params.set("q", q.trim());
    else params.delete("q");

    if (topicValue && topicValue !== "all") params.set("topic", topicValue);
    else params.delete("topic");

    if (p > 1) params.set("page", String(p));
    else params.delete("page");

    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  return (
    <div>
      <div className="mb-8 border-[3px] border-ink bg-white p-4 shadow-[4px_4px_0_0_#0A0A0A] md:p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_13.5rem] md:items-end md:gap-5">
          <label className="flex min-w-0 flex-col gap-1.5">
            <span className="label-mono text-[10px] text-ink/50">
              {t("blog.search")}
            </span>
            <span className="relative block">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  const value = e.target.value;
                  setQuery(value);
                  pushParams({ q: value, page: 1 });
                }}
                placeholder={t("blog.searchPlaceholder")}
                className="h-12 w-full border-[3px] border-ink bg-[#f5f0e8] py-0 pl-10 pr-10 font-sans text-sm text-ink outline-none placeholder:text-ink/40 focus:bg-white"
              />
              {query ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 border-2 border-ink bg-white p-1 hover:bg-accent hover:text-cream"
                  onClick={() => {
                    setQuery("");
                    pushParams({ q: "", page: 1 });
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </span>
          </label>

          <label className="flex w-full flex-col gap-1.5">
            <span className="label-mono text-[10px] text-ink/50">
              {t("blog.topic")}
            </span>
            <select
              value={topic}
              onChange={(e) => {
                const value = e.target.value;
                setTopic(value);
                pushParams({ topic: value, page: 1 });
              }}
              className="h-12 w-full border-[3px] border-ink bg-[#f5f0e8] px-3 font-mono text-xs uppercase tracking-wider text-ink outline-none focus:bg-white"
            >
              <option value="all">{t("blog.allTopics")}</option>
              {topics.map((topicName) => (
                <option key={topicName} value={topicName}>
                  {topicName}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/50">
          {filtered.length}{" "}
          {filtered.length === 1 ? t("blog.essay") : t("blog.essays")}
          {topic !== "all" ? ` · ${topic}` : ""}
          {query.trim() ? ` · “${query.trim()}”` : ""}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/50">
          {t("blog.page")} {safePage} / {totalPages}
        </p>
      </div>

      {pagePosts.length === 0 ? (
        <div className="border-[3px] border-ink bg-white p-10 text-center shadow-[4px_4px_0_0_#0A0A0A]">
          <p className="font-sans text-lg font-bold text-ink">
            {t("blog.noMatch")}
          </p>
          <p className="mt-2 text-sm text-ink/60">{t("blog.noMatchHint")}</p>
          <button
            type="button"
            className="mt-6 border-[3px] border-ink bg-accent px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-cream shadow-[3px_3px_0_0_#0A0A0A]"
            onClick={() => {
              setQuery("");
              setTopic("all");
              pushParams({ q: "", topic: "all", page: 1 });
            }}
          >
            {t("blog.reset")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pagePosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex h-full min-h-[340px] flex-col border-[3px] border-ink bg-white p-7 shadow-[4px_4px_0_0_#0A0A0A] transition-[transform,box-shadow,background-color] duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#fff8ef] hover:shadow-[7px_7px_0_0_#FF3B00]"
            >
              <div className="flex flex-wrap gap-2">
                {(post.tags ?? []).slice(0, 2).map((tag) => (
                  <span key={tag} className="tag-brutal w-fit">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="mt-5 line-clamp-3 font-sans text-xl font-bold leading-snug text-ink group-hover:text-accent md:text-2xl">
                {post.title}
              </h2>
              <p className="mt-4 line-clamp-5 flex-1 text-base leading-relaxed text-ink/60">
                {post.excerpt}
              </p>
              <p className="label-mono mt-6 border-t-2 border-ink/15 pt-4 text-ink/45">
                {post.readingTime} {t("blog.min").toUpperCase()} ·{" "}
                {formatDate(post.publishedAt ?? post.createdAt).toUpperCase()}
              </p>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <nav
          aria-label="Essay pages"
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => pushParams({ page: safePage - 1 })}
            className="border-[3px] border-ink bg-white px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-ink shadow-[3px_3px_0_0_#0A0A0A] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("blog.prev")}
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              aria-current={n === safePage ? "page" : undefined}
              onClick={() => pushParams({ page: n })}
              className={
                n === safePage
                  ? "border-[3px] border-ink bg-accent px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-cream shadow-[3px_3px_0_0_#0A0A0A]"
                  : "border-[3px] border-ink bg-white px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-ink shadow-[3px_3px_0_0_#0A0A0A] hover:bg-[#fff8ef]"
              }
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => pushParams({ page: safePage + 1 })}
            className="border-[3px] border-ink bg-white px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-ink shadow-[3px_3px_0_0_#0A0A0A] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("blog.next")}
          </button>
        </nav>
      ) : null}
    </div>
  );
}
