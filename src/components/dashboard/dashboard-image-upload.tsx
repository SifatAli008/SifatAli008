"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadFileToCloudinary } from "@/lib/cloudinary/upload-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DashboardImageUploadProps {
  label?: string;
  hint?: string;
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  previewClassName?: string;
}

export function DashboardImageUpload({
  label = "Image",
  hint,
  value = "",
  onChange,
  folder = "sifat-ali",
  previewClassName,
}: DashboardImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10 MB");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadFileToCloudinary(file, { folder });
      onChange(result.url);
      toast.success("Image uploaded to Cloudinary");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-zinc-300">{label}</Label>
        {hint && <p className="mt-0.5 text-[11px] text-zinc-600">{hint}</p>}
      </div>

      {value ? (
        <div
          className={cn(
            "relative overflow-hidden border-2 border-white/10 bg-white/[0.03]",
            previewClassName ?? "aspect-video max-w-sm"
          )}
        >
          <Image
            src={value}
            alt=""
            fill
            className="object-cover"
            unoptimized={value.includes("cloudinary.com")}
          />
          <div className="absolute right-2 top-2 flex gap-1">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-8 w-8 border border-white/10 bg-ink/90"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-8 w-8 border border-white/10 bg-ink/90"
              disabled={uploading}
              onClick={() => onChange("")}
            >
              <Trash2 className="h-4 w-4 text-red-400" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex w-full max-w-sm flex-col items-center justify-center gap-2 border-2 border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-zinc-500 transition-colors hover:border-accent/40 hover:text-zinc-300 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          ) : (
            <ImagePlus className="h-8 w-8 text-accent" />
          )}
          <span className="label-mono text-[10px]">
            {uploading ? "UPLOADING…" : "UPLOAD TO CLOUDINARY"}
          </span>
          <span className="text-[11px]">PNG, JPG, WEBP · max 10 MB</span>
        </button>
      )}

      <Input
        className="dashboard-field font-mono text-xs"
        placeholder="Or paste image URL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
