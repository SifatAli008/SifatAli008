import { config as loadEnv } from "dotenv";
import fs from "fs";
import path from "path";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { writeAssetManifest } from "../src/lib/cloudinary/sync-assets";

loadEnv({ path: ".env.local" });

const CHARACTERS_DIR = path.join(process.cwd(), "public", "assets", "characters");

const RENAME_MAP: Record<string, string> = {
  "1.svg": "sifat-idle-confident.svg",
  "2.svg": "sifat-casual-confused-determined-explaining-idle.svg",
  "3.svg": "sifat-casual-confused-determined-explaining-idle-set-2.svg",
  "4.svg": "sifat-casual-confused-determined-explaining-idle-set-3.svg",
  "5.svg": "sifat-professional-confident-neutral-mobile-explaining.svg",
  "6.svg": "sifat-professional-confident-neutral-mobile-explaining-set-2.svg",
  "7.svg": "sifat-professional-confident-neutral-mobile-explaining-set-3.svg",
  "8.svg": "sifat-professional-confident-neutral-mobile-explaining-set-4.svg",
  "9.svg": "sifat-enthusiastic-idle-cheer-thinking-presenting.svg",
  "10.svg": "sifat-enthusiastic-idle-cheer-thinking-presenting-set-2.svg",
  "11.svg": "sifat-enthusiastic-idle-cheer-thinking-presenting-set-3.svg",
  "12.svg": "sifat-enthusiastic-idle-cheer-thinking-presenting-set-4.svg",
  "13.svg": "sifat-developer-laptop-confused-phone-presenting.svg",
  "14.svg": "sifat-developer-laptop-confused-phone-presenting-set-2.svg",
  "15.svg": "sifat-developer-laptop-confused-phone-presenting-set-3.svg",
  "16.svg": "sifat-developer-laptop-confused-phone-presenting-set-4.svg",
};

function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary env vars missing in .env.local");
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
}

function renameCharacters() {
  for (const [from, to] of Object.entries(RENAME_MAP)) {
    const src = path.join(CHARACTERS_DIR, from);
    const dest = path.join(CHARACTERS_DIR, to);
    if (!fs.existsSync(src)) {
      console.warn(`Skip missing: ${from}`);
      continue;
    }
    if (fs.existsSync(dest) && path.resolve(src) !== path.resolve(dest)) {
      fs.unlinkSync(dest);
    }
    fs.renameSync(src, dest);
    console.log(`Renamed ${from} -> ${to}`);
  }

  for (const file of fs.readdirSync(CHARACTERS_DIR)) {
    if (file.startsWith("_preview_")) {
      fs.unlinkSync(path.join(CHARACTERS_DIR, file));
    }
  }
}

async function uploadCharacters() {
  configureCloudinary();
  const manifest: Record<string, string> = {};

  const files = fs
    .readdirSync(CHARACTERS_DIR)
    .filter((f) => f.endsWith(".svg"))
    .sort();

  let uploaded = 0;
  let failed = 0;

  for (const file of files) {
    const filePath = path.join(CHARACTERS_DIR, file);
    const publicPath = `/assets/characters/${file}`;

    try {
      const uploadResult: UploadApiResponse = await cloudinary.uploader.upload(filePath, {
        folder: "sifat-ali/assets/characters",
        public_id: path.parse(file).name,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        resource_type: "image",
      });

      manifest[publicPath] = uploadResult.secure_url;
      uploaded += 1;
      console.log(`Uploaded ${file}`);
      console.log(`  -> ${uploadResult.secure_url}\n`);
    } catch (error) {
      failed += 1;
      console.error(
        `Failed ${file}: ${error instanceof Error ? error.message : "Upload failed"}\n`
      );
    }
  }

  const manifestPath = writeAssetManifest(manifest);
  console.log(`Manifest: ${path.relative(process.cwd(), manifestPath)}`);
  console.log(`Done - ${uploaded} uploaded, ${failed} failed.`);

  if (failed > 0) process.exit(1);
}

async function main() {
  renameCharacters();
  await uploadCharacters();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
