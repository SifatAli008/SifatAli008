"use client";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { GitHubReposSection } from "@/components/dashboard/github-repos-section";

export default function ProjectsManagerPage() {
  return (
    <div>
      <DashboardPageHeader
        label="GITHUB"
        title="Projects"
        description="Same live repos as 05 / SELECTED WORK on your landing page - sorted by stars"
      />

      <div className="mt-8">
        <GitHubReposSection />
      </div>
    </div>
  );
}
