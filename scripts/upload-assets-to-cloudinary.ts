import "dotenv/config";
import { config as loadEnv } from "dotenv";
import path from "path";
import {
  uploadAllLocalAssets,
  writeAssetManifest,
} from "../src/lib/cloudinary/sync-assets";

loadEnv({ path: ".env.local" });

async function main() {
  console.log("Uploading all images from public/assets to Cloudinary…\n");

  const { manifest, results, errors } = await uploadAllLocalAssets();

  for (const item of results) {
    console.log(`✓ ${item.localPath}`);
    console.log(`  → ${item.url}\n`);
  }

  for (const item of errors) {
    console.error(`✗ ${item.localPath}: ${item.error}\n`);
  }

  const manifestPath = writeAssetManifest(manifest);
  console.log(`Manifest: ${path.relative(process.cwd(), manifestPath)}`);
  console.log(`Done — ${results.length} uploaded, ${errors.length} failed.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
