import type { BlogPost } from "@/types";

/** Drop markdown bodies before sending posts into client components / list pages. */
export function slimBlogPosts(posts: BlogPost[]): BlogPost[] {
  return posts.map((post) => ({
    ...post,
    content: "",
  }));
}
