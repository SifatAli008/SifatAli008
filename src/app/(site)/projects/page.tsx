import type { Metadata } from "next";
import { getProjects } from "@/lib/firebase/queries";
import { buildPageMetadata, itemListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { ProjectsRows } from "@/components/site/projects-rows";

export const metadata: Metadata = buildPageMetadata({
  title: "Work — Selected Projects",
  description:
    "Selected projects by Sifat Ali — AI/ML, web, desktop, games, and developer tools.",
  path: "/projects",
});

export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await getProjects();

  const jsonLd = itemListJsonLd(
    "Sifat Ali — Projects",
    projects.map((p) => ({
      name: p.title,
      url: `/projects/${p.slug}`,
    }))
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="border-b-[3px] border-ink bg-ink">
        <div className="site-container py-4">
          <p className="label-mono text-accent">PORTFOLIO</p>
          <h1 className="font-display text-display leading-none text-cream">
            ALL WORK
          </h1>
        </div>
      </div>
      <ProjectsRows projects={projects} showHeader={false} />
    </>
  );
}
