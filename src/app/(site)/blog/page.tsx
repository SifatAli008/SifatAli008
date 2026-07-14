import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/firebase/queries";
import { fallbackBlogPosts } from "@/lib/data/fallback";
import { buildPageMetadata, itemListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { formatDate } from "@/lib/utils";

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
  if (posts.length === 0) posts = fallbackBlogPosts.filter((p) => p.status === "published");

  const jsonLd = itemListJsonLd(
    "Sifat Ali - Writing",
    posts.map((p) => ({ name: p.title, url: `/blog/${p.slug}` }))
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="bg-ink text-cream">
      <div className="border-b-[3px] border-cream/20">
        <div className="site-container py-4">
          <p className="label-mono text-accent">WRITING</p>
          <h1 className="font-display text-display leading-none">ALL ESSAYS</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream/65 md:text-base">
            Engineering notes from Sifat Ali on AI, retrieval-augmented generation (RAG),
            Firebase, desktop tools, and shipping full-stack products. Read for practical
            architecture decisions - not fluff.
          </p>
        </div>
      </div>
      <div className="site-container section-pad divide-y-2 divide-cream/20">
        {posts.length === 0 ? (
          <p className="py-12 text-cream/60">
            New essays are in progress. Meanwhile, explore{" "}
            <Link href="/projects" className="text-accent underline">
              selected work
            </Link>{" "}
            or ask about Sifat&apos;s stack on the homepage chat.
          </p>
        ) : (
          posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex flex-col gap-4 py-8 transition-colors duration-75 hover:bg-accent hover:px-6 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <span className="tag-brutal-light">{post.status}</span>
              <h2 className="mt-4 font-sans text-2xl font-bold group-hover:text-cream">
                {post.title}
              </h2>
              <p className="mt-2 max-w-2xl text-cream/60">{post.excerpt}</p>
            </div>
            <p className="label-mono shrink-0 text-cream/40">
              {post.readingTime} MIN · {formatDate(post.createdAt).toUpperCase()}
            </p>
          </Link>
          ))
        )}
      </div>
    </div>
    </>
  );
}
