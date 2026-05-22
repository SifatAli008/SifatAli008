"use client";

import { fallbackAchievements } from "@/lib/data/fallback";
import { Badge } from "@/components/ui/badge";

export default function AchievementsManagerPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-white">
        Achievements
      </h1>
      <p className="mt-2 text-sm text-zinc-500">Archive milestones & metrics</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {fallbackAchievements.map((a) => (
          <div key={a.id} className="glass rounded-xl p-6">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{a.category}</Badge>
              <span className="text-xs text-zinc-600">{a.year}</span>
            </div>
            <h3 className="mt-2 font-medium text-white">{a.title}</h3>
            <p className="mt-2 text-sm text-zinc-500">{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
