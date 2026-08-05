import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  getExperience,
  getFeaturedPosts,
  getProfile,
  getResearchPapers,
  getResearchSettings,
  getSkills,
  getTechStack,
} from "@/lib/firebase/queries";
import {
  loadPortfolio,
  PORTFOLIO_PREVIEW_LIMIT,
  resolveGitHubUsername,
} from "@/lib/github/load-portfolio";
import {
  buildPageMetadata,
  personJsonLd,
  profilePageJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Hero } from "@/components/site/hero";
import { About } from "@/components/site/about";
import { FeaturedSection } from "@/components/site/featured-section";
import { ExperienceTable } from "@/components/site/experience-table";
import { SkillsBands } from "@/components/site/skills-bands";
import { ProjectsRows } from "@/components/site/projects-rows";
import { FaqSection } from "@/components/site/faq-section";
import { blogFallbackMeta } from "@/lib/data/blog-meta";

const AcademicResearchSection = dynamic(
  () =>
    import("@/components/site/academic-research-section").then((m) => ({
      default: m.AcademicResearchSection,
    }))
);
const GitHubActivitySection = dynamic(
  () =>
    import("@/components/site/github-activity-section").then((m) => ({
      default: m.GitHubActivitySection,
    }))
);
const MarqueeStrip = dynamic(
  () =>
    import("@/components/site/marquee-strip").then((m) => ({
      default: m.MarqueeStrip,
    }))
);
const WritingSection = dynamic(
  () =>
    import("@/components/site/writing-section").then((m) => ({
      default: m.WritingSection,
    }))
);
const ContactSection = dynamic(
  () =>
    import("@/components/site/contact-section").then((m) => ({
      default: m.ContactSection,
    }))
);

export const revalidate = 3600;

const HOME_TITLE = "Sifat Ali - AI/RAG Engineer & Full-Stack Builder";
const HOME_DESCRIPTION =
  "Sifat Ali — COO @ Fluvo Soft, AI/RAG engineer & 2× hackathon winner. Hire for scalable AI-automation and full-stack products.";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    path: "/",
  }),
  title: {
    absolute: HOME_TITLE,
  },
};

export default async function HomePage() {
  const profile = await getProfile();
  const username = resolveGitHubUsername(profile.socials?.github);

  const [
    portfolio,
    experiences,
    skills,
    featuredPosts,
    researchSettings,
    researchPapers,
    techStack,
  ] = await Promise.all([
    loadPortfolio(username, { preferSnapshot: true }).then((r) => r.portfolio),
    getExperience(),
    getSkills(),
    getFeaturedPosts(),
    getResearchSettings(),
    getResearchPapers(),
    getTechStack(),
  ]);

  const posts = blogFallbackMeta.filter((p) => p.status === "published");

  const profileWithLiveStats = {
    ...profile,
    stats: {
      ...profile.stats,
      projectsBuilt: portfolio.length,
    },
  };

  const jsonLd = [
    websiteJsonLd(),
    personJsonLd(profileWithLiveStats),
    profilePageJsonLd(profileWithLiveStats),
    organizationJsonLd(),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Hero profile={profileWithLiveStats} />
      <About profile={profileWithLiveStats} />
      <FeaturedSection profile={profileWithLiveStats} items={featuredPosts} />
      <ExperienceTable experiences={experiences} />
      <SkillsBands skills={skills} />
      <ProjectsRows projects={portfolio} limit={PORTFOLIO_PREVIEW_LIMIT} />
      <AcademicResearchSection settings={researchSettings} papers={researchPapers} />
      <GitHubActivitySection profile={profileWithLiveStats} />
      <MarqueeStrip items={techStack} />
      <WritingSection posts={posts} />
      <FaqSection />
      <ContactSection profile={profileWithLiveStats} />
    </>
  );
}
