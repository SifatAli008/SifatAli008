import type { BlogPost } from "@/types";

/** Fields stored on `blog_posts` (no markdown body). */
export type BlogPostMeta = Omit<BlogPost, "content"> & { content?: string };

export function stripBlogContent<T extends { content?: string }>(
  post: T
): T & { content: string } {
  return { ...post, content: "" };
}

export function blogMetaPayload(
  post: Omit<BlogPost, "id"> | BlogPost
): Omit<BlogPost, "id" | "content"> & { content: string } {
  const { content: _content, id: _id, ...rest } = post as BlogPost & {
    id?: string;
  };
  return { ...rest, content: "" };
}
