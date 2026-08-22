import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/firebase/queries";
import {
  blogPostingJsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
  faqPageJsonLd,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { ArticleFaqSection } from "@/components/blog/article-faq-section";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { ArticleToc } from "@/components/blog/article-toc";
import { ReadingProgress } from "@/components/blog/reading-progress";
import {
  ArticleLangNote,
  ArticleRelatedBlock,
  ArticleSidebarLabels,
  ArticleTocSummary,
} from "@/components/blog/article-reading-chrome";
import { formatDate } from "@/lib/utils";
import { blogFallbackMeta } from "@/lib/data/blog-meta";
import { articleFaqsBySlug } from "@/lib/data/article-faqs";
import { extractToc } from "@/lib/blog/extract-toc";

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
  return buildPageMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: `/blog/${post.slug}`,
    ogType: "article",
    publishedTime: post.publishedAt ?? post.createdAt,
    modifiedTime: post.updatedAt,
    tags: post.tags,
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
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      tags: p.tags,
      status: p.status,
      readingTime: p.readingTime,
      createdAt: p.createdAt,
      publishedAt: p.publishedAt,
    }));
  const faqs = articleFaqsBySlug[post.slug];
  const toc = extractToc(post.content).filter((item) => item.level === 2);
  const year = new Date(post.publishedAt ?? post.createdAt).getFullYear();
  const jsonLd = [
    blogPostingJsonLd(post),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Writing", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
    ...(faqs?.length ? [faqPageJsonLd(faqs, `/blog/${post.slug}`)] : []),
  ];

  return (
    <>
      <ReadingProgress />
      <JsonLd data={jsonLd} />
      <article className="bg-[#f5f0e8]">
        <header className="border-b-[3px] border-ink bg-ink">
          <div className="site-container py-12 md:py-16">
            <p className="label-mono text-accent">
              {post.readingTime} MIN READ ·{" "}
              {formatDate(post.publishedAt ?? post.createdAt).toUpperCase()}
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95] tracking-tight text-cream">
              {post.title.toUpperCase()}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/70">
              {post.excerpt}
            </p>
            {post.tags?.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag-brutal-light">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
            <p className="mt-8">
              <Link
                href="/blog"
                className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
              >
                ← Writing
              </Link>
            </p>
          </div>
        </header>

        <div className="site-container section-pad">
          <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,42rem)] lg:justify-between xl:grid-cols-[220px_minmax(0,42rem)_200px]">
            <aside className="hidden lg:block">
              <div className="sticky top-28 border-[3px] border-ink bg-white p-5 shadow-[4px_4px_0_0_#0A0A0A]">
                <ArticleToc items={toc} />
              </div>
            </aside>

            <div className="min-w-0 max-w-[42rem] justify-self-center lg:justify-self-start">
              <details className="mb-8 border-[3px] border-ink bg-white p-4 lg:hidden">
                <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                  <ArticleTocSummary />
                </summary>
                <div className="mt-4">
                  <ArticleToc items={toc} />
                </div>
              </details>

              <ArticleLangNote />
              <MarkdownContent content={post.content} />
              {faqs?.length ? <ArticleFaqSection faqs={faqs} /> : null}
              <ArticleRelatedBlock related={related} />
            </div>

            <aside className="hidden xl:block">
              <ArticleSidebarLabels
                title={post.title}
                year={year}
                showFaq={Boolean(faqs?.length)}
              />
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
