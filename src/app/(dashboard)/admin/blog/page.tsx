"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { blogFallbackMeta } from "@/lib/data/blog-meta";
import { blogMetaPayload } from "@/lib/blog/blog-meta-fields";
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
import { DashboardImageUpload } from "@/components/dashboard/dashboard-image-upload";
import { getFirestoreErrorMessage } from "@/lib/firebase/errors";
import { useDashboardAuth } from "@/lib/firebase/use-dashboard-auth";
import { useAuth } from "@/lib/auth/context";
import { toast } from "sonner";
import { CloudUpload, Pencil, Plus } from "lucide-react";

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
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>(blogFallbackMeta);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!db || !ready) return;
    getDocs(collection(db, "blog_posts"))
      .then((snap) => {
        if (!snap.empty) {
          setPosts(
            snap.docs.map(
              (d) =>
                ({
                  id: d.id,
                  ...d.data(),
                  content: "",
                }) as BlogPost
            )
          );
        }
      })
      .catch((error) => {
        toast.error(getFirestoreErrorMessage(error));
      });
  }, [ready]);

  const openEditor = async (post: BlogPost) => {
    if (!db) {
      setEditing(post);
      return;
    }
    try {
      const bodySnap = await getDoc(doc(db, "blog_posts", post.id, "body", "main"));
      const content =
        bodySnap.exists() && typeof bodySnap.data().content === "string"
          ? bodySnap.data().content
          : post.content || "";
      setEditing({ ...post, content });
    } catch (error) {
      toast.error(getFirestoreErrorMessage(error));
      setEditing(post);
    }
  };

  const savePost = async () => {
    if (!editing?.title || !editing.content) {
      toast.error("Title and content required");
      return;
    }
    const now = new Date().toISOString();
    const slug = editing.slug || slugify(editing.title);
    const full = {
      slug,
      title: editing.title,
      excerpt: editing.excerpt ?? editing.content.slice(0, 160),
      content: editing.content,
      tags: editing.tags ?? [],
      status: (editing.status ?? "draft") as BlogStatus,
      readingTime: calculateReadingTime(editing.content),
      seoTitle: editing.seoTitle,
      seoDescription: editing.seoDescription,
      coverImage: editing.coverImage,
      ogImage: editing.ogImage,
      updatedAt: now,
      createdAt: editing.createdAt ?? now,
      publishedAt:
        editing.status === "published" ? editing.publishedAt ?? now : undefined,
    };
    const meta = blogMetaPayload(full);

    if (db && editing.id) {
      await updateDoc(doc(db, "blog_posts", editing.id), meta);
      await setDoc(doc(db, "blog_posts", editing.id, "body", "main"), {
        content: editing.content,
        updatedAt: now,
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? { ...p, ...meta, id: editing.id!, content: "" }
            : p
        )
      );
    } else if (db) {
      const ref = await addDoc(collection(db, "blog_posts"), meta);
      await setDoc(doc(db, "blog_posts", ref.id, "body", "main"), {
        content: editing.content,
        updatedAt: now,
      });
      setPosts((prev) => [
        ...prev,
        { id: ref.id, ...meta, content: "" } as BlogPost,
      ]);
    } else {
      toast.info("Saved locally (configure Firebase to persist)");
    }
    setEditing(null);
    toast.success("Post saved");
  };

  const syncCodebaseArticles = async () => {
    if (!db || !user) {
      toast.error("Sign in to Firebase admin first");
      return;
    }
    setSyncing(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/admin/articles-export", {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!res.ok) {
        throw new Error((await res.json().catch(() => null))?.error ?? "Export failed");
      }
      const { posts: exported } = (await res.json()) as {
        posts: Omit<BlogPost, "id">[];
      };

      let synced = 0;
      for (const article of exported) {
        const now = new Date().toISOString();
        const meta = blogMetaPayload({
          ...article,
          updatedAt: now,
          publishedAt: article.publishedAt ?? now,
          createdAt: article.createdAt ?? now,
        });

        const existing = await getDocs(
          query(
            collection(db, "blog_posts"),
            where("slug", "==", article.slug),
            limit(1)
          )
        );

        let postId: string;
        if (!existing.empty) {
          postId = existing.docs[0].id;
          await updateDoc(doc(db, "blog_posts", postId), {
            ...meta,
            id: postId,
            content: article.content,
          });
        } else {
          const ref = await addDoc(collection(db, "blog_posts"), {
            ...meta,
            content: article.content,
          });
          postId = ref.id;
          await updateDoc(ref, { id: postId });
        }

        // Prefer separate body doc (lighter list reads once rules are deployed)
        try {
          await setDoc(doc(db, "blog_posts", postId, "body", "main"), {
            content: article.content,
            updatedAt: now,
          });
          await updateDoc(doc(db, "blog_posts", postId), { content: "" });
        } catch {
          /* inline content already saved — OK with current rules */
        }
        synced += 1;
      }

      const snap = await getDocs(collection(db, "blog_posts"));
      if (!snap.empty) {
        setPosts(
          snap.docs.map(
            (d) => ({ id: d.id, ...d.data(), content: "" }) as BlogPost
          )
        );
      }
      toast.success(`Synced ${synced} article(s) to Firebase`);
    } catch (error) {
      toast.error(getFirestoreErrorMessage(error));
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DashboardPageHeader
          label="CONTENT"
          title="Blog"
          description="Markdown editor · SEO · drafts & published posts"
        />
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled={syncing || !ready}
            onClick={() => void syncCodebaseArticles()}
          >
            <CloudUpload className="mr-2 h-4 w-4" />
            {syncing ? "Syncing…" : "Sync articles to Firebase"}
          </Button>
          <Button onClick={() => setEditing({ ...emptyPost })}>
            <Plus className="mr-2 h-4 w-4" />
            New post
          </Button>
        </div>
      </div>

      <ul className="mt-8 space-y-3">
        {posts.map((post) => (
          <li
            key={post.id}
            className="glass glow-border flex cursor-pointer items-center justify-between gap-4 rounded-xl p-4 transition-colors hover:bg-white/[0.04]"
            onClick={() => void openEditor(post)}
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
                  void openEditor(post);
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
            <DashboardImageUpload
              label="Cover image"
              hint="Blog card and post header image."
              folder="sifat-ali/blog"
              value={editing.coverImage ?? ""}
              onChange={(url) => setEditing({ ...editing, coverImage: url })}
            />
            <DashboardImageUpload
              label="Social preview (OG)"
              hint="Open Graph image for link previews."
              folder="sifat-ali/blog/og"
              value={editing.ogImage ?? ""}
              onChange={(url) => setEditing({ ...editing, ogImage: url })}
            />
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
