import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getBlogPosts } from "@/lib/firebase/queries";
import { blogFallbackMeta } from "@/lib/data/blog-meta";
import { buildPageMetadata, itemListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import {
  BlogListing,
  type BlogCardPost,
} from "@/components/blog/blog-listing";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Writing - AI, NLP & Engineering Essays",
    description:
      "Long-form engineering essays on AI agents, NLP, RAG, ClinicalBERT, Firebase, PyQt5, and full-stack development by Sifat Ali.",
    path: "/blog",
  }),
  title: { absolute: "Writing by Sifat Ali | AI, NLP & Engineering Essays" },
};

export const revalidate = 3600;

function toCardPost(post: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  status: BlogCardPost["status"];
  readingTime: number;
  createdAt: string;
  publishedAt?: string;
}): BlogCardPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    tags: post.tags,
    status: post.status,
    readingTime: post.readingTime,
    createdAt: post.createdAt,
    publishedAt: post.publishedAt,
  };
}

export default async function BlogPage() {
  let posts = await getBlogPosts(true);
  if (posts.length === 0) {
    posts = blogFallbackMeta.filter((p) => p.status === "published");
  }

  const cards = posts.map(toCardPost);

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
          {cards.length === 0 ? (
            <p className="py-12 text-ink/60">
              New essays are in progress. Meanwhile, explore{" "}
              <Link href="/projects" className="text-accent underline">
                selected work
              </Link>{" "}
              or ask about Sifat&apos;s stack on the homepage chat.
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
    </>
  );
}
