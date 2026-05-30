import { NextResponse } from "next/server";
import {
  getAutoCropImageUrl,
  getOptimizedImageUrl,
  isCloudinaryConfigured,
  uploadImage,
} from "@/lib/cloudinary/client";

export async function POST(request: Request) {
  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured on the server." },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as {
      url?: string;
      publicId?: string;
      folder?: string;
    };

    if (!body.url?.trim()) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    const uploadResult = await uploadImage(body.url.trim(), {
      publicId: body.publicId,
      folder: body.folder ?? "sifat-ali",
    });

    const publicId = uploadResult.public_id;

    return NextResponse.json({
      publicId,
      url: uploadResult.secure_url,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
      optimizedUrl: getOptimizedImageUrl(publicId),
      autoCropUrl: getAutoCropImageUrl(publicId),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cloudinary upload failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
