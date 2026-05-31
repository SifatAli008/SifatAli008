"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { getFirestoreErrorMessage, isFirestorePermissionError } from "@/lib/firebase/errors";
import { useDashboardAuth } from "@/lib/firebase/use-dashboard-auth";
import { useAuth } from "@/lib/auth/context";
import { fallbackBlogPosts, fallbackSkills } from "@/lib/data/fallback";
import { SITE_SYNC_MAP } from "@/lib/portfolio-sync";
import type { BlogPost, ContactSubmission } from "@/types";
import { useGitHubRepos } from "@/lib/github/use-github-repos";
import {
  FolderKanban,
  FileText,
  Mail,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Briefcase,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import {
  DashboardPageHeader,
  DashboardQuickLink,
} from "@/components/dashboard/page-header";
import { DashboardBarChart } from "@/components/dashboard/charts/dashboard-bar-chart";
import { DashboardDonutChart } from "@/components/dashboard/charts/dashboard-donut-chart";
import { DashboardLineChart } from "@/components/dashboard/charts/dashboard-line-chart";
import {
  DashboardChartPanel,
  DashboardProgressPanel,
} from "@/components/dashboard/charts/dashboard-chart-panel";

const MONTHS = 6;

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [y, m] = key.split("-");
  return new Date(Number(y), Number(m) - 1).toLocaleString("en", { month: "short" });
}

function buildMonthBuckets() {
  const buckets: string[] = [];
  const now = new Date();
  for (let i = MONTHS - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push(monthKey(d));
  }
  return buckets;
}

export default function DashboardOverviewPage() {
  const { ready } = useDashboardAuth();
  const { user } = useAuth();
  const {
    profileUsername,
    activeUsername,
    stats: githubStats,
    topRepos,
    loading: githubLoading,
    error: githubError,
    fetchRepos,
  } = useGitHubRepos();
  const [permError, setPermError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    posts: fallbackBlogPosts.length,
    contacts: 0,
    skills: fallbackSkills.length,
    experience: 0,
    achievements: 0,
    unread: 0,
  });
  const [blogStats, setBlogStats] = useState({ published: 0, draft: 0 });
  const [contactTrend, setContactTrend] = useState<{ label: string; value: number }[]>([]);
  const [recentContacts, setRecentContacts] = useState<ContactSubmission[]>([]);
  const [topSkills, setTopSkills] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    if (profileUsername) {
      void fetchRepos(profileUsername, false);
    }
  }, [profileUsername, fetchRepos]);

  useEffect(() => {
    if (!db || !ready) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const [b, c, s, exp, ach] = await Promise.all([
          getDocs(collection(db, "blog_posts")),
          getDocs(collection(db, "contacts")),
          getDocs(collection(db, "skills")),
          getDocs(collection(db, "experiences")),
          getDocs(collection(db, "achievements")),
        ]);

        const posts = b.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost));
        const contacts = c.docs.map((d) => ({ id: d.id, ...d.data() } as ContactSubmission));
        const skills = s.docs.map((d) => d.data() as { name: string; proficiency: number; category: string });

        const published = posts.filter((post) => post.status === "published").length;
        const draft = posts.filter((post) => post.status === "draft").length;

        const buckets = buildMonthBuckets();
        const trendMap = Object.fromEntries(buckets.map((k) => [k, 0]));
        contacts.forEach((contact) => {
          const key = monthKey(new Date(contact.createdAt));
          if (key in trendMap) trendMap[key] += 1;
        });

        setCounts((prev) => ({
          ...prev,
          posts: posts.length || fallbackBlogPosts.length,
          contacts: contacts.length,
          skills: s.size || fallbackSkills.length,
          experience: exp.size,
          achievements: ach.size,
          unread: contacts.filter((x) => !x.read).length,
        }));
        setBlogStats({
          published: published || fallbackBlogPosts.filter((x) => x.status === "published").length,
          draft: draft || fallbackBlogPosts.filter((x) => x.status === "draft").length,
        });
        setContactTrend(
          buckets.map((key) => ({ label: monthLabel(key), value: trendMap[key] ?? 0 }))
        );
        setRecentContacts(
          [...contacts]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
        );
        setTopSkills(
          [...skills]
            .sort((a, b) => (b.proficiency ?? 0) - (a.proficiency ?? 0))
            .slice(0, 5)
            .map((skill) => ({ label: skill.name, value: skill.proficiency ?? 0 }))
        );
        setPermError(null);
      } catch (error) {
        if (isFirestorePermissionError(error)) {
          const msg = getFirestoreErrorMessage(error);
          setPermError(msg);
          toast.error(msg);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [ready]);

  const contentBars = useMemo(
    () => [
      { label: "Repos", value: githubStats.repos, color: "#FF3B00" },
      { label: "Published", value: blogStats.published, color: "#F5F0E8" },
      { label: "Skills", value: counts.skills, color: "#888580" },
      { label: "Archive", value: counts.achievements, color: "#CC2F00" },
    ],
    [blogStats.published, counts.achievements, counts.skills, githubStats.repos]
  );

  const languageBars = useMemo(() => {
    const entries = Object.entries(githubStats.languageBreakdown);
    if (entries.length === 0) return [];

    return entries
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, value], i) => ({
        label,
        value,
        color: i === 0 ? "#FF3B00" : i === 1 ? "#F5F0E8" : "#888580",
      }));
  }, [githubStats.languageBreakdown]);

  const healthItems = useMemo(
    () => [
      {
        label: "Published blog posts",
        value: blogStats.published,
        max: Math.max(counts.posts, 1),
      },
      {
        label: "Repos with live demos",
        value: githubStats.demos,
        max: Math.max(githubStats.repos, 1),
      },
      {
        label: "Inbox cleared",
        value: counts.contacts - counts.unread,
        max: Math.max(counts.contacts, 1),
      },
    ],
    [blogStats, counts, githubStats]
  );

  const cards = [
    {
      label: "GitHub repos",
      value: githubStats.repos,
      icon: FolderKanban,
      href: "/admin/projects",
      loading: githubLoading,
    },
    { label: "Published posts", value: blogStats.published, icon: FileText, href: "/admin/blog" },
    { label: "Unread", value: counts.unread, icon: Mail, href: "/admin/contacts", highlight: counts.unread > 0 },
    {
      label: "Total stars",
      value: githubStats.stars,
      icon: Star,
      href: "/admin/projects",
      loading: githubLoading,
    },
  ];

  const firstName = user?.displayName?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "Admin";

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        label="OVERVIEW"
        title={`Hey, ${firstName}`}
        description="Your content at a glance — stats, trends, and quick actions."
        action={
          <div className="flex items-center gap-2 border-2 border-white/10 bg-white/[0.03] px-3 py-2">
            <Clock className="h-3.5 w-3.5 text-accent" />
            <span className="label-mono text-[10px] text-zinc-400">
              {new Date().toLocaleDateString("en", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        }
      />

      {permError && (
        <div className="border-2 border-accent bg-accent/10 p-4 text-sm text-cream">
          <p className="label-mono text-accent">FIRESTORE PERMISSIONS</p>
          <p className="mt-2 text-zinc-300">{permError}</p>
        </div>
      )}

      <section className="glass-strong rounded-xl p-6">
        <p className="label-mono text-accent">SITE SYNC</p>
        <p className="mt-1 text-sm text-zinc-400">
          Admin sections map directly to the public portfolio.
        </p>
        <ul className="mt-4 divide-y divide-white/5">
          {SITE_SYNC_MAP.map((row) => (
            <li
              key={row.admin}
              className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[120px_1fr_1fr]"
            >
              <span className="label-mono text-[10px] text-accent">{row.admin}</span>
              <span className="text-sm text-zinc-300">{row.public}</span>
              <span className="text-xs text-zinc-500">{row.source}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`dashboard-stat-card group ${card.highlight ? "ring-1 ring-accent/50" : ""}`}
          >
            <div className="flex items-start justify-between">
              <card.icon className="h-5 w-5 text-accent" strokeWidth={2.5} />
              <TrendingUp className="h-3.5 w-3.5 text-zinc-700 transition-colors group-hover:text-accent" />
            </div>
            <p className="mt-4 font-display text-4xl leading-none text-cream">
              {loading || card.loading ? "—" : card.value.toLocaleString()}
            </p>
            <p className="label-mono mt-2 text-[10px] text-zinc-500">{card.label}</p>
            <ArrowUpRight className="mt-4 h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardChartPanel
          label="ANALYTICS"
          title="Content volume"
          description="Total items across your main collections"
        >
          <DashboardBarChart data={contentBars} />
        </DashboardChartPanel>

        <DashboardChartPanel
          label="ANALYTICS"
          title="Blog status"
          description="Published vs draft posts"
        >
          <DashboardDonutChart
            segments={[
              { label: "Published", value: blogStats.published, color: "#FF3B00" },
              { label: "Draft", value: blogStats.draft, color: "#888580" },
            ]}
            centerValue={String(blogStats.published + blogStats.draft)}
            centerLabel="POSTS"
          />
        </DashboardChartPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DashboardChartPanel
          label="ANALYTICS"
          title="Contact inquiries"
          description={`Last ${MONTHS} months`}
          className="lg:col-span-2"
        >
          <DashboardLineChart data={contactTrend} height={180} />
        </DashboardChartPanel>

        <DashboardChartPanel
          label="ANALYTICS"
          title="Repos by language"
          description={`GitHub · @${activeUsername || profileUsername}`}
        >
          {languageBars.length > 0 ? (
            <DashboardBarChart data={languageBars} height={180} />
          ) : (
            <p className="text-sm text-zinc-500">
              {githubLoading ? "Loading GitHub data…" : "No language data yet."}
            </p>
          )}
        </DashboardChartPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardProgressPanel
          label="HEALTH"
          title="Content health"
          items={healthItems}
        />

        <DashboardChartPanel label="SKILLS" title="Top proficiency">
          {topSkills.length > 0 ? (
            <ul className="space-y-3">
              {topSkills.map((skill, i) => (
                <li key={skill.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-zinc-300">{skill.label}</span>
                    <span className="label-mono text-[10px] text-zinc-500">{skill.value}%</span>
                  </div>
                  <div className="h-2 border border-white/10 bg-white/[0.03]">
                    <div
                      className="h-full bg-accent transition-all duration-500"
                      style={{
                        width: `${skill.value}%`,
                        opacity: 1 - i * 0.12,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">No skills data yet.</p>
          )}
        </DashboardChartPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="glass-strong rounded-xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="label-mono text-accent">INBOX</p>
              <h2 className="mt-1 font-display text-xl text-cream">Recent contacts</h2>
            </div>
            <Link
              href="/admin/contacts"
              className="label-mono text-[10px] text-zinc-500 transition-colors hover:text-accent"
            >
              View all →
            </Link>
          </div>
          {recentContacts.length === 0 ? (
            <div className="dashboard-empty mt-6 text-sm text-zinc-500">
              No inquiries yet — they&apos;ll show up here from your contact form.
            </div>
          ) : (
            <ul className="mt-5 divide-y divide-white/5">
              {recentContacts.map((contact) => (
                <li key={contact.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div
                    className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${contact.read ? "bg-zinc-700" : "bg-accent"}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium text-cream">{contact.name}</p>
                      <span className="label-mono text-[9px] text-zinc-600">
                        {formatDate(contact.createdAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-zinc-500">{contact.subject}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="glass-strong rounded-xl p-6">
          <p className="label-mono text-accent">QUICK ACTIONS</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <DashboardQuickLink href="/admin/projects">View repos</DashboardQuickLink>
            <DashboardQuickLink href="/admin/blog">Write post</DashboardQuickLink>
            <DashboardQuickLink href="/admin/contacts">Inbox</DashboardQuickLink>
            <DashboardQuickLink href="/admin/featured">Featured</DashboardQuickLink>
            <DashboardQuickLink href="/admin/research">Research</DashboardQuickLink>
            <DashboardQuickLink href="/admin/tech-stack">Tech stack</DashboardQuickLink>
            <DashboardQuickLink href="/admin/achievements">Archive</DashboardQuickLink>
            <DashboardQuickLink href="/admin/experience">
              <span className="inline-flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                Experience
              </span>
            </DashboardQuickLink>
            <DashboardQuickLink href="/" external>
              Live site →
            </DashboardQuickLink>
          </div>
          {!githubLoading && topRepos.length > 0 && (
            <div className="mt-5 space-y-2 border-t border-white/5 pt-5">
              <p className="label-mono text-[10px] text-zinc-600">TOP REPOS</p>
              <ul className="space-y-2">
                {topRepos.map((repo) => (
                  <li key={repo.id}>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 text-xs text-zinc-400 transition-colors hover:text-accent"
                    >
                      <span className="truncate font-mono">{repo.name}</span>
                      <span className="shrink-0 label-mono text-[10px] text-zinc-600">
                        {repo.stars} ★
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!githubLoading && githubStats.repos > 0 && (
            <p className="mt-5 border-l-2 border-accent/40 pl-3 text-xs text-zinc-500">
              {counts.experience} roles · {counts.achievements} archive items ·{" "}
              {githubStats.repos} repos · {githubStats.stars.toLocaleString()} stars on GitHub
            </p>
          )}
          {githubError && (
            <p className="mt-5 border-l-2 border-accent/40 pl-3 text-xs text-zinc-500">
              GitHub sync issue — open Projects to retry.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
