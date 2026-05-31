/** Company / org logos — files in public/assets/logos */
import { assetUrl } from "@/lib/cloudinary/assets";

export interface ExperienceLogo {
  id: string;
  name: string;
  src: string;
}

export const experienceLogos: ExperienceLogo[] = [
  {
    id: "fluvo-soft",
    name: "FLUVO SOFT",
    src: assetUrl("/assets/logos/Fluvo Soft.png"),
  },
  {
    id: "shohoz-skill",
    name: "SHOHOZ SKILL",
    src: assetUrl("/assets/logos/Shohoz Skill.jpg"),
  },
  {
    id: "akino",
    name: "AKINO",
    src: assetUrl("/assets/logos/Akino.avif"),
  },
];
