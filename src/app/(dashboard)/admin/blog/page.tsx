"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { fallbackBlogPosts } from "@/lib/data/fallback";
import { slugify, calculateReadingTime } from "@/lib/utils";
import type { BlogPost, BlogStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  DashboardFormActions,
  DashboardModal,
  DashboardSelect,
} from "@/components/dashboard/dashboard-modal";
import { getFirestoreErrorMessage } from "@/lib/firebase/errors";
import { useDashboardAuth } from "@/lib/firebase/use-dashboard-auth";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((m) => m.default),
  { ssr: false }
);

const emptyPost: Partial<BlogPost> = {
  title: "",
  content: "",
  excerpt: "",
  status: "draft",
  tags: [],
};

export default function BlogManagerPage() {
  const { ready } = useDashboardAuth();
  const [posts, setPosts] = useState<BlogPost[]>(fallbackBlogPosts);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);

  useEffect(() => {
    if (!db || !ready) return;
    getDocs(collection(db, "blog_posts"))
      .then((snap) => {
        if (!snap.empty) {
          setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost)));
        }
      })
      .catch((error) => {
        toast.error(getFirestoreErrorMessage(error));
      });
  }, [ready]);

  const savePost = async () => {
    if (!editing?.title || !editing.content) {
      toast.error("Title and content required");
      return;
    }
    const now = new Date().toISOString();
    const payload = {
      slug: editing.slug || slugify(editing.title),
      title: editing.title,
      excerpt: editing.excerpt ?? editing.content.slice(0, 160),
      content: editing.content,
      tags: editing.tags ?? [],
      status: (editing.status ?? "draft") as BlogStatus,
      readingTime: calculateReadingTime(editing.content),
      seoTitle: editing.seoTitle,
      seoDescription: editing.seoDescription,
      updatedAt: now,
      createdAt: editing.createdAt ?? now,
      publishedAt:
        editing.status === "published" ? editing.publishedAt ?? now : undefined,
    };

    if (db && editing.id) {
      await updateDoc(doc(db, "blog_posts", editing.id), payload);
      setPosts((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...p, ...payload, id: editing.id! } : p))
      );
    } else if (db) {
      const ref = await addDoc(collection(db, "blog_posts"), payload);
      setPosts((prev) => [...prev, { id: ref.id, ...payload } as BlogPost]);
    } else {
      toast.info("Saved locally (configure Firebase to persist)");
    }
    setEditing(null);
    toast.success("Post saved");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DashboardPageHeader
          label="CONTENT"
          title="Blog"
          description="Markdown editor · SEO · drafts & published posts"
        />
        <Button onClick={() => setEditing({ ...emptyPost })}>
          <Plus className="mr-2 h-4 w-4" />
          New post
        </Button>
      </div>

      <ul className="mt-8 space-y-3">
        {posts.map((post) => (
          <li
            key={post.id}
            className="glass glow-border flex cursor-pointer items-center justify-between gap-4 rounded-xl p-4 transition-colors hover:bg-white/[0.04]"
            onClick={() => setEditing(post)}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-cream">{post.title}</p>
              <p className="mt-1 text-xs text-zinc-500">
                {post.readingTime} min · {post.slug}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge variant={post.status === "published" ? "success" : "secondary"}>
                {post.status}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing(post);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <DashboardModal
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        title={editing?.id ? "Edit post" : "New post"}
        description="Write in Markdown. Save as draft or publish to the live site."
        size="2xl"
        footer={
          <DashboardFormActions
            onCancel={() => setEditing(null)}
            onSave={savePost}
            saveLabel={editing?.id ? "Update post" : "Create post"}
          />
        }
      >
        {editing && (
          <div className="space-y-4" data-color-mode="dark">
            <div>
              <Label>Title</Label>
              <Input
                className="dashboard-field mt-2"
                value={editing.title ?? ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    title: e.target.value,
                    slug: slugify(e.target.value),
                  })
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Slug</Label>
                <Input
                  className="dashboard-field mt-2 font-mono text-xs"
                  value={editing.slug ?? slugify(editing.title ?? "")}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                />
              </div>
              <div>
                <Label>Status</Label>
                <DashboardSelect
                  value={editing.status ?? "draft"}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      status: e.target.value as BlogStatus,
                    })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </DashboardSelect>
              </div>
            </div>
            <div>
              <Label>Excerpt</Label>
              <Textarea
                className="dashboard-field mt-2"
                rows={2}
                value={editing.excerpt ?? ""}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
              />
            </div>
            <div>
              <Label>Tags (comma separated)</Label>
              <Input
                className="dashboard-field mt-2"
                value={(editing.tags ?? []).join(", ")}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    tags: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
            <div>
              <Label>Content</Label>
              <div className="mt-2 overflow-hidden border-2 border-white/10">
                <MDEditor
                  value={editing.content ?? ""}
                  onChange={(v) => setEditing({ ...editing, content: v ?? "" })}
                  height={220}
                  preview="edit"
                  visibleDragbar={false}
                />
              </div>
            </div>
          </div>
        )}
      </DashboardModal>
    </div>
  );
}
