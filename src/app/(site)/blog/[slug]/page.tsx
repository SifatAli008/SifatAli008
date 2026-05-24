import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/firebase/queries";
import { blogPostingJsonLd, breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { formatDate } from "@/lib/utils";
import { fallbackBlogPosts } from "@/lib/data/fallback";

export const revalidate = 3600;

export async function generateStaticParams() {
  let posts = await getBlogPosts(false);
  if (posts.length === 0) posts = fallbackBlogPosts;
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

  let posts = await getBlogPosts(false);
  if (posts.length === 0) posts = fallbackBlogPosts;
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const jsonLd = [
    blogPostingJsonLd(post),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Writing", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
  ];

  return (
    <>
      <ReadingProgress />
      <JsonLd data={jsonLd} />
      <article className="bg-cream">
        <header className="border-b-[3px] border-ink bg-ink">
          <div className="site-container py-12 md:py-16">
            <p className="label-mono text-accent">
              {post.readingTime} MIN READ · {formatDate(post.createdAt).toUpperCase()}
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-display leading-none text-cream">
              {post.title.toUpperCase()}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-cream/70">{post.excerpt}</p>
          </div>
        </header>
        <div className="site-container section-pad max-w-3xl">
          <div className="prose-brutal text-[17px] leading-[1.85]">
            <MarkdownContent content={post.content} />
          </div>
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
      </article>
    </>
  );
}
