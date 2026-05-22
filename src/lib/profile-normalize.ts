import { seedProfile } from "@/lib/data/seed-data";
import type { Profile } from "@/types";

export function normalizeProfile(profile: Profile): Profile {
  const s = profile.stats as Profile["stats"] & { leetcodeSolved?: number };
  if (s.leetcode?.solved) {
    return {
      ...profile,
      metrics: profile.metrics ?? seedProfile.metrics,
    };
  }

  return {
    ...profile,
    stats: seedProfile.stats,
    metrics: profile.metrics ?? seedProfile.metrics,
  };
}
