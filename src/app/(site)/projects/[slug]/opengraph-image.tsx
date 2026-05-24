import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/firebase/queries";
import { createBrutalistOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-template";

export const runtime = "edge";
export const alt = "Sifat Ali — Project";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function ProjectOgImage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  return createBrutalistOgImage({
    eyebrow: `Work · ${project.category}`,
    title: project.title,
    subtitle: project.tagline,
    badge: project.status === "completed" ? "SHIPPED" : project.status.toUpperCase(),
  });
}
