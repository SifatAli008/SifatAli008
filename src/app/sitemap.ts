import type { MetadataRoute } from "next";
import { getBlogPosts, getPortfolioWork } from "@/lib/firebase/queries";
import { fallbackBlogPosts } from "@/lib/data/fallback";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/archive`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const portfolio = await getPortfolioWork();
  const projectRoutes: MetadataRoute.Sitemap = portfolio.map((item) => ({
    url: `${base}/projects/${item.slug}`,
    lastModified: new Date(item.updatedAt),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  let posts = await getBlogPosts(true);
  if (posts.length === 0) {
    posts = fallbackBlogPosts.filter((p) => p.status === "published");
  }
  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
