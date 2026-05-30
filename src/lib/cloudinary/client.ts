import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export function getCloudinaryCloudName(): string {
  return (
    process.env.CLOUDINARY_CLOUD_NAME ??
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ??
    ""
  );
}

function configureCloudinary(requireSecret = false) {
  const cloudName = getCloudinaryCloudName();
  if (!cloudName) {
    throw new Error("Cloudinary cloud name is missing. Set CLOUDINARY_CLOUD_NAME.");
  }

  if (requireSecret && !isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary upload requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  return cloudinary;
}

export interface UploadImageOptions {
  publicId?: string;
  folder?: string;
  overwrite?: boolean;
}

export async function uploadImage(
  source: string,
  options: UploadImageOptions = {}
): Promise<UploadApiResponse> {
  configureCloudinary(true);

  return cloudinary.uploader.upload(source, {
    public_id: options.publicId,
    folder: options.folder,
    overwrite: options.overwrite,
  });
}

export function getOptimizedImageUrl(
  publicId: string,
  options: { width?: number; height?: number } = {}
) {
  configureCloudinary(false);

  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: "auto",
    ...options,
  });
}

export function getAutoCropImageUrl(
  publicId: string,
  options: { width?: number; height?: number } = {}
) {
  configureCloudinary(false);

  return cloudinary.url(publicId, {
    crop: "auto",
    gravity: "auto",
    width: options.width ?? 500,
    height: options.height ?? 500,
    fetch_format: "auto",
    quality: "auto",
  });
}
