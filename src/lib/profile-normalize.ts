import { seedProfile } from "@/lib/data/seed-data";
import { assetUrl } from "@/lib/cloudinary/assets";
import type { Profile } from "@/types";

export function normalizeProfile(profile: Profile): Profile {
  const s = profile.stats as Profile["stats"] & { leetcodeSolved?: number };
  const base = {
    ...profile,
    avatar: profile.avatar ? assetUrl(profile.avatar) : seedProfile.avatar,
    metrics: profile.metrics ?? seedProfile.metrics,
    domains: profile.domains?.length ? profile.domains : seedProfile.domains,
  };

  if (s.leetcode?.solved) {
    return base;
  }

  return {
    ...base,
    stats: seedProfile.stats,
  };
}
