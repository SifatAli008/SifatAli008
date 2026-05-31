import manifest from "../data/cloudinary-assets.json";

const assetMap = manifest as Record<string, string>;

/** Resolve a local `/assets/...` path to Cloudinary when uploaded, else keep as-is. */
export function assetUrl(path: string | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return assetMap[path] ?? path;
}

export const PROFILE_AVATAR = assetUrl("/assets/images/profile-image.jpeg");

export { assetMap as cloudinaryAssetMap };
