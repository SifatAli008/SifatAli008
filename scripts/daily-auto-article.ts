/**
 * Daily auto blog publisher for sifatali.site
 *
 * Two slots per day (Asia/Dhaka):
 *   afternoon — 3:00 PM  → 09:00 UTC
 *   evening   — 8:00 PM  → 14:00 UTC
 *
 * Usage:
 *   npx tsx scripts/daily-auto-article.ts
 *   npx tsx scripts/daily-auto-article.ts --slot=afternoon
 *   npx tsx scripts/daily-auto-article.ts --slot=evening
 *   npx tsx scripts/daily-auto-article.ts --dry-run
 *   npx tsx scripts/daily-auto-article.ts --force
 *
 * Env: GEMINI_API_KEY and/or OPENROUTER_API_KEY
 * Optional: ARTICLE_SLOT=afternoon|evening
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import fs from "node:fs";
import {
  applyArticleToRepo,
  countArticlesForDhakaDay,
  hasArticleForSlot,
  listArticleSlugs,
} from "./lib/article-files";
import { generateDailyArticleWithGemini } from "./lib/gemini-article";

export type ArticleSlot = "afternoon" | "evening";

const MAX_ARTICLES_PER_DAY = 2;

const SLOT_UTC_HOUR: Record<ArticleSlot, number> = {
  afternoon: 9, // 3:00 PM Asia/Dhaka
  evening: 14, // 8:00 PM Asia/Dhaka
};

const SLOT_TOPIC_FOCUS: Record<ArticleSlot, string> = {
  afternoon:
    "Prefer NLP (natural language processing): transformers, tokenization, embeddings, ClinicalBERT/domain NLP, retrieval, evaluation, or production NLP pipelines. Include NLP in tags.",
  evening:
    "Focus on AI agents, cloud, developer tools, shipping lessons, or NLP advances relevant this week. Include NLP when it fits the story.",
};

function parseSlotArg(): ArticleSlot | null {
  const fromEnv = process.env.ARTICLE_SLOT?.trim().toLowerCase();
  if (fromEnv === "afternoon" || fromEnv === "evening") return fromEnv;

  const arg = process.argv.find((a) => a.startsWith("--slot="));
  if (!arg) return null;
  const value = arg.slice("--slot=".length).toLowerCase();
  if (value === "afternoon" || value === "evening") return value;
  console.error(`Invalid --slot=${value}. Use afternoon or evening.`);
  process.exit(1);
}

function resolveSlotFromDhakaHour(): ArticleSlot {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Dhaka",
      hour: "numeric",
      hour12: false,
    }).format(new Date())
  );
  // Before 5:30 PM Dhaka → afternoon slot; otherwise evening
  return hour < 17 ? "afternoon" : "evening";
}

function dhakaPublishISO(slot: ArticleSlot): {
  publishedAt: string;
  dayLabel: string;
  dayKey: string;
  slot: ArticleSlot;
} {
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

  const utcHour = String(SLOT_UTC_HOUR[slot]).padStart(2, "0");
  const publishedAt = `${dayKey}T${utcHour}:00:00.000Z`;

  return { publishedAt, dayLabel, dayKey, slot };
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

  const slot = parseSlotArg() ?? resolveSlotFromDhakaHour();
  const { publishedAt, dayLabel, dayKey } = dhakaPublishISO(slot);
  const existingSlugs = await listArticleSlugs();

  if (!force) {
    if (await hasArticleForSlot(dayKey, slot)) {
      console.log(`Skip: ${slot} article already exists for ${dayLabel}.`);
      process.exit(0);
    }
    const count = await countArticlesForDhakaDay(dayLabel, dayKey);
    if (count >= MAX_ARTICLES_PER_DAY) {
      console.log(
        `Skip: already have ${count} articles for ${dayLabel} (max ${MAX_ARTICLES_PER_DAY}).`
      );
      process.exit(0);
    }
  }

  console.log(
    `Generating ${slot} article for ${dayLabel} (${publishedAt})...`
  );
  const article = await generateDailyArticleWithGemini({
    apiKey: geminiKey ?? "",
    dayLabel,
    publishedAt,
    existingSlugs,
    slot,
    topicFocus: SLOT_TOPIC_FOCUS[slot],
  });

  console.log(`Generated: ${article.title}`);
  console.log(`Slug: ${article.slug}`);
  console.log(`File: src/lib/data/articles/${article.fileBase}.ts`);

  if (dryRun) {
    console.log("Dry run — files not written.");
    process.exit(0);
  }

  await applyArticleToRepo(article, publishedAt, dayLabel, slot);
  console.log("✓ Wrote article + updated index, FAQs, blog-meta, blog-fallback");

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `article_slug=${article.slug}\narticle_slot=${slot}\n`
    );
  }

  console.log(`Live path after deploy: /blog/${article.slug}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
