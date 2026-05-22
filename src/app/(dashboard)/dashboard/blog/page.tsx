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
import { toast } from "sonner";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((m) => m.default),
  { ssr: false }
);

export default function BlogManagerPage() {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackBlogPosts);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);

  useEffect(() => {
    if (!db) return;
    getDocs(collection(db, "blog_posts")).then((snap) => {
      if (!snap.empty) {
        setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost)));
      }
    });
  }, []);

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
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h1 className="font-display text-3xl font-semibold text-white">Blog</h1>
        <p className="mt-2 text-sm text-zinc-500">Markdown editor · SEO · drafts</p>
        <Button
          className="mt-6"
          onClick={() =>
            setEditing({ title: "", content: "", status: "draft", tags: [] })
          }
        >
          New post
        </Button>
        <ul className="mt-6 space-y-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="glass flex cursor-pointer items-center justify-between rounded-lg p-4"
              onClick={() => setEditing(post)}
            >
              <div>
                <p className="font-medium text-white">{post.title}</p>
                <p className="text-xs text-zinc-500">
                  {post.readingTime} min · {post.slug}
                </p>
              </div>
              <Badge variant={post.status === "published" ? "success" : "secondary"}>
                {post.status}
              </Badge>
            </li>
          ))}
        </ul>
      </div>

      {editing && (
        <div className="glass rounded-2xl p-6" data-color-mode="dark">
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                className="mt-2"
                value={editing.title ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value, slug: slugify(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>Excerpt</Label>
              <Textarea
                className="mt-2"
                value={editing.excerpt ?? ""}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
              />
            </div>
            <div>
              <Label>Status</Label>
              <select
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
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
              </select>
            </div>
            <div>
              <Label>Content</Label>
              <div className="mt-2">
                <MDEditor
                  value={editing.content ?? ""}
                  onChange={(v) => setEditing({ ...editing, content: v ?? "" })}
                  height={300}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={savePost}>Save</Button>
              <Button variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
