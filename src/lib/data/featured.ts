import type { FeaturedPost } from "@/types";
import { assetUrl } from "@/lib/cloudinary/assets";

/** @deprecated Use FeaturedPost from @/types */
export type FeaturedItem = FeaturedPost;

/** LinkedIn posts - seeded to Firestore `featured_posts` */
export const featuredItems: FeaturedPost[] = [
  {
    id: "nextzen-iiuc",
    title: "NextZen · IIUC Tech Fest 2025",
    subtitle: "UIU OrBit · National Inter-University Hackathon",
    excerpt:
      "4th place among 152+ teams nationwide with Md. Fatin Shadab Turja & Sifat Bin Jibon - UIU Developers Hub.",
    badge: "4TH PLACE",
    type: "POST",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7404026694963007488/",
    image: assetUrl("/assets/linkedin/NextZen IIUC Tech Fest 2025.jpg"),
    accent: true,
    order: 1,
  },
  {
    id: "innovatex-bubt",
    title: "InnovateX Hackathon 2025 · BUBT",
    subtitle: "UIU OrBit · National competition",
    excerpt:
      "1st Runner-Up among 130+ teams with Sifat Bin Jibon & Tasmim Rahman Medha - another national win for UIU Developers Hub.",
    badge: "1ST RUNNER-UP",
    type: "POST",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7404033807449792512/",
    image: assetUrl("/assets/linkedin/InnovateX Hackathon 2025 BUBT.png"),
    accent: true,
    order: 2,
  },
  {
    id: "uiu-hackday-announce",
    title: "UIU HackDay 2026 Announced",
    subtitle: "UIU Developers Hub · Intra-university hackathon",
    excerpt:
      "6-hour coding challenge, mystery theme on-site, 30,000 BDT prize pool - January 3rd, 2026 at United International University.",
    badge: "ORGANIZER",
    type: "POST",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7404037671599235072/",
    image: assetUrl("/assets/linkedin/UIU HackDay 2026 Announced.jpg"),
    order: 3,
  },
  {
    id: "uiu-hackday-recap",
    title: "UIU HackDay 2026 - Milestone",
    subtitle: "Community growth through collaboration",
    excerpt:
      "Alhamdulillah - collective effort from organizers, mentors, and participants. Proud to contribute and see UIU Developers Hub grow.",
    type: "POST",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7417412024864821248/",
    image: assetUrl("/assets/linkedin/UIU HackDay 2026 Milestone.jpg"),
    order: 4,
  },
  {
    id: "hackday-cat3-workshop",
    title: "UIU HackDay 2026 · Category 3 Workshop",
    subtitle: "UIU Developers Hub · Trimester 9–12+ bracket",
    excerpt:
      "Exclusive workshop for senior participants - interpret mystery themes fast, scope product direction, and plan technically sound solutions within the 6-hour hackathon.",
    badge: "WORKSHOP",
    type: "POST",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7415750283919568897/",
    image: assetUrl("/assets/linkedin/UIU HackDay 2026 Category 3 Workshop.jpg"),
    order: 5,
  },
  {
    id: "devhub-recruitment",
    title: "UIU Developers Hub · Recruitment",
    subtitle: "Interview invitations · UIU Dev Hub",
    excerpt:
      "Inviting all candidates to the interview process - best of luck to everyone applying. #UIUDH #DevHub #UIUDevelopersHub",
    badge: "RECRUITMENT",
    type: "POST",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7416498694381801472/",
    image: assetUrl("/assets/linkedin/UIU Developers Hub Recruitment.jpg"),
    order: 6,
  },
];
