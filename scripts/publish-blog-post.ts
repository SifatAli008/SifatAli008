/**
 * Publish a codebase article to Firestore.
 *
 * Usage:
 *   npx tsx scripts/publish-blog-post.ts
 *   npx tsx scripts/publish-blog-post.ts --slug=eu-ai-act-august-2-2026-agentic-ai-enterprise-governance
 *
 * Requires FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { publishedArticles } from "../src/lib/data/articles";
import { calculateReadingTime } from "../src/lib/utils";

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
      "Missing FIREBASE_ADMIN_* env vars. Add them to .env.local to publish to Firestore."
    );
    console.error(
      "The article is still live via codebase fallback at /blog/<slug>."
    );
    process.exit(1);
  }

  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
  return getFirestore();
}

async function main() {
  const slugArg = process.argv
    .find((a) => a.startsWith("--slug="))
    ?.split("=")[1];
  const article =
    publishedArticles.find((p) => p.slug === slugArg) ??
    publishedArticles[0];

  if (!article) {
    console.error("No article found to publish.");
    process.exit(1);
  }

  const db = initAdmin();
  const now = new Date().toISOString();
  const existing = await db
    .collection("blog_posts")
    .where("slug", "==", article.slug)
    .limit(1)
    .get();

  const payload = {
    ...article,
    status: "published" as const,
    readingTime: calculateReadingTime(article.content),
    updatedAt: now,
    publishedAt: article.publishedAt ?? now,
    createdAt: article.createdAt ?? now,
  };

  if (!existing.empty) {
    const doc = existing.docs[0];
    await doc.ref.set({ ...payload, id: doc.id }, { merge: true });
    console.log(`✓ Updated blog_posts/${doc.id} (${article.slug})`);
  } else {
    const ref = db.collection("blog_posts").doc();
    await ref.set({ ...payload, id: ref.id });
    console.log(`✓ Created blog_posts/${ref.id} (${article.slug})`);
  }

  console.log(`Live URL path: /blog/${article.slug}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
