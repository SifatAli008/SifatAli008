import { notFound } from "next/navigation";
import { getFallbackProject } from "@/lib/data/fallback";
import { createBrutalistOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-template";

export const runtime = "edge";
export const alt = "Sifat Ali - Project";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * Uses local fallback project data only — Firebase client SDK
 * exceeds Vercel’s 1 MB Edge Function limit.
 */
export default function ProjectOgImage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getFallbackProject(params.slug);
  if (!project) notFound();

  return createBrutalistOgImage({
    eyebrow: `Work · ${project.category}`,
    title: project.title,
    subtitle: project.tagline,
    badge:
      project.status === "completed" ? "SHIPPED" : project.status.toUpperCase(),
  });
}
