import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/firebase/queries";
import { fallbackBlogPosts } from "@/lib/data/blog-fallback";
import { buildPageMetadata, itemListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { formatDate } from "@/lib/utils";
import { slimBlogPosts } from "@/lib/blog/slim-post";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Writing - Engineering Essays",
    description:
      "Engineering essays on AI, RAG, Firebase, PyQt5, and full-stack development by Sifat Ali.",
    path: "/blog",
  }),
  title: { absolute: "Writing by Sifat Ali | AI & Engineering Essays" },
};

export const revalidate = 3600;

export default async function BlogPage() {
  let posts = await getBlogPosts(true);
  if (posts.length === 0)
    posts = fallbackBlogPosts.filter((p) => p.status === "published");
  posts = slimBlogPosts(posts);

  const jsonLd = itemListJsonLd(
    "Sifat Ali - Writing",
    posts.map((p) => ({ name: p.title, url: `/blog/${p.slug}` }))
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="bg-[#f5f0e8] text-ink">
        <div className="border-b-[3px] border-ink">
          <div className="site-container py-10 md:py-14">
            <p className="label-mono text-accent">WRITING</p>
            <h1 className="font-display text-display leading-none text-ink">
              ALL ESSAYS
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65 md:text-base">
              Engineering notes from Sifat Ali on AI, retrieval-augmented
              generation (RAG), Firebase, desktop tools, and shipping full-stack
              products. Read for practical architecture decisions - not fluff.
            </p>
          </div>
        </div>

        <div className="site-container section-pad">
          {posts.length === 0 ? (
            <p className="py-12 text-ink/60">
              New essays are in progress. Meanwhile, explore{" "}
              <Link href="/projects" className="text-accent underline">
                selected work
              </Link>{" "}
              or ask about Sifat&apos;s stack on the homepage chat.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex h-full min-h-[340px] flex-col border-[3px] border-ink bg-white p-7 shadow-[4px_4px_0_0_#0A0A0A] transition-[transform,box-shadow,background-color] duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#fff8ef] hover:shadow-[7px_7px_0_0_#FF3B00]"
                >
                  <span className="tag-brutal w-fit">{post.status}</span>
                  <h2 className="mt-5 line-clamp-3 font-sans text-xl font-bold leading-snug text-ink group-hover:text-accent md:text-2xl">
                    {post.title}
                  </h2>
                  <p className="mt-4 line-clamp-5 flex-1 text-base leading-relaxed text-ink/60">
                    {post.excerpt}
                  </p>
                  <p className="label-mono mt-6 border-t-2 border-ink/15 pt-4 text-ink/45">
                    {post.readingTime} MIN ·{" "}
                    {formatDate(post.createdAt).toUpperCase()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
