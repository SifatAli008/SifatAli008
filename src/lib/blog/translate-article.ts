import { unstable_cache } from "next/cache";
import {
  ARTICLE_LANGUAGES,
  type ArticleLangCode,
} from "@/lib/blog/article-languages";

export type ArticleTranslatePayload = {
  title: string;
  excerpt: string;
  content: string;
  faqs: { question: string; answer: string }[];
};

export type ArticleTranslateInput = ArticleTranslatePayload & {
  slug: string;
  lang: Exclude<ArticleLangCode, "en">;
  /** Invalidate cache when the English source changes */
  revision?: string;
};

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenced) return JSON.parse(fenced[1].trim());
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("invalid_json");
  }
}

export async function translateArticle(
  input: ArticleTranslateInput
): Promise<ArticleTranslatePayload> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("missing_api_key");
  }

  const langLabel =
    ARTICLE_LANGUAGES.find((l) => l.code === input.lang)?.label ?? input.lang;
  const model =
    process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash-lite";

  const system = `You translate technology blog articles for sifatali.site.
Return ONLY valid JSON with keys: title, excerpt, content, faqs.
Keep markdown structure, headings, tables, lists, and links.
Preserve ~~~chart fences and their JSON exactly (do not translate chart JSON keys).
Preserve citation markers like [[1]](#ref-...) exactly.
Do not add commentary. Translate into ${langLabel} (${input.lang}).`;

  const user = JSON.stringify({
    title: input.title,
    excerpt: input.excerpt,
    content: input.content.slice(0, 48_000),
    faqs: input.faqs,
  });

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(90_000),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  });

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(`gemini_${response.status}`);
  }

  const payload = JSON.parse(raw) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = payload.candidates?.[0]?.content?.parts
    ?.map((p) => p.text)
    .filter(Boolean)
    .join("\n");
  if (!text) throw new Error("empty_translation");

  const parsed = extractJson(text) as Record<string, unknown>;
  return {
    title: String(parsed.title ?? input.title),
    excerpt: String(parsed.excerpt ?? input.excerpt),
    content: String(parsed.content ?? input.content),
    faqs: Array.isArray(parsed.faqs)
      ? (parsed.faqs as { question: string; answer: string }[]).map((f) => ({
          question: String(f.question ?? ""),
          answer: String(f.answer ?? ""),
        }))
      : input.faqs,
  };
}

/**
 * Cached for SEO language pages + API — English pages never call this.
 * Revalidates weekly; revision (updatedAt) busts the cache on edits.
 */
export function getCachedArticleTranslation(input: ArticleTranslateInput) {
  const revision = input.revision ?? "0";
  return unstable_cache(
    async () => translateArticle(input),
    ["article-translation", input.slug, input.lang, revision],
    {
      revalidate: 604_800,
      tags: [`article-tr:${input.slug}`, `article-tr:${input.slug}:${input.lang}`],
    }
  )();
}
