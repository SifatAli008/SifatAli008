"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { fallbackFeaturedPosts } from "@/lib/data/fallback";
import type { FeaturedPost, FeaturedPostType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  DashboardFormActions,
  DashboardModal,
  DashboardSelect,
} from "@/components/dashboard/dashboard-modal";
import { DashboardImageUpload } from "@/components/dashboard/dashboard-image-upload";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";

const emptyFeatured: Omit<FeaturedPost, "id"> = {
  title: "",
  subtitle: "",
  excerpt: "",
  type: "POST",
  href: "",
  order: 0,
};

export default function FeaturedManagerPage() {
  const [items, setItems] = useState<FeaturedPost[]>(fallbackFeaturedPosts);
  const [editing, setEditing] = useState<Partial<FeaturedPost> | null>(null);

  useEffect(() => {
    if (!db) return;
    getDocs(query(collection(db, "featured_posts"), orderBy("order", "asc"))).then(
      (snap) => {
        if (!snap.empty) {
          setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FeaturedPost)));
        }
      }
    );
  }, []);

  const save = async () => {
    if (!editing?.title?.trim() || !editing.href?.trim()) {
      toast.error("Title and LinkedIn URL are required");
      return;
    }

    const payload = {
      title: editing.title.trim(),
      subtitle: editing.subtitle ?? "",
      excerpt: editing.excerpt ?? "",
      badge: editing.badge || undefined,
      type: (editing.type ?? "POST") as FeaturedPostType,
      href: editing.href.trim(),
      image: editing.image || undefined,
      accent: editing.accent ?? false,
      order: editing.order ?? items.length + 1,
    };

    if (db && editing.id) {
      await updateDoc(doc(db, "featured_posts", editing.id), payload);
      setItems((prev) =>
        prev.map((item) =>
          item.id === editing.id ? { ...item, ...payload, id: editing.id! } : item
        )
      );
    } else if (db) {
      const ref = await addDoc(collection(db, "featured_posts"), payload);
      setItems((prev) => [...prev, { id: ref.id, ...payload }]);
    } else {
      toast.info("Configure Firebase to persist changes");
    }

    setEditing(null);
    toast.success("Featured post saved");
  };

  const remove = async (id: string) => {
    if (db) await deleteDoc(doc(db, "featured_posts", id));
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Deleted");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DashboardPageHeader
          label="CONTENT"
          title="Featured"
          description="LinkedIn posts shown in the homepage grid — synced to /#featured"
        />
        <Button onClick={() => setEditing({ ...emptyFeatured })}>
          <Plus className="mr-2 h-4 w-4" />
          New post
        </Button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="glass glow-border rounded-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{item.type}</Badge>
                  {item.badge && <Badge>{item.badge}</Badge>}
                  {item.accent && (
                    <span className="label-mono text-[10px] text-accent">ACCENT</span>
                  )}
                </div>
                <h3 className="mt-2 font-display text-lg text-cream">{item.title}</h3>
                <p className="mt-1 text-xs text-zinc-500">{item.subtitle}</p>
                <p className="mt-2 text-sm text-zinc-500 line-clamp-2">{item.excerpt}</p>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-mono mt-3 inline-flex items-center gap-1 text-[10px] text-accent hover:underline"
                >
                  Open on LinkedIn
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" onClick={() => setEditing(item)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(item.id)}>
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DashboardModal
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        title={editing?.id ? "Edit featured post" : "New featured post"}
        description="Cards appear on the homepage LinkedIn section in order."
        footer={
          <DashboardFormActions
            onCancel={() => setEditing(null)}
            onSave={save}
            saveLabel={editing?.id ? "Update post" : "Add post"}
          />
        }
      >
        {editing && (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                className="dashboard-field mt-2"
                value={editing.title ?? ""}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                className="dashboard-field mt-2"
                value={editing.subtitle ?? ""}
                onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
              />
            </div>
            <div>
              <Label>Excerpt</Label>
              <Textarea
                className="dashboard-field mt-2"
                rows={3}
                value={editing.excerpt ?? ""}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>LinkedIn URL</Label>
                <Input
                  className="dashboard-field mt-2"
                  value={editing.href ?? ""}
                  onChange={(e) => setEditing({ ...editing, href: e.target.value })}
                />
              </div>
              <div>
                <Label>Order</Label>
                <Input
                  className="dashboard-field mt-2"
                  type="number"
                  value={editing.order ?? 0}
                  onChange={(e) =>
                    setEditing({ ...editing, order: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <DashboardImageUpload
              label="Card image"
              hint="Upload to Cloudinary — used on the homepage featured grid."
              folder="sifat-ali/featured"
              value={editing.image ?? ""}
              onChange={(url) => setEditing({ ...editing, image: url })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Badge</Label>
                <Input
                  className="dashboard-field mt-2"
                  placeholder="4TH PLACE"
                  value={editing.badge ?? ""}
                  onChange={(e) => setEditing({ ...editing, badge: e.target.value })}
                />
              </div>
              <div>
                <Label>Type</Label>
                <DashboardSelect
                  value={editing.type ?? "POST"}
                  onChange={(e) =>
                    setEditing({ ...editing, type: e.target.value as FeaturedPostType })
                  }
                >
                  <option value="POST">POST</option>
                  <option value="ACTIVITY">ACTIVITY</option>
                </DashboardSelect>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={editing.accent ?? false}
                onChange={(e) => setEditing({ ...editing, accent: e.target.checked })}
                className="accent-accent"
              />
              Highlight as accent card
            </label>
          </div>
        )}
      </DashboardModal>
    </div>
  );
}
