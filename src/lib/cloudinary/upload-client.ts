export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
  optimizedUrl?: string;
  autoCropUrl?: string;
}

export async function uploadFileToCloudinary(
  file: File,
  options: { folder?: string } = {}
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  if (options.folder) formData.append("folder", options.folder);

  const response = await fetch("/api/cloudinary/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const data = (await response.json()) as CloudinaryUploadResult & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "Upload failed");
  }

  return data;
}

export async function uploadUrlToCloudinary(
  url: string,
  options: { folder?: string; publicId?: string } = {}
): Promise<CloudinaryUploadResult> {
  const response = await fetch("/api/cloudinary/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      folder: options.folder,
      publicId: options.publicId,
    }),
    credentials: "include",
  });

  const data = (await response.json()) as CloudinaryUploadResult & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "Upload failed");
  }

  return data;
}
