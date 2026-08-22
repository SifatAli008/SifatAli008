import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/firebase/queries";
import {
  blogPostingJsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
  faqPageJsonLd,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { ArticleLanguageReader } from "@/components/blog/article-language-reader";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { blogFallbackMeta } from "@/lib/data/blog-meta";
import { articleFaqsBySlug } from "@/lib/data/article-faqs";
import { extractToc } from "@/lib/blog/extract-toc";
import {
  ARTICLE_LANGUAGES,
  articleHrefLangMap,
  articleLangMeta,
  articlePath,
  isTranslatableArticleLang,
  type ArticleLangCode,
} from "@/lib/blog/article-languages";
import { getCachedArticleTranslation } from "@/lib/blog/translate-article";

export const revalidate = 604800;
export const dynamicParams = true;

/** Language pages are ISR on first visit — avoids build-time Gemini for every post×lang. */
export function generateStaticParams() {
  return [] as { slug: string; lang: string }[];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; lang: string };
}): Promise<Metadata> {
  if (!isTranslatableArticleLang(params.lang)) {
    return { title: "Not Found" };
  }
  const lang = params.lang;
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };

  const faqs = articleFaqsBySlug[post.slug] ?? [];
  const meta = articleLangMeta(lang);
  const languages = articleHrefLangMap(post.slug);
  const alternateLocales = ARTICLE_LANGUAGES.filter((l) => l.code !== lang).map(
    (l) => l.ogLocale
  );

  try {
    const translated = await getCachedArticleTranslation({
      slug: post.slug,
      lang,
      title: post.seoTitle ?? post.title,
      excerpt: post.seoDescription ?? post.excerpt,
      content: post.content,
      faqs,
      revision: post.updatedAt ?? post.createdAt,
    });

    return buildPageMetadata({
      title: translated.title,
      description: translated.excerpt,
      path: articlePath(post.slug, lang),
      ogType: "article",
      publishedTime: post.publishedAt ?? post.createdAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      locale: meta.ogLocale,
      alternateLocales,
      languages,
    });
  } catch {
    return buildPageMetadata({
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt,
      path: articlePath(post.slug, "en"),
      ogType: "article",
      noIndex: true,
      publishedTime: post.publishedAt ?? post.createdAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      languages,
    });
  }
}

export default async function BlogPostLangPage({
  params,
}: {
  params: { slug: string; lang: string };
}) {
  if (!isTranslatableArticleLang(params.lang)) notFound();
  const lang = params.lang as Exclude<ArticleLangCode, "en">;

  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const faqs = articleFaqsBySlug[post.slug] ?? [];
  const english = {
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    faqs,
  };

  let translated;
  try {
    translated = await getCachedArticleTranslation({
      slug: post.slug,
      lang,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      faqs,
      revision: post.updatedAt ?? post.createdAt,
    });
  } catch {
    redirect(articlePath(post.slug, "en"));
  }

  const related = blogFallbackMeta
    .filter((p) => p.status === "published" && p.slug !== post.slug)
    .slice(0, 3)
    .map((p) => ({ id: p.id, slug: p.slug, title: p.title }));
  const toc = extractToc(translated.content).filter((item) => item.level === 2);
  const langMeta = articleLangMeta(lang);
  const path = articlePath(post.slug, lang);

  const jsonLd = [
    blogPostingJsonLd({
      ...post,
      title: translated.title,
      excerpt: translated.excerpt,
      seoTitle: translated.title,
      seoDescription: translated.excerpt,
      lang,
      inLanguage: langMeta.schemaLanguage,
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Writing", path: "/blog" },
      { name: translated.title, path },
    ]),
    ...(translated.faqs.length
      ? [faqPageJsonLd(translated.faqs, path)]
      : []),
  ];

  return (
    <>
      <ReadingProgress />
      <JsonLd data={jsonLd} />
      <article className="bg-[#f5f0e8]" lang={lang} dir={langMeta.rtl ? "rtl" : "ltr"}>
        <ArticleLanguageReader
          slug={post.slug}
          readingTime={post.readingTime}
          createdAt={post.createdAt}
          publishedYear={new Date(
            post.publishedAt ?? post.createdAt
          ).getFullYear()}
          tags={post.tags ?? []}
          toc={toc}
          related={related}
          lang={lang}
          english={english}
          initial={translated}
        />
      </article>
    </>
  );
}
