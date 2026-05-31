import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isCloudinaryConfigured } from "@/lib/cloudinary/client";
import { uploadAllLocalAssets, writeAssetManifest } from "@/lib/cloudinary/sync-assets";

export async function POST() {
  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured on the server." },
      { status: 503 }
    );
  }

  const session = cookies().get("firebase-auth-session")?.value;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { manifest, results, errors } = await uploadAllLocalAssets();
    const manifestPath = writeAssetManifest(manifest);

    return NextResponse.json({
      uploaded: results.length,
      failed: errors.length,
      manifest,
      manifestPath,
      results,
      errors,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Asset sync failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
