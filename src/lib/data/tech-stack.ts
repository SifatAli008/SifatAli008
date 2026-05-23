export interface TechStackItem {
  id: string;
  label: string;
  /** simple-icons slug — https://simpleicons.org */
  iconSlug?: string;
}

export const techStackMarquee: TechStackItem[] = [
  { id: "react", label: "REACT", iconSlug: "react" },
  { id: "nextjs", label: "NEXT.JS", iconSlug: "nextdotjs" },
  { id: "node", label: "NODE", iconSlug: "nodedotjs" },
  { id: "rag", label: "RAG" },
  { id: "wordpress", label: "WORDPRESS", iconSlug: "wordpress" },
  { id: "elementor", label: "ELEMENTOR", iconSlug: "elementor" },
  { id: "unity", label: "UNITY", iconSlug: "unity" },
  { id: "firebase", label: "FIREBASE", iconSlug: "firebase" },
  { id: "tensorflow", label: "TENSORFLOW", iconSlug: "tensorflow" },
  { id: "docker", label: "DOCKER", iconSlug: "docker" },
  { id: "csharp", label: "C#", iconSlug: "csharp" },
  { id: "typescript", label: "TYPESCRIPT", iconSlug: "typescript" },
  { id: "tailwind", label: "TAILWIND", iconSlug: "tailwindcss" },
];

export function simpleIconUrl(slug: string): string {
  return `https://cdn.jsdelivr.net/npm/simple-icons@11.15.0/icons/${slug}.svg`;
}
