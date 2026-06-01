/** Company / org logos - files in public/assets/logos */
import { assetUrl } from "@/lib/cloudinary/assets";

export interface ExperienceLogo {
  id: string;
  name: string;
  src: string;
  url: string;
}

export const experienceLogos: ExperienceLogo[] = [
  {
    id: "fluvo-soft",
    name: "FLUVO SOFT",
    src: assetUrl("/assets/logos/Fluvo Soft.png"),
    url: "https://www.fluvosoft.com/",
  },
  {
    id: "shohoz-skill",
    name: "SHOHOZ SKILL",
    src: assetUrl("/assets/logos/Shohoz Skill.jpg"),
    url: "https://shohozskill.com/",
  },
  {
    id: "akino",
    name: "AKINO",
    src: assetUrl("/assets/logos/Akino.avif"),
    url: "https://www.akino.store/",
  },
];
