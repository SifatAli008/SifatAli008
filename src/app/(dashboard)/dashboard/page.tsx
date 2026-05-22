"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { fallbackProjects, fallbackBlogPosts } from "@/lib/data/fallback";
import { FolderKanban, FileText, Mail, Sparkles } from "lucide-react";

export default function DashboardOverviewPage() {
  const [counts, setCounts] = useState({
    projects: fallbackProjects.length,
    posts: fallbackBlogPosts.length,
    contacts: 0,
    skills: 14,
  });

  useEffect(() => {
    if (!db) return;
    (async () => {
      try {
        const [p, b, c, s] = await Promise.all([
          getDocs(collection(db, "projects")),
          getDocs(collection(db, "blog_posts")),
          getDocs(collection(db, "contacts")),
          getDocs(collection(db, "skills")),
        ]);
        setCounts({
          projects: p.size || fallbackProjects.length,
          posts: b.size || fallbackBlogPosts.length,
          contacts: c.size,
          skills: s.size || 14,
        });
      } catch {
        /* use fallback */
      }
    })();
  }, []);

  const cards = [
    { label: "Projects", value: counts.projects, icon: FolderKanban, href: "/dashboard/projects" },
    { label: "Blog posts", value: counts.posts, icon: FileText, href: "/dashboard/blog" },
    { label: "Contacts", value: counts.contacts, icon: Mail, href: "/dashboard/settings" },
    { label: "Skills", value: counts.skills, icon: Sparkles, href: "/dashboard/skills" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-white">Overview</h1>
      <p className="mt-2 text-zinc-500">
        Personal brand operating system — manage content from one place.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="glass rounded-2xl p-6 transition-all hover:glow-border"
          >
            <card.icon className="h-5 w-5 text-accent-indigo" />
            <p className="mt-4 font-display text-3xl font-semibold text-white">
              {card.value}
            </p>
            <p className="text-sm text-zinc-500">{card.label}</p>
          </Link>
        ))}
      </div>
      <div className="mt-12 glass rounded-2xl p-6">
        <h2 className="font-display text-lg text-white">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/dashboard/projects" className="text-sm text-accent-indigo hover:underline">
            Manage projects
          </Link>
          <Link href="/dashboard/blog" className="text-sm text-accent-indigo hover:underline">
            Write blog post
          </Link>
          <Link href="/" target="_blank" className="text-sm text-accent-indigo hover:underline">
            View live site →
          </Link>
        </div>
      </div>
    </div>
  );
}
