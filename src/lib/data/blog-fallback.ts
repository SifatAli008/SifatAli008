import { seedBlogPosts } from "@/lib/data/seed-data";
import type { BlogPost } from "@/types";

type ArticleModule = Omit<BlogPost, "id">;

/** Per-slug dynamic imports — load one article body, not the whole library. */
const ARTICLE_LOADERS: Record<string, () => Promise<ArticleModule>> = {
  "cloud-agent-orchestration-scaling-lessons-august-14-2026": async () =>
    (await import("./articles/cloud-agent-orchestration-aug-14-2026")).cloudAgentOrchestrationLessonsArticle,
  "production-nlp-pipelines-august-14-2026": async () =>
    (await import("./articles/production-nlp-pipelines-aug-14-2026")).productionNlpPipelinesArticle,
  "nlp-agent-synergy-august-13-2026": async () =>
    (await import("./articles/nlp-agent-aug13")).nlpAgentIntegrationArticle,
  "ai-agent-advancements-august-13-2026": async () =>
    (await import("./articles/ai-agents-aug-13-2026")).aiAgentAdvancementsArticle,
  "eu-ai-act-august-2-2026-agentic-ai-enterprise-governance": async () =>
    (await import("./articles/eu-ai-act-august-2-2026-agentic-ai"))
      .euAiActAugust2026Article,
  "building-ai-healthcare-systems-clinicalbert": async () =>
    (await import("./articles/clinicalbert-healthcare-ai"))
      .clinicalBertHealthcareArticle,
  "real-time-firebase-lessons": async () =>
    (await import("./articles/firebase-realtime-lessons"))
      .firebaseRealtimeLessonsArticle,
  "designing-pyqt5-dashboards": async () =>
    (await import("./articles/pyqt5-modern-dashboards")).pyqt5DashboardsArticle,
};

function withId(article: ArticleModule, prefix: string): BlogPost {
  return { ...article, id: `${prefix}-${article.slug}` };
}

/** Load a single article body from codebase fallback (async). */
export async function getFallbackBlogPost(
  slug: string
): Promise<BlogPost | undefined> {
  const loader = ARTICLE_LOADERS[slug];
  if (loader) {
    return withId(await loader(), "blog-fb");
  }

  const seed = seedBlogPosts.find((p) => p.slug === slug);
  if (seed) return withId(seed, "blog-seed");
  return undefined;
}

/** Loads all published fallback bodies (scripts / one-off migrations only). */
export async function loadAllFallbackBlogPosts(): Promise<BlogPost[]> {
  const slugs = Object.keys(ARTICLE_LOADERS);
  const articles = await Promise.all(
    slugs.map((slug) => getFallbackBlogPost(slug))
  );
  const published = articles.filter(
    (p): p is BlogPost => !!p && p.status === "published"
  );
  const seeds = seedBlogPosts
    .filter((p) => p.status === "published")
    .map((p, i) => withId(p, `blog-seed-${i}`));
  return [...published, ...seeds];
}
