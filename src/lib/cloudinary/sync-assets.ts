import fs from "fs";
import path from "path";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { isCloudinaryConfigured } from "./client";

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg"]);

export interface AssetUploadResult {
  localPath: string;
  url: string;
  publicId: string;
}

function getAssetsDir() {
  return path.join(process.cwd(), "public", "assets");
}

function walkFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
      continue;
    }
    if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

function toPublicPath(absPath: string) {
  const rel = path.relative(path.join(process.cwd(), "public"), absPath).replace(/\\/g, "/");
  return `/${rel}`;
}

function toCloudinaryFolder(publicPath: string) {
  const withoutLeading = publicPath.replace(/^\/assets\/?/, "");
  const dir = path.dirname(withoutLeading).replace(/\\/g, "/");
  if (!dir || dir === ".") return "sifat-ali/assets";
  return `sifat-ali/assets/${dir}`;
}

function configureUploadClient() {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export function listLocalAssetPaths(): string[] {
  return walkFiles(getAssetsDir()).map(toPublicPath);
}

export async function uploadAllLocalAssets(): Promise<{
  manifest: Record<string, string>;
  results: AssetUploadResult[];
  errors: { localPath: string; error: string }[];
}> {
  configureUploadClient();

  const files = walkFiles(getAssetsDir());
  const manifest: Record<string, string> = {};
  const results: AssetUploadResult[] = [];
  const errors: { localPath: string; error: string }[] = [];

  for (const filePath of files) {
    const publicPath = toPublicPath(filePath);
    const folder = toCloudinaryFolder(publicPath);

    try {
      const uploadResult: UploadApiResponse = await cloudinary.uploader.upload(filePath, {
        folder,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        resource_type: "image",
      });

      manifest[publicPath] = uploadResult.secure_url;
      results.push({
        localPath: publicPath,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      });
    } catch (error) {
      errors.push({
        localPath: publicPath,
        error: error instanceof Error ? error.message : "Upload failed",
      });
    }
  }

  return { manifest, results, errors };
}

export function writeAssetManifest(manifest: Record<string, string>) {
  const manifestPath = path.join(process.cwd(), "src", "lib", "data", "cloudinary-assets.json");
  let existing: Record<string, string> = {};

  if (fs.existsSync(manifestPath)) {
    existing = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as Record<string, string>;
  }

  const merged = { ...existing, ...manifest };
  fs.writeFileSync(manifestPath, `${JSON.stringify(merged, null, 2)}\n`);
  return manifestPath;
}
