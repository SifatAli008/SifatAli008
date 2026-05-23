import {
  getExperience,
  getProfile,
  getProjects,
  getBlogPosts,
} from "@/lib/firebase/queries";
import { fallbackBlogPosts } from "@/lib/data/fallback";
import { personJsonLd } from "@/lib/seo";
import { Hero } from "@/components/site/hero";
import { About } from "@/components/site/about";
import { FeaturedSection } from "@/components/site/featured-section";
import { ExperienceTable } from "@/components/site/experience-table";
import { SkillsBands } from "@/components/site/skills-bands";
import { AcademicResearchSection } from "@/components/site/academic-research-section";
import { ProjectsRows } from "@/components/site/projects-rows";
import { MarqueeStrip } from "@/components/site/marquee-strip";
import { WritingSection } from "@/components/site/writing-section";
import { ContactSection } from "@/components/site/contact-section";

export const revalidate = 3600;

export default async function HomePage() {
  const [profile, projects, experiences] = await Promise.all([
    getProfile(),
    getProjects(),
    getExperience(),
  ]);

  let posts = await getBlogPosts(false);
  if (posts.length === 0) posts = fallbackBlogPosts;

  const jsonLd = personJsonLd(profile);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero profile={profile} />
      <About profile={profile} />
      <FeaturedSection profile={profile} />
      <ExperienceTable experiences={experiences} />
      <SkillsBands />
      <AcademicResearchSection />
      <ProjectsRows projects={projects} />
      <MarqueeStrip />
      <WritingSection posts={posts} />
      <ContactSection profile={profile} />
    </>
  );
}
