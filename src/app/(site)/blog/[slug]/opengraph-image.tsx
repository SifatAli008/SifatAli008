import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/firebase/queries";
import { createBrutalistOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-template";

export const runtime = "edge";
export const alt = "Sifat Ali - Writing";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function BlogOgImage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  return createBrutalistOgImage({
    eyebrow: "Writing",
    title: post.seoTitle ?? post.title,
    subtitle: post.excerpt,
    badge: post.tags[0]?.toUpperCase(),
  });
}
