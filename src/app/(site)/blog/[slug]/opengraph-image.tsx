import { notFound } from "next/navigation";
import { blogFallbackMeta } from "@/lib/data/blog-meta";
import { createBrutalistOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-template";

export const runtime = "edge";
export const alt = "Sifat Ali - Writing";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * Uses lightweight blog-meta only — importing Firebase queries
 * exceeds Vercel’s 1 MB Edge Function limit.
 */
export default function BlogOgImage({
  params,
}: {
  params: { slug: string };
}) {
  const post = blogFallbackMeta.find(
    (p) => p.slug === params.slug && p.status === "published"
  );
  if (!post) notFound();

  return createBrutalistOgImage({
    eyebrow: "Writing",
    title: post.seoTitle ?? post.title,
    subtitle: post.seoDescription ?? post.excerpt,
    badge: post.tags[0]?.toUpperCase(),
  });
}
