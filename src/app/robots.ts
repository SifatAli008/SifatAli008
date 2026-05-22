import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sifatali.dev";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/dashboard/"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
