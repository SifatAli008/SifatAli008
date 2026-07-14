import type { Metadata } from "next";
import { assetUrl } from "@/lib/cloudinary/assets";

const FALLBACK_SITE_URL = "https://sifatali.dev";

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL;
  return url.replace(/\/$/, "");
}

export function absoluteUrl(path = ""): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

const DEFAULT_OG_IMAGE = "/opengraph-image";

const PERSON_AWARDS = [
  "InnovateX Hackathon 2025 - 1st Runner-Up (130+ teams)",
  "NextZen @ IIUC Tech Fest 2025 - 4th Place (152+ teams)",
];

function parseUniversityName(education?: string): string | undefined {
  if (!education) return undefined;
  const parts = education.split("-");
  return parts.length > 1 ? parts[parts.length - 1].trim() : education.trim();
}

export type PageSeoInput = {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
};

/** Per-page metadata with canonical, Open Graph, and Twitter cards */
export function buildPageMetadata(input: PageSeoInput): Metadata {
  const {
    title,
    description,
    path = "",
    ogImage = DEFAULT_OG_IMAGE,
    ogType = "website",
    noIndex = false,
    publishedTime,
    modifiedTime,
    tags,
  } = input;

  const url = absoluteUrl(path);
  const imageUrl = ogImage.startsWith("http") ? ogImage : absoluteUrl(ogImage);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: ogType,
      locale: "en_US",
      url,
      siteName: "Sifat Ali",
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(ogType === "article" && publishedTime
        ? { publishedTime, modifiedTime: modifiedTime ?? publishedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@sifatali008",
    },
    ...(tags?.length ? { keywords: tags } : {}),
    ...(noIndex
      ? { robots: { index: false, follow: false } }
      : { robots: { index: true, follow: true } }),
  };
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Sifat Ali - AI/RAG Engineer & Full-Stack Builder",
    template: "%s | Sifat Ali",
  },
  description:
    "Sifat Ali — COO @ Fluvo Soft, AI/RAG engineer & 2× hackathon winner. Hire for scalable AI-automation and full-stack products.",
  keywords: [
    "Sifat Ali",
    "Fluvo Soft",
    "AI RAG Engineer",
    "Full Stack Developer",
    "Next.js",
    "TypeScript",
    "Bangladesh Developer",
    "Hackathon Winner",
    "EdTech",
    "MedTech",
    "SaaS",
  ],
  authors: [{ name: "Sifat Ali", url: getSiteUrl() }],
  creator: "Sifat Ali",
  publisher: "Sifat Ali",
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: { canonical: getSiteUrl() },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: getSiteUrl(),
    siteName: "Sifat Ali",
    title: "Sifat Ali - AI/RAG Engineer & Full-Stack Builder",
    description:
      "Sifat Ali — COO @ Fluvo Soft, AI/RAG engineer & 2× hackathon winner. Hire for scalable AI-automation and full-stack products.",
    images: [
      {
        url: absoluteUrl(DEFAULT_OG_IMAGE),
        width: 1200,
        height: 630,
        alt: "Sifat Ali - AI/RAG Engineer & Full-Stack Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sifat Ali - AI/RAG Engineer & Full-Stack Builder",
    description:
      "Sifat Ali — COO @ Fluvo Soft, AI/RAG engineer & 2× hackathon winner. Hire for scalable AI-automation and full-stack products.",
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
    creator: "@sifatali008",
  },
  robots: { index: true, follow: true },
};

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function websiteJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Sifat Ali",
    description: defaultMetadata.description as string,
    inLanguage: "en-US",
    publisher: { "@id": `${siteUrl}/#person` },
  };
}

export function personJsonLd(profile: {
  name: string;
  tagline: string;
  headline?: string;
  email: string;
  location?: string;
  avatar?: string;
  education?: string;
  socials: Record<string, string | undefined>;
}) {
  const siteUrl = getSiteUrl();
  const university = parseUniversityName(profile.education);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: profile.name,
    jobTitle: profile.tagline,
    description: profile.headline,
    email: profile.email,
    url: siteUrl,
    image: profile.avatar ? absoluteUrl(profile.avatar) : absoluteUrl(DEFAULT_OG_IMAGE),
    ...(profile.location
      ? { address: { "@type": "PostalAddress", addressLocality: profile.location } }
      : {}),
    sameAs: Object.values(profile.socials).filter(Boolean),
    worksFor: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "Fluvo Soft" },
    ...(university
      ? {
          alumniOf: {
            "@type": "CollegeOrUniversity",
            name: university,
          },
        }
      : {}),
    award: PERSON_AWARDS,
    knowsAbout: [
      "Artificial Intelligence",
      "Retrieval-Augmented Generation",
      "Full-Stack Development",
      "Next.js",
      "Firebase",
      "EdTech",
      "MedTech",
      "SaaS",
    ],
  };
}

export function profilePageJsonLd(profile: {
  name: string;
  tagline: string;
  headline?: string;
}) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/#profilepage`,
    url: siteUrl,
    name: `${profile.name} - Portfolio`,
    description: profile.headline ?? profile.tagline,
    mainEntity: { "@id": `${siteUrl}/#person` },
    inLanguage: "en-US",
  };
}

export function organizationJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Fluvo Soft",
    description:
      "AI, web, mobile, and SaaS product delivery - scalable systems from concept to production.",
    logo: (() => {
      const logo = assetUrl("/assets/logos/Fluvo Soft.png");
      return logo.startsWith("http") ? logo : absoluteUrl(logo);
    })(),
    url: "https://www.fluvosoft.com/",
    founder: { "@id": `${siteUrl}/#person` },
    employee: { "@id": `${siteUrl}/#person`, name: "Sifat Ali" },
    sameAs: ["https://www.linkedin.com/in/sifat-ali/"],
    knowsAbout: ["Artificial Intelligence", "SaaS", "Web Development", "Mobile Apps"],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function softwareAppJsonLd(project: {
  title: string;
  description: string;
  tagline?: string;
  slug: string;
  techStack: string[];
  coverImage?: string;
  updatedAt?: string;
}) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/projects/${project.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${url}#software`,
    name: project.title,
    description: project.description || project.tagline,
    url,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    programmingLanguage: project.techStack,
    ...(project.coverImage ? { image: absoluteUrl(project.coverImage) } : {}),
    ...(project.updatedAt ? { dateModified: project.updatedAt } : {}),
    author: { "@id": `${siteUrl}/#person` },
  };
}

export function blogPostingJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt?: string;
  updatedAt?: string;
  coverImage?: string;
  tags?: string[];
}) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: url,
    datePublished: post.publishedAt ?? post.updatedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: "en-US",
    ...(post.coverImage ? { image: absoluteUrl(post.coverImage) } : {}),
    ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
    author: { "@type": "Person", "@id": `${siteUrl}/#person`, name: "Sifat Ali" },
    publisher: { "@type": "Person", "@id": `${siteUrl}/#person`, name: "Sifat Ali" },
  };
}

export function itemListJsonLd(
  name: string,
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url.startsWith("http") ? item.url : absoluteUrl(item.url),
    })),
  };
}

/** Site-wide schema safe to embed in root <head> without async profile data */
export function siteWideJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Sifat Ali",
        description: defaultMetadata.description as string,
        inLanguage: "en-US",
        publisher: { "@id": `${siteUrl}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Sifat Ali",
        url: siteUrl,
        jobTitle: "AI/RAG Engineer & Full-Stack Builder",
        description:
          "COO at Fluvo Soft, AI/RAG systems engineer, and 2× national hackathon winner building scalable AI-automation and full-stack products.",
        email: "sifatali008@gmail.com",
        image: absoluteUrl(DEFAULT_OG_IMAGE),
        sameAs: [
          "https://github.com/SifatAli008",
          "https://www.linkedin.com/in/sifat-ali/",
          "https://leetcode.com/u/SifatAli008/",
          "https://medium.com/@sifatali008",
        ],
        worksFor: {
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`,
          name: "Fluvo Soft",
        },
        award: PERSON_AWARDS,
        knowsAbout: [
          "Artificial Intelligence",
          "Retrieval-Augmented Generation",
          "Full-Stack Development",
          "Next.js",
          "Firebase",
          "EdTech",
          "MedTech",
          "SaaS",
        ],
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Fluvo Soft",
        description:
          "AI, web, mobile, and SaaS product delivery - scalable systems from concept to production.",
        url: "https://www.fluvosoft.com/",
        founder: { "@id": `${siteUrl}/#person` },
        employee: { "@id": `${siteUrl}/#person`, name: "Sifat Ali" },
        sameAs: ["https://www.linkedin.com/in/sifat-ali/"],
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        url: siteUrl,
        mainEntity: [
          {
            "@type": "Question",
            name: "Who is Sifat Ali?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sifat Ali is an AI/RAG engineer, full-stack builder, and COO at Fluvo Soft. He is a 2× national hackathon winner building AI-automation and product systems in Bangladesh.",
            },
          },
          {
            "@type": "Question",
            name: "What is Sifat Ali best at?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "AI meets full-stack product building - RAG pipelines, Next.js/Firebase apps, and operator mindset from his COO role at Fluvo Soft.",
            },
          },
          {
            "@type": "Question",
            name: "How can I hire or contact Sifat Ali?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Email sifatali008@gmail.com with project scope, or book a call from the contact page at sifatali.dev/contact.",
            },
          },
          {
            "@type": "Question",
            name: "Where is Sifat Ali based?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sifat Ali is based in Bangladesh and works on AI, EdTech, MedTech, and SaaS products remotely and with Fluvo Soft.",
            },
          },
        ],
      },
    ],
  };
}

export function contactPageJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${siteUrl}/contact#contactpage`,
    url: `${siteUrl}/contact`,
    name: "Contact Sifat Ali",
    description:
      "Book a call or send a project inquiry to Sifat Ali - AI/RAG engineer and full-stack builder.",
    mainEntity: { "@id": `${siteUrl}/#person` },
    inLanguage: "en-US",
  };
}
