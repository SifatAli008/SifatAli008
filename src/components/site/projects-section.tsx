import Link from "next/link";
import { SectionHeading } from "@/components/layout/section-heading";
import { ProjectCard } from "@/components/site/project-card";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types";

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const featured = projects.filter((p) => p.featured).slice(0, 2);
  const rest = projects.filter((p) => !featured.find((f) => f.id === p.id));

  return (
    <section id="projects" className="section-gap border-t border-white/[0.06] bg-surface/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            label="Projects"
            title="Selected work"
            description="Production systems across AI, web, mobile, and desktop."
          />
          <Button asChild variant="outline">
            <Link href="/projects">View all projects</Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProjectCard key={p.id} project={p} featured />
          ))}
          {rest.slice(0, 5).map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
