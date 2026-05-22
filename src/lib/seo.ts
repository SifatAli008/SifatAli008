import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sifatali.dev";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sifat Ali — AI/RAG Engineer & Full-Stack Builder",
    template: "%s | Sifat Ali",
  },
  description:
    "Sifat Ali — COO @ Fluvo Soft, AI/RAG Systems Engineer, 2× National Hackathon Winner. Building scalable AI-automation and full-stack products in Bangladesh.",
  keywords: [
    "Sifat Ali",
    "Fluvo Soft",
    "AI RAG Engineer",
    "Full Stack Developer",
    "Next.js",
    "TypeScript",
    "Bangladesh Developer",
    "Hackathon Winner",
  ],
  authors: [{ name: "Sifat Ali", url: siteUrl }],
  creator: "Sifat Ali",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Sifat Ali",
    title: "Sifat Ali — AI/RAG Engineer & Full-Stack Builder",
    description:
      "COO @ Fluvo Soft · 2× National Hackathon Winner · AI-automation & full-stack systems.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sifat Ali — AI/RAG Engineer & Full-Stack Builder",
    description:
      "COO @ Fluvo Soft · 2× National Hackathon Winner · AI-automation & full-stack systems.",
    creator: "@sifatali008",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
};

export function personJsonLd(profile: {
  name: string;
  tagline: string;
  email: string;
  socials: Record<string, string | undefined>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.tagline,
    email: profile.email,
    url: siteUrl,
    sameAs: Object.values(profile.socials).filter(Boolean),
  };
}

export function softwareAppJsonLd(project: {
  title: string;
  description: string;
  slug: string;
  techStack: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.description,
    url: `${siteUrl}/projects/${project.slug}`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    programmingLanguage: project.techStack,
  };
}

export function blogPostingJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: `${siteUrl}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: "Sifat Ali" },
  };
}
