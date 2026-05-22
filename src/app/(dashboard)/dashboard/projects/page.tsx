"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { fallbackProjects } from "@/lib/data/fallback";
import { slugify } from "@/lib/utils";
import type { Project } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, Star, Trash2, ExternalLink } from "lucide-react";

export default function ProjectsManagerPage() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!db) return;
    getDocs(collection(db, "projects")).then((snap) => {
      if (!snap.empty) {
        setProjects(
          snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project))
        );
      }
    });
  }, []);

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.includes(search.toLowerCase())
  );

  const toggleFeatured = async (project: Project) => {
    const next = !project.featured;
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, featured: next } : p))
    );
    if (db) {
      await updateDoc(doc(db, "projects", project.id), { featured: next });
    }
    toast.success(next ? "Marked featured" : "Unfeatured");
  };

  const bulkDelete = async () => {
    if (!db || selected.size === 0) return;
    for (const id of Array.from(selected)) {
      await deleteDoc(doc(db, "projects", id));
    }
    setProjects((prev) => prev.filter((p) => !selected.has(p.id)));
    setSelected(new Set());
    toast.success("Deleted selected projects");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-white">
            Projects
          </h1>
          <p className="text-sm text-zinc-500">
            Search, filter, feature, and manage case studies
          </p>
        </div>
        <div className="flex gap-2">
          {selected.size > 0 && (
            <Button variant="outline" size="sm" onClick={bulkDelete}>
              <Trash2 className="h-4 w-4" />
              Delete ({selected.size})
            </Button>
          )}
        </div>
      </div>

      <div className="relative mt-8 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          placeholder="Search projects…"
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5">
            <tr>
              <th className="p-4">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelected(new Set(filtered.map((p) => p.id)));
                    } else setSelected(new Set());
                  }}
                />
              </th>
              <th className="p-4 text-zinc-400">Title</th>
              <th className="p-4 text-zinc-400">Slug</th>
              <th className="p-4 text-zinc-400">Status</th>
              <th className="p-4 text-zinc-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((project) => (
              <tr
                key={project.id}
                className="border-b border-white/5 hover:bg-white/[0.02]"
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selected.has(project.id)}
                    onChange={(e) => {
                      const next = new Set(selected);
                      if (e.target.checked) next.add(project.id);
                      else next.delete(project.id);
                      setSelected(next);
                    }}
                  />
                </td>
                <td className="p-4">
                  <p className="font-medium text-white">{project.title}</p>
                  <Badge variant="secondary" className="mt-1">
                    {project.category}
                  </Badge>
                </td>
                <td className="p-4 font-mono text-xs text-zinc-500">
                  {project.slug || slugify(project.title)}
                </td>
                <td className="p-4 capitalize text-zinc-400">
                  {project.status}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFeatured(project)}
                    >
                      <Star
                        className={
                          project.featured
                            ? "fill-amber-400 text-amber-400"
                            : "text-zinc-500"
                        }
                      />
                    </Button>
                    <Button asChild variant="ghost" size="icon">
                      <Link
                        href={`/projects/${project.slug}`}
                        target="_blank"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!db && (
        <p className="mt-4 text-xs text-amber-500/80">
          Firebase not configured — showing seed data. Run npm run seed after
          setting env vars.
        </p>
      )}
    </div>
  );
}
