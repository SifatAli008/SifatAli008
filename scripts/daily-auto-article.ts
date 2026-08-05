/**
 * Daily auto blog publisher for sifatali.site
 *
 * Usage:
 *   npx tsx scripts/daily-auto-article.ts
 *   npx tsx scripts/daily-auto-article.ts --dry-run
 *   npx tsx scripts/daily-auto-article.ts --force
 *
 * Env: GEMINI_API_KEY (required)
 * Optional: FIREBASE_ADMIN_* then run publish:article after
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import fs from "node:fs";
import {
  applyArticleToRepo,
  hasArticleForDhakaDay,
  listArticleSlugs,
} from "./lib/article-files";
import { generateDailyArticleWithGemini } from "./lib/gemini-article";

function dhakaPublishISO(): { publishedAt: string; dayLabel: string; dayKey: string } {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const y = parts.find((p) => p.type === "year")?.value ?? "2026";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const d = parts.find((p) => p.type === "day")?.value ?? "01";
  const dayKey = `${y}-${m}-${d}`;

  const monthName = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    month: "long",
  }).format(now);
  const dayNum = Number(d);
  const dayLabel = `${monthName} ${dayNum}, ${y}`;

  // 8:30 PM Asia/Dhaka ≈ 14:30 UTC same calendar day
  const publishedAt = `${dayKey}T14:30:00.000Z`;

  return { publishedAt, dayLabel, dayKey };
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const force = process.argv.includes("--force");
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();

  if (!geminiKey && !openRouterKey) {
    console.error(
      "Missing AI key. Set GEMINI_API_KEY and/or OPENROUTER_API_KEY in .env.local or GitHub Actions secrets."
    );
    process.exit(1);
  }

  const { publishedAt, dayLabel, dayKey } = dhakaPublishISO();
  const existingSlugs = await listArticleSlugs();

  if (!force && (await hasArticleForDhakaDay(dayLabel))) {
    console.log(`Skip: article already exists for ${dayLabel}.`);
    process.exit(0);
  }

  console.log(`Generating daily article for ${dayLabel}...`);
  const article = await generateDailyArticleWithGemini({
    apiKey: geminiKey ?? "",
    dayLabel,
    publishedAt,
    existingSlugs,
  });

  console.log(`Generated: ${article.title}`);
  console.log(`Slug: ${article.slug}`);
  console.log(`File: src/lib/data/articles/${article.fileBase}.ts`);

  if (dryRun) {
    console.log("Dry run — files not written.");
    process.exit(0);
  }

  await applyArticleToRepo(article, publishedAt, dayLabel);
  console.log("✓ Wrote article + updated index, FAQs, blog-meta, blog-fallback");

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `article_slug=${article.slug}\n`
    );
  }

  console.log(`Live path after deploy: /blog/${article.slug}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
