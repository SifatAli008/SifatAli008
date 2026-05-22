"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { fallbackSkills } from "@/lib/data/fallback";
import type { Skill } from "@/types";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function SkillsManagerPage() {
  const [skills, setSkills] = useState<Skill[]>(fallbackSkills);

  useEffect(() => {
    if (!db) return;
    getDocs(collection(db, "skills")).then((snap) => {
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
      toast.success("Updated");
    }
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
      <h1 className="font-display text-3xl font-semibold text-white">Skills</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Category grouping · proficiency sliders · inline edit
      </p>
      <div className="mt-10 space-y-10">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-sm font-medium uppercase tracking-wider text-accent-indigo">
              {category}
            </h2>
            <div className="mt-4 space-y-4">
              {items.map((skill) => (
                <div key={skill.id} className="glass flex items-center gap-4 rounded-xl p-4">
                  <Input
                    defaultValue={skill.name}
                    className="max-w-[200px]"
                    onBlur={async (e) => {
                      if (db) {
                        await updateDoc(doc(db, "skills", skill.id), {
                          name: e.target.value,
                        });
                      }
                    }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={skill.proficiency}
                    className="flex-1"
                    onChange={(e) =>
                      updateProficiency(skill, Number(e.target.value))
                    }
                  />
                  <span className="w-12 text-right text-sm text-zinc-400">
                    {skill.proficiency}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
