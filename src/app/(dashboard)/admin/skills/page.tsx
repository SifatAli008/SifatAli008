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
import { fallbackSkills } from "@/lib/data/fallback";
import type { Skill, SkillCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  DashboardFormActions,
  DashboardModal,
  DashboardSelect,
} from "@/components/dashboard/dashboard-modal";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

const categories: SkillCategory[] = [
  "Frontend",
  "Backend",
  "AI & Data",
  "Tools",
  "Games",
  "CMS",
];

const emptySkill: Omit<Skill, "id"> = {
  name: "",
  category: "Frontend",
  icon: "code",
  proficiency: 80,
  order: 0,
};

export default function SkillsManagerPage() {
  const [skills, setSkills] = useState<Skill[]>(fallbackSkills);
  const [editing, setEditing] = useState<Partial<Skill> | null>(null);

  useEffect(() => {
    if (!db) return;
    getDocs(query(collection(db, "skills"), orderBy("order", "asc"))).then((snap) => {
      if (!snap.empty) {
        setSkills(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Skill)));
      }
    });
  }, []);

  const updateProficiency = async (skill: Skill, value: number) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === skill.id ? { ...s, proficiency: value } : s))
    );
    if (db) {
      await updateDoc(doc(db, "skills", skill.id), { proficiency: value });
    }
  };

  const save = async () => {
    if (!editing?.name?.trim()) {
      toast.error("Skill name is required");
      return;
    }

    const payload = {
      name: editing.name.trim(),
      category: (editing.category ?? "Frontend") as SkillCategory,
      icon: editing.icon ?? "code",
      proficiency: editing.proficiency ?? 80,
      order: editing.order ?? skills.length + 1,
    };

    if (db && editing.id) {
      await updateDoc(doc(db, "skills", editing.id), payload);
      setSkills((prev) =>
        prev.map((s) => (s.id === editing.id ? { ...s, ...payload, id: editing.id! } : s))
      );
    } else if (db) {
      const ref = await addDoc(collection(db, "skills"), payload);
      setSkills((prev) => [...prev, { id: ref.id, ...payload }]);
    } else {
      toast.info("Configure Firebase to persist changes");
    }

    setEditing(null);
    toast.success("Skill saved");
  };

  const remove = async (id: string) => {
    if (db) await deleteDoc(doc(db, "skills", id));
    setSkills((prev) => prev.filter((s) => s.id !== id));
    toast.success("Deleted");
  };

  const grouped = skills.reduce(
    (acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DashboardPageHeader
          label="CONTENT"
          title="Skills"
          description="Category grouping · proficiency sliders · add or edit skills"
        />
        <Button onClick={() => setEditing({ ...emptySkill })}>
          <Plus className="mr-2 h-4 w-4" />
          New skill
        </Button>
      </div>

      <div className="mt-10 space-y-10">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h2 className="label-mono text-accent">{category}</h2>
            <div className="mt-4 space-y-3">
              {items.map((skill) => (
                <div
                  key={skill.id}
                  className="glass glow-border flex flex-wrap items-center gap-4 rounded-xl p-4"
                >
                  <div className="min-w-[140px] flex-1">
                    <p className="font-medium text-cream">{skill.name}</p>
                    <p className="text-xs text-zinc-600">{skill.proficiency}% proficiency</p>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={skill.proficiency}
                    className="h-2 min-w-[120px] flex-1 cursor-pointer accent-accent"
                    onChange={(e) =>
                      updateProficiency(skill, Number(e.target.value))
                    }
                  />
                  <span className="w-10 text-right text-sm text-zinc-400">
                    {skill.proficiency}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditing(skill)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(skill.id)}>
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <DashboardModal
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        title={editing?.id ? "Edit skill" : "New skill"}
        description="Skills appear on your public profile and project pages."
        size="md"
        footer={
          <DashboardFormActions
            onCancel={() => setEditing(null)}
            onSave={save}
            saveLabel={editing?.id ? "Update skill" : "Add skill"}
          />
        }
      >
        {editing && (
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                className="dashboard-field mt-2"
                value={editing.name ?? ""}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Category</Label>
              <DashboardSelect
                value={editing.category ?? "Frontend"}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    category: e.target.value as SkillCategory,
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Proficiency</Label>
                <Input
                  className="dashboard-field mt-2"
                  type="number"
                  min={0}
                  max={100}
                  value={editing.proficiency ?? 80}
                  onChange={(e) =>
                    setEditing({ ...editing, proficiency: Number(e.target.value) })
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
              <Label>Icon slug</Label>
              <Input
                className="dashboard-field mt-2 font-mono text-xs"
                placeholder="react, python, firebase…"
                value={editing.icon ?? ""}
                onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
              />
            </div>
          </div>
        )}
      </DashboardModal>
    </div>
  );
}
