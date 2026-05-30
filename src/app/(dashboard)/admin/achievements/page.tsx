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
import { fallbackAchievements } from "@/lib/data/fallback";
import type { Achievement, ArchiveCategory } from "@/types";
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
import { Pencil, Plus, Trash2 } from "lucide-react";

const categories: ArchiveCategory[] = [
  "Project",
  "Learning",
  "Job",
  "Research",
  "Community",
  "Achievement",
];

const emptyAchievement: Omit<Achievement, "id"> = {
  title: "",
  description: "",
  year: new Date().getFullYear(),
  category: "Achievement",
  metrics: {},
  order: 0,
};

export default function AchievementsManagerPage() {
  const [items, setItems] = useState<Achievement[]>(fallbackAchievements);
  const [editing, setEditing] = useState<Partial<Achievement> | null>(null);

  useEffect(() => {
    if (!db) return;
    getDocs(query(collection(db, "achievements"), orderBy("order", "asc"))).then(
      (snap) => {
        if (!snap.empty) {
          setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Achievement)));
        }
      }
    );
  }, []);

  const save = async () => {
    if (!editing?.title) {
      toast.error("Title is required");
      return;
    }

    const payload = {
      title: editing.title,
      description: editing.description ?? "",
      year: editing.year ?? new Date().getFullYear(),
      category: (editing.category ?? "Achievement") as ArchiveCategory,
      metrics: editing.metrics ?? {},
      order: editing.order ?? items.length + 1,
    };

    if (db && editing.id) {
      await updateDoc(doc(db, "achievements", editing.id), payload);
      setItems((prev) =>
        prev.map((a) => (a.id === editing.id ? { ...a, ...payload, id: editing.id! } : a))
      );
    } else if (db) {
      const ref = await addDoc(collection(db, "achievements"), payload);
      setItems((prev) => [...prev, { id: ref.id, ...payload }]);
    } else {
      toast.info("Configure Firebase to persist changes");
    }

    setEditing(null);
    toast.success("Milestone saved");
  };

  const remove = async (id: string) => {
    if (db) await deleteDoc(doc(db, "achievements", id));
    setItems((prev) => prev.filter((a) => a.id !== id));
    toast.success("Deleted");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DashboardPageHeader
          label="CONTENT"
          title="Achievements"
          description="Archive milestones & metrics"
        />
        <Button onClick={() => setEditing({ ...emptyAchievement })}>
          <Plus className="mr-2 h-4 w-4" />
          New milestone
        </Button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((a) => (
          <div key={a.id} className="glass glow-border rounded-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{a.category}</Badge>
                  <span className="label-mono text-[10px] text-zinc-600">{a.year}</span>
                </div>
                <h3 className="mt-2 font-display text-lg text-cream">{a.title}</h3>
                <p className="mt-2 text-sm text-zinc-500 line-clamp-3">{a.description}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => setEditing(a)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(a.id)}>
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
        title={editing?.id ? "Edit milestone" : "New milestone"}
        description="Track wins, learning, and career highlights."
        footer={
          <DashboardFormActions
            onCancel={() => setEditing(null)}
            onSave={save}
            saveLabel={editing?.id ? "Update milestone" : "Add milestone"}
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
              <Label>Description</Label>
              <Textarea
                className="dashboard-field mt-2"
                rows={3}
                value={editing.description ?? ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Year</Label>
                <Input
                  className="dashboard-field mt-2"
                  type="number"
                  value={editing.year ?? new Date().getFullYear()}
                  onChange={(e) =>
                    setEditing({ ...editing, year: Number(e.target.value) })
                  }
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
            <div>
              <Label>Category</Label>
              <DashboardSelect
                value={editing.category ?? "Achievement"}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    category: e.target.value as ArchiveCategory,
                  })
                }
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </DashboardSelect>
            </div>
          </div>
        )}
      </DashboardModal>
    </div>
  );
}
