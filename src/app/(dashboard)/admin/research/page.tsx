"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import {
  fallbackResearchPapers,
  fallbackResearchSettings,
} from "@/lib/data/fallback";
import type { ResearchPaper, ResearchSectionSettings, ResearchSectionStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  DashboardFormActions,
  DashboardModal,
  DashboardSelect,
} from "@/components/dashboard/dashboard-modal";
import { ExternalLink, Pencil, Plus, Save, Trash2 } from "lucide-react";

const emptyPaper: Omit<ResearchPaper, "id"> = {
  title: "",
  authors: "",
  venue: "",
  year: new Date().getFullYear(),
  abstract: "",
  order: 0,
};

export default function ResearchManagerPage() {
  const [settings, setSettings] = useState<ResearchSectionSettings>(
    fallbackResearchSettings
  );
  const [papers, setPapers] = useState<ResearchPaper[]>(fallbackResearchPapers);
  const [editing, setEditing] = useState<Partial<ResearchPaper> | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    if (!db) return;

    getDoc(doc(db, "research_settings", "main")).then((snap) => {
      if (snap.exists()) setSettings(snap.data() as ResearchSectionSettings);
    });

    getDocs(query(collection(db, "research_papers"), orderBy("order", "asc"))).then(
      (snap) => {
        if (!snap.empty) {
          setPapers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ResearchPaper)));
        }
      }
    );
  }, []);

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      if (db) {
        await setDoc(doc(db, "research_settings", "main"), settings, { merge: true });
        toast.success("Research section settings saved");
      } else {
        toast.info("Configure Firebase to persist changes");
      }
    } finally {
      setSavingSettings(false);
    }
  };

  const savePaper = async () => {
    if (!editing?.title?.trim()) {
      toast.error("Title is required");
      return;
    }

    const payload = {
      title: editing.title.trim(),
      authors: editing.authors ?? "",
      venue: editing.venue ?? "",
      year: editing.year ?? new Date().getFullYear(),
      abstract: editing.abstract ?? "",
      href: editing.href || undefined,
      pdfUrl: editing.pdfUrl || undefined,
      order: editing.order ?? papers.length + 1,
    };

    if (db && editing.id) {
      await updateDoc(doc(db, "research_papers", editing.id), payload);
      setPapers((prev) =>
        prev.map((paper) =>
          paper.id === editing.id ? { ...paper, ...payload, id: editing.id! } : paper
        )
      );
    } else if (db) {
      const ref = await addDoc(collection(db, "research_papers"), payload);
      setPapers((prev) => [...prev, { id: ref.id, ...payload }]);
    } else {
      toast.info("Configure Firebase to persist changes");
    }

    setEditing(null);
    toast.success("Paper saved");
  };

  const removePaper = async (id: string) => {
    if (db) await deleteDoc(doc(db, "research_papers", id));
    setPapers((prev) => prev.filter((paper) => paper.id !== id));
    toast.success("Deleted");
  };

  return (
    <div>
      <DashboardPageHeader
        label="CONTENT"
        title="Research"
        description="Academic section on the homepage - coming soon or published papers"
      />

      <Tabs defaultValue="settings" className="mt-8">
        <TabsList className="border-2 border-white/10 bg-white/[0.03]">
          <TabsTrigger value="settings">Section settings</TabsTrigger>
          <TabsTrigger value="papers">Papers ({papers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="mt-6 space-y-6 focus-visible:outline-none">
          <section className="glass glow-border rounded-xl p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="label-mono text-accent">SECTION</p>
                <h2 className="mt-1 font-display text-lg text-cream">Homepage research block</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Set status to published when you have papers to show. Otherwise visitors see
                  the coming-soon state with your custom copy.
                </p>
              </div>
              <Button onClick={saveSettings} disabled={savingSettings}>
                <Save className="mr-2 h-4 w-4" />
                {savingSettings ? "Saving…" : "Save settings"}
              </Button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Status</Label>
                <DashboardSelect
                  className="mt-2"
                  value={settings.status}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      status: e.target.value as ResearchSectionStatus,
                    })
                  }
                >
                  <option value="coming_soon">Coming soon</option>
                  <option value="published">Published (show papers)</option>
                </DashboardSelect>
              </div>
              <div>
                <Label>Status badge</Label>
                <Input
                  className="dashboard-field mt-2"
                  value={settings.statusBadge}
                  onChange={(e) =>
                    setSettings({ ...settings, statusBadge: e.target.value })
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Section label</Label>
                <Input
                  className="dashboard-field mt-2"
                  value={settings.sectionLabel}
                  onChange={(e) =>
                    setSettings({ ...settings, sectionLabel: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Headline</Label>
                <Input
                  className="dashboard-field mt-2"
                  value={settings.headline}
                  onChange={(e) =>
                    setSettings({ ...settings, headline: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea
                  className="dashboard-field mt-2"
                  rows={3}
                  value={settings.message}
                  onChange={(e) =>
                    setSettings({ ...settings, message: e.target.value })
                  }
                />
              </div>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="papers" className="mt-6 focus-visible:outline-none">
          <div className="mb-4 flex justify-end">
            <Button onClick={() => setEditing({ ...emptyPaper })}>
              <Plus className="mr-2 h-4 w-4" />
              New paper
            </Button>
          </div>

          {papers.length === 0 ? (
            <div className="dashboard-empty text-sm text-zinc-500">
              No papers yet - add entries here, then set section status to published.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {papers.map((paper) => (
                <div key={paper.id} className="glass glow-border rounded-xl p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{paper.year}</Badge>
                        <span className="label-mono text-[10px] text-zinc-600">
                          {paper.venue}
                        </span>
                      </div>
                      <h3 className="mt-2 font-display text-lg text-cream">{paper.title}</h3>
                      <p className="mt-1 text-xs text-zinc-500">{paper.authors}</p>
                      <p className="mt-2 text-sm text-zinc-500 line-clamp-3">{paper.abstract}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setEditing(paper)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removePaper(paper.id)}>
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <DashboardModal
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        title={editing?.id ? "Edit paper" : "New paper"}
        description="Shown when section status is published."
        footer={
          <DashboardFormActions
            onCancel={() => setEditing(null)}
            onSave={savePaper}
            saveLabel={editing?.id ? "Update paper" : "Add paper"}
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Authors</Label>
                <Input
                  className="dashboard-field mt-2"
                  value={editing.authors ?? ""}
                  onChange={(e) => setEditing({ ...editing, authors: e.target.value })}
                />
              </div>
              <div>
                <Label>Venue</Label>
                <Input
                  className="dashboard-field mt-2"
                  placeholder="IEEE, arXiv, UIU…"
                  value={editing.venue ?? ""}
                  onChange={(e) => setEditing({ ...editing, venue: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Abstract</Label>
              <Textarea
                className="dashboard-field mt-2"
                rows={4}
                value={editing.abstract ?? ""}
                onChange={(e) => setEditing({ ...editing, abstract: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
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
                <Label>Link URL</Label>
                <Input
                  className="dashboard-field mt-2"
                  value={editing.href ?? ""}
                  onChange={(e) => setEditing({ ...editing, href: e.target.value })}
                />
              </div>
              <div>
                <Label>PDF URL</Label>
                <Input
                  className="dashboard-field mt-2"
                  value={editing.pdfUrl ?? ""}
                  onChange={(e) => setEditing({ ...editing, pdfUrl: e.target.value })}
                />
              </div>
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
            {(editing.href || editing.pdfUrl) && (
              <div className="flex flex-wrap gap-3">
                {editing.href && (
                  <a
                    href={editing.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label-mono inline-flex items-center gap-1 text-[10px] text-accent"
                  >
                    Preview link <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </DashboardModal>
    </div>
  );
}
