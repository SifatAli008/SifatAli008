import { createBrutalistOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-template";

export const runtime = "edge";
export const alt = "Sifat Ali — AI/RAG Engineer & Full-Stack Builder";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return createBrutalistOgImage({
    eyebrow: "Sifat Ali",
    title: "AI/RAG Engineer & Full-Stack Builder",
    subtitle: "COO @ Fluvo Soft · 2× National Hackathon Winner",
  });
}
