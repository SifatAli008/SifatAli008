import { ArchiveView } from "@/components/site/archive-view";
import { getAchievements } from "@/lib/firebase/queries";
import { achievementsToArchiveItems } from "@/lib/portfolio-sync";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  itemListJsonLd,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

export const revalidate = 300;

export default async function ArchivePage() {
  const achievements = await getAchievements();
  const items = achievementsToArchiveItems(achievements);

  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/archive#collection"),
    url: absoluteUrl("/archive"),
    name: "Digital Archive - Sifat Ali",
    description:
      "Career timeline of jobs, hackathon wins, community work, and learning milestones by Sifat Ali.",
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: { "@id": absoluteUrl("/#person") },
    inLanguage: "en-US",
  };

  const jsonLd = [
    collectionPage,
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Archive", path: "/archive" },
    ]),
    itemListJsonLd(
      "Sifat Ali - Career Archive",
      items.map((item) => ({
        name: `${item.year} - ${item.title}`,
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
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream/70 md:text-base">
              A chronological record of Sifat Ali&apos;s work - roles, awards,
              teaching, and community builds. Use this page to verify milestones
              cited on the portfolio and LinkedIn.
            </p>
          </div>
        </div>
        <ArchiveView items={items} />
      </div>
    </>
  );
}
