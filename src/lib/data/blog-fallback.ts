import { publishedArticles } from "@/lib/data/articles";
import { seedBlogPosts } from "@/lib/data/seed-data";
import type { BlogPost } from "@/types";

function withIds(
  items: Omit<BlogPost, "id">[],
  prefix: string
): BlogPost[] {
  return items.map((item, i) => ({
    ...item,
    id: `${prefix}-${i + 1}`,
  }));
}

/** Blog fallbacks only — keep heavy article bodies out of non-blog client graphs. */
export const fallbackBlogPosts: BlogPost[] = withIds(
  [...publishedArticles, ...seedBlogPosts],
  "blog"
);

export function getFallbackBlogPost(slug: string): BlogPost | undefined {
  return fallbackBlogPosts.find((p) => p.slug === slug);
}

export const publishedFallbackPosts = fallbackBlogPosts.filter(
  (p) => p.status === "published"
);
