import "dotenv/config";
import { cert, initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import {
  seedProfile,
  seedProjects,
  seedSkills,
  seedExperience,
  seedAchievements,
  seedBlogPosts,
} from "../src/lib/data/seed-data";
import { featuredItems } from "../src/lib/data/featured";
import { defaultResearchSettings } from "../src/lib/data/research";
import { techStackMarquee } from "../src/lib/data/tech-stack";

function initAdmin() {
  if (getApps().length) return getFirestore();

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n"
  );

  if (!projectId || !clientEmail || !privateKey) {
    console.error(
      "Missing FIREBASE_ADMIN_* env vars. Copy .env.example and add service account credentials."
    );
    process.exit(1);
  }

  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
  return getFirestore();
}

async function seed() {
  const db = initAdmin();
  console.log("Seeding Firestore…");

  await db.collection("profile").doc("main").set(seedProfile);
  console.log("✓ profile/main");

  for (const project of seedProjects) {
    const ref = db.collection("projects").doc();
    await ref.set({ ...project, id: ref.id });
  }
  console.log(`✓ ${seedProjects.length} projects`);

  for (const skill of seedSkills) {
    const ref = db.collection("skills").doc();
    await ref.set({ ...skill, id: ref.id });
  }
  console.log(`✓ ${seedSkills.length} skills`);

  for (const exp of seedExperience) {
    const ref = db.collection("experiences").doc();
    await ref.set({ ...exp, id: ref.id });
  }
  console.log(`✓ ${seedExperience.length} experiences`);

  for (const ach of seedAchievements) {
    const ref = db.collection("achievements").doc();
    await ref.set({ ...ach, id: ref.id });
  }
  console.log(`✓ ${seedAchievements.length} achievements`);

  for (const post of seedBlogPosts) {
    const ref = db.collection("blog_posts").doc();
    await ref.set({ ...post, id: ref.id });
  }
  console.log(`✓ ${seedBlogPosts.length} blog posts (drafts)`);

  for (const item of featuredItems) {
    const { id, ...data } = item;
    await db.collection("featured_posts").doc(id).set(data);
  }
  console.log(`✓ ${featuredItems.length} featured posts`);

  for (const item of techStackMarquee) {
    const { id, ...data } = item;
    await db.collection("tech_stack").doc(id).set(data);
  }
  console.log(`✓ ${techStackMarquee.length} tech stack items`);

  await db.collection("research_settings").doc("main").set(defaultResearchSettings);
  console.log("✓ research_settings/main");

  console.log("\nSeed complete.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
