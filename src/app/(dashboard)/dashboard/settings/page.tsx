"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { seedProfile } from "@/lib/data/seed-data";
import type { Profile } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile>(seedProfile);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!db) return;
    getDoc(doc(db, "profile", "main")).then((snap) => {
      if (snap.exists()) setProfile(snap.data() as Profile);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      if (db) {
        await setDoc(doc(db, "profile", "main"), profile, { merge: true });
        toast.success("Profile saved");
      } else {
        toast.info("Configure Firebase to persist settings");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-white">
        Settings
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        Profile, socials, availability, bio
      </p>
      <div className="mt-8 space-y-6">
        <div>
          <Label>Name</Label>
          <Input
            className="mt-2"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div>
          <Label>Tagline</Label>
          <Input
            className="mt-2"
            value={profile.tagline}
            onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
          />
        </div>
        <div>
          <Label>Headline</Label>
          <Input
            className="mt-2"
            value={profile.headline}
            onChange={(e) =>
              setProfile({ ...profile, headline: e.target.value })
            }
          />
        </div>
        <div>
          <Label>Bio</Label>
          <Textarea
            className="mt-2"
            rows={3}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            className="mt-2"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="available"
            checked={profile.availableForWork}
            onChange={(e) =>
              setProfile({ ...profile, availableForWork: e.target.checked })
            }
          />
          <Label htmlFor="available">Available for work</Label>
        </div>
        <div>
          <Label>GitHub URL</Label>
          <Input
            className="mt-2"
            value={profile.socials.github ?? ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                socials: { ...profile.socials, github: e.target.value },
              })
            }
          />
        </div>
        <div>
          <Label>LinkedIn URL</Label>
          <Input
            className="mt-2"
            value={profile.socials.linkedin ?? ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                socials: { ...profile.socials, linkedin: e.target.value },
              })
            }
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input
            className="mt-2"
            value={profile.phone ?? ""}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
        </div>
        <div>
          <Label>Address</Label>
          <Input
            className="mt-2"
            value={profile.address ?? ""}
            onChange={(e) =>
              setProfile({ ...profile, address: e.target.value })
            }
          />
        </div>
        <div>
          <Label>Education</Label>
          <Input
            className="mt-2"
            value={profile.education ?? ""}
            onChange={(e) =>
              setProfile({ ...profile, education: e.target.value })
            }
          />
        </div>
        <div>
          <Label>LeetCode URL</Label>
          <Input
            className="mt-2"
            value={profile.socials.leetcode ?? ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                socials: { ...profile.socials, leetcode: e.target.value },
              })
            }
          />
        </div>
        <div>
          <Label>Resume URL</Label>
          <Input
            className="mt-2"
            value={profile.resumeUrl ?? ""}
            onChange={(e) =>
              setProfile({ ...profile, resumeUrl: e.target.value })
            }
          />
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </div>
  );
}
