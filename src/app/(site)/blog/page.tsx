import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/firebase/queries";
import { blogFallbackMeta } from "@/lib/data/blog-meta";
import { buildPageMetadata, itemListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { BlogIndexClient } from "@/components/blog/blog-index-client";
import type { BlogCardPost } from "@/components/blog/blog-listing";

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
      <BlogIndexClient cards={cards} />
    </>
  );
}
