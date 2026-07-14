import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Digital Archive",
    description:
      "Timeline of Sifat Ali's career milestones - jobs, achievements, learning, and community impact.",
    path: "/archive",
  }),
  title: { absolute: "Digital Archive | Sifat Ali Career Timeline" },
};

export default function ArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
