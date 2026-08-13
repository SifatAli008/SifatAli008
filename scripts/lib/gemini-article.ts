import type { GeneratedArticle } from "./article-files";

const GEMINI_MODELS = [
  process.env.GEMINI_MODEL?.trim(),
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
].filter(Boolean) as string[];

const OPENROUTER_MODELS = [
  process.env.OPENROUTER_MODEL?.trim(),
  "google/gemini-2.0-flash-exp:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "openrouter/free",
].filter(Boolean) as string[];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
    throw new Error("Gemini response did not contain valid JSON");
  }
}

function validateArticle(data: unknown): GeneratedArticle {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid article payload");
  }
  const d = data as Record<string, unknown>;
  const required = [
    "exportName",
    "fileBase",
    "slug",
    "title",
    "excerpt",
    "seoTitle",
    "seoDescription",
    "tags",
    "content",
    "faqs",
  ] as const;

  for (const key of required) {
    if (d[key] == null || d[key] === "") {
      throw new Error(`Missing field: ${key}`);
    }
  }

  if (!Array.isArray(d.tags) || d.tags.length === 0) {
    throw new Error("tags must be a non-empty array");
  }
  if (!Array.isArray(d.faqs) || d.faqs.length < 3) {
    throw new Error("faqs must include at least 3 items");
  }

  const content = String(d.content);
  if (content.split(/\s+/).length < 600) {
    throw new Error("Article content too short (need ~1200+ words target)");
  }

  return {
    exportName: String(d.exportName),
    fileBase: String(d.fileBase),
    slug: String(d.slug),
    title: String(d.title),
    excerpt: String(d.excerpt),
    seoTitle: String(d.seoTitle),
    seoDescription: String(d.seoDescription),
    tags: d.tags.map(String),
    content,
    faqs: (d.faqs as { question: string; answer: string }[]).map((f) => ({
      question: String(f.question),
      answer: String(f.answer),
    })),
  };
}

export async function generateDailyArticleWithGemini(input: {
  apiKey: string;
  dayLabel: string;
  publishedAt: string;
  existingSlugs: string[];
  slot?: "afternoon" | "evening";
  topicFocus?: string;
}): Promise<GeneratedArticle> {
  const { system, user } = buildPrompts(input);
  const errors: string[] = [];

  if (input.apiKey) {
    for (const model of Array.from(new Set(GEMINI_MODELS))) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const text = await callGemini(input.apiKey, model, system, user);
          return validateArticle(extractJson(text));
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          errors.push(`Gemini/${model}: ${msg}`);
          if (msg.includes("429") && attempt === 0) {
            await sleep(4000 * (attempt + 1));
            continue;
          }
          break;
        }
      }
    }
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();
  if (openRouterKey) {
    for (const model of Array.from(new Set(OPENROUTER_MODELS))) {
      try {
        const text = await callOpenRouter(openRouterKey, model, system, user);
        return validateArticle(extractJson(text));
      } catch (err) {
        errors.push(
          `OpenRouter/${model}: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
  }

  throw new Error(
    `Article generation failed:\n${errors.join("\n")}\n\nAdd GEMINI_API_KEY or OPENROUTER_API_KEY with quota.`
  );
}

function buildPrompts(input: {
  dayLabel: string;
  publishedAt: string;
  existingSlugs: string[];
  slot?: "afternoon" | "evening";
  topicFocus?: string;
}) {
  const slotLabel = input.slot ?? "daily";
  const topicFocus =
    input.topicFocus ??
    "Focus on AI, NLP, agents, cloud, developer tools, or shipping lessons relevant this week.";

  const system = `You are a senior technology journalist writing for sifatali.site.
Return ONLY valid JSON (no markdown wrapper) matching this schema:
{
  "exportName": "camelCaseExportName",
  "fileBase": "kebab-case-filename-without-ts",
  "slug": "url-slug-lowercase",
  "title": "string",
  "excerpt": "string",
  "seoTitle": "string",
  "seoDescription": "string",
  "tags": ["AI", "NLP", "..."],
  "content": "markdown string",
  "faqs": [{ "question": "string", "answer": "string" }]
}

Rules:
- Write 1500-2500 words in content (markdown).
- Topic: timely, verifiable technology news for founders and engineers on ${input.dayLabel}.
- Priority topic areas: NLP, AI/RAG, agents, cloud, developer tools, healthcare AI, shipping lessons.
- ${topicFocus}
- Do NOT reuse these slugs: ${input.existingSlugs.join(", ") || "none"}.
- No em dashes. Use commas or periods instead.
- Include Executive Summary, tables, Key Takeaways, References with markdown links.
- Include one ~~~chart fence with JSON (type bar|donut|timeline|hbar) — NOT triple backticks.
- Include inline citations like [[1]](#ref-1-name) in content.
- exportName must be valid JavaScript identifier ending with Article.
- fileBase should be short kebab-case, include date hint when possible.
- faqs: 5-6 practical questions.
- Be factual; if uncertain, say so. Do not invent company announcements.
- When the piece covers language models, text pipelines, or clinical text, include "NLP" in tags.`;

  const user = `Generate today's ${slotLabel} tech article for ${input.dayLabel}.
Publish timestamp ISO: ${input.publishedAt}.
${topicFocus}
Cover AI, NLP, agents, cloud, developer tools, or shipping lessons relevant this week.`;

  return { system, user };
}

async function callGemini(
  apiKey: string,
  model: string,
  system: string,
  user: string
): Promise<string> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(120_000),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  });

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${raw.slice(0, 200)}`);
  }

  const payload = JSON.parse(raw) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = payload.candidates?.[0]?.content?.parts
    ?.map((p) => p.text)
    .filter(Boolean)
    .join("\n");

  if (!text) throw new Error("empty Gemini candidate");
  return text;
}

async function callOpenRouter(
  apiKey: string,
  model: string,
  system: string,
  user: string
): Promise<string> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://sifatali.site";

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": siteUrl,
      "X-Title": "Sifat Ali Daily Article",
    },
    signal: AbortSignal.timeout(120_000),
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.7,
      max_tokens: 8192,
      response_format: { type: "json_object" },
    }),
  });

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${raw.slice(0, 200)}`);
  }

  const payload = JSON.parse(raw) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = payload.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("empty OpenRouter candidate");
  return text;
}
