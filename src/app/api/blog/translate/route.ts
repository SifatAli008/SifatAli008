import { NextResponse } from "next/server";
import { isTranslatableArticleLang } from "@/lib/blog/article-languages";
import { getCachedArticleTranslation } from "@/lib/blog/translate-article";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TranslateBody = {
  slug?: string;
  lang?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  faqs?: { question: string; answer: string }[];
  revision?: string;
};

export async function POST(request: Request) {
  let body: TranslateBody;
  try {
    body = (await request.json()) as TranslateBody;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const slug = body.slug?.trim();
  const lang = body.lang?.trim();
  if (!slug || !lang || !isTranslatableArticleLang(lang)) {
    return NextResponse.json({ error: "invalid_lang" }, { status: 400 });
  }

  const title = String(body.title ?? "").trim();
  const excerpt = String(body.excerpt ?? "").trim();
  const content = String(body.content ?? "").trim();
  const faqs = Array.isArray(body.faqs) ? body.faqs : [];

  if (!title || !content) {
    return NextResponse.json({ error: "missing_content" }, { status: 400 });
  }

  try {
    const translated = await getCachedArticleTranslation({
      slug,
      lang,
      title,
      excerpt,
      content,
      faqs,
      revision: body.revision,
    });
    return NextResponse.json(translated);
  } catch (err) {
    const reason = err instanceof Error ? err.message : "translate_failed";
    return NextResponse.json({ error: reason }, { status: 502 });
  }
}
