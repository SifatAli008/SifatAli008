"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { seedProfile } from "@/lib/data/seed-data";
import type { Profile } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { useDashboardAuth } from "@/lib/firebase/use-dashboard-auth";
import { useGitHubRepos } from "@/lib/github/use-github-repos";
import { toast } from "sonner";
import {
  User,
  Mail,
  Share2,
  BookOpen,
  BarChart3,
  Save,
  Loader2,
  Globe,
  CheckCircle2,
  CloudUpload,
} from "lucide-react";
import { DashboardImageUpload } from "@/components/dashboard/dashboard-image-upload";
import { CloudinarySyncPanel } from "@/components/dashboard/cloudinary-sync-panel";

function SettingsSection({
  label,
  title,
  description,
  children,
}: {
  label: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass glow-border overflow-visible rounded-xl p-5 md:p-6">
      <p className="label-mono text-[10px] text-accent">{label}</p>
      <h2 className="mt-1 font-display text-lg text-cream">{title}</h2>
      {description && <p className="mt-1 text-xs text-zinc-500">{description}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-zinc-300">{label}</Label>
      {hint && <p className="mt-0.5 text-[11px] text-zinc-600">{hint}</p>}
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { ready } = useDashboardAuth();
  const { profileUsername, stats: githubStats, fetchRepos } = useGitHubRepos();
  const [profile, setProfile] = useState<Profile>(seedProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!db || !ready) {
      setLoading(false);
      return;
    }
    getDoc(doc(db, "profile", "main"))
      .then((snap) => {
        if (snap.exists()) setProfile(snap.data() as Profile);
      })
      .finally(() => setLoading(false));
  }, [ready]);

  useEffect(() => {
    if (profileUsername) {
      void fetchRepos(profileUsername, false);
    }
  }, [profileUsername, fetchRepos]);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      if (db) {
        await setDoc(doc(db, "profile", "main"), profile, { merge: true });
        setSaved(true);
        toast.success("Profile saved to Firestore");
      } else {
        toast.info("Configure Firebase to persist settings");
      }
    } finally {
      setSaving(false);
    }
  };

  const updateSocial = (key: keyof Profile["socials"], value: string) => {
    setProfile({
      ...profile,
      socials: { ...profile.socials, [key]: value },
    });
    setSaved(false);
  };

  const updateStat = (key: keyof Profile["stats"], value: number) => {
    setProfile({
      ...profile,
      stats: { ...profile.stats, [key]: value },
    });
    setSaved(false);
  };

  const updateLeetcodeStat = (key: keyof Profile["stats"]["leetcode"], value: number) => {
    setProfile({
      ...profile,
      stats: {
        ...profile.stats,
        leetcode: { ...profile.stats.leetcode, [key]: value },
      },
    });
    setSaved(false);
  };

  const patch = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setProfile({ ...profile, [key]: value });
    setSaved(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
        <Loader2 className="mr-2 h-4 w-4 animate-spin text-accent" />
        Loading profile…
      </div>
    );
  }

  return (
    <div className="pb-20 sm:pb-8">
      <DashboardPageHeader
        label="PROFILE"
        title="Settings"
        description="Manage your public site identity, contact info, social links, and stats."
        action={
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="hidden items-center gap-2 border-2 border-accent bg-accent px-4 py-2.5 text-sm font-semibold uppercase tracking-wider text-cream transition-opacity hover:brightness-110 disabled:opacity-50 sm:inline-flex"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving…" : "Save profile"}
          </button>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-start">
        <div className="min-w-0">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 border-2 border-white/10 bg-white/[0.03] p-1">
              <TabsTrigger
                value="profile"
                className="gap-1.5 border-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-accent/10 data-[state=active]:text-cream"
              >
                <User className="h-3.5 w-3.5" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className="gap-1.5 border-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-accent/10 data-[state=active]:text-cream"
              >
                <Mail className="h-3.5 w-3.5" />
                Contact
              </TabsTrigger>
              <TabsTrigger
                value="social"
                className="gap-1.5 border-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-accent/10 data-[state=active]:text-cream"
              >
                <Share2 className="h-3.5 w-3.5" />
                Social
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="gap-1.5 border-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-accent/10 data-[state=active]:text-cream"
              >
                <BookOpen className="h-3.5 w-3.5" />
                About
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="gap-1.5 border-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-accent/10 data-[state=active]:text-cream"
              >
                <BarChart3 className="h-3.5 w-3.5" />
                Stats
              </TabsTrigger>
              <TabsTrigger
                value="media"
                className="gap-1.5 border-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-accent/10 data-[state=active]:text-cream"
              >
                <CloudUpload className="h-3.5 w-3.5" />
                Media
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6 space-y-6 focus-visible:outline-none">
              <SettingsSection
                label="IDENTITY"
                title="Public profile"
                description="Shown in the hero and site metadata."
              >
                <Field label="Full name">
                  <Input
                    className="dashboard-field mt-2"
                    value={profile.name}
                    onChange={(e) => patch("name", e.target.value)}
                  />
                </Field>
                <Field label="Tagline" hint="Short role line under your name">
                  <Input
                    className="dashboard-field mt-2"
                    value={profile.tagline}
                    onChange={(e) => patch("tagline", e.target.value)}
                  />
                </Field>
                <Field label="Headline">
                  <Input
                    className="dashboard-field mt-2"
                    value={profile.headline}
                    onChange={(e) => patch("headline", e.target.value)}
                  />
                </Field>
                <Field label="Bio" hint="Short summary for cards and SEO">
                  <Textarea
                    className="dashboard-field mt-2"
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => patch("bio", e.target.value)}
                  />
                </Field>
                <DashboardImageUpload
                  label="Avatar"
                  hint="Upload to Cloudinary or paste a URL - shown in hero and featured cards."
                  folder="sifat-ali/avatars"
                  value={profile.avatar ?? ""}
                  onChange={(url) => patch("avatar", url)}
                  previewClassName="relative aspect-square h-32 w-32"
                />
                <Field label="Typewriter roles" hint="One role per line - hero animation">
                  <Textarea
                    className="dashboard-field mt-2"
                    rows={4}
                    value={profile.typewriterRoles.join("\n")}
                    onChange={(e) =>
                      patch(
                        "typewriterRoles",
                        e.target.value.split("\n").filter(Boolean)
                      )
                    }
                  />
                </Field>
                <Field label="Focus domains" hint="Comma separated - e.g. EdTech, SaaS">
                  <Input
                    className="dashboard-field mt-2"
                    value={(profile.domains ?? []).join(", ")}
                    onChange={(e) =>
                      patch(
                        "domains",
                        e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                      )
                    }
                  />
                </Field>
              </SettingsSection>
            </TabsContent>

            <TabsContent value="contact" className="mt-6 space-y-6 focus-visible:outline-none">
              <SettingsSection
                label="CONTACT"
                title="Reach you"
                description="Used on the contact page and footer."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Email">
                    <Input
                      className="dashboard-field mt-2"
                      type="email"
                      value={profile.email}
                      onChange={(e) => patch("email", e.target.value)}
                    />
                  </Field>
                  <Field label="Phone">
                    <Input
                      className="dashboard-field mt-2"
                      value={profile.phone ?? ""}
                      onChange={(e) => patch("phone", e.target.value)}
                    />
                  </Field>
                </div>
                <Field label="Address">
                  <Input
                    className="dashboard-field mt-2"
                    value={profile.address ?? ""}
                    onChange={(e) => patch("address", e.target.value)}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Location">
                    <Input
                      className="dashboard-field mt-2"
                      value={profile.location}
                      onChange={(e) => patch("location", e.target.value)}
                    />
                  </Field>
                  <Field label="Timezone">
                    <Input
                      className="dashboard-field mt-2"
                      value={profile.timezone}
                      onChange={(e) => patch("timezone", e.target.value)}
                    />
                  </Field>
                </div>
                <Field label="Education">
                  <Input
                    className="dashboard-field mt-2"
                    value={profile.education ?? ""}
                    onChange={(e) => patch("education", e.target.value)}
                  />
                </Field>
                <Field label="Response time">
                  <Input
                    className="dashboard-field mt-2"
                    value={profile.responseTime}
                    onChange={(e) => patch("responseTime", e.target.value)}
                  />
                </Field>
                <label className="flex cursor-pointer items-center gap-3 border-2 border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-accent/40">
                  <input
                    type="checkbox"
                    checked={profile.availableForWork}
                    onChange={(e) => patch("availableForWork", e.target.checked)}
                    className="accent-accent"
                  />
                  <div>
                    <p className="text-sm font-medium text-cream">Available for work</p>
                    <p className="text-xs text-zinc-500">Shows hiring badge on the live site</p>
                  </div>
                </label>
              </SettingsSection>
            </TabsContent>

            <TabsContent value="social" className="mt-6 space-y-6 focus-visible:outline-none">
              <SettingsSection
                label="LINKS"
                title="Social & resume"
                description="Profile links across the site."
              >
                {(
                  [
                    ["github", "GitHub"],
                    ["linkedin", "LinkedIn"],
                    ["twitter", "Twitter / X"],
                    ["medium", "Medium"],
                    ["leetcode", "LeetCode"],
                    ["behance", "Behance"],
                  ] as const
                ).map(([key, label]) => (
                  <Field key={key} label={label}>
                    <Input
                      className="dashboard-field mt-2 font-mono text-xs"
                      placeholder={`https://${key}.com/…`}
                      value={profile.socials[key] ?? ""}
                      onChange={(e) => updateSocial(key, e.target.value)}
                    />
                  </Field>
                ))}
                <Field label="Resume URL">
                  <Input
                    className="dashboard-field mt-2 font-mono text-xs"
                    value={profile.resumeUrl ?? ""}
                    onChange={(e) => patch("resumeUrl", e.target.value)}
                  />
                </Field>
              </SettingsSection>
            </TabsContent>

            <TabsContent value="about" className="mt-6 space-y-6 focus-visible:outline-none">
              <SettingsSection
                label="STORY"
                title="About page content"
                description="Long-form copy for the about section."
              >
                <Field label="About story">
                  <Textarea
                    className="dashboard-field mt-2"
                    rows={8}
                    value={profile.aboutStory}
                    onChange={(e) => patch("aboutStory", e.target.value)}
                  />
                </Field>
                <Field label="Engineering philosophy">
                  <Textarea
                    className="dashboard-field mt-2"
                    rows={3}
                    value={profile.engineeringPhilosophy}
                    onChange={(e) => patch("engineeringPhilosophy", e.target.value)}
                  />
                </Field>
                <Field label="Core values" hint="One value per line">
                  <Textarea
                    className="dashboard-field mt-2"
                    rows={5}
                    value={profile.values.join("\n")}
                    onChange={(e) =>
                      patch("values", e.target.value.split("\n").filter(Boolean))
                    }
                  />
                </Field>
              </SettingsSection>
            </TabsContent>

            <TabsContent value="stats" className="mt-6 space-y-6 focus-visible:outline-none">
              <SettingsSection
                label="METRICS"
                title="Public stats"
                description="Numbers shown on the homepage and about page. Projects built is synced from GitHub on the live site."
              >
                <Field
                  label="Projects built"
                  hint="Read-only - auto-synced from your GitHub repo count on the public site."
                >
                  <Input
                    className="dashboard-field mt-2 cursor-not-allowed opacity-70"
                    type="number"
                    readOnly
                    value={githubStats.repos || profile.stats.projectsBuilt}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      ["studentsMentored", "Students mentored"],
                      ["eventsOrganized", "Events organized"],
                      ["yearsExperience", "Years experience"],
                      ["hackathonWins", "Hackathon wins"],
                      ["bootcampsLed", "Bootcamps led"],
                      ["clientsServed", "Clients served"],
                    ] as const
                  ).map(([key, label]) => (
                    <Field key={key} label={label}>
                      <Input
                        className="dashboard-field mt-2"
                        type="number"
                        min={0}
                        value={profile.stats[key]}
                        onChange={(e) => updateStat(key, Number(e.target.value))}
                      />
                    </Field>
                  ))}
                </div>
              </SettingsSection>

              <SettingsSection label="LEETCODE" title="LeetCode stats">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {(
                    [
                      ["solved", "Total solved"],
                      ["easy", "Easy"],
                      ["medium", "Medium"],
                      ["hard", "Hard"],
                    ] as const
                  ).map(([key, label]) => (
                    <Field key={key} label={label}>
                      <Input
                        className="dashboard-field mt-2"
                        type="number"
                        min={0}
                        value={profile.stats.leetcode[key]}
                        onChange={(e) => updateLeetcodeStat(key, Number(e.target.value))}
                      />
                    </Field>
                  ))}
                </div>
              </SettingsSection>
            </TabsContent>

            <TabsContent value="media" className="mt-6 space-y-6 focus-visible:outline-none">
              <CloudinarySyncPanel />
            </TabsContent>
          </Tabs>
        </div>

        <aside className="min-w-0 space-y-4 xl:sticky xl:top-6 xl:self-start">
          <div className="glass-strong rounded-xl p-5">
            <p className="label-mono text-[10px] text-accent">PREVIEW</p>
            <div className="mt-4 border-2 border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-accent/40 bg-accent/10 text-lg font-bold text-accent">
                  {profile.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-lg text-cream">{profile.name}</p>
                  <p className="truncate text-xs text-zinc-500">{profile.tagline}</p>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-zinc-400">
                {profile.bio}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.availableForWork && (
                  <span className="label-mono border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] text-emerald-400">
                    OPEN TO WORK
                  </span>
                )}
                <span className="label-mono border border-white/10 px-2 py-0.5 text-[9px] text-zinc-500">
                  {profile.location}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs text-zinc-500">
              <p className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-accent" />
                {profile.email}
              </p>
              {profile.socials.github && (
                <p className="flex items-center gap-2 truncate">
                  <Globe className="h-3 w-3 text-accent" />
                  GitHub linked
                </p>
              )}
            </div>

            {saved && (
              <p className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Saved to Firestore
              </p>
            )}
          </div>
        </aside>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t-2 border-white/10 bg-background/95 px-6 py-3 backdrop-blur-md sm:hidden">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 border-2 border-accent bg-accent py-3 text-sm font-semibold uppercase tracking-wider text-cream disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : "Save profile"}
        </button>
      </div>
    </div>
  );
}
