"use client";

import { useState } from "react";
import { CloudUpload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CloudinarySyncPanel() {
  const [syncing, setSyncing] = useState(false);
  const [lastResult, setLastResult] = useState<{
    uploaded: number;
    failed: number;
  } | null>(null);

  const syncAssets = async () => {
    setSyncing(true);
    try {
      const response = await fetch("/api/cloudinary/sync-assets", {
        method: "POST",
        credentials: "include",
      });
      const data = (await response.json()) as {
        error?: string;
        uploaded?: number;
        failed?: number;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Sync failed");
      }

      setLastResult({ uploaded: data.uploaded ?? 0, failed: data.failed ?? 0 });
      toast.success(`Uploaded ${data.uploaded} images to Cloudinary`);
      if (data.failed) {
        toast.warning(`${data.failed} files failed - check server logs`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <section className="glass glow-border overflow-visible rounded-xl p-5 md:p-6">
      <p className="label-mono text-[10px] text-accent">CLOUDINARY</p>
      <h2 className="mt-1 font-display text-lg text-cream">Bulk asset upload</h2>
      <p className="mt-1 text-xs text-zinc-500">
        Upload every image in <code className="text-zinc-400">public/assets</code> to
        Cloudinary and update the local manifest. Requires{" "}
        <code className="text-zinc-400">CLOUDINARY_*</code> env vars on the server.
      </p>
      <Button className="mt-5" onClick={syncAssets} disabled={syncing}>
        {syncing ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CloudUpload className="mr-2 h-4 w-4" />
        )}
        {syncing ? "Uploading…" : "Upload all local assets"}
      </Button>
      {lastResult && (
        <p className="label-mono mt-4 text-[10px] text-zinc-500">
          Last sync - {lastResult.uploaded} uploaded · {lastResult.failed} failed · restart
          dev server to pick up manifest changes
        </p>
      )}
    </section>
  );
}
