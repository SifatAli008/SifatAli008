import type { TechStackItem } from "@/types";

export type { TechStackItem };

export const techStackMarquee: TechStackItem[] = [
  { id: "react", label: "REACT", iconSlug: "react", order: 1 },
  { id: "nextjs", label: "NEXT.JS", iconSlug: "nextdotjs", order: 2 },
  { id: "node", label: "NODE", iconSlug: "nodedotjs", order: 3 },
  { id: "rag", label: "RAG", order: 4 },
  { id: "wordpress", label: "WORDPRESS", iconSlug: "wordpress", order: 5 },
  { id: "elementor", label: "ELEMENTOR", iconSlug: "elementor", order: 6 },
  { id: "unity", label: "UNITY", iconSlug: "unity", order: 7 },
  { id: "firebase", label: "FIREBASE", iconSlug: "firebase", order: 8 },
  { id: "tensorflow", label: "TENSORFLOW", iconSlug: "tensorflow", order: 9 },
  { id: "docker", label: "DOCKER", iconSlug: "docker", order: 10 },
  { id: "csharp", label: "C#", iconSlug: "csharp", order: 11 },
  { id: "typescript", label: "TYPESCRIPT", iconSlug: "typescript", order: 12 },
  { id: "tailwind", label: "TAILWIND", iconSlug: "tailwindcss", order: 13 },
];

export function simpleIconUrl(slug: string): string {
  return `https://cdn.jsdelivr.net/npm/simple-icons@11.15.0/icons/${slug}.svg`;
}
