import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getAutoCropImageUrl,
  getOptimizedImageUrl,
  isCloudinaryConfigured,
  uploadImage,
} from "@/lib/cloudinary/client";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function buildUploadResponse(publicId: string, uploadResult: Awaited<ReturnType<typeof uploadImage>>) {
  return NextResponse.json({
    publicId,
    url: uploadResult.secure_url,
    width: uploadResult.width,
    height: uploadResult.height,
    format: uploadResult.format,
    optimizedUrl: getOptimizedImageUrl(publicId),
    autoCropUrl: getAutoCropImageUrl(publicId),
  });
}

export async function POST(request: Request) {
  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured on the server." },
      { status: 503 }
    );
  }

  const session = cookies().get("firebase-auth-session")?.value;
  if (!session) {
    return unauthorized();
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");
      const folder = (formData.get("folder") as string | null)?.trim() || "sifat-ali";

      if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "file is required" }, { status: 400 });
      }

      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
      }

      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "File must be under 10 MB" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const dataUri = `data:${file.type};base64,${base64}`;

      const uploadResult = await uploadImage(dataUri, { folder });
      return buildUploadResponse(uploadResult.public_id, uploadResult);
    }

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

    return buildUploadResponse(uploadResult.public_id, uploadResult);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cloudinary upload failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
