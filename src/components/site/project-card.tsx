"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export function ProjectCard({ project, featured }: ProjectCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl glass transition-all hover:glow-border",
        featured ? "md:col-span-2 md:row-span-2" : ""
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo/5 to-accent-violet/5 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className={cn("relative p-6", featured && "p-8")}>
        <div className="flex items-start justify-between gap-4">
          <Badge variant="secondary">{project.category}</Badge>
          {project.featured && <Badge>Featured</Badge>}
        </div>
        <h3
          className={cn(
            "mt-4 font-display font-semibold text-white",
            featured ? "text-2xl" : "text-lg"
          )}
        >
          {project.title}
        </h3>
        <p className="mt-2 text-sm text-zinc-400">{project.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-white/10 px-2 py-0.5 text-xs text-zinc-500"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.githubUrl && (
            <Button asChild variant="outline" size="sm">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
            </Button>
          )}
          {project.demoUrl && (
            <Button asChild variant="outline" size="sm">
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                Demo
              </a>
            </Button>
          )}
          <Button asChild size="sm">
            <Link href={`/projects/${project.slug}`}>Case Study</Link>
          </Button>
        </div>
        <p className="mt-3 text-xs capitalize text-zinc-600">
          {project.status.replace("-", " ")}
        </p>
      </div>
    </motion.article>
  );
}
