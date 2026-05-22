import type { Metadata } from "next";
import { getProjects } from "@/lib/firebase/queries";
import { ProjectsRows } from "@/components/site/projects-rows";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects by Sifat Ali — AI, web, desktop, and tools.",
};

export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
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
