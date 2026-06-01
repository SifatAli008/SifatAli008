import { assetUrl } from "@/lib/cloudinary/assets";

/** Individual 512×512 PNGs in public/assets/charahters/ (not sprite sheets). */
const CHAR = "/assets/charahters";

export type CharacterSheetId =
  | "standalone"
  | "casual"
  | "professional"
  | "enthusiastic"
  | "developer";

export const CHARACTER_SHEETS: Record<CharacterSheetId, { label: string }> = {
  standalone: { label: "Sifat" },
  casual: { label: "Casual" },
  professional: { label: "Professional" },
  enthusiastic: { label: "Enthusiastic" },
  developer: { label: "Developer" },
};

/** One PNG per mood pose (filename order: …-set-2 = 2nd pose, set-3 = 3rd, set-4 = 4th). */
const POSE_SRC: Record<CharacterSheetId, Record<string, string>> = {
  standalone: {
    default: `${CHAR}/sifat-idle-confident.png`,
  },
  casual: {
    confused: `${CHAR}/sifat-casual-confused-determined-explaining-idle.png`,
    determined: `${CHAR}/sifat-casual-confused-determined-explaining-idle-set-2.png`,
    explaining: `${CHAR}/sifat-casual-confused-determined-explaining-idle-set-3.png`,
    idle: `${CHAR}/sifat-casual-confused-determined-explaining-idle.png`,
    default: `${CHAR}/sifat-casual-confused-determined-explaining-idle.png`,
  },
  professional: {
    confident: `${CHAR}/sifat-professional-confident-neutral-mobile-explaining.png`,
    neutral: `${CHAR}/sifat-professional-confident-neutral-mobile-explaining-set-2.png`,
    mobile: `${CHAR}/sifat-professional-confident-neutral-mobile-explaining-set-3.png`,
    explaining: `${CHAR}/sifat-professional-confident-neutral-mobile-explaining-set-4.png`,
    default: `${CHAR}/sifat-professional-confident-neutral-mobile-explaining.png`,
  },
  enthusiastic: {
    idle: `${CHAR}/sifat-enthusiastic-idle-cheer-thinking-presenting.png`,
    cheer: `${CHAR}/sifat-enthusiastic-idle-cheer-thinking-presenting-set-2.png`,
    thinking: `${CHAR}/sifat-enthusiastic-idle-cheer-thinking-presenting-set-3.png`,
    presenting: `${CHAR}/sifat-enthusiastic-idle-cheer-thinking-presenting-set-4.png`,
    default: `${CHAR}/sifat-enthusiastic-idle-cheer-thinking-presenting.png`,
  },
  developer: {
    laptop: `${CHAR}/sifat-developer-laptop-confused-phone-presenting.png`,
    confused: `${CHAR}/sifat-developer-laptop-confused-phone-presenting-set-2.png`,
    phone: `${CHAR}/sifat-developer-laptop-confused-phone-presenting-set-3.png`,
    presenting: `${CHAR}/sifat-developer-laptop-confused-phone-presenting-set-4.png`,
    default: `${CHAR}/sifat-developer-laptop-confused-phone-presenting.png`,
  },
};

export function resolveCharacterImageKey(
  sheetId: CharacterSheetId,
  poseKey: string
): string {
  return `${sheetId}-${poseKey}`;
}

export function getCharacterImageSrc(sheetId: CharacterSheetId, poseKey: string): string {
  const sheet = POSE_SRC[sheetId];
  const path = sheet[poseKey] ?? sheet.default ?? POSE_SRC.standalone.default;
  return assetUrl(path);
}
