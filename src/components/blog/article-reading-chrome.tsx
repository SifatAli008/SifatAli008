"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/locale-provider";
import type { BlogCardPost } from "@/components/blog/blog-listing";

export function ArticleLangNote() {
  const { t } = useLocale();
  return (
    <p className="mb-8 border-2 border-ink/15 bg-white px-4 py-3 text-sm leading-relaxed text-ink/65">
      {t("article.langNote")}
    </p>
  );
}

export function ArticleTocSummary() {
  const { t } = useLocale();
  return <>{t("article.toc")}</>;
}

export function ArticleRelatedBlock({
  related,
}: {
  related: BlogCardPost[];
}) {
  const { t } = useLocale();
  if (!related.length) return null;
  return (
    <aside className="mt-20 border-t-2 border-ink pt-12">
      <p className="label-mono text-accent">{t("article.related")}</p>
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
  );
}

export function ArticleSidebarLabels({
  title,
  year,
  showFaq,
}: {
  title: string;
  year: number;
  showFaq: boolean;
}) {
  const { t } = useLocale();

  return (
    <div className="sticky top-28 space-y-4">
      <div className="border-[3px] border-ink bg-white p-4 shadow-[4px_4px_0_0_#0A0A0A]">
        <p className="label-mono text-accent">{t("article.cite")}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          Sifat Ali. ({year}).{" "}
          <span className="font-medium text-ink">{title}</span>.
        </p>
      </div>
      <div className="border-[3px] border-ink bg-white p-4 shadow-[4px_4px_0_0_#0A0A0A]">
        <p className="label-mono text-accent">{t("article.jump")}</p>
        <a
          href="#references"
          className="mt-3 block text-sm font-medium text-ink underline decoration-accent/40 hover:text-accent"
        >
          {t("article.references")}
        </a>
        {showFaq ? (
          <a
            href="#faq"
            className="mt-2 block text-sm font-medium text-ink underline decoration-accent/40 hover:text-accent"
          >
            {t("article.faq")}
          </a>
        ) : null}
        <a
          href="#key-takeaways"
          className="mt-2 block text-sm font-medium text-ink underline decoration-accent/40 hover:text-accent"
        >
          {t("article.keyTakeaways")}
        </a>
      </div>
      <p className="text-xs leading-relaxed text-ink/50">{t("article.langNote")}</p>
    </div>
  );
}
