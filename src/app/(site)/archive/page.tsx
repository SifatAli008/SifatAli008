import { ArchiveView } from "@/components/site/archive-view";
import { getAchievements } from "@/lib/firebase/queries";
import { achievementsToArchiveItems } from "@/lib/portfolio-sync";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

export const revalidate = 300;

export default async function ArchivePage() {
  const achievements = await getAchievements();
  const items = achievementsToArchiveItems(achievements);

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Archive", path: "/archive" },
    ]),
    itemListJsonLd(
      "Sifat Ali — Career Archive",
      items.map((item) => ({
        name: `${item.year} — ${item.title}`,
        url: `/archive#${item.year}-${item.title.replace(/\s+/g, "-").toLowerCase()}`,
      }))
    ),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="bg-cream">
        <div className="border-b-[3px] border-ink bg-ink">
          <div className="site-container py-4">
            <p className="label-mono text-accent">ARCHIVE</p>
            <h1 className="font-display text-display leading-none text-cream">
              DIGITAL LEGACY
            </h1>
          </div>
        </div>
        <ArchiveView items={items} />
      </div>
    </>
  );
}
