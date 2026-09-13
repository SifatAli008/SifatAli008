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
    id: "shohoz-skill",
    name: "SHOHOZ SKILL",
    src: assetUrl("/assets/logos/Shohoz Skill.jpg"),
    url: "https://shohozskill.com/",
  },
];
