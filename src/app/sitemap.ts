import type { MetadataRoute } from "next";
import { getBlogPosts, getPortfolioWork } from "@/lib/firebase/queries";
import { blogFallbackMeta } from "@/lib/data/blog-meta";
import { getSiteUrl } from "@/lib/seo";
import {
  ARTICLE_LANGUAGES,
  articlePath,
} from "@/lib/blog/article-languages";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/archive`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/security`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
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
    posts = blogFallbackMeta.filter((p) => p.status === "published");
  }

  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => {
    const languages: Record<string, string> = {};
    for (const lang of ARTICLE_LANGUAGES) {
      languages[lang.hreflang] = `${base}${articlePath(p.slug, lang.code)}`;
    }
    languages["x-default"] = `${base}${articlePath(p.slug, "en")}`;

    return {
      url: `${base}${articlePath(p.slug, "en")}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "monthly",
      priority: 0.65,
      alternates: { languages },
    };
  });

  /** Explicit language URLs so crawlers discover every locale page */
  const blogLangRoutes: MetadataRoute.Sitemap = posts.flatMap((p) =>
    ARTICLE_LANGUAGES.filter((l) => l.code !== "en").map((lang) => {
      const languages: Record<string, string> = {};
      for (const l of ARTICLE_LANGUAGES) {
        languages[l.hreflang] = `${base}${articlePath(p.slug, l.code)}`;
      }
      languages["x-default"] = `${base}${articlePath(p.slug, "en")}`;

      return {
        url: `${base}${articlePath(p.slug, lang.code)}`,
        lastModified: new Date(p.updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.6,
        alternates: { languages },
      };
    })
  );

  return [...staticRoutes, ...projectRoutes, ...blogRoutes, ...blogLangRoutes];
}
