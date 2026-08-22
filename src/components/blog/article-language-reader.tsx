"use client";

import Link from "next/link";
import { useEffect } from "react";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { ArticleFaqSection } from "@/components/blog/article-faq-section";
import { ArticleToc } from "@/components/blog/article-toc";
import {
  ARTICLE_LANGUAGES,
  articleLangMeta,
  articlePath,
  shouldUppercaseTitle,
  type ArticleLangCode,
} from "@/lib/blog/article-languages";
import { ensureArticleScriptFont } from "@/lib/blog/ensure-article-script-font";
import type { TocItem } from "@/lib/blog/extract-toc";
import { cn, formatDate } from "@/lib/utils";

type Faq = { question: string; answer: string };

type ArticleBundle = {
  title: string;
  excerpt: string;
  content: string;
  faqs: Faq[];
};

type RelatedPost = {
  id: string;
  slug: string;
  title: string;
};

type ArticleLanguageReaderProps = {
  slug: string;
  readingTime: number;
  createdAt: string;
  publishedYear: number;
  tags: string[];
  toc: TocItem[];
  related: RelatedPost[];
  lang: ArticleLangCode;
  english: ArticleBundle;
  /** SSR bundle for the active language (English or translated). */
  initial: ArticleBundle;
};

export function ArticleLanguageReader({
  slug,
  readingTime,
  createdAt,
  publishedYear,
  tags,
  toc,
  related,
  lang,
  english,
  initial,
}: ArticleLanguageReaderProps) {
  const meta = articleLangMeta(lang);
  const isBangla = lang === "bn";
  const titleText = shouldUppercaseTitle(lang)
    ? initial.title.toUpperCase()
    : initial.title;

  useEffect(() => {
    ensureArticleScriptFont(lang);
    const prev = document.documentElement.lang;
    document.documentElement.lang = meta.hreflang;
    return () => {
      document.documentElement.lang = prev || "en";
    };
  }, [lang, meta.hreflang]);

  return (
    <>
      <header className="border-b-[3px] border-ink bg-ink">
        <div className="site-container py-12 md:py-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="label-mono text-accent">
              {readingTime} MIN READ · {formatDate(createdAt).toUpperCase()}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="label-mono text-[10px] text-cream/50">
                Language
              </span>
              <nav
                aria-label="Article language"
                className="flex flex-wrap gap-1.5"
              >
                {ARTICLE_LANGUAGES.map((item) => {
                  const active = item.code === lang;
                  const href = articlePath(slug, item.code);
                  return (
                    <Link
                      key={item.code}
                      href={href}
                      hrefLang={item.hreflang}
                      aria-current={active ? "page" : undefined}
                      onMouseEnter={() => {
                        if (item.code === "bn") ensureArticleScriptFont("bn");
                      }}
                      onFocus={() => {
                        if (item.code === "bn") ensureArticleScriptFont("bn");
                      }}
                      className={cn(
                        "border-2 px-2.5 py-1 text-[10px] tracking-wider",
                        item.code === "bn"
                          ? "font-bangla text-[12px] normal-case tracking-normal"
                          : "font-mono uppercase",
                        active
                          ? "border-accent bg-accent text-cream"
                          : "border-cream/30 bg-transparent text-cream/70 hover:border-cream hover:text-cream"
                      )}
                    >
                      {item.native}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          <h1
            lang={lang}
            dir={meta.rtl ? "rtl" : "ltr"}
            className={
              isBangla
                ? "article-script-bn article-title-bn mt-5 max-w-4xl text-cream"
                : "mt-5 max-w-4xl font-display text-display leading-none text-cream"
            }
          >
            {titleText}
          </h1>
          <p
            lang={lang}
            dir={meta.rtl ? "rtl" : "ltr"}
            className={cn(
              "mt-6 max-w-2xl text-cream/70",
              isBangla
                ? "article-script-bn article-lede-bn"
                : "text-lg leading-relaxed"
            )}
          >
            {initial.excerpt}
          </p>
          {tags.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="tag-brutal-light">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <div className="site-container section-pad">
        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_200px]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 border-[3px] border-ink bg-white p-5 shadow-[4px_4px_0_0_#0A0A0A]">
              <ArticleToc items={toc} />
            </div>
          </aside>

          <div
            lang={lang}
            dir={meta.rtl ? "rtl" : "ltr"}
            className={cn(
              "min-w-0 max-w-3xl justify-self-stretch lg:max-w-none",
              isBangla && "article-script-bn"
            )}
          >
            <details className="mb-8 border-[3px] border-ink bg-white p-4 lg:hidden">
              <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                Table of contents
              </summary>
              <div className="mt-4">
                <ArticleToc items={toc} />
              </div>
            </details>

            <MarkdownContent content={initial.content} />
            {initial.faqs.length ? (
              <ArticleFaqSection faqs={initial.faqs} />
            ) : null}

            {related.length > 0 && (
              <aside className="mt-20 border-t-2 border-ink pt-12">
                <p className="label-mono text-accent">RELATED</p>
                <ul className="mt-6 divide-y-2 divide-ink">
                  {related.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/blog/${p.slug}`}
                        className="block py-4 font-sans text-lg font-bold hover:text-accent"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </aside>
            )}
          </div>

          <aside className="hidden xl:block">
            <div className="sticky top-28 space-y-4">
              <div className="border-[3px] border-ink bg-white p-4 shadow-[4px_4px_0_0_#0A0A0A]">
                <p className="label-mono text-accent">Cite this</p>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  Sifat Ali. ({publishedYear}).{" "}
                  <span className="font-medium text-ink">{english.title}</span>.
                </p>
              </div>
              <div className="border-[3px] border-ink bg-white p-4 shadow-[4px_4px_0_0_#0A0A0A]">
                <p className="label-mono text-accent">Jump</p>
                <a
                  href="#references"
                  className="mt-3 block text-sm font-medium text-ink underline decoration-accent/40 hover:text-accent"
                >
                  References
                </a>
                <a
                  href="#faq"
                  className="mt-2 block text-sm font-medium text-ink underline decoration-accent/40 hover:text-accent"
                >
                  FAQ
                </a>
                <a
                  href="#key-takeaways"
                  className="mt-2 block text-sm font-medium text-ink underline decoration-accent/40 hover:text-accent"
                >
                  Key takeaways
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
