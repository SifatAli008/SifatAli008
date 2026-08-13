import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(__dirname, "../..");
export const ARTICLES_DIR = path.join(ROOT, "src/lib/data/articles");

export type GeneratedArticle = {
  exportName: string;
  fileBase: string;
  slug: string;
  title: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  content: string;
  faqs: { question: string; answer: string }[];
};

export function escapeTemplateLiteral(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

export async function listArticleSlugs(): Promise<string[]> {
  const files = await fs.readdir(ARTICLES_DIR);
  const slugs: string[] = [];

  for (const file of files) {
    if (!file.endsWith(".ts") || file === "index.ts") continue;
    const src = await fs.readFile(path.join(ARTICLES_DIR, file), "utf8");
    const match = src.match(/slug:\s*"([^"]+)"/);
    if (match) slugs.push(match[1]);
  }
  return slugs;
}

export type ArticleSlot = "afternoon" | "evening";

const SLOT_UTC_HOUR: Record<ArticleSlot, string> = {
  afternoon: "09", // 3:00 PM Asia/Dhaka
  evening: "14", // 8:00 PM Asia/Dhaka
};

/** Count daily briefs already written for this Dhaka calendar day. */
export async function countArticlesForDhakaDay(
  dayLabel: string,
  dayKey: string
): Promise<number> {
  const files = await fs.readdir(ARTICLES_DIR);
  let count = 0;
  for (const file of files) {
    if (!file.endsWith(".ts") || file === "index.ts") continue;
    const src = await fs.readFile(path.join(ARTICLES_DIR, file), "utf8");
    if (
      src.includes(`Daily technology brief, ${dayLabel}`) ||
      src.includes(`publishedAt = "${dayKey}T`)
    ) {
      count += 1;
    }
  }
  return count;
}

export async function hasArticleForDhakaDay(dayLabelOrKey: string): Promise<boolean> {
  const files = await fs.readdir(ARTICLES_DIR);
  for (const file of files) {
    if (!file.endsWith(".ts") || file === "index.ts") continue;
    const src = await fs.readFile(path.join(ARTICLES_DIR, file), "utf8");
    if (src.includes(`Daily technology brief, ${dayLabelOrKey}`)) return true;
    if (src.includes(`publishedAt = "${dayLabelOrKey}`)) return true;
  }
  return false;
}

export async function hasArticleForSlot(
  dayKey: string,
  slot: ArticleSlot
): Promise<boolean> {
  const stamp = `${dayKey}T${SLOT_UTC_HOUR[slot]}:00:00.000Z`;
  const files = await fs.readdir(ARTICLES_DIR);
  for (const file of files) {
    if (!file.endsWith(".ts") || file === "index.ts") continue;
    const src = await fs.readFile(path.join(ARTICLES_DIR, file), "utf8");
    if (src.includes(`publishedAt = "${stamp}"`)) return true;
    if (src.includes(`slot: ${slot}`) && src.includes(dayKey)) return true;
  }
  return false;
}

export function buildArticleSource(
  article: GeneratedArticle,
  publishedAt: string,
  dayLabel: string,
  slot?: ArticleSlot
): string {
  const tags = article.tags.map((t) => `"${t.replace(/"/g, '\\"')}"`).join(", ");
  const content = escapeTemplateLiteral(article.content.trim());
  const readingTime = Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
  const slotNote = slot ? ` (${slot} slot)` : "";

  return `import type { BlogPost } from "@/types";

const publishedAt = "${publishedAt}";

/**
 * Daily technology brief, ${dayLabel}${slotNote}
 * slot: ${slot ?? "unspecified"}
 */
export const ${article.exportName}: Omit<BlogPost, "id"> = {
  slug: "${article.slug}",
  title: ${JSON.stringify(article.title)},
  excerpt: ${JSON.stringify(article.excerpt)},
  seoTitle: ${JSON.stringify(article.seoTitle)},
  seoDescription: ${JSON.stringify(article.seoDescription)},
  tags: [${tags}],
  status: "published",
  readingTime: ${readingTime},
  publishedAt,
  createdAt: publishedAt,
  updatedAt: publishedAt,
  content: \`${content}\`,
};
`;
}

export async function writeArticleFile(
  article: GeneratedArticle,
  publishedAt: string,
  dayLabel: string,
  slot?: ArticleSlot
): Promise<string> {
  const filePath = path.join(ARTICLES_DIR, `${article.fileBase}.ts`);
  await fs.writeFile(
    filePath,
    buildArticleSource(article, publishedAt, dayLabel, slot),
    "utf8"
  );
  return filePath;
}

export async function updateArticlesIndex(article: GeneratedArticle): Promise<void> {
  const indexPath = path.join(ARTICLES_DIR, "index.ts");
  let src = await fs.readFile(indexPath, "utf8");

  const importLine = `import { ${article.exportName} } from "./${article.fileBase}";`;
  if (!src.includes(importLine)) {
    const next = src.replace(
      /import type \{ BlogPost \} from "@\/types";\r?\n/,
      (m) => `${m}${importLine}\n`
    );
    if (next === src) {
      throw new Error("updateArticlesIndex: could not insert import line");
    }
    src = next;
  }

  if (!src.includes(`${article.exportName},`)) {
    const next = src.replace(
      /export const publishedArticles: Omit<BlogPost, "id">\[\] = \[\r?\n/,
      (m) => `${m}  ${article.exportName},\n`
    );
    if (next === src) {
      throw new Error("updateArticlesIndex: could not insert export entry");
    }
    src = next;
  }

  await fs.writeFile(indexPath, src, "utf8");
}

export async function updateArticleFaqs(article: GeneratedArticle): Promise<void> {
  const faqsPath = path.join(ROOT, "src/lib/data/article-faqs.ts");
  let src = await fs.readFile(faqsPath, "utf8");

  if (src.includes(`"${article.slug}":`)) return;

  const faqBlock = article.faqs
    .map(
      (f) => `    {
      question: ${JSON.stringify(f.question)},
      answer: ${JSON.stringify(f.answer)},
    }`
    )
    .join(",\n");

  const entry = `  "${article.slug}": [\n${faqBlock},\n  ],\n`;

  const next = src.replace(
    /export const articleFaqsBySlug: Record<\r?\n  string,\r?\n  \{ question: string; answer: string \}\[\]\r?\n> = \{\r?\n/,
    (m) => `${m}${entry}`
  );
  if (next === src) {
    throw new Error("updateArticleFaqs: could not insert FAQ entry");
  }

  await fs.writeFile(faqsPath, next, "utf8");
}

export async function updateBlogMeta(
  article: GeneratedArticle,
  publishedAt: string
): Promise<void> {
  const metaPath = path.join(ROOT, "src/lib/data/blog-meta.ts");
  let src = await fs.readFile(metaPath, "utf8");

  if (src.includes(`slug: "${article.slug}"`)) return;

  const readingTime = Math.max(
    1,
    Math.ceil(article.content.trim().split(/\s+/).length / 200)
  );
  const tags = article.tags.map((t) => `"${t}"`).join(", ");
  const idNum =
    (src.match(/id: "blog-meta-\d+"/g)?.length ?? 0) + 1;

  const entry = `  {
    id: "blog-meta-${idNum}",
    slug: "${article.slug}",
    title: ${JSON.stringify(article.title)},
    excerpt: ${JSON.stringify(article.excerpt.slice(0, 160))},
    content: "",
    tags: [${tags}],
    status: "published",
    readingTime: ${readingTime},
    publishedAt: "${publishedAt}",
    createdAt: "${publishedAt}",
    updatedAt: "${publishedAt}",
  },
`;

  const next = src.replace(
    /export const blogFallbackMeta: BlogPost\[\] = \[\r?\n/,
    (m) => `${m}${entry}`
  );
  if (next === src) {
    throw new Error("updateBlogMeta: could not insert meta entry");
  }

  await fs.writeFile(metaPath, next, "utf8");
}

export async function updateBlogFallbackLoader(
  article: GeneratedArticle
): Promise<void> {
  const fallbackPath = path.join(ROOT, "src/lib/data/blog-fallback.ts");
  let src = await fs.readFile(fallbackPath, "utf8");

  if (src.includes(`"${article.slug}":`)) return;

  const loader = `  "${article.slug}": async () =>
    (await import("./articles/${article.fileBase}")).${article.exportName},`;

  const next = src.replace(
    /const ARTICLE_LOADERS: Record<string, \(\) => Promise<ArticleModule>> = \{\r?\n/,
    (m) => `${m}${loader}\n`
  );
  if (next === src) {
    throw new Error("updateBlogFallbackLoader: could not insert loader");
  }

  await fs.writeFile(fallbackPath, next, "utf8");
}

export async function applyArticleToRepo(
  article: GeneratedArticle,
  publishedAt: string,
  dayLabel: string,
  slot?: ArticleSlot
): Promise<void> {
  await writeArticleFile(article, publishedAt, dayLabel, slot);
  await updateArticlesIndex(article);
  await updateArticleFaqs(article);
  await updateBlogMeta(article, publishedAt);
  await updateBlogFallbackLoader(article);
}
