import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sifat Ali - Portfolio",
    short_name: "Sifat Ali",
    description:
      "AI/RAG engineer and full-stack builder - portfolio, projects, and writing.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F0E8",
    theme_color: "#FF3B00",
    lang: "en",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
