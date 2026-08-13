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
    .slice(0, 3);
  const faqs = articleFaqsBySlug[post.slug];
  const toc = extractToc(post.content).filter((item) => item.level === 2);
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
              {formatDate(post.createdAt).toUpperCase()}
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-display leading-none text-cream">
              {post.title.toUpperCase()}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-cream/70">{post.excerpt}</p>
            {post.tags?.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
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

            <div className="min-w-0">
              <details className="mb-8 border-[3px] border-ink bg-white p-4 lg:hidden">
                <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                  Table of contents
                </summary>
                <div className="mt-4">
                  <ArticleToc items={toc} />
                </div>
              </details>

              <MarkdownContent content={post.content} />

              {faqs?.length ? <ArticleFaqSection faqs={faqs} /> : null}

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
                    Sifat Ali. ({new Date(post.publishedAt ?? post.createdAt).getFullYear()}).{" "}
                    <span className="font-medium text-ink">{post.title}</span>.
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
      </article>
    </>
  );
}
