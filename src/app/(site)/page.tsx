import {
  getExperience,
  getFeaturedPosts,
  getPortfolioWork,
  getProfile,
  getBlogPosts,
  getResearchPapers,
  getResearchSettings,
  getSkills,
  getTechStack,
} from "@/lib/firebase/queries";
import { publishedFallbackPosts } from "@/lib/data/fallback";
import { PORTFOLIO_PREVIEW_LIMIT } from "@/lib/github/load-portfolio";
import {
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
import { AcademicResearchSection } from "@/components/site/academic-research-section";
import { ProjectsRows } from "@/components/site/projects-rows";
import { GitHubActivitySection } from "@/components/site/github-activity-section";
import { MarqueeStrip } from "@/components/site/marquee-strip";
import { WritingSection } from "@/components/site/writing-section";
import { ContactSection } from "@/components/site/contact-section";

export const revalidate = 300;

export default async function HomePage() {
  const [
    profile,
    portfolio,
    experiences,
    skills,
    featuredPosts,
    researchSettings,
    researchPapers,
    techStack,
  ] = await Promise.all([
    getProfile(),
    getPortfolioWork(),
    getExperience(),
    getSkills(),
    getFeaturedPosts(),
    getResearchSettings(),
    getResearchPapers(),
    getTechStack(),
  ]);

  let posts = await getBlogPosts(true);
  if (posts.length === 0) posts = publishedFallbackPosts;

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
      <AcademicResearchSection settings={researchSettings} papers={researchPapers} />
      <ProjectsRows projects={portfolio} limit={PORTFOLIO_PREVIEW_LIMIT} />
      <GitHubActivitySection profile={profileWithLiveStats} />
      <MarqueeStrip items={techStack} />
      <WritingSection posts={posts} />
      <ContactSection profile={profileWithLiveStats} />
    </>
  );
}
