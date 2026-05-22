"use client";

import { fallbackExperience } from "@/lib/data/fallback";

export default function ExperienceManagerPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-white">
        Experience
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        Timeline entries — edit via Firestore or seed script
      </p>
      <div className="mt-8 space-y-4">
        {fallbackExperience.map((exp) => (
          <div key={exp.id} className="glass rounded-xl p-6">
            <p className="text-xs text-accent-indigo">{exp.duration}</p>
            <h3 className="mt-1 font-display text-lg text-white">{exp.role}</h3>
            <p className="text-sm text-zinc-500">{exp.company}</p>
            <ul className="mt-4 space-y-1 text-sm text-zinc-400">
              {exp.impact.map((i) => (
                <li key={i}>· {i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
