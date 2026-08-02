/**
 * Publish codebase article(s) to Firestore.
 * Meta → blog_posts (no markdown). Body → blog_posts/{id}/body/main.
 *
 * Usage:
 *   npx tsx scripts/publish-blog-post.ts --all
 *   npx tsx scripts/publish-blog-post.ts --slug=eu-ai-act-august-2-2026-agentic-ai-enterprise-governance
 *
 * Requires FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { publishedArticles } from "../src/lib/data/articles";
import { blogMetaPayload } from "../src/lib/blog/blog-meta-fields";
import { calculateReadingTime } from "../src/lib/utils";
import type { BlogPost } from "../src/types";

function initAdmin(): Firestore {
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
      "Until then, list pages use light blog-meta; article pages fall back to codebase bodies."
    );
    process.exit(1);
  }

  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
  return getFirestore();
}

async function publishOne(db: Firestore, article: Omit<BlogPost, "id">) {
  const now = new Date().toISOString();
  const readingTime = calculateReadingTime(article.content);
  const existing = await db
    .collection("blog_posts")
    .where("slug", "==", article.slug)
    .limit(1)
    .get();

  const base = {
    ...article,
    status: "published" as const,
    readingTime,
    updatedAt: now,
    publishedAt: article.publishedAt ?? now,
    createdAt: article.createdAt ?? now,
  };
  const meta = blogMetaPayload(base);

  let postId: string;
  if (!existing.empty) {
    postId = existing.docs[0].id;
    await existing.docs[0].ref.set({ ...meta, id: postId }, { merge: true });
    console.log(`✓ Meta updated blog_posts/${postId} (${article.slug})`);
  } else {
    const ref = db.collection("blog_posts").doc();
    postId = ref.id;
    await ref.set({ ...meta, id: postId });
    console.log(`✓ Meta created blog_posts/${postId} (${article.slug})`);
  }

  await db
    .collection("blog_posts")
    .doc(postId)
    .collection("body")
    .doc("main")
    .set({ content: article.content, updatedAt: now });
  console.log(`✓ Body saved blog_posts/${postId}/body/main`);
  console.log(`  Live: /blog/${article.slug}`);
}

async function main() {
  const slugArg = process.argv
    .find((a) => a.startsWith("--slug="))
    ?.split("=")[1];
  const publishAll = process.argv.includes("--all");

  const articles = publishAll
    ? publishedArticles
    : [
        publishedArticles.find((p) => p.slug === slugArg) ??
          publishedArticles[0],
      ].filter(Boolean);

  if (!articles.length) {
    console.error("No article found to publish.");
    process.exit(1);
  }

  const db = initAdmin();
  for (const article of articles) {
    await publishOne(db, article as Omit<BlogPost, "id">);
  }
  console.log(`Done (${articles.length} article(s)).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
