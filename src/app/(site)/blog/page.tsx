import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/firebase/queries";
import { fallbackBlogPosts } from "@/lib/data/fallback";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Writing",
  description: "Engineering essays on AI, Firebase, PyQt5, and full-stack development.",
};

export const revalidate = 3600;

export default async function BlogPage() {
  let posts = await getBlogPosts(false);
  if (posts.length === 0) posts = fallbackBlogPosts;

  return (
    <div className="bg-ink text-cream">
      <div className="border-b-[3px] border-cream/20">
        <div className="site-container py-4">
          <p className="label-mono text-accent">WRITING</p>
          <h1 className="font-display text-display leading-none">ALL ESSAYS</h1>
        </div>
      </div>
      <div className="site-container section-pad divide-y-2 divide-cream/20">
        {posts.map((post) => (
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
        ))}
      </div>
    </div>
  );
}
