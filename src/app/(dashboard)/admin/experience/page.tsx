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
import { fallbackExperience } from "@/lib/data/fallback";
import type { Experience } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  DashboardFormActions,
  DashboardModal,
} from "@/components/dashboard/dashboard-modal";
import { Pencil, Plus, Trash2 } from "lucide-react";

const emptyExperience: Omit<Experience, "id"> = {
  company: "",
  role: "",
  duration: "",
  location: "",
  description: "",
  impact: [],
  stack: [],
  order: 0,
};

export default function ExperienceManagerPage() {
  const [items, setItems] = useState<Experience[]>(fallbackExperience);
  const [editing, setEditing] = useState<Partial<Experience> | null>(null);

  useEffect(() => {
    if (!db) return;
    getDocs(query(collection(db, "experiences"), orderBy("order", "asc"))).then(
      (snap) => {
        if (!snap.empty) {
          setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Experience)));
        }
      }
    );
  }, []);

  const save = async () => {
    if (!editing?.company || !editing.role) {
      toast.error("Company and role are required");
      return;
    }

    const payload = {
      company: editing.company,
      role: editing.role,
      duration: editing.duration ?? "",
      location: editing.location ?? "",
      description: editing.description ?? "",
      impact: editing.impact ?? [],
      stack: editing.stack ?? [],
      order: editing.order ?? items.length + 1,
    };

    if (db && editing.id) {
      await updateDoc(doc(db, "experiences", editing.id), payload);
      setItems((prev) =>
        prev.map((e) => (e.id === editing.id ? { ...e, ...payload, id: editing.id! } : e))
      );
    } else if (db) {
      const ref = await addDoc(collection(db, "experiences"), payload);
      setItems((prev) => [...prev, { id: ref.id, ...payload }]);
    } else {
      toast.info("Configure Firebase to persist changes");
    }

    setEditing(null);
    toast.success("Experience saved");
  };

  const remove = async (id: string) => {
    if (db) await deleteDoc(doc(db, "experiences", id));
    setItems((prev) => prev.filter((e) => e.id !== id));
    toast.success("Deleted");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DashboardPageHeader
          label="CONTENT"
          title="Experience"
          description="Work history shown on the public site"
        />
        <Button onClick={() => setEditing({ ...emptyExperience })}>
          <Plus className="mr-2 h-4 w-4" />
          New role
        </Button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((exp) => (
          <div key={exp.id} className="glass glow-border rounded-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="label-mono text-[10px] text-accent">{exp.duration}</p>
                <h3 className="mt-1 font-display text-lg text-cream">{exp.role}</h3>
                <p className="text-sm text-zinc-500">{exp.company}</p>
                {exp.location && (
                  <p className="mt-1 text-xs text-zinc-600">{exp.location}</p>
                )}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => setEditing(exp)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(exp.id)}>
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            </div>
            <ul className="mt-4 space-y-1 text-sm text-zinc-400">
              {exp.impact.slice(0, 2).map((i) => (
                <li key={i}>· {i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <DashboardModal
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        title={editing?.id ? "Edit role" : "New role"}
        description="Add or update a position in your work history."
        footer={
          <DashboardFormActions
            onCancel={() => setEditing(null)}
            onSave={save}
            saveLabel={editing?.id ? "Update role" : "Add role"}
          />
        }
      >
        {editing && (
          <div className="space-y-4">
            <div>
              <Label>Role</Label>
              <Input
                className="dashboard-field mt-2"
                value={editing.role ?? ""}
                onChange={(e) => setEditing({ ...editing, role: e.target.value })}
              />
            </div>
            <div>
              <Label>Company</Label>
              <Input
                className="dashboard-field mt-2"
                value={editing.company ?? ""}
                onChange={(e) => setEditing({ ...editing, company: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Duration</Label>
                <Input
                  className="dashboard-field mt-2"
                  placeholder="2024 - Present"
                  value={editing.duration ?? ""}
                  onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
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
              <Label>Location</Label>
              <Input
                className="dashboard-field mt-2"
                value={editing.location ?? ""}
                onChange={(e) => setEditing({ ...editing, location: e.target.value })}
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
            <div>
              <Label>Impact (one per line)</Label>
              <Textarea
                className="dashboard-field mt-2"
                rows={4}
                value={(editing.impact ?? []).join("\n")}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    impact: e.target.value.split("\n").filter(Boolean),
                  })
                }
              />
            </div>
            <div>
              <Label>Stack (comma separated)</Label>
              <Input
                className="dashboard-field mt-2"
                value={(editing.stack ?? []).join(", ")}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    stack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
              />
            </div>
          </div>
        )}
      </DashboardModal>
    </div>
  );
}
