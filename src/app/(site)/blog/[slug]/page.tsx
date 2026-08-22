import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/firebase/queries";
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
} from "@/lib/blog/article-languages";

export const revalidate = 3600;

export async function generateStaticParams() {
  let posts = await getBlogPosts(true);
  if (posts.length === 0) {
    posts = blogFallbackMeta.filter((p) => p.status === "published");
  }
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };
  const en = articleLangMeta("en");
  return buildPageMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: articlePath(post.slug, "en"),
    ogType: "article",
    publishedTime: post.publishedAt ?? post.createdAt,
    modifiedTime: post.updatedAt,
    tags: post.tags,
    locale: en.ogLocale,
    alternateLocales: ARTICLE_LANGUAGES.filter((l) => l.code !== "en").map(
      (l) => l.ogLocale
    ),
    languages: articleHrefLangMap(post.slug),
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const related = blogFallbackMeta
    .filter((p) => p.status === "published" && p.slug !== post.slug)
    .slice(0, 3)
    .map((p) => ({ id: p.id, slug: p.slug, title: p.title }));
  const faqs = articleFaqsBySlug[post.slug] ?? [];
  const toc = extractToc(post.content).filter((item) => item.level === 2);
  const path = articlePath(post.slug, "en");
  const english = {
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    faqs,
  };
  const jsonLd = [
    blogPostingJsonLd({
      ...post,
      inLanguage: articleLangMeta("en").schemaLanguage,
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Writing", path: "/blog" },
      { name: post.title, path },
    ]),
    ...(faqs.length ? [faqPageJsonLd(faqs, path)] : []),
  ];

  return (
    <>
      <ReadingProgress />
      <JsonLd data={jsonLd} />
      <article className="bg-[#f5f0e8]" lang="en">
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
          lang="en"
          english={english}
          initial={english}
        />
      </article>
    </>
  );
}
