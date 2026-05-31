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
import { fallbackTechStack } from "@/lib/data/fallback";
import { simpleIconUrl } from "@/lib/data/tech-stack";
import type { TechStackItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  DashboardFormActions,
  DashboardModal,
} from "@/components/dashboard/dashboard-modal";
import { Pencil, Plus, Trash2 } from "lucide-react";

const emptyTech: Omit<TechStackItem, "id"> = {
  label: "",
  iconSlug: "",
  order: 0,
};

export default function TechStackManagerPage() {
  const [items, setItems] = useState<TechStackItem[]>(fallbackTechStack);
  const [editing, setEditing] = useState<Partial<TechStackItem> | null>(null);

  useEffect(() => {
    if (!db) return;
    getDocs(query(collection(db, "tech_stack"), orderBy("order", "asc"))).then(
      (snap) => {
        if (!snap.empty) {
          setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as TechStackItem)));
        }
      }
    );
  }, []);

  const save = async () => {
    if (!editing?.label?.trim()) {
      toast.error("Label is required");
      return;
    }

    const payload = {
      label: editing.label.trim().toUpperCase(),
      iconSlug: editing.iconSlug?.trim() || undefined,
      order: editing.order ?? items.length + 1,
    };

    if (db && editing.id) {
      await updateDoc(doc(db, "tech_stack", editing.id), payload);
      setItems((prev) =>
        prev.map((item) =>
          item.id === editing.id ? { ...item, ...payload, id: editing.id! } : item
        )
      );
    } else if (db) {
      const ref = await addDoc(collection(db, "tech_stack"), payload);
      setItems((prev) => [...prev, { id: ref.id, ...payload }]);
    } else {
      toast.info("Configure Firebase to persist changes");
    }

    setEditing(null);
    toast.success("Tech item saved");
  };

  const remove = async (id: string) => {
    if (db) await deleteDoc(doc(db, "tech_stack", id));
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Deleted");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DashboardPageHeader
          label="CONTENT"
          title="Tech stack"
          description="Marquee strip on the homepage - icons from simple-icons.org"
        />
        <Button onClick={() => setEditing({ ...emptyTech })}>
          <Plus className="mr-2 h-4 w-4" />
          New item
        </Button>
      </div>

      <ul className="mt-8 space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="glass glow-border flex items-center justify-between gap-4 rounded-xl px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              {item.iconSlug ? (
                <Image
                  src={simpleIconUrl(item.iconSlug)}
                  alt=""
                  width={20}
                  height={20}
                  className="shrink-0 invert"
                  unoptimized
                />
              ) : (
                <span className="label-mono text-[10px] text-zinc-600">NO ICON</span>
              )}
              <span className="font-display text-cream">{item.label}</span>
              {item.iconSlug && (
                <span className="label-mono truncate text-[10px] text-zinc-600">
                  {item.iconSlug}
                </span>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="label-mono text-[10px] text-zinc-600">#{item.order}</span>
              <Button variant="ghost" size="icon" onClick={() => setEditing(item)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => remove(item.id)}>
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <DashboardModal
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        title={editing?.id ? "Edit tech item" : "New tech item"}
        description="Use a simple-icons slug (e.g. react, nextdotjs) or leave blank for text only."
        footer={
          <DashboardFormActions
            onCancel={() => setEditing(null)}
            onSave={save}
            saveLabel={editing?.id ? "Update item" : "Add item"}
          />
        }
      >
        {editing && (
          <div className="space-y-4">
            <div>
              <Label>Label</Label>
              <Input
                className="dashboard-field mt-2"
                placeholder="REACT"
                value={editing.label ?? ""}
                onChange={(e) => setEditing({ ...editing, label: e.target.value })}
              />
            </div>
            <div>
              <Label>Icon slug</Label>
              <Input
                className="dashboard-field mt-2"
                placeholder="react"
                value={editing.iconSlug ?? ""}
                onChange={(e) => setEditing({ ...editing, iconSlug: e.target.value })}
              />
              <p className="mt-1 text-[11px] text-zinc-600">
                Browse slugs at simpleicons.org - leave empty for text-only items like RAG.
              </p>
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
        )}
      </DashboardModal>
    </div>
  );
}
