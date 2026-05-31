import type { MetadataRoute } from "next";
import { PROFILE_AVATAR } from "@/lib/cloudinary/assets";
import { getSiteUrl } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  const base = getSiteUrl();
  return {
    name: "Sifat Ali - Portfolio",
    short_name: "Sifat Ali",
    description:
      "AI/RAG engineer and full-stack builder - portfolio, projects, and writing.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F0E8",
    theme_color: "#F5F0E8",
    lang: "en",
    icons: [
      {
        src: PROFILE_AVATAR,
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
