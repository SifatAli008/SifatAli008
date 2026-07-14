import type { Metadata } from "next";
import { getPortfolioWork } from "@/lib/firebase/queries";
import { buildPageMetadata, itemListJsonLd } from "@/lib/seo";
import { PORTFOLIO_PREVIEW_LIMIT } from "@/lib/github/load-portfolio";
import { JsonLd } from "@/components/seo/json-ld";
import { ProjectsRows } from "@/components/site/projects-rows";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Work - Selected Projects",
    description:
      "Selected projects by Sifat Ali - live GitHub portfolio synced with admin dashboard.",
    path: "/projects",
  }),
  title: { absolute: "Selected Work by Sifat Ali | AI & Full-Stack Projects" },
};

export const revalidate = 300;

export default async function ProjectsPage() {
  const portfolio = await getPortfolioWork();

  const jsonLd = itemListJsonLd(
    "Sifat Ali - Projects",
    portfolio.map((item) => ({
      name: item.title,
      url: `/projects/${item.slug}`,
    }))
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="border-b-[3px] border-ink bg-ink">
        <div className="site-container py-4">
          <p className="label-mono text-accent">PORTFOLIO</p>
          <h1 className="font-display text-display leading-none text-cream">
            ALL WORK
          </h1>
          <p className="mt-2 label-mono text-xs text-cream/60">
            Live from GitHub · synced with admin dashboard
          </p>
        </div>
      </div>
      <ProjectsRows projects={portfolio} showHeader={false} pageSize={PORTFOLIO_PREVIEW_LIMIT} />
    </>
  );
}
