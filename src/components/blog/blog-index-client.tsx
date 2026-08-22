"use client";

import { Suspense } from "react";
import Link from "next/link";
import { BlogListing, type BlogCardPost } from "@/components/blog/blog-listing";
import { useLocale } from "@/components/i18n/locale-provider";

type BlogIndexClientProps = {
  cards: BlogCardPost[];
};

function BlogIndexHeader() {
  const { t } = useLocale();
  return (
    <div className="border-b-[3px] border-ink">
      <div className="site-container py-10 md:py-14">
        <p className="label-mono text-accent">{t("blog.writing")}</p>
        <h1 className="font-display text-display leading-none text-ink">
          {t("blog.allEssays")}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65 md:text-base">
          {t("blog.intro")}
        </p>
      </div>
    </div>
  );
}

export function BlogIndexClient({ cards }: BlogIndexClientProps) {
  const { t } = useLocale();

  return (
    <div className="bg-[#f5f0e8] text-ink">
      <BlogIndexHeader />
      <div className="site-container section-pad">
        {cards.length === 0 ? (
          <p className="py-12 text-ink/60">
            New essays are in progress. Meanwhile, explore{" "}
            <Link href="/projects" className="text-accent underline">
              {t("nav.projects")}
            </Link>
            .
          </p>
        ) : (
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="min-h-[340px] animate-pulse border-[3px] border-ink/20 bg-white"
                  />
                ))}
              </div>
            }
          >
            <BlogListing posts={cards} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
